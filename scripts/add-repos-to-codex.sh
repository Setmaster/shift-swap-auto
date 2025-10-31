#!/usr/bin/env bash
set -euo pipefail

error() {
  echo "Error: $*" >&2
}

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    error "Required command '$cmd' not found in PATH."
    exit 1
  fi
}

for tool in gh jq; do
  require_cmd "$tool"
done

APP_NAME=${APP_NAME:-"ChatGPT Codex Connector"}
DRY_RUN=${DRY_RUN:-0}
INCLUDE_ORGS=${INCLUDE_ORGS:-0}

normalize_flag() {
  local value="${1:-0}"
  case "$value" in
    1|true|TRUE|True|yes|on)
      echo 1
      ;;
    *)
      echo 0
      ;;
  esac
}

DRY_RUN=$(normalize_flag "$DRY_RUN")
INCLUDE_ORGS=$(normalize_flag "$INCLUDE_ORGS")

LOGIN=""
INSTALL_ID=""

put_with_retry() {
  local endpoint="$1"
  local attempt=1
  local max_attempts=3
  local tmp

  while (( attempt <= max_attempts )); do
    tmp=$(mktemp)
    if gh api --include -X PUT "$endpoint" >"$tmp" 2>&1; then
      rm -f "$tmp"
      return 0
    fi

    local output
    output=$(cat "$tmp")
    rm -f "$tmp"

    if grep -q "404" <<<"$output"; then
      error "GitHub API returned 404 when granting access. Ensure the app is installed with repository access or the token has admin rights."
      return 1
    fi

    if grep -q "403" <<<"$output"; then
      if grep -qi "x-ratelimit-remaining: 0" <<<"$output"; then
        if (( attempt < max_attempts )); then
          echo "Rate limit reached (attempt ${attempt}/${max_attempts}). Sleeping 60 seconds before retry..." >&2
          sleep 60
          ((attempt++))
          continue
        else
          error "GitHub API rate limit exhausted after ${max_attempts} attempts."
          return 2
        fi
      fi
      error "GitHub API returned 403 when granting access. Ensure you have admin rights and the PAT includes repo scope."
      return 1
    fi

    if (( attempt < max_attempts )); then
      echo "Request failed (attempt ${attempt}/${max_attempts}). Retrying in 5 seconds..." >&2
      sleep 5
      ((attempt++))
      continue
    fi

    error "GitHub API request failed after ${max_attempts} attempts."
    return 2
  done

  return 2
}

fetch_login() {
  if ! LOGIN=$(gh api user -q .login 2>/dev/null); then
    error "Unable to determine GitHub login. Verify that gh is authenticated."
    exit 1
  fi
}

fetch_installation() {
  local tmp
  tmp=$(mktemp)
  if ! gh api --paginate user/installations >"$tmp"; then
    rm -f "$tmp"
    error "Unable to list GitHub App installations. Ensure the PAT has appropriate access."
    exit 1
  fi

  mapfile -t INSTALL_LINES < <(jq -r --arg app "$APP_NAME" '.installations[] | select(.app.name==$app) | [.id, .account.login] | @tsv' "$tmp") || true
  rm -f "$tmp"

  if (( ${#INSTALL_LINES[@]} == 0 )); then
    error "No installation found for app '${APP_NAME}'. Install the app or set APP_NAME to the correct value."
    exit 1
  fi

  IFS=$'\t' read -r INSTALL_ID _ <<<"${INSTALL_LINES[0]}"
}

fetch_login
fetch_installation

echo "Using GitHub login: ${LOGIN}"
echo "Using GitHub App: ${APP_NAME} (installation ID: ${INSTALL_ID})"

mapfile -t EXISTING_IDS < <(gh api --paginate "user/installations/${INSTALL_ID}/repositories?per_page=100" -q '.repositories[].id' | sort -u)

declare -A EXISTING_MAP=()
for repo_id in "${EXISTING_IDS[@]}"; do
  if [[ -n "$repo_id" ]]; then
    EXISTING_MAP["$repo_id"]=1
  fi

done

AFFILIATION="owner"
if [[ "$INCLUDE_ORGS" == "1" ]]; then
  AFFILIATION="owner,collaborator,organization_member"
fi

if ! REPO_DATA=$(gh api --paginate "user/repos?affiliation=${AFFILIATION}&per_page=100"); then
  error "Unable to list repositories for user ${LOGIN}."
  exit 2
fi

mapfile -t REPO_LINES < <(printf '%s' "$REPO_DATA" | jq -r 'if type == "array" then .[] else empty end | [.id, .full_name, (.archived // false), .owner.login, (.permissions.admin // false)] | @tsv' | sort -u)

ADDED_COUNT=0
ALREADY_COUNT=0
SKIPPED_COUNT=0
ARCHIVED_COUNT=0
DRY_COUNT=0

process_repo() {
  local repo_id="$1"
  local full_name="$2"
  local archived="$3"
  local owner_login="$4"
  local has_admin="$5"

  if [[ "$archived" == "true" ]]; then
    ((ARCHIVED_COUNT++))
    echo "archived: ${full_name} (skipping)"
    return
  fi

  if [[ "$INCLUDE_ORGS" == "1" ]]; then
    if [[ "$has_admin" != "true" ]]; then
      ((SKIPPED_COUNT++))
      echo "skip: ${full_name} (no admin permission)"
      return
    fi
  else
    if [[ "$owner_login" != "$LOGIN" ]]; then
      ((SKIPPED_COUNT++))
      echo "skip: ${full_name} (not owned by ${LOGIN})"
      return
    fi
  fi

  if [[ -n "${EXISTING_MAP[$repo_id]+x}" ]]; then
    ((ALREADY_COUNT++))
    echo "already present: ${full_name}"
    return
  fi

  if [[ "$DRY_RUN" == "1" ]]; then
    ((SKIPPED_COUNT++))
    ((DRY_COUNT++))
    echo "dry-run: would add ${full_name}"
    return
  fi

  local endpoint="user/installations/${INSTALL_ID}/repositories/${repo_id}"
  if put_with_retry "$endpoint"; then
    ((ADDED_COUNT++))
    echo "added: ${full_name}"
  else
    local status=$?
    if [[ $status -eq 1 ]]; then
      exit 1
    else
      exit 2
    fi
  fi
}

while IFS=$'\t' read -r repo_id full_name archived owner_login has_admin; do
  [[ -z "$repo_id" ]] && continue
  process_repo "$repo_id" "$full_name" "$archived" "$owner_login" "$has_admin"
done < <(printf '%s\n' "${REPO_LINES[@]}")

echo
echo "Summary: added=${ADDED_COUNT}, already_present=${ALREADY_COUNT}, skipped=${SKIPPED_COUNT}, archived=${ARCHIVED_COUNT}"
if [[ "$DRY_RUN" == "1" ]]; then
  echo "Dry-run mode enabled; no repositories were modified."
  if (( DRY_COUNT > 0 )); then
    echo "Dry-run skipped ${DRY_COUNT} repository(ies)."
  fi
fi
