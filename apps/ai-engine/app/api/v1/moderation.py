from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from ...services.vision_service import VisionModerationService
from ...services.nlp_service import NLPContentFilter

router = APIRouter(prefix="/moderation", tags=["Content Safety & Moderation"])

class TextScreenPayload(BaseModel):
    text: str
    isMutualMatch: bool = False

@router.post("/screen-text")
async def screen_text_content(payload: TextScreenPayload):
    """
    Screens text bios and chat messages for unauthorized contact leakage or toxicity.
    """
    result = NLPContentFilter.screen_text(payload.text, payload.isMutualMatch)
    return result

@router.post("/validate-image")
async def validate_profile_image(file: UploadFile = File(...)):
    """
    Validates uploaded profile photo for resolution, face presence, and quality.
    """
    contents = await file.read()
    result = VisionModerationService.validate_and_process_photo(contents)
    return result
