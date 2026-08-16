from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from ...services.scoring_engine import SDAMatchScoringEngine

router = APIRouter(prefix="/compatibility", tags=["Compatibility Matching"])

class ProfileDataPayload(BaseModel):
    profileA: Dict[str, Any]
    profileB: Dict[str, Any]

@router.post("/score")
async def calculate_compatibility(payload: ProfileDataPayload):
    """
    Calculates the 0-100% SDA Faith-Centric Compatibility Index between two member profiles.
    """
    try:
        result = SDAMatchScoringEngine.calculate_compatibility(
            payload.profileA,
            payload.profileB
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")
