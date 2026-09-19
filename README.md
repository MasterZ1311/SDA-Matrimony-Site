# Seventh-day Adventist (SDA) Matrimony Platform

- **Architect & Lead Developer**: MasterZ1311
- **GitHub Profile**: [https://github.com/MasterZ1311](https://github.com/MasterZ1311)
- **Repository**: [https://github.com/MasterZ1311/SDA-Matrimony-Site](https://github.com/MasterZ1311/SDA-Matrimony-Site)
- **Branch**: [MasterZ-FullVersion](https://github.com/MasterZ1311/SDA-Matrimony-Site/tree/MasterZ-FullVersion)

---

## 1. Executive Summary and Author Statement

As the sole architect and developer of this platform, I engineered the Seventh-day Adventist (SDA) Matrimony Platform to address the nuanced spiritual, lifestyle, and community-trust requirements of the global Seventh-day Adventist denomination.

Traditional matrimonial platforms operate on generic demographic parameters that fail to capture Adventist core values, including Sabbath observance, baptismal commitment, Adventist health and dietary standards, local church and conference governance, and verified pastoral endorsements. This platform was designed from the ground up to establish a trusted, secure, and modern digital ecosystem for Adventist individuals seeking spiritually aligned marriage.

The system is engineered as a production-ready, full-stack monorepo featuring a Next.js 14 web client, a high-throughput NestJS REST API, a distributed Socket.io real-time gateway, a Python FastAPI AI and moderation microservice, and a PostgreSQL database powered by Prisma and `pgvector`.

---

## 2. Technical Documentation Index

For in-depth architectural breakdowns, setup procedures, and deployment guides, refer to the dedicated documentation files:

- **[System Architecture (docs/ARCHITECTURE.md)](file:///e:/Github/Matrimony%20Project/docs/ARCHITECTURE.md)**: Deep dive into microservice boundaries, data flow lifecycles, database entity relationships, and type-safety mechanisms.
- **[Technology Stack Specifications (docs/TECH_STACK.md)](file:///e:/Github/Matrimony%20Project/docs/TECH_STACK.md)**: Exhaustive breakdown of frameworks, libraries, database engines, caching layers, and tooling across the entire monorepo.
- **[Platform Features and Domain Specs (docs/FEATURES.md)](file:///e:/Github/Matrimony%20Project/docs/FEATURES.md)**: Comprehensive catalog of faith profiling, church hierarchy integration, pastoral verification, AI matching, and privacy controls.
- **[Local Development and Onboarding Guide (docs/GETTING_STARTED.md)](file:///e:/Github/Matrimony%20Project/docs/GETTING_STARTED.md)**: Step-by-step instructions for configuring local environments, running Docker infrastructure, applying migrations, seeding data, and executing services.
- **[API Specification (docs/API_SPECIFICATION.md)](file:///e:/Github/Matrimony%20Project/docs/API_SPECIFICATION.md)**: Comprehensive REST and WebSocket interface definitions, payload schemas, query parameters, authentication headers, and Socket.IO events.
- **[Production Readiness and Deployment Guide (docs/PRODUCTION_READINESS.md)](file:///e:/Github/Matrimony%20Project/docs/PRODUCTION_READINESS.md)**: Enterprise deployment standards, containerization, Kubernetes topologies, security hardening, database clustering, and observability.
- **[Production Scaling & Client Credentials Guide (docs/PRODUCTION_SCALING_AND_CREDENTIALS_GUIDE.md)](file:///e:/Github/Matrimony%20Project/docs/PRODUCTION_SCALING_AND_CREDENTIALS_GUIDE.md)**: Client access checklists, production secret configurations, horizontal scaling blueprints, and launch verification sign-off matrix.
- **[Feature Gap & Ecosystem Analysis (docs/FEATURE_GAP_ANALYSIS.md)](file:///e:/Github/Matrimony%20Project/docs/FEATURE_GAP_ANALYSIS.md)**: Comparative feature gap audit against reference implementations, evaluating candidate safety, interactive prompts, and shortlist subsystems.

---

## 3. High-Level System Architecture

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
| greSQL|      | Cache |      | MinIO |               | Vector|      | Queue |      | Logs  |
| /pgvec|      | /Queue|      | Media |               | Engine|      | (Bull)|      |       |
+-------+      +-------+      +-------+               +-------+      +-------+      +-------+
```

---

## 4. Repository Structure

The monorepo structure is organized into discrete applications and shared packages:

```
.
├── apps/
│   ├── web/                     # Next.js 14 Web Application (App Router, Zustand, React Query)
│   ├── api-core/                # NestJS REST API (Auth, Profiles, Church, Verification, Biodata)
│   ├── api-realtime/            # NestJS WebSocket Gateway (Socket.io, Redis Adapter)
│   └── ai-engine/               # Python FastAPI Microservice (Compatibility & Moderation)
├── packages/
│   ├── database/                # Prisma ORM schema, PostgreSQL migrations, and database seeds
│   └── common-types/            # Shared TypeScript interfaces, DTOs, and domain enums
├── docs/
│   ├── ARCHITECTURE.md          # System design, data flows, and schema relationships
│   ├── TECH_STACK.md            # Detailed technology stack and dependency analysis
│   ├── FEATURES.md              # Domain specifications and feature catalog
│   ├── GETTING_STARTED.md       # Developer onboarding and local execution guide
│   ├── API_SPECIFICATION.md     # REST & WebSocket API specification and payloads
│   ├── PRODUCTION_READINESS.md  # Production hardening, deployment, and security checklist
│   ├── PRODUCTION_SCALING_AND_CREDENTIALS_GUIDE.md # Production scaling, secrets, and credentials
│   └── FEATURE_GAP_ANALYSIS.md  # Competitive gap analysis and missing feature specifications
├── infrastructure/
│   └── docker/                  # Docker Compose definitions (PostgreSQL, Redis, MinIO)
└── README.md                    # Root platform documentation
```

---

## 5. Core Platform Capabilities

### 5.1 Faith and Spiritual Profile System
- **Church Hierarchy Integration**: Mapping across General Conference Divisions, Unions, Conferences/Missions, and Local Churches.
- **Baptism & Sabbath Alignment**: Explicit tracking of baptism by immersion, Sabbath observance practices, and doctrinal perspectives.
- **Church Ministry Engagement**: Participation in Pathfinders, Sabbath School, Adventist Youth, Music Ministry, Deaconry, and Eldership.

### 5.2 Adventist Health and Lifestyle Standards
- **Dietary Categories**: Support for Strict Vegan, Lacto-Ovo Vegetarian, Pescatarian, and Levitical Non-Vegetarian standards.
- **Health Commitments**: Strict abstinence from alcohol, tobacco, narcotics, and unclean foods.
- **Modesty & Recreation**: Alignment on music preferences, recreational activities, and Christian modesty.

### 5.3 Multi-Tiered Verification and Safety
- **Pastoral Endorsement Workflow**: Verification outreach enabling local pastors or elders to confirm membership and character standing.
- **Identity & Face Matching**: Government photo ID upload combined with computer vision face matching and OCR birth date validation.
- **Granular Photo Privacy**: Configurable photo privacy tiers (Public, Verified Members Only, Upon Approved Request) with automated dynamic watermarking.

### 5.4 AI Compatibility and Discovery
- **Theological Redline Filters**: Strict validation against non-negotiable faith parameters.
- **Multi-Factor Scoring Formula**: Weighted mathematical scoring factoring faith alignment, lifestyle commitments, education, occupation, and geographic proximity.
- **Vector Semantic Search**: Dense vector embeddings stored in PostgreSQL via `pgvector` for candidate discovery.

### 5.5 Communication and Biodata Generation
- **Two-Way Express Interest**: Structured interest request lifecycle (`PENDING` -> `ACCEPTED` / `DECLINED`).
- **Real-Time Instant Messaging**: WebSocket 1-on-1 messaging unlocked only after mutual interest acceptance, with real-time NLP safety screening.
- **Automated PDF Biodata Generator**: Formatted printable PDF exports for traditional family and pastoral review.

---

## 6. Quick Start Summary

For comprehensive onboarding instructions, review [docs/GETTING_STARTED.md](file:///e:/Github/Matrimony%20Project/docs/GETTING_STARTED.md).

### 6.1 Prerequisites
- Node.js >= 20.x
- Python >= 3.11
- Docker Engine >= 26.x and Docker Compose >= 2.x

### 6.2 Setup and Launch
```bash
# 1. Clone repository and checkout branch
git clone https://github.com/MasterZ1311/SDA-Matrimony-Site.git
cd SDA-Matrimony-Site
git checkout MasterZ-FullVersion

# 2. Configure environment
cp .env.example .env

# 3. Start local Docker infrastructure (PostgreSQL + pgvector, Redis, MinIO)
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d

# 4. Install dependencies and build shared packages
npm install
npm run build:packages

# 5. Initialize database schema and seed data
cd packages/database
npx prisma db push
npx ts-node prisma/seed.ts
cd ../..

# 6. Run all services concurrently
npm run dev
```

### 6.3 Local Service URLs
- **Web Application**: `http://localhost:3000`
- **Core REST API**: `http://localhost:4000/api/docs`
- **Realtime Gateway**: `ws://localhost:4001`
- **AI Engine Docs**: `http://localhost:8000/docs`
- **MinIO Console**: `http://localhost:9001`

---

## 7. Security and Quality Assurance

- **Static Type Safety**: End-to-end type validation across frontend, backend, and database layers via `@sda/common-types` and Prisma.
- **Data Protection**: AES-256 encryption for PII at rest, TLS 1.3 in transit, and short-lived JWT access tokens with rotating refresh cookies.
- **Audit Trails**: Immutable event logs for all verification decisions, profile modifications, and administrative oversight.

---

*Architected and developed by MasterZ1311 ([https://github.com/MasterZ1311](https://github.com/MasterZ1311)).*
