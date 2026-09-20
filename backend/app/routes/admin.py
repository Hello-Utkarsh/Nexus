from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import Optional, Dict, Any
from app.models.common import UserRole, AuthenticatedUser
from app.middleware.auth import require_role, get_current_user
from app.services.audit_service import AuditService

router = APIRouter(tags=["Admin & Telemetry"])


@router.get("/api/admin/audit-logs")
async def get_admin_audit_logs(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(25, ge=1, le=100, description="Items per page"),
    severity: Optional[str] = Query(
        None, description="Filter by severity (INFO, SENSITIVE, CRITICAL)"
    ),
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    current_user: AuthenticatedUser = Depends(require_role(UserRole.SUPER_ADMIN)),
):
    """
    Paginated telemetry & audit logs for SUPER_ADMIN only.
    Protected strictly with role verification.
    """
    result = await AuditService.get_logs(
        page=page, limit=limit, severity=severity, user_id=user_id
    )
    return {"data": result["data"], "pagination": result["pagination"]}


# Also support /api/v1/audit for frontend AuditDock failover contract
@router.get("/api/v1/audit")
async def get_v1_audit_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    severity: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
):
    result = await AuditService.get_logs(
        page=page, limit=limit, severity=severity, user_id=user_id
    )
    return {"logs": result["logs"], "totalQueries": result["totalQueries"]}
