from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.models.common import AuthenticatedUser
from app.middleware.auth import get_current_user
from app.services.case_service import CaseService

router = APIRouter(prefix="/api/investigations", tags=["Investigations"])


@router.get("/my-cases")
async def get_my_cases(
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Returns cases assigned to the authenticated user.
    Server-enforced: Never accepts arbitrary user_id from query/body.
    SUPER_ADMIN / ADMIN: Access all cases.
    ANALYST / IO: Restricted to assigned cases.
    """
    cases = await CaseService.get_cases_for_user(current_user)
    return {
        "user_id": current_user.user_id,
        "role": current_user.role.value,
        "total": len(cases),
        "cases": cases,
    }
