from fastapi import APIRouter, HTTPException, Depends, status, Body
from pydantic import BaseModel
from typing import Optional
from app.models.common import UserRole, AuthenticatedUser, TokenResponse
from app.core.security import create_access_token, VERIFIED_PERSONNEL
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    service_id: str
    passkey: Optional[str] = None
    role: Optional[str] = None  # Optional requested role for demo setup


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    """
    Demo/Government Authentication Endpoint.
    Authenticates registered officers or issues demo JWTs.
    """
    service_id = payload.service_id.strip()

    # Check registered personnel
    profile = VERIFIED_PERSONNEL.get(service_id)
    if profile:
        role = profile["role"]
        user = AuthenticatedUser(**profile)
    else:
        # If unknown service id, default to Analyst/IO unless specified
        role = UserRole.ANALYST_IO
        if payload.role:
            try:
                role = UserRole.normalize(payload.role)
            except ValueError:
                role = UserRole.ANALYST_IO
        user = AuthenticatedUser(
            user_id=service_id,
            role=role,
            name=f"Officer {service_id}",
            badge_number=service_id,
            unit="UP STF Special Unit",
            clearance_level="LEVEL-2",
        )

    token = create_access_token(
        user_id=user.user_id,
        role=user.role,
        extra_claims={
            "name": user.name,
            "badge_number": user.badge_number,
            "unit": user.unit,
            "clearance_level": user.clearance_level,
        },
    )

    return TokenResponse(
        access_token=token, token_type="Bearer", user=user, expires_in=60 * 24 * 60
    )


@router.get("/me", response_model=AuthenticatedUser)
def get_current_user_profile(user: AuthenticatedUser = Depends(get_current_user)):
    """Returns currently authenticated user profile verified from Bearer token."""
    return user
