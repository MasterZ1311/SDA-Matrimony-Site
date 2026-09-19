# SDA Matrimony - DigiLocker Document Verification

This folder contains the DigiLocker document-verification module for the
SDA-MATRIMONY project.

## Purpose

The module is **document-only**.

It does NOT contain:

- face recognition
- face verification
- selfie matching
- biometric processing
- OpenCV
- image recognition

The intended flow is:

```text
SDA Matrimony
      |
      v
Verify with DigiLocker
      |
      v
DigiLocker authorization / user consent
      |
      v
Requester API token exchange
      |
      v
Authorized document/resource retrieval
      |
      v
Document verification result
```

## Folder structure

```text
digilocker-verification/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── services/
│   │       ├── __init__.py
│   │       └── digilocker.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   └── index.html
└── README.md
```

## Run locally

### 1. Open the backend folder

```bash
cd digilocker-verification/backend
```

### 2. Create a virtual environment

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create environment file

Copy:

```text
.env.example
```

to:

```text
.env
```

Keep the real DigiLocker credentials only in `.env`.

### 5. Start the API

```bash
uvicorn app.main:app --reload
```

API:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

### 6. Open the frontend

Open:

```text
frontend/index.html
```

in a browser.

## Demo mode

The default configuration has:

```text
DIGILOCKER_DEMO_MODE=true
```

This lets the frontend/backend structure be tested without real DigiLocker
credentials.

## Live DigiLocker integration

Live integration requires the organization to complete the appropriate
DigiLocker Requester/EntityLocker onboarding and receive approved credentials,
scopes, redirect URI configuration, and document/resource API details.

This project intentionally does **not** invent a document endpoint. The
`get_authorized_documents()` method should be completed only using the API
details provided for the approved integration.

## Security

Never commit:

```text
.env
DIGILOCKER_CLIENT_SECRET
access tokens
refresh tokens
personal identity documents
```

The repository should contain `.env.example` only.

## Project scope

This module is intended to be integrated into the larger SDA Matrimony
application. It focuses only on DigiLocker document verification and does not
replace the main authentication, profile, matchmaking, or frontend systems.
