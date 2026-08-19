from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "SDA Matrimony AI Engine"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    AI_SERVICE_SECRET: str = "your_internal_service_token"
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:4001",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    class Config:
        case_sensitive = True
        env_file = "../../.env"
        extra = "allow"

settings = Settings()
