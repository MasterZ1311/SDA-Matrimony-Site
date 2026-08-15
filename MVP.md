# SDA Matrimony Platform: MVP Phase Execution Plan

## 1. Document Overview

This document outlines the Minimum Viable Product (MVP) phase for the Seventh-day Adventist (SDA) Matrimony Platform. The primary objective of the MVP is to deliver a secure, faith-aligned, high-trust matchmaking experience with core spiritual profile matching, basic real-time communication, pastoral verification requests, and privacy controls.

---

## 2. MVP Goals and Success Criteria

### 2.1 Core Goals
* Provide an intuitive onboarding flow capturing essential SDA faith metrics (baptism, Sabbath observance, church conference, dietary habits).
* Enable advanced filtering and rule-based compatibility scoring.
* Implement a two-way interest approval workflow prior to private messaging.
* Provide an administrative and pastoral verification interface to guarantee high community trust.
* Deliver a production-hardened, responsive web application with zero critical vulnerabilities.

### 2.2 Key Performance Indicators (KPIs) for MVP
* Profile Completion Rate >= 85%.
* User Verification Submission Rate >= 60%.
* Average API Response Time (p95) < 150ms.
* Zero unhandled security exceptions or unauthorized data disclosures.
* 99.9% uptime during the launch window.

---

## 3. MoSCoW Scope Prioritization

### 3.1 Must Have (P0 - Mandatory for MVP Launch)
* **Authentication & Authorization**:
  * Email/Password registration with email verification link.
  * Role-Based Access Control (Member, Verified Member, Pastor/Verifier, Platform Admin).
* **Faith-Centric Profile Management**:
  * Adventist church hierarchy selection (Division -> Union -> Conference -> Church).
  * Baptism status, Sabbath observance, dietary preference (Vegan, Vegetarian, etc.).
  * Photo upload with privacy settings (Public, Verified-Only, On-Request).
* **Matching & Discovery**:
  * Profile browsing with structured multi-attribute filtering.
  * Rule-based faith compatibility index calculation.
* **Interaction Workflow**:
  * Send/Accept/Decline Interest requests.
  * 1-on-1 text messaging strictly unlocked after mutual interest acceptance.
* **Verification**:
  * Pastor / Local Elder reference submission.
  * Admin review queue to approve/reject pastoral and identity verification.
* **Basic Biodata Generation**:
  * Standardized PDF export of candidate profile for offline review.

### 3.2 Should Have (P1 - Fast-Follow Post Core Flow)
* Basic automated NSFW and face validation on profile photo upload.
* Real-time typing indicators and online presence status in chat.
* Email and in-app notifications for interest requests and new messages.
* Shortlist / Bookmark candidate profiles.

### 3.3 Could Have (P2 - Defer to Phase 2)
* AI vector similarity embedding search for qualitative spiritual essays.
* Automated government ID OCR scanning.
* Paid subscription tiers / payment gateway integration.
* In-app audio/video calling.

### 3.4 Won't Have (P3 - Out of Scope for MVP)
* Native mobile applications (iOS/Android) — focus exclusively on responsive web.
* Public astrological / horoscope matchmaking (explicitly excluded as anti-doctrinal).
* Swipe-based dating mechanics (incompatible with traditional matrimonial decorum).

---

## 4. 4-Week Sprint Schedule

```
+-----------------------------------------------------------------------------------+
| Week 1: Foundation, Data Models, Authentication & Core UI Shell                   |
+-----------------------------------------------------------------------------------+
| Week 2: SDA Profile Engine, Search/Filter Pipeline & Verification Workflows       |
+-----------------------------------------------------------------------------------+
| Week 3: Matching Logic, Realtime Messaging, Media Pipeline & AI Moderation        |
+-----------------------------------------------------------------------------------+
| Week 4: End-to-End Integration, Security Hardening, UAT & Production Launch       |
+-----------------------------------------------------------------------------------+
```

### 4.1 Sprint 1 (Week 1): Architecture Foundation and Core Schemas
* **Frontend**: Setup Next.js 14 App Router, establish design tokens, layout shell, auth views (Sign In, Sign Up, Email Verification).
* **Backend Dev 1**: Initialize NestJS API, implement JWT/Refresh token auth, RBAC guards, and email service integration.
* **Backend Dev 2**: Setup database schema in PostgreSQL (Users, Profiles, ChurchEntities), build base CRUD endpoints.
* **AI/ML Engineer**: Define compatibility scoring formulation; setup FastAPI scaffolding and moderation baseline scripts.
* **DevOps & DB**: Spin up PostgreSQL + pgvector, Redis, Docker Compose environment, and GitHub Actions CI pipelines (linting and testing).

### 4.2 Sprint 2 (Week 2): Profile Engine, Church Hierarchy and Search
* **Frontend**: Build multi-step SDA Profile Onboarding wizard, member profile view, and search filter interface.
* **Backend Dev 1**: Build Profile Service, Church Directory endpoints, and Pastoral Verification submission endpoints.
* **Backend Dev 2**: Implement full-text and parameterized profile search queries with Redis caching.
* **AI/ML Engineer**: Implement image safety validation pipeline (face detection + NSFW screening) for profile images.
* **DevOps & DB**: Configure MinIO / S3 object storage with pre-signed upload URLs and access policies.

### 4.3 Sprint 3 (Week 3): Interaction Workflows, Realtime Messaging and Matching
* **Frontend**: Implement Express Interest workflow UI, Realtime Chat window, and notification tray.
* **Backend Dev 1**: Implement Interest state machine (Pending, Accepted, Rejected, Blocked) and PDF Biodata generator.
* **Backend Dev 2**: Implement WebSocket gateway (Socket.io) with Redis Pub/Sub for private 1-on-1 messaging.
* **AI/ML Engineer**: Integrate hybrid scoring algorithm combining rule-based filters and bio compatibility score.
* **DevOps & DB**: Deploy staging environment, configure NGINX reverse proxy, SSL certificates, and Sentry error monitoring.

### 4.4 Sprint 4 (Week 4): Integration, Security Hardening and Launch
* **Frontend**: Polish responsive states, edge case handling (empty states, connection dropbacks), and accessibility review.
* **Backend Dev 1 & 2**: Complete end-to-end integration, rate limiting, SQL injection and XSS defenses, audit log interceptors.
* **AI/ML Engineer**: Connect AI moderation directly to file upload middleware with fallback handlers.
* **DevOps & DB**: Load testing with k6 (target: 500 concurrent active users), database index tuning, automated daily backup verification.
* **All Team**: User Acceptance Testing (UAT), bug triage, and zero-downtime production deployment.

---

## 5. Deliverables Breakdown by Role

### 5.1 Frontend Developer Deliverables
* Fully responsive client application compatible with desktop, tablet, and mobile browsers.
* 4-step SDA Registration & Profile Creation flow with client-side validation using Zod.
* Profile discovery view with instant filtering (Division, Conference, Diet, Education, Age).
* Secure 1-on-1 chat interface with real-time message delivery and read receipts.
* Admin / Pastor verification review panel.

### 5.2 Backend Developer 1 (Core Services & Verification)
* User authentication and session lifecycle management.
* Comprehensive SDA Church hierarchy data fixtures and REST APIs.
* Pastoral verification request management and admin approval endpoints.
* Server-side PDF Biodata generator rendering structured Adventist profiles.
* Comprehensive OpenAPI / Swagger documentation for all core endpoints.

### 5.3 Backend Developer 2 (Realtime, Search & Media)
* WebSocket server supporting concurrent chat sessions with connection heartbeats and reconnection handling.
* High-performance search and filtering service with multi-column database indexes.
* Express Interest workflow engine enforcing permissions and mutual acceptance rules.
* Background job queue (BullMQ) for asynchronous notification dispatch (email/SMS).
* Pre-signed S3 upload flow with validation and access token gating.

### 5.4 AI/ML Engineer Deliverables
* Standalone FastAPI service providing compatibility scoring between candidate profiles.
* Computer vision image moderation service validating face presence and blocking illicit images.
* Text moderation filter screening chat messages and user bios for contact scraping or inappropriate content.
* Python benchmark suite verifying scoring latency < 100ms per request.

### 5.5 DevOps and Database Engineer Deliverables
* Normalized PostgreSQL schema with strict foreign key constraints, indexes, and automated migrations.
* Redis caching layer with cache invalidation policies for search results and user sessions.
* Fully reproducible local development environment via Docker Compose.
* Production Kubernetes manifests / container deployment scripts with health checks.
* GitHub Actions CI/CD workflows executing automated lint, test, build, and deploy steps.
* Prometheus and Grafana dashboards tracking system latency, error rates, and resource utilization.

---

## 6. Definition of Done (DoD) for MVP

A feature or milestone is considered complete only when:
1. **Code Quality**: Code is reviewed and approved by at least one other engineer.
2. **Automated Testing**: Unit tests pass with >= 80% code coverage on business logic.
3. **Integration Verification**: Verified against staging database and dependent microservices.
4. **Security Clearance**: No medium or high severity vulnerabilities reported in dependency scans (Trivy/npm audit).
5. **Documentation**: API endpoints documented in Swagger/OpenAPI with valid request/response examples.
6. **Responsiveness**: UI components verified across standard viewport sizes (375px, 768px, 1280px, 1920px).
