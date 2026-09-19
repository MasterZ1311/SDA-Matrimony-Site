# SDA Matrimony Platform — API Specification

**Document Version:** 2.0.0  
**Target Environment:** Microservices Monorepo (`api-core`, `api-realtime`, `ai-engine`)  
**Security Standard:** OAuth2 / JWT (RS256/HS256) + Role-Based Access Control (RBAC)  
**Classification:** Internal Developer Documentation

---

## 1. Architecture Overview & Base URLs

The platform operates as a distributed system comprised of independent, high-performance microservices:

| Service | Port | Base URL | Protocol | Authentication |
| :--- | :--- | :--- | :--- | :--- |
| **API Core** | `4000` | `http://localhost:4000/api/v1` | HTTP / REST | Bearer JWT (Access Token) |
| **API Realtime** | `4001` | `ws://localhost:4001` | WebSocket (Socket.IO) | Handshake `auth.token` |
| **AI Intelligence Engine** | `8000` | `http://localhost:8000/api/v1` | HTTP / REST | Service API Key (`X-API-Key`) |
| **Frontend Web Client** | `3000` | `http://localhost:3000` | HTTP / HTML5 | Next.js Client App |

### Swagger / OpenAPI Documentation
Interactive Swagger documentation for `api-core` is accessible locally at:
```
http://localhost:4000/api/docs
```
FastAPI interactive docs for `ai-engine` are accessible at:
```
http://localhost:8000/docs
```

---

## 2. Global Security & Authentication Standards

### 2.1 Bearer Token Header
All protected REST endpoints in `api-core` require an HTTP `Authorization` header containing a valid JSON Web Token:
```http
Authorization: Bearer <jwt_access_token>
```

### 2.2 WebSocket Handshake Authentication
The `api-realtime` gateway validates connection requests during handshake initiation:
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4001', {
  auth: {
    token: accessToken,
  },
  transports: ['websocket'],
});
```

### 2.3 Service-to-Service Security
Inter-service calls to `ai-engine` must pass the shared secret key in the request header:
```http
X-API-Key: <AI_SERVICE_API_KEY>
```

### 2.4 Error Response Format
Standardized error envelopes are returned across all HTTP services:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2026-09-19T22:00:00.000Z",
  "path": "/api/v1/auth/login"
}
```

---

## 3. API Core Service Reference (`:4000`)

### 3.1 Authentication Module (`/auth`)

#### `POST /auth/register`
Creates a candidate member account and initializes their matrimonial profile shell.

- **Access:** Public
- **Request Body (`application/json`):**
```json
{
  "email": "david.miller@sda-matrimony.test",
  "password": "Password123!",
  "firstName": "David",
  "lastName": "Miller",
  "gender": "MALE",
  "dateOfBirth": "1996-04-15"
}
```
- **Response `201 Created`:**
```json
{
  "user": {
    "id": "c1f72b84-3c81-4fa3-9f12-9c17ab321001",
    "email": "david.miller@sda-matrimony.test",
    "role": "MEMBER",
    "isEmailVerified": false
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

#### `POST /auth/login`
Authenticates a registered member and issues JWT token credentials.

- **Access:** Public
- **Request Body (`application/json`):**
```json
{
  "email": "david.miller@sda-matrimony.test",
  "password": "Password123!"
}
```
- **Response `200 OK`:**
```json
{
  "user": {
    "id": "c1f72b84-3c81-4fa3-9f12-9c17ab321001",
    "email": "david.miller@sda-matrimony.test",
    "role": "MEMBER"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

#### `POST /auth/refresh-token`
Rotates an expired access token using a valid refresh token.

- **Access:** Public
- **Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
}
```
- **Response `200 OK`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

#### `GET /auth/me`
Retrieves authenticated candidate identity, verified status, and profile payload.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:**
```json
{
  "id": "c1f72b84-3c81-4fa3-9f12-9c17ab321001",
  "email": "david.miller@sda-matrimony.test",
  "role": "MEMBER",
  "isEmailVerified": true,
  "profile": {
    "id": "p90a1b2c-...",
    "firstName": "David",
    "lastName": "Miller",
    "gender": "MALE",
    "baptismStatus": "BAPTIZED_MEMBER",
    "dietaryHabit": "VEGAN"
  }
}
```

---

### 3.2 Member Profiles & Discovery (`/profiles`)

#### `GET /profiles/me`
Fetches the full matrimonial profile of the requesting authenticated member.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** Returns complete Profile object including church, career, lifestyle, and verification records.

#### `PUT /profiles/me`
Updates spiritual, career, dietary, and personal attributes.

- **Access:** Protected (`Bearer JWT`)
- **Request Body (`application/json`):**
```json
{
  "bio": "Passionate healthcare professional and Sabbath School superintendent.",
  "baptismStatus": "BAPTIZED_MEMBER",
  "baptismDate": "2012-08-18",
  "dietaryHabit": "VEGETARIAN",
  "education": "Master of Science in Nursing",
  "occupation": "Nurse Practitioner",
  "conferenceId": "conf-uuid",
  "localChurchName": "Loma Linda University Church",
  "familyValues": "Traditional Adventist home, active community outreach",
  "partnerPreferences": {
    "ageMin": 24,
    "ageMax": 32,
    "dietaryPreference": ["VEGETARIAN", "VEGAN"]
  }
}
```

#### `GET /profiles/search`
Filters candidate profiles based on Adventist faith criteria, demographics, and location.

- **Access:** Protected (`Bearer JWT`)
- **Query Parameters:**
  - `gender` (`MALE` | `FEMALE`)
  - `baptismStatus` (`BAPTIZED_MEMBER`, `SEEKER`, etc.)
  - `dietaryHabit` (`VEGAN`, `VEGETARIAN`, `PESCATARIAN`, `NON_VEGETARIAN`)
  - `ageMin` (number)
  - `ageMax` (number)
  - `divisionId` (string)
  - `conferenceId` (string)
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
- **Response `200 OK`:**
```json
{
  "total": 48,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": "prof-uuid-1",
      "firstName": "Sarah",
      "lastName": "Jenkins",
      "age": 27,
      "occupation": "Teacher",
      "dietaryHabit": "VEGETARIAN",
      "localChurchName": "Silver Spring SDA Church",
      "isVerified": true,
      "avatarUrl": "https://..."
    }
  ]
}
```

#### `GET /profiles/:id`
Retrieves a specific candidate's public profile summary.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** Sanitized profile object (contact information is withheld prior to mutual interest approval).

#### `POST /profiles/:id/report`
Confidential pastoral conduct report against a profile.

- **Access:** Protected (`Bearer JWT`)
- **Request Body:**
```json
{
  "reason": "FALSE_INFORMATION",
  "details": "Inaccurate church membership claims."
}
```
- **Response `201 Created`:** Confirmed submission to pastoral moderation queue.

#### `POST /profiles/:id/block`
Mutually blocks a member, removing them from candidate search, discovery, and direct communications.

- **Access:** Protected (`Bearer JWT`)
- **Response `201 Created`:** `{ "blocked": true, "blockedUserId": "<id>" }`

#### `DELETE /profiles/:id/block`
Unblocks a previously blocked user.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** `{ "unblocked": true }`

#### `GET /profiles/blocked`
Lists all candidate IDs blocked by the authenticated user.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** Array of blocked member IDs.

#### `GET /profiles/admin/reports`
Pastoral Oversight Board report queue for church moderators.

- **Access:** Protected (`Bearer JWT`, Role: `ADMIN` | `PASTOR`)
- **Response `200 OK`:** Array of pending conduct reports with reporter and candidate details.

---

### 3.3 Expressions of Interest (`/interests`)

Follows the Adventist courtship workflow: Members express interest with a respectful introductory greeting; direct messaging unlocks only upon mutual acceptance.

#### `POST /interests/express`
Sends an expression of interest to a candidate.

- **Access:** Protected (`Bearer JWT`)
- **Request Body:**
```json
{
  "receiverId": "usr-cand-uuid-4491",
  "introMessage": "Christian greetings! I noticed your commitment to church ministry and would welcome the opportunity to connect."
}
```
- **Response `201 Created`:** Interest record with status `PENDING`.

#### `GET /interests/received`
Lists all inbound expressions of interest received by the user.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** Array of interest proposals with sender profile previews.

#### `GET /interests/sent`
Lists all outbound expressions of interest initiated by the user.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** Array of sent proposals and current status (`PENDING`, `ACCEPTED`, `DECLINED`).

#### `PUT /interests/:id/respond`
Accepts or declines a received interest request.

- **Access:** Protected (`Bearer JWT`)
- **Request Body:**
```json
{
  "status": "ACCEPTED"
}
```
- **Side Effect:** If `ACCEPTED`, a mutual `Conversation` room is automatically initialized in the database and an event is broadcast via WebSockets.

#### `DELETE /interests/:id/withdraw`
Withdraws a previously submitted expression of interest.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** Status confirmation.

#### `POST /interests/shortlist`
Toggles saving a candidate to the user's prayerful consideration shortlist.

- **Access:** Protected (`Bearer JWT`)
- **Request Body:**
```json
{
  "targetUserId": "usr-cand-uuid-4491"
}
```
- **Response `201 Created`:** `{ "favorited": true, "targetUserId": "..." }`

#### `GET /interests/shortlist`
Lists all candidate profiles currently favorited/shortlisted by the user.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** Array of shortlisted profile objects.

#### `GET /interests/notifications`
Aggregates unread matrimonial proposals, accepted connections, and pending alerts.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:**
```json
{
  "totalUnread": 3,
  "pendingCount": 2,
  "matchCount": 1,
  "notifications": [
    {
      "id": "notif-1",
      "type": "proposal",
      "title": "New Expression of Interest",
      "message": "Sarah expressed matrimonial interest in your profile.",
      "link": "/interests",
      "date": "2026-09-19T20:00:00.000Z"
    }
  ]
}
```

---

### 3.4 Conversations & Messaging (`/messages`)

#### `GET /messages/conversations`
Lists all authorized chat conversations where mutual interest was accepted.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** List of conversation threads, latest message snippet, unread counts, and participant metadata.

#### `GET /messages/conversations/:id`
Fetches historical messages for an authorized conversation thread.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:** Array of message records sorted chronologically.

#### `POST /messages/conversations/:id/messages`
Sends a message via REST fallback (Socket.IO is the preferred primary delivery method).

- **Access:** Protected (`Bearer JWT`)
- **Request Body:**
```json
{
  "content": "Happy Sabbath! Wishing you a blessed week ahead."
}
```

#### `GET /messages/icebreakers/:targetUserId`
Generates personalized, Christ-centered icebreaker questions based on mutual Adventist traits, campus heritage, and ministry activities.

- **Access:** Protected (`Bearer JWT`)
- **Response `200 OK`:**
```json
{
  "icebreakers": [
    "Happy Sabbath preparation! What are your favorite Sabbath traditions?",
    "I noticed you attended Spicer Adventist University! What was your favorite campus memory?",
    "What scripture has most deeply guided your walk with Christ recently?"
  ]
}
```

---

### 3.5 Pastoral & Identity Verification (`/verification`)

#### `POST /verification/pastoral/submit`
Candidate submits pastoral contact details for endorsement.

- **Access:** Protected (`Bearer JWT`)
- **Request Body:**
```json
{
  "pastorName": "Pastor Randy Roberts",
  "pastorEmail": "pastor.randy@lluc.org",
  "pastorPhone": "+1 (909) 558-4570",
  "churchName": "Loma Linda University Church",
  "conferenceName": "Southeastern California Conference",
  "referenceNotes": "Active deacon and Sabbath school teacher."
}
```
- **Response `201 Created`:** Generates secure token and dispatches automated verification email to pastor.

#### `POST /verification/pastoral/endorse/:token`
Public pastoral endorsement portal endpoint invoked via unique cryptographic link.

- **Access:** Public (Secured by token)
- **Request Body:**
```json
{
  "isEndorsed": true,
  "pastorComments": "I confirm candidate is a baptized member in regular standing."
}
```

#### `GET /verification/admin/pending`
Admin queue: Returns pending pastoral references and verification documents.

- **Access:** Protected (`ADMIN` Role required)
- **Response `200 OK`:** List of pending verifications awaiting review.

#### `POST /verification/admin/review/:id`
Admin decision: Approves or rejects a candidate verification request.

- **Access:** Protected (`ADMIN` Role required)
- **Request Body:**
```json
{
  "isApproved": true
}
```

---

### 3.6 Church Hierarchy Directory (`/church`)

Reference data reflecting Seventh-day Adventist world church administration.

#### `GET /church/divisions`
Returns all 13 General Conference World Divisions (e.g., NAD, ECD, SUD, SID).

#### `GET /church/unions?divisionId=:divisionId`
Returns Unions affiliated with a specific Division.

#### `GET /church/conferences?unionId=:unionId`
Returns Conferences or Mission fields under a Union.

#### `GET /church/local-churches?conferenceId=:conferenceId`
Returns registered congregations in a Conference.

---

### 3.7 Biodata PDF Generation (`/biodata`)

#### `GET /biodata/:profileId/download`
Renders a formal Seventh-day Adventist matrimonial Biodata in PDF format for print/offline family review.

- **Access:** Protected (`Bearer JWT`)
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="SDA_Biodata_<id>.pdf"`

---

## 4. API Realtime Service Reference (`:4001`)

### 4.1 Connection & Handshake
- **URL:** `ws://localhost:4001`
- **Transport:** WebSocket
- **Auth Handshake:**
```javascript
const socket = io('http://localhost:4001', {
  auth: { token: 'JWT_ACCESS_TOKEN' }
});
```

### 4.2 Client to Server Events

| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `join_conversation` | `{ conversationId: string }` | Joins a mutual conversation room (`conv_<id>`). |
| `send_message` | `{ conversationId: string, content: string }` | Dispatches a message to room participants. |
| `typing` | `{ conversationId: string, isTyping: boolean }` | Emits typing state to recipient. |

### 4.3 Server to Client Events

| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `user_status` | `{ userId: string, status: "ONLINE" \| "OFFLINE" }` | Emitted globally on connect/disconnect. |
| `new_message` | `ChatMessage` entity | Broadcast to conversation room on new message. |
| `message_notification` | `{ senderName, content, conversationId }` | Direct alert sent to recipient socket. |
| `user_typing` | `{ userId: string, isTyping: boolean }` | Typing activity notification. |

---

## 5. AI Engine Service Reference (`:8000`)

### 5.1 Compatibility Scoring (`/api/v1/compatibility`)

#### `POST /api/v1/compatibility/score`
Computes the multi-dimensional SDA Faith-Centric Compatibility Index between two candidate profiles.

- **Headers:** `X-API-Key: <AI_SERVICE_API_KEY>`
- **Request Body:**
```json
{
  "profileA": {
    "baptismStatus": "BAPTIZED_MEMBER",
    "dietaryHabit": "VEGAN",
    "sabbathObservance": "STRICT",
    "spiritOfProphecy": "AFFIRMED",
    "familyPlans": "WANTS_CHILDREN",
    "interests": ["CHOIR", "PATHFINDERS"]
  },
  "profileB": {
    "baptismStatus": "BAPTIZED_MEMBER",
    "dietaryHabit": "VEGETARIAN",
    "sabbathObservance": "STRICT",
    "spiritOfProphecy": "AFFIRMED",
    "familyPlans": "WANTS_CHILDREN",
    "interests": ["PATHFINDERS", "CAMPING"]
  }
}
```
- **Response `200 OK`:**
```json
{
  "overallScore": 92.5,
  "breakdown": {
    "faithAndDoctrinal": 96.0,
    "dietaryAndLifestyle": 88.0,
    "sabbathAndWorship": 95.0,
    "familyAndGoals": 90.0
  },
  "synergies": [
    "Both actively involved in Adventist youth ministry",
    "Aligned dietary principles and Sabbath values"
  ],
  "recommendation": "HIGHLY_RECOMMENDED"
}
```

#### `POST /api/v1/compatibility/icebreakers`
Generates personalized, Christ-centered icebreakers and conversation starters leveraging profile synergy, shared campus backgrounds, and lifestyle alignment.

- **Headers:** `X-API-Key: <AI_SERVICE_API_KEY>`
- **Request Body:**
```json
{
  "profileA": {
    "name": "David",
    "institution": "Spicer Adventist University",
    "church": "Central SDA Church",
    "favoriteScripture": "Jeremiah 29:11"
  },
  "profileB": {
    "name": "Sarah",
    "institution": "Andrews University",
    "church": "Pioneer Memorial Church",
    "favoriteScripture": "Romans 8:28"
  }
}
```
- **Response `200 OK`:**
```json
{
  "icebreakers": [
    "Happy Sabbath preparation! What are your favorite Sabbath traditions?",
    "I noticed you attended Spicer Adventist University! What was your favorite campus memory?",
    "What scripture has most deeply guided your walk with Christ recently?"
  ]
}
```

---

### 5.2 Content Safety & Moderation (`/api/v1/moderation`)

#### `POST /api/v1/moderation/screen-text`
Evaluates member-written content (bios, intros, chat) for contact leakage (phone numbers, emails, handles) and safety.

- **Headers:** `X-API-Key: <AI_SERVICE_API_KEY>`
- **Request Body:**
```json
{
  "text": "Hello! Reach me directly at 555-123-4567 or on telegram.",
  "isMutualMatch": false
}
```
- **Response `200 OK`:**
```json
{
  "isApproved": false,
  "flags": ["CONTACT_LEAKAGE_DETECTED"],
  "cleanText": "Hello! Reach me directly at [HIDDEN] or on [HIDDEN].",
  "riskLevel": "MEDIUM"
}
```

#### `POST /api/v1/moderation/validate-image`
Multi-point automated inspection of candidate profile photos (face detection, resolution, modesty, inappropriate content screening).

- **Headers:** `X-API-Key: <AI_SERVICE_API_KEY>`
- **Request Body:** `multipart/form-data` with `file: <binary_image>`
- **Response `200 OK`:**
```json
{
  "isValid": true,
  "faceDetected": true,
  "faceCount": 1,
  "isModest": true,
  "qualityScore": 0.89,
  "rejectionReason": null
}
```
