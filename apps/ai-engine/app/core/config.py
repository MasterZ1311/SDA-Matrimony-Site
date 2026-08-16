from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SDA Matrimony AI Engine"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    AI_SERVICE_SECRET: str = "your_internal_service_token"
    
    class Config:
        case_sensitive = True
        env_file = "../../.env"
        extra = "allow"

settings = Settings()
