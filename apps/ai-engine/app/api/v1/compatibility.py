from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from ...services.scoring_engine import SDAMatchScoringEngine
from ...core.security import verify_api_key

router = APIRouter(
    prefix="/compatibility",
    tags=["Compatibility Matching"],
    dependencies=[Depends(verify_api_key)],
)

class ProfileDataPayload(BaseModel):
    profileA: Dict[str, Any]
    profileB: Dict[str, Any]

class IcebreakersPayload(BaseModel):
    targetProfile: Dict[str, Any]

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

@router.post("/icebreakers")
async def generate_icebreakers(payload: IcebreakersPayload):
    """
    Generates tailored, faith-centered Adventist icebreakers and conversation starters.
    """
    try:
        p = payload.targetProfile or {}
        name = p.get("firstName") or p.get("name") or "there"
        occ = ""
        inst = ""
        city = p.get("residenceCity") or p.get("location") or ""

        if isinstance(p.get("educationCareer"), dict):
            occ = p["educationCareer"].get("occupation") or ""
            inst = p["educationCareer"].get("institution") or ""
        else:
            occ = p.get("occupation") or ""
            inst = p.get("education") or p.get("institution") or ""

        starters = [
            f"Happy Sabbath {name}! What are your favorite Sabbath traditions and peaceful afternoon spots in nature?",
            f"Greetings {name}! I noticed your heart for church service. How did you feel guided into your ministry involvement?",
            f"Hello {name}! What is a favorite Bible promise or hymn that has been an anchor for your walk with Christ lately?",
        ]

        if occ:
            starters.append(f"Hi {name}, I saw you work in {occ}. How do you see your profession serving God's kingdom and community?")
        elif inst:
            starters.append(f"Hi {name}, I noticed you attended {inst}. What was your most cherished memory or spiritual milestone from your time there?")
        elif city:
            starters.append(f"Hi {name}! How is the Adventist church fellowship and outreach around {city}?")
        else:
            starters.append(f"Hello {name}! It's a true pleasure to connect with you. What does a Christ-centered family life look like in your vision?")

        return {
            "targetName": name,
            "icebreakers": starters
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate icebreakers: {str(e)}")

