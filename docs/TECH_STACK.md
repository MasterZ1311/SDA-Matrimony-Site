# Technology Stack Specifications

- **Architect & Author**: MasterZ1311
- **GitHub Profile**: [https://github.com/MasterZ1311](https://github.com/MasterZ1311)
- **Repository**: [https://github.com/MasterZ1311/SDA-Matrimony-Site](https://github.com/MasterZ1311/SDA-Matrimony-Site)

---

## 1. Architectural Philosophy and Overview

As the sole architect and developer of this platform, I engineered the SDA Matrimony system using a modular monorepo architecture. The goal was to establish strict separation of concerns, high maintainability, end-to-end type safety, and the ability to scale specialized workloads independently (such as AI moderation and real-time WebSocket communication).

The codebase is organized into discrete applications (`apps/`) and shared packages (`packages/`), ensuring zero code duplication and predictable dependency trees.

---

## 2. Core Microservices and Applications

### 2.1 Web Frontend (`apps/web`)
- **Framework**: Next.js 14 with App Router and React 18.
- **Language**: TypeScript (Strict Mode enabled).
- **Rendering Model**: Hybrid model utilizing Server-Side Rendering (SSR) for initial loads and SEO-critical pages, alongside Client Components for rich interactive interfaces.
- **Styling Architecture**: Vanilla CSS Modules with custom design tokens, CSS custom properties, responsive breakpoints, and strict avoidance of third-party CSS utility bloat.
- **Client State Management**: Zustand for lightweight, decoupled global client state (session tokens, current user context, UI modals, notification badges).
- **Server State & Caching**: TanStack Query (React Query) for optimistic updates, automatic cache invalidation, and deduplication of network requests.
- **Form Management & Validation**: React Hook Form with Zod schema resolvers mapped to shared DTOs from `@sda/common-types`.
- **Real-Time Client**: Socket.io Client integration with automatic reconnection, heartbeat handling, and event dispatchers.

### 2.2 Core REST API (`apps/api-core`)
- **Framework**: NestJS with Fastify HTTP adapter for high-throughput, low-overhead request processing.
- **Language**: TypeScript.
- **Architectural Pattern**: Modular Domain-Driven Design (DDD) with Dependency Injection (DI).
- **Core Modules**:
  - `AuthModule`: Handles user registration, authentication, JWT token issuance, refresh token rotation, and password hashing via bcrypt.
  - `ProfilesModule`: Manages comprehensive Adventist profile details, lifestyle attributes, search indexing, and profile privacy states.
  - `ChurchModule`: Encapsulates the global SDA church hierarchy (Divisions, Unions, Conferences, Local Churches).
  - `VerificationModule`: Coordinates pastoral endorsement submissions, government ID review pipelines, and administrative audit trails.
  - `BiodataModule`: Generates structured matrimonial biodata exports for offline family and pastoral review.
  - `PrismaModule`: Global database access layer providing lifecycle management and query telemetry.
- **Security & Middleware**: Global HTTP exception filters, NestJS Guards for JWT authentication and Role-Based Access Control (RBAC), and validation pipes powered by `class-validator` and `class-transformer`.

### 2.3 Real-Time Gateway (`apps/api-realtime`)
- **Framework**: NestJS WebSocket Gateway built on Socket.io.
- **Language**: TypeScript.
- **Scaling & Distribution**: Redis Adapter (`@socket.io/redis-adapter`) enabling stateless horizontal scaling across multiple container instances with shared Pub/Sub message distribution.
- **Gateways**:
  - `ChatGateway`: Private one-on-one instant messaging, message read receipts, and typing indicators, strictly unlocked after mutual interest acceptance.
  - `InterestGateway`: Real-time push notifications for interest requests, approvals, pastoral review status changes, and admin announcements.

### 2.4 AI and Machine Learning Engine (`apps/ai-engine`)
- **Framework**: FastAPI (Python 3.11).
- **Primary Responsibilities**:
  - **Compatibility Scoring Engine**: Multi-dimensional mathematical compatibility scoring combining hard theological constraints (baptism, Sabbath keeping, Adventist dietary alignment) with weighted lifestyle compatibility formulas.
  - **Computer Vision Moderation**: Profile image validation, face detection verification, modesty compliance screening, and automated watermarking.
  - **NLP Text Moderation**: Real-time inspection of profile bios and messages to prevent harassment, offensive language, and premature sharing of external contact details or links before mutual consent.
- **Integration**: Asynchronous REST endpoints invoked by `api-core` and background worker queues.

---

## 3. Database, Cache, and Shared Packages

### 3.1 Database Layer (`packages/database`)
- **Primary Database**: PostgreSQL 16.
- **Object-Relational Mapping (ORM)**: Prisma ORM with strongly-typed client generation.
- **Vector Extensions**: `pgvector` for storing dense vector embeddings and performing nearest-neighbor cosine similarity queries for candidate discovery.
- **Data Integrity**: Foreign key constraints, compound indexes for fast filtering, database-level enums, and automated audit timestamp triggers.

### 3.2 In-Memory Caching and Queue Store
- **Store**: Redis 7.
- **Responsibilities**: Session caching, API rate limiting, real-time presence tracking, WebSocket cluster pub/sub, and background job queue brokering.

### 3.3 Shared Common Types (`packages/common-types`)
- **Package**: `@sda/common-types`
- **Contents**: Shared TypeScript interfaces, Data Transfer Objects (DTOs), and enums (SDA Divisions, Baptism Status, Diet Types, Verification Statuses, Interest States) imported across `apps/web`, `apps/api-core`, and `apps/api-realtime` to guarantee end-to-end type safety.

---

## 4. Infrastructure, DevOps, and Containerization

- **Containerization**: Multi-stage Dockerfiles tailored for production optimization, minimal image sizes, and non-root execution.
- **Local Orchestration**: Docker Compose (`infrastructure/docker/docker-compose.dev.yml`) managing PostgreSQL with `pgvector`, Redis, and MinIO object storage.
- **Object Storage**: S3-compatible storage (MinIO for development; AWS S3 / Cloudflare R2 for production) with pre-signed upload URLs and strict access control.
- **Reverse Proxy & Edge**: NGINX / Cloudflare for SSL termination, HTTP/2 and HTTP/3 support, DDoS mitigation, and Web Application Firewall (WAF) rule sets.

---

## 5. Summary Matrix

| Layer | Technology | Primary Purpose |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 14, React 18, TypeScript, Zustand, TanStack Query | Client application, SSR, responsive UI, state synchronization |
| **Backend Core** | NestJS, Fastify, TypeScript, Prisma | REST API, authentication, business logic, verification pipeline |
| **Realtime Service** | NestJS, Socket.io, Redis Adapter | Real-time 1-on-1 chat, presence, instant event notifications |
| **AI / ML Service** | Python 3.11, FastAPI, Pydantic, Computer Vision, NLP | Compatibility matching engine, content moderation, image safety |
| **Primary Database** | PostgreSQL 16 + pgvector | Persistent relational data, ACID transactions, vector similarity |
| **Cache & Pub/Sub** | Redis 7 | API response caching, rate limiting, WebSocket pub/sub distribution |
| **Object Storage** | MinIO (Dev) / AWS S3 / Cloudflare R2 | Secure encrypted storage for profile photos and verification IDs |
| **Monorepo Tooling** | npm / pnpm workspaces, TypeScript Project References | Monorepo package resolution, cross-package builds, type checking |

---

*Authored by MasterZ1311 ([https://github.com/MasterZ1311](https://github.com/MasterZ1311)).*
