# Production Readiness and Deployment Architecture

- **Architect & Author**: MasterZ1311
- **GitHub Profile**: [https://github.com/MasterZ1311](https://github.com/MasterZ1311)
- **Repository**: [https://github.com/MasterZ1311/SDA-Matrimony-Site](https://github.com/MasterZ1311/SDA-Matrimony-Site)

---

## 1. Executive Statement

As the sole architect and developer of this platform, I engineered the SDA Matrimony system with enterprise security, low latency, fault tolerance, and horizontal scalability as foundational requirements. 

This document serves as the canonical blueprint for transitioning the platform from local development into high-availability production environments (AWS, GCP, or bare-metal Kubernetes clusters).

---

## 2. Infrastructure Architecture for Production

```
                                 [ Internet Traffic ]
                                          |
                                          v
                              [ Cloudflare Edge / WAF ]
                                (DDoS / TLS 1.3 / CDN)
                                          |
                                          v
                              [ Application Load Balancer ]
                               (AWS ALB / NGINX Ingress)
                                          |
        +---------------------------------+---------------------------------+
        |                                 |                                 |
        v                                 v                                 v
[ Next.js SSR Web ]              [ NestJS Core API ]            [ NestJS Realtime WS ]
  (Replica Set: 3+)                (Replica Set: 3+)              (Replica Set: 2+)
        |                                 |                                 |
        |                                 +----------------+                |
        |                                 |                |                |
        v                                 v                v                v
[ Next.js Static Cache ]         [ Python AI Engine ]    [ PostgreSQL 16 ]  [ Redis 7 Cluster ]
                                  (Replica Set: 2+)      (Primary + Replica) (Cache/PubSub/Queue)
                                                           + pgvector
```

---

## 3. Containerization and Orchestration

### 3.1 Docker Multi-Stage Optimization
All microservices (`web`, `api-core`, `api-realtime`, `ai-engine`) must be compiled using multi-stage Docker builds to:
- Minimize production image attack surface.
- Exclude build-time dependencies, devDependencies, and test runners from production images.
- Enforce non-root user execution (`USER node` or `USER nonroot`) to prevent container breakout vulnerabilities.

### 3.2 Kubernetes Deployment Topology
When deploying to Kubernetes (EKS / GKE):
- **Horizontal Pod Autoscaling (HPA)**: Configure HPA targets (CPU utilization > 70% or memory utilization > 75%).
- **Pod Disruption Budgets (PDB)**: Enforce a minimum of 1 available replica during rolling cluster upgrades.
- **Liveness and Readiness Probes**:
  - `api-core`: `GET /health/liveness` and `GET /health/readiness`
  - `api-realtime`: TCP socket health check on port 4001
  - `ai-engine`: `GET /health`
  - `web`: `GET /api/health`

---

## 4. Database Optimization and Storage Reliability

### 4.1 PostgreSQL 16 & pgvector
- **Connection Pooling**: Deploy AWS RDS Proxy or PgBouncer in transaction pooling mode to manage connection concurrency efficiently.
- **Vector Indexing (`pgvector`)**:
  - Use `HNSW` (Hierarchical Navigable Small World) or `IVFFlat` indexes on profile embedding vectors for sub-10ms approximate nearest neighbor searches.
  - Optimize vector search index parameters:
    ```sql
    CREATE INDEX ON profile_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
    ```
- **Read Replicas**: Route complex search queries and biodata read requests to dedicated PostgreSQL read replicas.

### 4.2 Automated Backups and Disaster Recovery
- **Continuous Archiving**: Enable Point-In-Time Recovery (PITR) with continuous WAL archiving to S3.
- **Daily Snapshots**: Automated daily full snapshots with a 30-day retention policy across multi-region backups.
- **RTO & RPO**: Designed for a Recovery Time Objective (RTO) < 15 minutes and Recovery Point Objective (RPO) < 5 minutes.

---

## 5. Security Hardening and Compliance

### 5.1 Transport and Perimeter Security
- **TLS Termination**: Enforce TLS 1.3 exclusively at the edge with HSTS (`max-age=31536000; includeSubDomains; preload`).
- **Web Application Firewall (WAF)**: Cloudflare / AWS WAF rules blocking SQL injection, XSS, rate anomalies, and known malicious IP lists.
- **CORS Configuration**: Restrict `Access-Control-Allow-Origin` explicitly to the production domain (`https://matrimony.adventist.org`).

### 5.2 Application-Level Security and Data Protection
- **Password Security**: Bcrypt with a salt round factor >= 12 or Argon2id.
- **JWT Lifecycle Management**:
  - Short-lived Access Tokens (15-minute expiration).
  - Refresh Tokens stored in HTTP-only, Secure, SameSite=Strict cookies with automatic token family rotation and reuse detection.
- **PII Encryption at Rest**: Government ID documents, passport numbers, and pastoral contact information encrypted in PostgreSQL using AES-256 before storage.
- **Object Storage Hardening**: MinIO/S3 buckets configured with zero public access. All media uploads and downloads strictly mediated via time-limited pre-signed URLs (TTL <= 15 minutes).

### 5.3 Regulatory Compliance
- **GDPR & CCPA**: User endpoints provided for right-to-be-forgotten (account deletion purging PII and anonymizing audit logs) and right-to-data-portability (structured JSON export).

---

## 6. Real-Time and Caching Strategy

### 6.1 Redis 7 Architecture
- **Clustering**: Multi-node Redis Cluster with Sentinel for automatic failover.
- **Key Eviction & Memory**: `maxmemory-policy allkeys-lru` with memory limits provisioned.
- **WebSocket Pub/Sub Scaling**: `@socket.io/redis-adapter` distributes socket events seamlessly across all running `api-realtime` pod instances.
- **Rate Limiting**: Distributed token-bucket rate limiting via Redis (`100 requests / minute` for standard endpoints; `5 requests / minute` for authentication attempts).

---

## 7. Observability, Monitoring, and Telemetry

### 7.1 Metrics & Dashboards
- **Prometheus**: Scrapes metrics from `/metrics` endpoints across `api-core`, `api-realtime`, and system exporters.
- **Grafana**: Real-time production dashboards monitoring HTTP request latency (p50, p95, p99), active WebSocket connections, error rates (4xx/5xx), database query execution times, and memory consumption.

### 7.2 Structured Logging and Tracing
- **Structured JSON Logging**: Winston and Pino loggers emitting standard fields: `timestamp`, `level`, `service`, `traceId`, `userId`, `message`, `context`.
- **Centralized Log Aggregation**: Logs shipped via FluentBit to Grafana Loki, AWS CloudWatch, or Elasticsearch.
- **Exception Tracking**: Sentry integrated in `apps/web`, `apps/api-core`, and `apps/ai-engine` with source-map integration and release tagging.

---

## 8. Pre-Flight Production Launch Checklist

| Category | Verification Item | Status Requirement |
| :--- | :--- | :--- |
| **Environment** | Production `.env` secrets loaded via AWS Secrets Manager / Vault | Mandatory |
| **Database** | Prisma migrations successfully applied and verified | Mandatory |
| **Database** | `pgvector` HNSW indexes compiled and operational | Mandatory |
| **Security** | Zero critical/high vulnerabilities in `npm audit` / `pip check` | Mandatory |
| **Security** | TLS 1.3, CSP headers, and CORS restrict production origins | Mandatory |
| **Realtime** | Redis adapter confirmed active across distributed WebSocket pods | Mandatory |
| **Storage** | S3 / MinIO bucket policies block public reads; pre-signed URLs enforced | Mandatory |
| **Monitoring** | Sentry, Prometheus, and Grafana alerts configured with on-call routing | Mandatory |
| **Disaster Recovery**| Automated daily backup verification and restore test passed | Mandatory |

---

*Authored by MasterZ1311 ([https://github.com/MasterZ1311](https://github.com/MasterZ1311)).*
