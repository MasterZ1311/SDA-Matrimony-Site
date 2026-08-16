# Platform Features and Functional Specifications

- **Architect & Author**: MasterZ1311
- **GitHub Profile**: [https://github.com/MasterZ1311](https://github.com/MasterZ1311)
- **Repository**: [https://github.com/MasterZ1311/SDA-Matrimony-Site](https://github.com/MasterZ1311/SDA-Matrimony-Site)

---

## 1. Introduction

As the sole designer and engineer of this platform, I developed the SDA Matrimony system to address the distinct cultural, doctrinal, and community requirements of the global Seventh-day Adventist (SDA) denomination. Traditional matrimonial platforms fail to capture the nuances of Adventist faith commitments, Sabbath keeping, church governance, dietary principles, and verified community trust.

This document details the functional specifications and domain modules implemented across the platform.

---

## 2. Faith and Spiritual Profile System

The core data model captures comprehensive faith markers to facilitate deep spiritual alignment between prospective partners.

### 2.1 Global Church Hierarchy Mapping
- Comprehensive structural categorization of church membership:
  - General Conference Divisions (e.g., Southern Asia Division, North American Division, Inter-European Division, etc.).
  - Unions, Local Conferences, and Missions.
  - Local Organized Churches and Companies.
- Verification of local church membership standing and years active.

### 2.2 Doctrinal and Lifestyle Metrics
- **Baptism Details**: Date of baptism by immersion in the SDA Church, officiating pastor details, and baptismal status confirmation.
- **Sabbath Observance**: Articulation of personal Sabbath observance from Friday sunset to Saturday sunset, including spiritual routines and family worship practices.
- **Church Department Engagement**: Tracking of active involvement in church ministries:
  - Pathfinders & Adventurers leadership.
  - Sabbath School teaching and coordination.
  - Adventist Youth Ministries (AYM).
  - Music ministry, choirs, and instrumental service.
  - Deaconry, Eldership, and Church Clerk responsibilities.
  - Adventist Medical Missionary and Community Services work.
- **Spirit of Prophecy & Theological Perspectives**: Candid personal answers to doctrinal and spiritual questions regarding fundamental Adventist beliefs, the Sanctuary message, and healthy Christian living.

---

## 3. Adventist Health and Lifestyle Standards

### 3.1 Dietary Principles
- Granular dietary preferences aligning with Adventist health principles:
  - Strict Vegan / Whole-Food Plant-Based.
  - Lacto-Ovo Vegetarian.
  - Pescatarian.
  - Non-Vegetarian (adhering strictly to Levitical clean meat guidelines).
- Commitment to complete abstinence from alcohol, tobacco, narcotics, and non-caffeinated/healthy living values.

### 3.2 Values, Modesty, and Recreation
- Personal viewpoints on Christian modesty in attire, personal adornment, and social conduct.
- Musical preferences (Sacred, Hymns, Classical, Contemporary Christian Music).
- Reading habits, outdoor activities, and mission outreach interests.

---

## 4. Verification and Trust Architecture

To prevent fraudulent profiles and protect user safety, I implemented a multi-tiered verification pipeline.

### 4.1 Pastoral Endorsement Workflow
- Users can submit the contact details and credentials of their local church pastor or head elder.
- Automated verification outreach allows pastoral leadership to vouch for church membership, standing, and character.
- Approved profiles receive a distinct "Pastoral Verified" badge on their profile cards and biodata sheets.

### 4.2 Government Identity and Face Verification
- Secure government-issued photo ID upload (passport, national identity card, or driver license).
- Computer vision automated face matching comparing the profile photo with the uploaded identity document.
- OCR scanning for birth date verification to confirm age authenticity.
- Review queue interface (`/admin/verifications`) for administrative oversight and compliance checks.

### 4.3 Granular Photo and Contact Privacy Controls
- **Photo Visibility Modes**:
  - *Public*: Visible to all registered users.
  - *Verified Only*: Visible exclusively to members who have completed pastoral or identity verification.
  - *On-Request*: Blurred photo placeholder with an explicit permission request workflow before unblurring.
- **Contact Information Shielding**: Email addresses, phone numbers, and social handles remain hidden and are never exposed publicly. Direct exchange of contact details requires explicit two-way authorization.
- **Anti-Scraping & Watermarking**: Automated dynamic watermarking on user photos with user ID and timestamp to deter unauthorized saving or distribution.

---

## 5. Matchmaking and Discovery Engine

### 5.1 AI and Constraint-Based Compatibility Engine
- **Theological Redline Filtering**: Mandatory validation on critical doctrinal checkpoints (e.g., matching on mutually acceptable baptism status, Sabbath alignment, and dietary practices).
- **Multi-Factor Scoring Matrix**:
  - Faith & Church Ministry Alignment (35% weight).
  - Lifestyle & Health Message Commitment (25% weight).
  - Educational Background & Profession (15% weight).
  - Geographic Proximity & Relocation Readiness (15% weight).
  - Personal Values & Interpersonal Preferences (10% weight).
- **Vector Embedding Search**: Deep semantic matching analyzing profile bio essays using Sentence Transformer embeddings stored in PostgreSQL via `pgvector`.

### 5.2 Discover and Search Interface
- Filter candidates by Division, Union, Conference, age bracket, height, education level, occupation, dietary habits, and verification status.
- Real-time search indexing with cached result sets in Redis for sub-millisecond query execution.

---

## 6. Interaction and Communication Workflows

### 6.1 Two-Way Express Interest Workflow
- Members express interest in candidate profiles by sending an Interest Request.
- The recipient can review the candidate's profile and choose to **Accept**, **Decline**, or **Keep on Hold**.
- Direct 1-on-1 private messaging is strictly locked until an interest request is accepted by both parties.

### 6.2 Real-Time Instant Messaging
- Low-latency WebSocket chat powered by Socket.io and Redis Pub/Sub cluster support.
- Real-time typing indicators, online presence tracking, and message read receipts.
- Built-in NLP safety filters inspecting message content in real time to prevent harassment or unsolicited link distribution.

### 6.3 Automated SDA Biodata Generator
- Generates standardized, beautifully formatted PDF biodata documents for printing or offline sharing with parents, guardians, and pastors.
- Includes candidate details, spiritual heritage, church affiliation, family background, educational credentials, and pastoral verification status.

---

## 7. Administrative and Moderation Governance

- **Admin Portal**: Comprehensive verification queue for identity documents and pastoral references.
- **Audit Logging**: Immutable event logging tracking every profile status change, verification review, and administrative action.
- **Content Moderation**: Automated vision moderation for profile images and NLP text screening for biographical essays.

---

*Authored by MasterZ1311 ([https://github.com/MasterZ1311](https://github.com/MasterZ1311)).*
