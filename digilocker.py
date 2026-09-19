import base64
import hashlib
import os
import secrets
from urllib.parse import urlencode

import httpx


class DigiLockerService:
    """
    DigiLocker OAuth/Requester integration helper.

    This module handles authorization URL construction and authorization-code
    token exchange. Document retrieval is intentionally left as an integration
    placeholder because the approved document/resource endpoint and scopes
    depend on the organization's DigiLocker Requester/EntityLocker onboarding.
    """

    def __init__(self):
        self.client_id = os.getenv("DIGILOCKER_CLIENT_ID", "")
        self.client_secret = os.getenv("DIGILOCKER_CLIENT_SECRET", "")
        self.redirect_uri = os.getenv(
            "DIGILOCKER_REDIRECT_URI",
            "http://localhost:8000/auth/digilocker/callback",
        )
        self.auth_url = os.getenv(
            "DIGILOCKER_AUTH_URL",
            "https://entity.digilocker.gov.in/public/oauth2/1/authorize",
        )
        self.token_url = os.getenv(
            "DIGILOCKER_TOKEN_URL",
            "https://entity.digilocker.gov.in/public/oauth2/1/token",
        )
        self.demo_mode = os.getenv("DIGILOCKER_DEMO_MODE", "true").lower() == "true"

    @staticmethod
    def create_pkce_pair():
        code_verifier = secrets.token_urlsafe(64)
        digest = hashlib.sha256(code_verifier.encode("ascii")).digest()
        code_challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")
        return code_verifier, code_challenge

    def build_authorization_url(self):
        if not self.client_id:
            raise ValueError("DIGILOCKER_CLIENT_ID is not configured.")

        code_verifier, code_challenge = self.create_pkce_pair()

        # Production note:
        # Store code_verifier and state in a secure server-side session/cache
        # associated with the current user before redirecting.
        state = secrets.token_urlsafe(32)

        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "state": state,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
        }

        # For a production app, persist code_verifier with the user's session.
        # This demo does not persist it automatically.
        return f"{self.auth_url}?{urlencode(params)}", state

    def exchange_code_for_token(self, code: str, code_verifier: str | None = None):
        if not self.client_id or not self.client_secret:
            raise ValueError(
                "DIGILOCKER_CLIENT_ID and DIGILOCKER_CLIENT_SECRET are required."
            )

        data = {
            "code": code,
            "grant_type": "authorization_code",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
        }

        if code_verifier:
            data["code_verifier"] = code_verifier

        with httpx.Client(timeout=30.0) as client:
            response = client.post(self.token_url, data=data)
            response.raise_for_status()
            return response.json()

    def get_authorized_documents(self):
        raise NotImplementedError(
            "Implement document retrieval only after DigiLocker provides "
            "your approved Requester API endpoint, resource/document scope, "
            "and response format."
        )
