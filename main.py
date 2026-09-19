from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import RedirectResponse
from .services.digilocker import DigiLockerService

app = FastAPI(
    title="SDA Matrimony - DigiLocker Document Verification",
    version="1.0.0",
)

digilocker = DigiLockerService()


@app.get("/health")
def health():
    return {"status": "ok", "service": "digilocker-document-verification"}


@app.get("/auth/digilocker/start")
def digilocker_start():
    """
    Starts DigiLocker authorization.
    In demo mode, returns a demo response instead of redirecting.
    """
    if digilocker.demo_mode:
        return {
            "demo_mode": True,
            "message": "DigiLocker demo mode is enabled. Add approved Requester credentials and set DIGILOCKER_DEMO_MODE=false for live OAuth."
        }

    authorization_url, state = digilocker.build_authorization_url()
    # In production, persist/validate state server-side before redirecting.
    return RedirectResponse(url=authorization_url)


@app.get("/auth/digilocker/callback")
def digilocker_callback(
    code: str = Query(...),
    state: str | None = Query(default=None),
):
    """
    Receives the OAuth authorization code and exchanges it for tokens.
    Token storage should be implemented securely for a production deployment.
    """
    if digilocker.demo_mode:
        return {
            "demo_mode": True,
            "message": "Demo callback received.",
            "code_received": bool(code),
        }

    try:
        token_data = digilocker.exchange_code_for_token(code=code)
        return {
            "success": True,
            "message": "DigiLocker authorization completed.",
            "token_response": token_data,
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/documents")
def get_documents():
    """
    Document retrieval intentionally remains a placeholder.

    The exact DigiLocker document/resource API and scopes depend on the
    organization's approved Requester/EntityLocker integration. Do not
    invent an endpoint or scope. Implement this method after onboarding
    provides the approved production API details.
    """
    try:
        return digilocker.get_authorized_documents()
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail=str(exc))
