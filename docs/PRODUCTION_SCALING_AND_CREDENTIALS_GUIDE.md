# Production Scaling and Client Credentials Guide

- **Platform**: Seventh-day Adventist (SDA) Matrimony Ecosystem
- **Target Environments**: AWS, GCP, Cloudflare, Kubernetes (EKS / GKE)
- **Document Version**: 1.0.0

---

## 1. Executive Summary

This guide serves as the definitive operational manual for taking the Seventh-day Adventist (SDA) Matrimony Platform from local development into an enterprise-grade, highly scalable, and secure production environment. It covers:

1. **Client Credential Acquisition**: The exhaustive list of accounts, API keys, and DNS delegations required from the client.
2. **Production Secret Configuration**: A comprehensive specification of all environment variables and secrets.
3. **Multi-Tier Scaling Strategy**: Architectural blueprints for scaling the web frontend, core REST APIs, WebSocket real-time gateway, AI engine, and database clusters.
4. **Security, Compliance & Disaster Recovery**: Hardening guidelines, PII data encryption, automated backups, and launch sign-off checklists.

---

## 2. Client Credentials & Third-Party Services Acquisition Matrix

Send this checklist to the client or organization IT administrator to acquire the necessary access and provision services.

| Service Category | Provider Options | Minimum Access / Permissions Required | Purpose in Platform |
| :--- | :--- | :--- | :--- |
| **Cloud Hosting** | AWS / GCP / Azure | IAM User or Role with Admin/Provisioning access to VPC, ECS/EKS, RDS, ElastiCache, S3, Secrets Manager, and IAM | Hosting containerized microservices and managed databases |
| **Domain & DNS / CDN** | Cloudflare / AWS Route 53 / Namecheap | DNS Zone Management (ability to create A, CNAME, TXT records) + Cloudflare WAF/CDN configuration | Custom domain routing, SSL/TLS 1.3 termination, DDoS protection, edge caching |
| **Transactional Email** | AWS SES / Resend / SendGrid / Postmark | SMTP credentials or API key with verified domain sending rights | Registration verification emails, password resets, interest notifications |
| **Object Storage** | AWS S3 / Cloudflare R2 / MinIO Enterprise | S3 Bucket creation, IAM Access Key ID & Secret Key, CORS policy management | Profile photos, government verification IDs, generated PDF biodata |
| **AI & Vector Embeddings** | OpenAI / Anthropic / Local vLLM | API Key with access to `text-embedding-3-small` or equivalent embedding models | Generating dense profile vector embeddings for compatibility scoring |
| **Image & Safety Moderation** | AWS Rekognition / Clarifai / Sightengine | API credentials for facial detection and NSFW image filtering | Ensuring profile photos contain valid human faces and adhere to Adventist modesty standards |
| **Observability & Errors** | Sentry / Datadog / Grafana Cloud | Project DSNs / Ingestion tokens for Web, Backend, and AI services | Live error monitoring, stack trace capture, uptime alerts |
| **SMS / 2FA (Optional)** | Twilio / AWS SNS / MessageBird | Account SID, Auth Token, Sender ID / Verified Phone Number | Two-factor authentication (2FA) and SMS alert notifications |
| **Payment Gateway (Optional)** | Stripe / Razorpay / PayPal | Publishable Key, Secret Key, and Webhook Signing Secret | Managing paid subscriptions and premium matrimonial tiers |

---

## 3. Detailed Client Access Requests

### 3.1 Cloud Provider Access Request (AWS Example)
Request the creation of an IAM User or Role named `sda-matrimony-deployer` with the following managed policies attached:
* `AmazonECS_FullAccess` (or `AmazonEKSClusterPolicy` if using Kubernetes)
* `AmazonRDSFullAccess`
* `AmazonElastiCacheFullAccess`
* `AmazonS3FullAccess`
* `SecretsManagerReadWrite`
* `CloudWatchLogsFullAccess`

### 3.2 Domain & DNS Configuration Requirements
The client must delegate DNS management or configure the following records on their domain provider:

| Host / Subdomain | Type | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| `matrimony.adventist.org` | `CNAME` / `A` | Load Balancer DNS / Edge IP | Web Application Frontend |
| `api.matrimony.adventist.org` | `CNAME` / `A` | Load Balancer DNS / Edge IP | Core REST API Gateway |
| `realtime.matrimony.adventist.org` | `CNAME` / `A` | Load Balancer DNS / Edge IP | WebSocket Gateway |
| `_dmarc.matrimony.adventist.org` | `TXT` | `v=DMARC1; p=reject; rua=mailto:...` | DMARC Email Security |
| `*._domainkey.matrimony.adventist.org`| `TXT` / `CNAME` | Provider DKIM keys | DKIM Email Verification |
| `@` | `TXT` | `v=spf1 include:amazonses.com ~all` | SPF Email Authorization |

---

## 4. Production Environment Configuration (`.env.production`)

Store all production secrets in a dedicated Secrets Manager (AWS Secrets Manager, Doppler, or HashiCorp Vault).

```bash
# ==============================================================================
# SEVENTH-DAY ADVENTIST MATRIMONY PLATFORM - PRODUCTION ENVIRONMENT
# ==============================================================================
NODE_ENV=production

# ------------------------------------------------------------------------------
# 1. APPLICATION URLS & DOMAINS
# ------------------------------------------------------------------------------
NEXT_PUBLIC_SITE_URL=https://matrimony.adventist.org
NEXT_PUBLIC_API_URL=https://api.matrimony.adventist.org/api/v1
NEXT_PUBLIC_WS_URL=wss://realtime.matrimony.adventist.org

# ------------------------------------------------------------------------------
# 2. CORE REST API (NestJS)
# ------------------------------------------------------------------------------
API_PORT=4000
API_PREFIX=api/v1
CORS_ORIGIN=https://matrimony.adventist.org

# High-entropy JWT secrets (Generate with: openssl rand -base64 64)
JWT_ACCESS_SECRET=REPLACE_WITH_HIGH_ENTROPY_64_CHAR_STRING
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_SECRET=REPLACE_WITH_HIGH_ENTROPY_64_CHAR_STRING
JWT_REFRESH_EXPIRATION=7d

# ------------------------------------------------------------------------------
# 3. REAL-TIME WEBSOCKET GATEWAY (NestJS / Socket.io)
# ------------------------------------------------------------------------------
WS_PORT=4001

# ------------------------------------------------------------------------------
# 4. DATABASE CONFIGURATION (PostgreSQL 16 + pgvector)
# ------------------------------------------------------------------------------
DATABASE_URL=postgresql://db_user:DB_PASSWORD@prod-postgres.xxxx.us-east-1.rds.amazonaws.com:5432/sda_matrimony_prod?schema=public&sslmode=require&connection_limit=50

# ------------------------------------------------------------------------------
# 5. REDIS CLUSTER (AWS ElastiCache Redis 7)
# ------------------------------------------------------------------------------
REDIS_URL=rediss://:REDIS_PASSWORD@prod-redis.xxxx.use1.cache.amazonaws.com:6379

# ------------------------------------------------------------------------------
# 6. AI & MACHINE LEARNING MICROSERVICE (FastAPI)
# ------------------------------------------------------------------------------
AI_SERVICE_PORT=8000
AI_SERVICE_URL=http://ai-engine.internal:8000/api/v1
AI_SERVICE_SECRET=REPLACE_WITH_INTERNAL_SHARED_TOKEN
OPENAI_API_KEY=sk-proj-REPLACE_WITH_OPENAI_KEY

# ------------------------------------------------------------------------------
# 7. OBJECT STORAGE (AWS S3)
# ------------------------------------------------------------------------------
STORAGE_DRIVER=s3
S3_REGION=us-east-1
S3_BUCKET=sda-matrimony-media-prod
S3_ACCESS_KEY=AKIA_REPLACE_WITH_AWS_ACCESS_KEY
S3_SECRET_KEY=REPLACE_WITH_AWS_SECRET_KEY
S3_FORCE_PATH_STYLE=false

# ------------------------------------------------------------------------------
# 8. TRANSACTIONAL EMAIL (AWS SES / SendGrid)
# ------------------------------------------------------------------------------
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=REPLACE_WITH_SMTP_USER
SMTP_PASSWORD=REPLACE_WITH_SMTP_PASSWORD
SMTP_FROM_EMAIL=noreply@matrimony.adventist.org
SMTP_FROM_NAME="SDA Matrimony Platform"

# ------------------------------------------------------------------------------
# 9. OBSERVABILITY & MONITORING (Sentry)
# ------------------------------------------------------------------------------
SENTRY_DSN=https://xxxxxxxx@o000000.ingest.sentry.io/0000000
```

---

## 5. Multi-Tier Scaling Architecture

```
                                  [ Global User Traffic ]
                                             |
                                             v
                             [ Cloudflare CDN / WAF Edge ]
                               (TLS 1.3 / Anti-DDoS / Rate Limiting)
                                             |
                                             v
                             [ AWS Application Load Balancer ]
                                             |
         +-----------------------------------+-----------------------------------+
         |                                   |                                   |
         v                                   v                                   v
 [ Next.js Web SSR ]               [ NestJS Core API ]               [ NestJS Realtime WS ]
  Auto-scaling (3-10 Pods)          Auto-scaling (3-10 Pods)          Auto-scaling (2-6 Pods)
         |                                   |                                   |
         |                                   +----------------+                  |
         |                                   |                |                  |
         v                                   v                v                  v
 [ S3 Media Bucket ]               [ Python AI Engine ] [ AWS RDS Postgres ] [ ElastiCache Redis ]
  (Pre-signed URLs / CloudFront)   (BullMQ Worker Queue)  (Primary + Replica)  (Cluster: Pub/Sub & Cache)
                                                         + pgvector (HNSW)
```

### 5.1 Web Frontend Layer (`apps/web` - Next.js 14)
* **Edge Static Caching**: Offload all static JS chunks, CSS, fonts, and images to Cloudflare / AWS CloudFront.
* **SSR Horizontal Pod Autoscaling (HPA)**: Scale between 3 and 10 replicas based on CPU utilization (> 70%) or active request counts.
* **Client-Side State**: Zustand store cached in `localStorage` for offline session resilience.

### 5.2 Core REST API (`apps/api-core` - NestJS)
* **Stateless Instances**: Zero in-memory session state; all state delegated to JWTs, Redis, and PostgreSQL.
* **Connection Pooling**: Use **AWS RDS Proxy** or **PgBouncer** to pool up to 5,000 concurrent database connections.
* **Multi-Tier Caching**:
  * Adventist church directory (Divisions, Unions, Conferences) cached in Redis for 24 hours.
  * User profile summaries cached with selective invalidation on profile updates.

### 5.3 Real-Time Gateway (`apps/api-realtime` - Socket.io)
* **Distributed Pub/Sub**: Deploy `@socket.io/redis-adapter` over AWS ElastiCache Redis so socket rooms and chat messages scale seamlessly across multiple gateway instances.
* **Load Balancer Sticky Sessions**: Configure ALB cookie affinity for initial WebSocket handshakes.

### 5.4 AI & Vector Engine (`apps/ai-engine` - FastAPI)
* **Asynchronous Offloading**: Offload expensive operations (vector embedding generation, computer vision NSFW checks) to background worker queues (BullMQ / Celery) to prevent blocking HTTP endpoints.
* **Vector Index Tuning (`pgvector`)**:
  ```sql
  CREATE INDEX IF NOT EXISTS idx_profile_embeddings_hnsw 
  ON profile_embeddings 
  USING hnsw (embedding vector_cosine_ops) 
  WITH (m = 16, ef_construction = 64);
  ```

### 5.5 Database & Storage Layer
* **PostgreSQL Multi-AZ Deployment**: AWS Aurora / RDS PostgreSQL 16 with automated failover replica.
* **Read Replicas**: Direct read-heavy discovery queries and biodata generation to dedicated read replicas.
* **Object Storage**: S3 bucket with `Block All Public Access = TRUE`. Media accessed strictly through 15-minute time-limited pre-signed URLs.

---

## 6. Zero-Downtime Deployment & CI/CD Pipeline

Implement automated deployments using GitHub Actions:

```
[ Push to MasterZ-FullVersion ] 
              │
              ▼
[ Automated Quality Gates ] (npm run lint ➔ npm run typecheck ➔ npm run test)
              │
              ▼
[ Multi-Stage Docker Builds ] (Web, Core API, Realtime API, AI Engine)
              │
              ▼
[ Push to Container Registry ] (AWS ECR / GitHub Packages)
              │
              ▼
[ Database Migration Step ] (npx prisma migrate deploy)
              │
              ▼
[ Rolling Cluster Deployment ] (AWS ECS / Kubernetes rolling update with zero downtime)
```

---

## 7. Security Hardening & Compliance Checklist

- [x] **TLS 1.3 & HSTS**: Strict HTTPS enforced across all subdomains with `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- [x] **Rate Limiting**: Distributed Redis token-bucket rate limiting (5 attempts/min for `/auth/login`, 100 requests/min for general endpoints).
- [x] **PII Protection**: Government IDs, passport numbers, and pastoral phone numbers encrypted in PostgreSQL with AES-256-GCM.
- [x] **Token Lifecycles**: 15-minute JWT access tokens + rotating refresh tokens stored in `HttpOnly; Secure; SameSite=Strict` cookies.
- [x] **CORS Policy**: Strictly locked to `https://matrimony.adventist.org`.
- [x] **Disaster Recovery**: Automated continuous WAL archiving (PITR) to S3 with Recovery Time Objective (RTO) < 15 minutes and Recovery Point Objective (RPO) < 5 minutes.

---

## 8. Launch Verification Sign-Off Matrix

Before directing live Adventist community traffic to the platform, verify that all items below have passed:

| Verification Item | Acceptance Criteria | Verified By | Date |
| :--- | :--- | :--- | :--- |
| **SSL/TLS & Domain** | `A+` grade on Qualys SSL Labs; TLS 1.3 confirmed active | DevOps Lead | ______ |
| **Prisma Migrations** | All migrations applied to production RDS instance with zero errors | Backend Lead | ______ |
| **`pgvector` Index** | HNSW vector cosine similarity index compiled and verified | AI Engineer | ______ |
| **Email Deliverability** | Verification email delivered to inbox with valid SPF/DKIM passes | QA Lead | ______ |
| **S3 Media Security** | Public direct GET requests to S3 return 403 Forbidden | Security Lead| ______ |
| **WebSocket Sync** | Messages delivered in real-time across 2+ distinct gateway pods | Full-Stack Lead | ______ |
| **Sentry Monitoring** | Test exception correctly triggers Sentry event and on-call alert | DevOps Lead | ______ |
| **Load Test (k6)** | Sustains 1,000 concurrent active users with p95 latency < 150ms | QA Lead | ______ |

---

*Authored for the Seventh-day Adventist Matrimony Platform Architecture Team.*
