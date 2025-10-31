# Sync Codex Connector Repositories

This repository includes automation that ensures every non-archived repository you own is granted access to the ChatGPT Codex Connector GitHub App installation.

## Personal Access Token

1. Visit <https://github.com/settings/tokens> and create a **classic** Personal Access Token.
2. Give the token the **repo** scope. Add **read:org** if you plan to include organization repositories (optional).
3. Copy the generated token. Treat it like a password.

## Repository Secrets

Add the following secrets under **Settings → Secrets and variables → Actions**:

| Name     | Required | Description |
|----------|----------|-------------|
| `GH_PAT` | Yes      | PAT created above. Must include the `repo` scope so the workflow can manage repository access. |
| `APP_NAME` | No     | GitHub App display name. Defaults to `ChatGPT Codex Connector` when omitted. |

Store these secrets at the repository or organization level, depending on how widely you want the automation available.

## Running the Sync

The workflow runs automatically every night at **03:15 UTC**. You can also trigger it manually:

1. Go to the **Actions** tab.
2. Select **Sync Codex Connector Repos**.
3. Click **Run workflow** and choose options:
   - `dry_run` – set to `true` to preview additions without making changes.
   - `include_orgs` – set to `true` to process organization repositories where you have admin rights.

## Security Notes

- Prefer the least privilege PAT and rotate it regularly.
- Revoke the PAT immediately if it leaks.
- Update secrets promptly when rotating credentials.
- Grant access only to repositories you intend to link with the GitHub App.
