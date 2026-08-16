# System Architecture and Engineering Design

- **Architect & Author**: MasterZ1311
- **GitHub Profile**: [https://github.com/MasterZ1311](https://github.com/MasterZ1311)
- **Repository**: [https://github.com/MasterZ1311/SDA-Matrimony-Site](https://github.com/MasterZ1311/SDA-Matrimony-Site)

---

## 1. System Architecture Overview

As the sole architect and creator of this platform, I designed the SDA Matrimony system around a decoupled, domain-driven microservices architecture. The platform orchestrates high-throughput relational transactions, low-latency WebSocket communication, and asynchronous machine learning workloads within a unified monorepo.

---

## 2. Microservice Boundaries and Responsibilities

```
                                  +-----------------------------+
                                  |         Web Client          |
                                  |     (Next.js 14 Web App)    |
                                  +--------------+--------------+
                                                 |
                         +-----------------------+-----------------------+
                         |                                               |
                    HTTPS REST                                      WebSockets
                         |                                               |
                         v                                               v
          +------------------------------+                +------------------------------+
          |         Core REST API        |                |       Realtime Gateway       |
          |       (NestJS + Fastify)     |                |      (NestJS + Socket.io)    |
          +--------------+---------------+                +--------------+---------------+
                         |                                               |
           +-------------+-------------+                                 |
           |             |             |                                 |
           v             v             v                                 v
     +-----------+ +-----------+ +-----------+                     +-----------+
     |PostgreSQL | |   Redis   | |   MinIO   | <------------------ |   Redis   |
     | (Prisma / | |  (Cache & | |  (Object  |      Pub/Sub        | (Adapter  |
     | pgvector) | |  Sessions)| |  Storage) |                     |  Cluster) |
     +-----------+ +-----------+ +-----------+                     +-----------+
           ^                           ^
           |                           |
           +-------------+-------------+
                         |
                    Internal REST
                         |
          +--------------+---------------+
          |       AI Engine Microservice  |
          |       (Python FastAPI)       |
          +------------------------------+
```

### 2.1 Web Client (`apps/web`)
- Serves the responsive end-user interface and administrative dashboard.
- Uses Next.js App Router for server-rendered HTML shells and hydration.
- Manages client-side interaction state with Zustand and network caching with TanStack Query.
- Connects directly to `api-core` for RESTful operations and `api-realtime` for persistent WebSocket streams.

### 2.2 Core REST API (`apps/api-core`)
- Acts as the primary backend gateway for business logic, identity management, and relational database persistence.
- Implements strict Role-Based Access Control (`Member`, `VerifiedMember`, `PastorVerifier`, `Admin`).
- Manages user profiles, church organizational hierarchies, interest request state transitions, and pastoral verification records.

### 2.3 Realtime Gateway (`apps/api-realtime`)
- Handles duplex communication for private messaging, typing status, presence tracking, and instantaneous push notifications.
- Integrated with Redis Pub/Sub through `@socket.io/redis-adapter` to allow seamless horizontal pod scaling across distributed nodes.

### 2.4 AI and Machine Learning Microservice (`apps/ai-engine`)
- Python-based asynchronous service executing mathematical compatibility algorithms, face detection/validation, image moderation, and bio text safety inspections.
- Generates vector embeddings for user profile narratives and compares them against candidates using cosine similarity calculations.

---

## 3. Data Flow and Lifecycle Workflows

### 3.1 Authentication and Onboarding Flow
1. **Registration**: The user registers via `POST /api/auth/register`. A new `User` record is created in PostgreSQL with a hashed password (bcrypt).
2. **Token Issuance**: The API returns an ephemeral JWT Access Token (15-minute validity) and sets a secure, HTTP-only Refresh Token.
3. **Profile Creation**: The user completes a multi-step onboarding wizard providing church hierarchy information, baptism status, lifestyle attributes, and photos.
4. **AI Pre-moderation**: Uploaded photos and textual descriptions are submitted asynchronously to `apps/ai-engine` for automated moderation screening before public indexing.

### 3.2 Interest and Private Messaging Lifecycle
```
[User A] -> Send Express Interest -> [api-core: Interest State = PENDING]
                                                  |
                                                  v
                                     [Realtime Gateway Notification]
                                                  |
                                                  v
                                              [User B]
                                                  |
                 +--------------------------------+--------------------------------+
                 |                                                                 |
           Accept Interest                                                   Decline Interest
                 |                                                                 |
                 v                                                                 v
[api-core: Interest State = ACCEPTED]                            [api-core: Interest State = REJECTED]
                 |                                                                 |
                 v                                                                 v
   [Chat Channel Unlocked]                                              [Channel Remains Locked]
                 |
                 v
[WebSocket 1-on-1 Realtime Messaging]
```

---

## 4. Database Entity Relationships and Schemas

The relational model is maintained in PostgreSQL and managed through Prisma ORM (`packages/database/prisma/schema.prisma`).

### 4.1 Primary Entities
- **User**: Core authentication identity, role, email, password hash, and active status.
- **Profile**: 1-to-1 relationship with User containing gender, birth date, height, marital status, education, occupation, and biography.
- **SdaFaithProfile**: Adventist-specific faith metrics including Division, Union, Conference, Local Church, baptism date, Sabbath observance details, and ministry engagements.
- **LifestyleProfile**: Adventist dietary standards (Vegan, Vegetarian, etc.), health commitments, recreation, and musical preferences.
- **VerificationRecord**: Status tracking for pastoral endorsements, government ID documents, review notes, and verifier identity.
- **Interest**: Expressed interest state machine (`PENDING`, `ACCEPTED`, `DECLINED`, `BLOCKED`) linking sender and recipient profiles.
- **ChatMessage**: Encrypted private messages exchanged between matched profiles with timestamps and read states.

---

## 5. End-to-End Type Safety Strategy

To eliminate schema drift across the entire monorepo:
1. Database entities are declared in `packages/database/prisma/schema.prisma`.
2. Shared DTOs, request/response models, and domain enums are centralized in `packages/common-types`.
3. Frontend forms in `apps/web` validate user inputs against Zod schemas mapped to the shared DTOs.
4. Backend controllers in `apps/api-core` validate incoming payloads using NestJS Validation Pipes against the same shared models.

---

*Authored by MasterZ1311 ([https://github.com/MasterZ1311](https://github.com/MasterZ1311)).*
