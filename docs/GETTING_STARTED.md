# Local Development and Onboarding Guide

- **Architect & Author**: MasterZ1311
- **GitHub Profile**: [https://github.com/MasterZ1311](https://github.com/MasterZ1311)
- **Repository**: [https://github.com/MasterZ1311/SDA-Matrimony-Site](https://github.com/MasterZ1311/SDA-Matrimony-Site)

---

## 1. Overview

Welcome to the SDA Matrimony Platform codebase. As the sole author and architect of this system, I designed the repository to be self-contained, reproducible, and straightforward for any new engineer to set up and run locally.

This guide provides step-by-step instructions to configure your development environment, start supporting infrastructure, run database migrations, seed sample data, and launch all microservices.

---

## 2. Prerequisites

Ensure the following tools are installed on your host system:

- **Node.js**: Version 20.x LTS or higher.
- **Package Manager**: `npm` (version 10.x+) or `pnpm` (version 9.x+).
- **Python**: Version 3.11 or higher (with `pip` and virtual environment support).
- **Docker & Docker Compose**: Docker Engine 26.x+ and Docker Compose 2.x+.
- **Git**: Version 2.40+ installed.

---

## 3. Clone Repository and Configure Environment

### 3.1 Clone Repository
```bash
git clone https://github.com/MasterZ1311/SDA-Matrimony-Site.git
cd SDA-Matrimony-Site
```

### 3.2 Checkout Target Development Branch
```bash
git checkout MasterZ-FullVersion
```

### 3.3 Set Up Environment Configuration
Copy the sample environment file to `.env`:
```bash
# On Linux/macOS
cp .env.example .env

# On Windows (PowerShell)
Copy-Item .env.example .env
```

Review `.env` and configure local variables as necessary. Default ports and service keys are pre-configured for standard local Docker infrastructure.

---

## 4. Bootstrapping Infrastructure with Docker

The platform depends on PostgreSQL 16 (with `pgvector` enabled), Redis 7, and MinIO object storage. These services are defined in `infrastructure/docker/docker-compose.dev.yml`.

Start the background containers:
```bash
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d
```

Verify that all containers are healthy:
```bash
docker compose -f infrastructure/docker/docker-compose.dev.yml ps
```

| Service | Port | Internal Purpose |
| :--- | :--- | :--- |
| **PostgreSQL (`pgvector`)** | `5432` | Relational database & vector embedding storage |
| **Redis** | `6379` | Cache, session store, and WebSocket pub/sub |
| **MinIO API** | `9000` | S3-compatible media and document storage |
| **MinIO Web Console** | `9001` | Object storage management interface (admin / password) |

---

## 5. Installing Dependencies and Preparing Database

### 5.1 Install Node.js Dependencies
Install all workspace dependencies from the repository root:
```bash
npm install
```

### 5.2 Build Shared Monorepo Packages
Build `@sda/common-types` and `@sda/database` packages so microservices can consume them:
```bash
npm run build:packages
```

### 5.3 Apply Database Schema and Seed Data
Generate the Prisma Client, run migrations against your local PostgreSQL instance, and seed default church hierarchy and demo user accounts:
```bash
# Navigate to database package or execute from root
cd packages/database
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts
cd ../..
```

---

## 6. Python AI Engine Setup

The AI microservice handles compatibility scoring, image validation, and NLP moderation.

### 6.1 Create and Activate Virtual Environment
```bash
# On Linux/macOS
cd apps/ai-engine
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ../..

# On Windows (PowerShell)
cd apps/ai-engine
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ../..
```

---

## 7. Running the Application Services

You can launch all services concurrently or execute them individually across separate terminals.

### 7.1 Option A: Run All Services Concurrently
From the root directory:
```bash
npm run dev
```

### 7.2 Option B: Run Services Individually

#### Terminal 1: Core API (`apps/api-core`)
```bash
cd apps/api-core
npm run start:dev
```
*Listens on: `http://localhost:4000`*

#### Terminal 2: Realtime Gateway (`apps/api-realtime`)
```bash
cd apps/api-realtime
npm run start:dev
```
*Listens on: `http://localhost:4001`*

#### Terminal 3: AI Engine (`apps/ai-engine`)
```bash
cd apps/ai-engine
# Ensure virtual environment is active
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Listens on: `http://localhost:8000`*

#### Terminal 4: Frontend Client (`apps/web`)
```bash
cd apps/web
npm run dev
```
*Listens on: `http://localhost:3000`*

---

## 8. Service Endpoints Reference

Once running, access the local endpoints:

- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **API Core Swagger Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Realtime Gateway WebSocket**: `ws://localhost:4001`
- **AI Engine OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **MinIO Storage Console**: [http://localhost:9001](http://localhost:9001)

---

## 9. Quality Assurance and Testing

### 9.1 Static Type Analysis
```bash
npm run typecheck
```

### 9.2 Linting
```bash
npm run lint
```

### 9.3 Executing Test Suites
```bash
# Test Core API
npm run test --workspace=apps/api-core

# Test Python AI Engine
cd apps/ai-engine
python test_ai_engine.py
cd ../..
```

---

*Authored by MasterZ1311 ([https://github.com/MasterZ1311](https://github.com/MasterZ1311)).*
