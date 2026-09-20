from typing import Optional, List, Callable
from fastapi import Request, HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.common import UserRole, AuthenticatedUser
from app.core.security import verify_token_or_session

security_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer),
) -> AuthenticatedUser:
    """
    Extracts Bearer token or session header from request and resolves authenticated user.
    Rejects unauthenticated requests with 401.
    Never trusts client-supplied roles from query/body.
    """
    token = None
    if credentials:
        token = credentials.credentials
    else:
        # Check custom session header if present
        token = request.headers.get("X-Session-Token") or request.headers.get(
            "Authorization"
        )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Bearer token or GovAuth session.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = verify_token_or_session(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Attach to request state for downstream handlers and audit logging
    request.state.user = user
    return user


async def get_optional_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer),
) -> Optional[AuthenticatedUser]:
    """Resolves authenticated user if provided, otherwise returns None without throwing 401."""
    token = None
    if credentials:
        token = credentials.credentials
    else:
        token = request.headers.get("X-Session-Token") or request.headers.get(
            "Authorization"
        )

    if not token:
        return None
    user = verify_token_or_session(token)
    if user:
        request.state.user = user
    return user


def require_role(required_role: UserRole) -> Callable:
    """
    RBAC dependency factory.
    Enforces role hierarchy:
    SUPER_ADMIN > ADMIN > ANALYST_IO
    Rejects unauthorized access with 403.
    """
    ROLE_HIERARCHY = {
        UserRole.SUPER_ADMIN: 3,
        UserRole.ADMIN: 2,
        UserRole.ANALYST_IO: 1,
    }

    async def role_checker(
        current_user: AuthenticatedUser = Depends(get_current_user),
    ) -> AuthenticatedUser:
        user_level = ROLE_HIERARCHY.get(current_user.role, 0)
        required_level = ROLE_HIERARCHY.get(required_role, 0)

        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Clearance role '{required_role.value}' required. Current role: '{current_user.role.value}'.",
            )
        return current_user

    return role_checker
