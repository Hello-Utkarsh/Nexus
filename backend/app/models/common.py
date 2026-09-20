from enum import Enum
from typing import Optional, Any, List, Generic, TypeVar
from pydantic import BaseModel, Field
import datetime


class UserRole(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    ANALYST_IO = "ANALYST_IO"

    @classmethod
    def normalize(cls, role_str: str) -> "UserRole":
        clean = role_str.strip().upper().replace(" ", "_").replace("/", "_")
        if clean in ("SUPER_ADMIN", "SUPERADMIN"):
            return cls.SUPER_ADMIN
        if clean in ("ADMIN", "COMMANDER"):
            return cls.ADMIN
        if clean in ("ANALYST_IO", "ANALYST", "IO", "INVESTIGATING_OFFICER"):
            return cls.ANALYST_IO
        raise ValueError(f"Unknown role: {role_str}")


class AuthenticatedUser(BaseModel):
    user_id: str
    role: UserRole
    name: str = "Officer"
    badge_number: Optional[str] = None
    unit: Optional[str] = None
    clearance_level: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: AuthenticatedUser
    expires_in: int


class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    limit: int = Field(25, ge=1, le=100, description="Items per page")


class PaginatedResponse(BaseModel):
    data: List[Any]
    pagination: dict


class APIErrorResponse(BaseModel):
    detail: str
    status_code: int
    timestamp: str = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
