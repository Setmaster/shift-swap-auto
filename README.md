# Shift Swap Platform

## Overview
Shift Swap is a microservices-based marketplace for trading work shifts. The backend is a suite of .NET 8 services that communicate through RabbitMQ and expose HTTP and gRPC APIs, while the Next.js 14 frontend provides the end-user experience with live updates via SignalR. The entire stack is containerized with Docker for consistent development and deployment.

Key capabilities include:
- **Auction management** – create, update, delete, and automatically close auctions backed by PostgreSQL and MassTransit outbox for reliable event publication. 【F:server/AuctionService/Controllers/AuctionsController.cs†L14-L111】【F:server/AuctionService/Services/AuctionStatusChecker.cs†L8-L63】
- **Real-time bidding** – MongoDB-powered bid tracking with validation, gRPC lookups to the auction service, and RabbitMQ events that fan out to other services. 【F:server/BiddingService/Controller/BidsController.cs†L18-L101】
- **Search indexing** – MongoDB full-text search that is hydrated from the auction service and kept current through RabbitMQ consumers. 【F:server/SearchService/Controllers/SearchController.cs†L7-L80】【F:server/SearchService/Data/DbInitializer.cs†L11-L38】
- **Identity and gateway** – Duende IdentityServer for OAuth/OIDC, and a YARP gateway that unifies HTTP access and applies CORS and JWT validation. 【F:server/IdentityService/Program.cs†L1-L38】【F:server/IdentityService/HostingExtensions.cs†L14-L70】【F:server/GatewayService/Program.cs†L4-L34】
- **Notifications** – SignalR hub pushing auction and bid events to the frontend, relayed via RabbitMQ. 【F:server/NotificationsService/Program.cs†L1-L36】【F:client/shift-swapper-web-app/lib/providers/SignalRProvider.tsx†L1-L79】
- **Modern frontend** – Next.js app styled with Mantine, authenticated with NextAuth against IdentityServer, and orchestrated through reusable stores and actions. 【F:client/shift-swapper-web-app/package.json†L8-L49】【F:client/shift-swapper-web-app/app/api/auth/[...nextauth]/route.ts†L1-L33】【F:client/shift-swapper-web-app/components/Listings/Listings.tsx†L1-L78】

## Architecture
The solution is organized as a .NET solution (`shift-swapper.sln`) containing several services and a shared contracts project, alongside a Next.js client. 【F:shift-swapper.sln†L1-L15】 Each service runs independently and communicates through RabbitMQ events defined in `server/Contracts`.

| Component | Purpose |
|-----------|---------|
| **AuctionService** | REST + gRPC API for auctions, persists to PostgreSQL, publishes auction lifecycle events. 【F:server/AuctionService/Program.cs†L13-L67】【F:server/AuctionService/Controllers/AuctionsController.cs†L14-L111】 |
| **BiddingService** | Handles bid placement, aggregates MongoDB bid history, calls AuctionService via gRPC, emits `BidPlaced` and `AuctionFinished`. 【F:server/BiddingService/Program.cs†L13-L72】【F:server/BiddingService/Controller/BidsController.cs†L18-L101】 |
| **SearchService** | Maintains a MongoDB search index and HTTP search API driven by auction events. 【F:server/SearchService/Program.cs†L11-L73】【F:server/SearchService/Controllers/SearchController.cs†L7-L80】 |
| **NotificationsService** | SignalR hub broadcasting domain events to connected clients. 【F:server/NotificationsService/Program.cs†L1-L36】 |
| **IdentityService** | Duende IdentityServer with ASP.NET Identity + PostgreSQL persistence. 【F:server/IdentityService/HostingExtensions.cs†L14-L69】 |
| **GatewayService** | YARP reverse proxy providing a unified API surface and enforcing auth/CORS. 【F:server/GatewayService/Program.cs†L4-L34】 |
| **Next.js Web App** | Shift Swap user interface, consumes gateway APIs, handles auth, uses AWS S3 for media. 【F:client/shift-swapper-web-app/lib/actions/auctionActions.ts†L1-L101】 |

### Event-Driven Flow
1. Users interact with the web app, which calls the gateway via `fetchWrapper` (Axios) with bearer tokens sourced from NextAuth. 【F:client/shift-swapper-web-app/lib/utils/fetchWrapper.ts†L1-L79】【F:client/shift-swapper-web-app/app/api/auth/[...nextauth]/route.ts†L1-L33】
2. Gateway proxies requests to downstream services. Services persist state (PostgreSQL or MongoDB) and publish events over RabbitMQ using contracts in `server/Contracts`. 【F:server/AuctionService/Program.cs†L24-L67】【F:server/BiddingService/Program.cs†L15-L52】【F:server/Contracts/AuctionCreated.cs†L1-L14】
3. Subscribers (SearchService, NotificationsService, others) react to events to update read models or push notifications. 【F:server/SearchService/Program.cs†L19-L73】【F:server/NotificationsService/Program.cs†L7-L36】
4. SignalR pushes `BidPlaced`, `AuctionCreated`, and `AuctionFinished` messages to clients, updating Zustand stores and showing Mantine toasts. 【F:client/shift-swapper-web-app/lib/providers/SignalRProvider.tsx†L18-L69】

## Project Structure
```
.
├── client/shift-swapper-web-app   # Next.js frontend
├── server/                        # .NET microservices + shared contracts
├── docker-compose.yml             # Local orchestration of services and dependencies
├── Makefile                       # Windows helper for dotnet watch workflows
└── shift-swapper.sln              # Visual Studio solution for server services
```

## Prerequisites
- Docker Desktop 4.x or Docker Engine with Compose V2 for running the full stack. 【F:docker-compose.yml†L1-L130】
- Node.js 18+ and npm (or pnpm/yarn) if you want to run the frontend outside of Docker. 【F:client/shift-swapper-web-app/package.json†L1-L49】
- .NET 8 SDK if you prefer to run services directly with `dotnet watch`. 【F:server/AuctionService/AuctionService.csproj†L1-L25】

## Running with Docker Compose
1. Copy `.env.example` (create one if needed) to `.env` and supply credentials required by the web app. At minimum, set:
   ```bash
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   NEXTAUTH_SECRET=change-me
   ```
   These feed into the Next.js container for S3 uploads and auth token encryption. 【F:docker-compose.yml†L83-L108】【F:client/shift-swapper-web-app/lib/actions/auctionActions.ts†L1-L72】【F:client/shift-swapper-web-app/app/api/auth/[...nextauth]/route.ts†L9-L27】
2. Start everything:
   ```bash
   docker compose up --build
   ```
   This brings up PostgreSQL, MongoDB, RabbitMQ, all .NET services, the Next.js web app, and an nginx proxy for local routing. 【F:docker-compose.yml†L5-L130】
3. Access the application:
   - Web app: http://localhost (served through the nginx proxy mapping `app.shiftswap.com`).
   - RabbitMQ management UI: http://localhost:15672 (guest/guest).
   - PostgreSQL: localhost:5432, MongoDB: localhost:27017 for direct inspection if needed.

> **Tip:** The compose file pins custom container names (`shift-swap-*`) that expose ports 7001-7004 for debugging individual services. 【F:docker-compose.yml†L29-L122】

## Running Services Manually
For iterative backend work you can run services with `dotnet watch` and use local infrastructure from Docker:
1. Start dependencies (databases, RabbitMQ) via compose without the app services:
   ```bash
   docker compose up postgres mongodb rabbitmq
   ```
2. In separate terminals run the desired services:
   ```bash
   dotnet watch --project server/AuctionService
   dotnet watch --project server/BiddingService
   dotnet watch --project server/SearchService
   dotnet watch --project server/GatewayService
   dotnet watch --project server/NotificationsService
   dotnet watch --project server/IdentityService
   ```
   The provided `Makefile` automates this workflow on Windows by spawning `dotnet watch` consoles. 【F:Makefile†L1-L37】

3. Install frontend dependencies and start Next.js in dev mode:
   ```bash
   cd client/shift-swapper-web-app
   npm install
   npm run dev
   ```
   Configure `.env.local` with `API_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ID_URL`, and `NEXT_PUBLIC_NOTIFY_API_URL` to point at your locally running gateway and identity services. 【F:client/shift-swapper-web-app/lib/utils/fetchWrapper.ts†L1-L79】【F:client/shift-swapper-web-app/lib/providers/SignalRProvider.tsx†L18-L34】

## CI/CD and Deployability
- Every service includes a Dockerfile so images can be built individually or via Compose. 【F:docker-compose.yml†L31-L122】
- The architecture emphasizes idempotent event handling, retry policies (Polly + MassTransit) for resiliency, and structured logging through Serilog in the identity service. 【F:server/AuctionService/Program.cs†L24-L49】【F:server/BiddingService/Program.cs†L19-L52】【F:server/SearchService/Program.cs†L19-L71】【F:server/IdentityService/Program.cs†L1-L38】
- AWS S3 integration supports image uploads directly from the frontend using the AWS SDK for JavaScript. 【F:client/shift-swapper-web-app/lib/actions/auctionActions.ts†L1-L92】

## Further Exploration
- Explore the `/architecture` route in the Next.js app for an interactive visualization of the services and dependencies.
- Inspect the `server/Contracts` project to see the event schemas that enable loose coupling between services. 【F:server/Contracts/AuctionCreated.cs†L1-L14】【F:server/Contracts/BidPlaced.cs†L1-L21】
- Use the RabbitMQ management UI to observe exchanges and queues created by MassTransit (e.g., `auction-auction-created`, `search-auction-created`). 【F:server/AuctionService/Program.cs†L24-L67】【F:server/SearchService/Program.cs†L19-L73】

Happy swapping!
