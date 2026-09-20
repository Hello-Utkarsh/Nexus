import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "CHAKRAVYUH 2.0 Intelligence Platform"

    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"

    # MongoDB Config
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "chakravyuh_db")

    # JWT & Auth
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET", "chakravyuh-national-cyber-security-secret-key-2026"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

    # Demo flag
    DEMO_MODE: bool = True


settings = Settings()
