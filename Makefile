# Define the services
DEFAULT_SERVICES = AuctionService GatewayService IdentityService SearchService

# Define the server directory
SERVER_DIR = server

# Default target
.PHONY: all
all: run

# Run default services
.PHONY: run
run:
	@for %%S in ($(DEFAULT_SERVICES)) do \
		echo Starting %%S... & \
		start cmd /k "cd /d %CD% && dotnet watch --no-hot-reload --project $(SERVER_DIR)/%%S"

# Stop all services
.PHONY: stop
stop:
	@echo Stopping all services...
	@taskkill /F /IM dotnet.exe
	@echo All services stopped.

# Restart all services
.PHONY: restart
restart: stop run

# Run a specific service
.PHONY: run-service
run-service:
	@set /p service=Enter service name: 
	@echo Starting %service%...
	@start cmd /k "cd /d %CD% && dotnet watch --no-hot-reload --project $(SERVER_DIR)/%service%"

# Stop a specific service
.PHONY: stop-service
stop-service:
	@set /p service=Enter service name: 
	@echo Stopping %service%...
	@taskkill /F /IM dotnet.exe /FI "WINDOWTITLE eq %service%"
	@echo %service% stopped.
