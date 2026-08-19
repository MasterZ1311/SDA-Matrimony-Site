import secrets
from typing import Optional
from fastapi import Header, HTTPException, status
from .config import settings

async def verify_api_key(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    authorization: Optional[str] = Header(None, alias="Authorization"),
) -> str:
    """
    Dependency to verify incoming requests to internal AI services.
    Accepts API key via 'X-API-Key' header or 'Authorization: Bearer <key>'.
    """
    token = None
    if x_api_key:
        token = x_api_key.strip()
    elif authorization:
        parts = authorization.strip().split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
        elif len(parts) == 1:
            token = parts[0]

    if not token or not settings.AI_SERVICE_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Missing API key",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not secrets.compare_digest(token, settings.AI_SERVICE_SECRET):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid API key",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token
