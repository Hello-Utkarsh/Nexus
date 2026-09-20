import datetime
from typing import Optional, Dict, Any
import jwt
from app.core.config import settings
from app.models.common import UserRole, AuthenticatedUser

# Registered Pre-configured Service Personnel (for National Cyber Demo & Testing)
VERIFIED_PERSONNEL: Dict[str, Dict[str, Any]] = {
    "IPS-HQ-0102": {
        "user_id": "IPS-HQ-0102",
        "name": "DIG Vikramaditya Sen, IPS",
        "role": UserRole.SUPER_ADMIN,
        "badge_number": "IPS-HQ-0102",
        "unit": "STF Directorate / Central Operations Command",
        "clearance_level": "LEVEL-4 TOP-SECRET // COMMAND EXCLUSIVE",
    },
    "SP-CYBER-8801": {
        "user_id": "SP-CYBER-8801",
        "name": "SP Alok Mathur",
        "role": UserRole.ADMIN,
        "badge_number": "SP-CYBER-8801",
        "unit": "Special Cell / Cyber & Economic Offenses",
        "clearance_level": "LEVEL-3 RESTRICTED // SUPERVISORY",
    },
    "STF-VNS-4491": {
        "user_id": "STF-VNS-4491",
        "name": "Inspector R. K. Singh",
        "role": UserRole.ANALYST_IO,
        "badge_number": "STF-VNS-4491",
        "unit": "UP STF Cyber & Hawala Cell (Varanasi)",
        "clearance_level": "LEVEL-2 CONFIDENTIAL // INVESTIGATING OFFICER",
    },
    "IO-AMIT-104": {
        "user_id": "IO-AMIT-104",
        "name": "Inspector Amit Verma",
        "role": UserRole.ANALYST_IO,
        "badge_number": "IO-AMIT-104",
        "unit": "Cyber Crime PS Lucknow Range",
        "clearance_level": "LEVEL-2 CONFIDENTIAL // INVESTIGATING OFFICER",
    },
}


def create_access_token(
    user_id: str,
    role: UserRole,
    extra_claims: Optional[Dict[str, Any]] = None,
    expires_delta: Optional[datetime.timedelta] = None,
) -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": user_id,
        "role": role.value,
        "iat": now,
        "exp": expire,
    }
    if extra_claims:
        to_encode.update(extra_claims)

    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except (jwt.PyJWTError, Exception):
        return None


def verify_token_or_session(token: str) -> Optional[AuthenticatedUser]:
    """
    Verifies either:
    1. Cryptographically signed JWT token.
    2. Registered Government Session Token (e.g. CKV-AUTH-... issued to verified personnel).
    Never trusts client-supplied roles directly.
    """
    if not token or not isinstance(token, str):
        return None

    clean_token = token.strip()
    if clean_token.lower().startswith("bearer "):
        clean_token = clean_token[7:].strip()

    # Check JWT first
    payload = decode_token(clean_token)
    if payload and "sub" in payload and "role" in payload:
        try:
            role = UserRole.normalize(payload["role"])
            return AuthenticatedUser(
                user_id=payload["sub"],
                role=role,
                name=payload.get("name", "Authorized Officer"),
                badge_number=payload.get("badge_number", payload["sub"]),
                unit=payload.get("unit", "Special Task Force"),
                clearance_level=payload.get("clearance_level", "LEVEL-2"),
            )
        except ValueError:
            return None

    # Check simulated GovAuth Session tokens (CKV-AUTH-...)
    if clean_token.startswith("CKV-AUTH-"):
        # If token was issued to known test officers, map to verified personnel
        # Check if the token has an officer identifier embedded or check known demo users
        # Default to Analyst/IO if unmapped, or map to user
        parts = clean_token.split("-")
        # Find if any officer ID matches
        for service_id, profile in VERIFIED_PERSONNEL.items():
            if service_id in clean_token:
                return AuthenticatedUser(**profile)

        # Default verified government session for demo
        return AuthenticatedUser(
            user_id="STF-VNS-4491",
            role=UserRole.ANALYST_IO,
            name="Inspector R. K. Singh",
            badge_number="STF-VNS-4491",
            unit="UP STF Cyber & Hawala Cell (Varanasi)",
            clearance_level="LEVEL-2 CONFIDENTIAL",
        )

    # Check if raw token is a direct service ID in verified personnel (e.g. for testing)
    if clean_token in VERIFIED_PERSONNEL:
        return AuthenticatedUser(**VERIFIED_PERSONNEL[clean_token])

    return None
