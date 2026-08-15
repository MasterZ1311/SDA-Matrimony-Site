# Seventh-day Adventist (SDA) Matrimony Platform

## 1. Executive Summary

The Seventh-day Adventist (SDA) Matrimony Platform is an enterprise-grade, faith-aligned digital matchmaking ecosystem designed specifically for the global Seventh-day Adventist community. The platform prioritizes spiritual compatibility, Adventist lifestyle alignment (including Sabbath observance, dietary standards, and church involvement), robust verification mechanisms (such as pastoral verification), and data privacy.

This repository serves as the central hub for the engineering team, detailing system architecture, domain specifications, technology stack decisions, development workflows, and team responsibilities.

---

## 2. Platform Domain Specifications

The platform addresses unique lifestyle, doctrinal, and cultural factors intrinsic to the SDA community:

### 2.1 Faith and Spiritual Profile
* **Church Structure & Membership**: Categorization by Division, Union, Conference/Mission, and Local Congregation.
* **Baptism Status**: Verification of baptism by immersion in the SDA Church.
* **Sabbath Observance**: Personal commitment to Sabbath keeping (Friday sunset to Saturday sunset).
* **Ministry & Leadership**: Engagement in church departments (Pathfinders, Adventurers, Sabbath School, Adventist Youth, Music/Choir, Deaconry, Eldership, Medical Missionary work).
* **Doctrinal Alignment**: Spirit of Prophecy perspectives, Biblical creation worldview, and core fundamental beliefs.

### 2.2 Lifestyle and Health Message
* **Dietary Preferences**: Strict Vegan, Lacto-Ovo Vegetarian, Pescatarian, or Non-Vegetarian.
* **Health Commitments**: Strict abstinence from alcohol, tobacco, narcotics, and unclean foods (Levitical dietary principles).
* **Recreation & Modesty**: Entertainment, musical preferences (Sacred, Classical, Contemporary Christian), and dress modesty values.

### 2.3 Verification, Safety, and Privacy
* **Pastoral Verification**: Optional verification endorsement by a local church pastor or head elder.
* **Identity Verification**: Secure government ID verification via automated optical character recognition and face matching.
* **Granular Privacy Controls**:
  * Photo privacy modes (visible to all, visible only to verified users, or visible upon approved request).
  * Contact information disclosure only upon mutual consent.
  * Anti-screenshot, anti-scraping, and watermark protections.

### 2.4 Matrimonial Matching Workflows
* **Compatibility Scoring**: Multi-factor scoring weighting faith, lifestyle, education, location, and relocation readiness.
* **Express Interest System**: Send Request -> Receive Acceptance -> Exchange Messages -> Request Contact Details.
* **Biodata Generation**: Automated generation of standardized, printable PDF biodata for family and pastoral review.

---

## 3. Technology Stack Architecture

The technical architecture is designed for high availability, security, strict data protection, and low-latency real-time operations.

```
                                  +-----------------------+
                                  |     Cloudflare /      |
                                  |   CDN & WAF Layer     |
                                  +-----------+-----------+
                                              |
                                  +-----------v-----------+
                                  |   Load Balancer (ALB) |
                                  +-----------+-----------+
                                              |
                                  +-----------v-----------+
                                  |  Next.js Frontend SSR |
                                  +-----------+-----------+
                                              |
                   +--------------------------+--------------------------+
                   |                                                     |
                   v                                                     v
       +-----------------------+                             +-----------------------+
       |   Backend Core API    |                             | Realtime Engine (WS)  |
       |     (NestJS API)      |                             |   (Socket.io / Redis) |
       +-----------+-----------+                             +-----------+-----------+
                   |                                                     |
    +--------------+--------------+                       +--------------+--------------+
    |              |              |                       |              |              |
    v              v              v                       v              v              v
+-------+      +-------+      +-------+               +-------+      +-------+      +-------+
|  Post |      | Redis |      | S3 /  |               | AI/ML |      | Worker|      | Audit |
| greSQL|      | Cache |      | R2    |               | Vector|      | Queue |      | Logs  |
| /pgvec|      | /Queue|      | Media |               | Engine|      | (Bull)|      |       |
+-------+      +-------+      +-------+               +-------+      +-------+      +-------+
```

### 3.1 Frontend Tier
* **Framework**: Next.js (React with App Router) and TypeScript.
* **Styling**: Modern CSS / Vanilla CSS Modules with a custom responsive design system.
* **State Management**: TanStack Query (React Query) for asynchronous server state, Zustand for client state.
* **Real-time Client**: Socket.io-client for chat, match notifications, and status presence.
* **Form & Validation**: React Hook Form with Zod schemas for end-to-end type safety.
* **PDF Engine**: `@react-pdf/renderer` or server-side Puppeteer for SDA Biodata generation.

### 3.2 Backend Tier
* **Core API Framework**: NestJS (TypeScript) with Fastify adapter for enterprise modularity, dependency injection, and high throughput.
* **API Paradigm**: RESTful endpoints with OpenAPI/Swagger documentation, supplemented by GraphQL for complex profile querying.
* **Real-time Communication**: WebSockets via Socket.io with Redis Adapter for cluster support.
* **Authentication**: OAuth2 / JWT (Access & Refresh token rotation), bcrypt password hashing, and Multi-Factor Authentication (TOTP / SMS OTP).
* **Task Queues**: BullMQ with Redis for background jobs (emails, SMS, PDF generation, notification delivery).

### 3.3 AI and Machine Learning Tier
* **Engine Framework**: Python (FastAPI microservice).
* **Compatibility Engine**: Hybrid matching combining rule-based constraint filtering (SDA doctrinal redlines) and dense vector embeddings (using Sentence Transformers / text-embedding-3-small).
* **Vector Search**: PostgreSQL with `pgvector` extension for efficient vector similarity queries (Cosine/Dot Product).
* **Computer Vision Moderation**:
  * Automated face detection and image moderation for profile photos.
  * Real-time watermarking and selective blurring for photo privacy tiers.
* **NLP & Text Moderation**: Real-time screening for toxic content, harassment, phone number/external link leakage prior to mutual consent.

### 3.4 Database and Storage Tier
* **Primary Database**: PostgreSQL 16 (Relational integrity, ACID transactions, complex relations).
* **Vector Storage**: PostgreSQL `pgvector` for embedding storage and similarity indexing.
* **In-Memory Store**: Redis 7 (Caching, session store, rate limiting, and real-time Pub/Sub).
* **Object Storage**: AWS S3 or Cloudflare R2 (Encrypted at rest, pre-signed URLs for media upload/download).

### 3.5 DevOps, Infrastructure, and Observability
* **Containerization**: Docker with multi-stage production builds.
* **Orchestration**: Docker Compose for local development; Kubernetes (EKS/GKE) or AWS ECS for production.
* **CI/CD**: GitHub Actions workflows for automated linting, unit/integration testing, security scanning, and deployment.
* **Reverse Proxy & Security**: NGINX / Cloudflare with WAF, TLS 1.3, DDoS protection, and automated SSL termination.
* **Observability**: Prometheus & Grafana for infrastructure metrics, Sentry for real-time exception tracking, Winston/Pino for structured JSON logging.

---

## 4. Engineering Team Structure and Responsibilities

The project is driven by a 5-member cross-functional engineering team.

| Role | Primary Ownership | Core Deliverables |
| :--- | :--- | :--- |
| **Frontend Developer** | Client Web Application | Next.js App Router, responsive UI design system, state management, form validations, WebSocket chat client, biodata viewer. |
| **Backend Developer 1** | Core Business Logic & Auth | User authentication, RBAC, SDA profile management, church directory integration, pastoral verification flow, payment gateway integration. |
| **Backend Developer 2** | Real-time Services & Match Engine | WebSocket messaging, notifications engine, search/filter pipeline, media processing, background job workers, API gateway integration. |
| **AI/ML Engineer** | Matching Algorithm & Moderation | Faith-based compatibility scoring engine, vector embedding generation, profile photo moderation, safety NLP filters, recommendation API. |
| **DevOps & Database Engineer** | Infrastructure, DB & Security | PostgreSQL database design & migrations, Redis setup, Docker containers, CI/CD pipelines, security hardening, monitoring, backups. |

---

## 5. Development Resources and References

### 5.1 Architectural and Functional Reference Repositories
Team members should review the following public repositories for structural and domain inspiration:
* **Metro Bond Client**: `https://github.com/Alifa-AS/Metro-bond-client` - Reference for matrimonial user interfaces, dashboard management, and member profile presentation.
* **Simple Matrimonial Website**: `https://github.com/jagadish-7/Simple-Matrimonial-Website` - Reference for matrimonial database relationships and search filtering parameters.
* **Complete Dating App**: `https://github.com/helloharendra/Complete-Dating-App` - Reference for real-time chat architecture, presence detection, and push notifications.

### 5.2 Mandatory Engineering Best Practices and Initiation References
All team members are required to review the following repositories to understand project workflows, modular development, and automated engineering skills:
* **Skills Bot Framework**: `https://github.com/MasterZ1311/Skills-Bot-V.-MZ.0-` - Study for prompt engineering, task decomposition, and modular development automation.
* **Hackathon Initiation & Execution Standard**: `https://github.com/MasterZ1311/Hackathon-Initiation-SIH` - Study for rapid development sprints, milestone tracking, and production delivery standards.

---

## 6. Repository Layout

```
.
├── apps/
│   ├── web/                     # Next.js Frontend Application
│   ├── api-core/                # NestJS Backend API (Auth, Profiles, Business Logic)
│   ├── api-realtime/            # Real-time WebSockets & Notifications Service
│   └── ai-engine/               # Python FastAPI Microservice (Compatibility & Moderation)
├── packages/
│   ├── database/                # Prisma/TypeORM schema, migrations, and seeders
│   ├── common-types/            # Shared TypeScript interfaces and DTOs
│   ├── eslint-config/           # Shared linting configuration
│   └── tsconfig/                # Base TypeScript configurations
├── infrastructure/
│   ├── docker/                  # Dockerfiles and docker-compose configurations
│   ├── k8s/                     # Kubernetes manifests (production deployment)
│   ├── nginx/                   # Reverse proxy configuration
│   └── scripts/                 # Database backup, seed, and deployment scripts
├── .github/
│   └── workflows/               # CI/CD pipelines (test, lint, security, deploy)
├── MVP.md                       # Phase 1 Minimum Viable Product Execution Plan
└── README.md                    # Main platform documentation
```

---

## 7. Getting Started: Local Development Setup

### 7.1 Prerequisites
* Node.js >= 20.x
* pnpm >= 9.x (recommended) or npm >= 10.x
* Python >= 3.11 with `pip` and `uv` or `venv`
* Docker Engine >= 26.x and Docker Compose >= 2.x
* PostgreSQL 16 with `pgvector` support

### 7.2 Clone and Setup Environment
```bash
# Clone the repository
git clone https://github.com/YourOrg/sda-matrimony-platform.git
cd sda-matrimony-platform

# Copy environment templates
cp .env.example .env
```

### 7.3 Bootstrapping Dependencies and Local Infrastructure
```bash
# Start PostgreSQL (with pgvector), Redis, and MinIO in Docker
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d

# Install Node.js dependencies
pnpm install

# Run database migrations and seeds
pnpm db:migrate
pnpm db:seed

# Install Python AI microservice dependencies
cd apps/ai-engine
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### 7.4 Running the Application Services
```bash
# Run all services concurrently (Frontend, Core API, AI Engine)
pnpm dev
```

Service endpoints once running:
* **Frontend Application**: `http://localhost:3000`
* **Core API & Swagger Documentation**: `http://localhost:4000/api/docs`
* **AI Engine & Docs**: `http://localhost:8000/docs`
* **MinIO Object Storage Console**: `http://localhost:9001`

---

## 8. Quality Assurance and Coding Standards

### 8.1 Git Workflow and Branching Strategy
* **Protected Branches**: `main` (production), `develop` (staging).
* **Feature Branches**: `feature/<issue-id>-<short-description>`
* **Bug Fix Branches**: `fix/<issue-id>-<short-description>`
* **Hotfix Branches**: `hotfix/<issue-id>-<short-description>`
* **Pull Request Requirements**:
  * Every PR requires at least 1 peer code review approval.
  * All CI pipeline checks (lint, tests, build) must pass prior to merge.
  * Commit messages must adhere to Conventional Commits standard:
    * `feat: add pastoral verification status endpoint`
    * `fix: resolve websocket reconnection issue on chat window`
    * `chore: update pgvector dependency`

### 8.2 Code Quality Commands
```bash
# Run static code analysis across all workspaces
pnpm lint

# Run type checks
pnpm typecheck

# Run test suites
pnpm test:unit
pnpm test:e2e
```

---

## 9. Security, Privacy, and Compliance

* **Data Protection**: Full compliance with global data protection standards (GDPR, CCPA).
* **Encryption**: TLS 1.3 in transit, AES-256 for sensitive database fields (ID documents, phone numbers).
* **Access Control**: Strict principle of least privilege using Role-Based Access Control (RBAC).
* **Audit Logging**: Immutable audit trails for pastoral verifications, admin interventions, and sensitive profile inspections.
