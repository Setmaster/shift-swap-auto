FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
EXPOSE 80

# Copy all .csproj files and restore as distinct layers
# Use same copy command for every dockerfile in the project to take advantage of caching
COPY shift-swapper.sln shift-swapper.sln
# AuctionService
COPY server/AuctionService/AuctionService.csproj server/AuctionService/AuctionService.csproj
# SearchService
COPY server/SearchService/SearchService.csproj server/SearchService/SearchService.csproj
# GatewayService
COPY server/GatewayService/GatewayService.csproj server/GatewayService/GatewayService.csproj
# BiddingService
COPY server/BiddingService/BiddingService.csproj server/BiddingService/BiddingService.csproj
# NotificationsService
COPY server/NotificationsService/NotificationsService.csproj server/NotificationsService/NotificationsService.csproj
# Contracts
COPY server/Contracts/Contracts.csproj server/Contracts/Contracts.csproj
# IdentityService
COPY server/IdentityService/IdentityService.csproj server/IdentityService/IdentityService.csproj

# Restore package dependencies
RUN dotnet restore shift-swapper.sln

# Copy the app folders and publish the app
COPY server/BiddingService server/BiddingService
COPY server/Contracts server/Contracts
WORKDIR /app/server/BiddingService
RUN dotnet publish -c Release -o /app/server/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/server/out ./
ENTRYPOINT ["dotnet", "BiddingService.dll"]