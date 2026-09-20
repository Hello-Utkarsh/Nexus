from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from app.services.intelligence_service import IntelligenceService

router = APIRouter(tags=["Intelligence"])


@router.get("/api/intelligence")
async def get_intelligence(
    case_id: Optional[str] = Query(None, description="Filter by case ID"),
    source_type: Optional[str] = Query(
        None, description="Filter by source type (FIR, CDR, STR, SOCMINT)"
    ),
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
):
    """
    Returns intelligence stream, alerts, FIR/CDR feeds, and parsed logs.
    """
    return await IntelligenceService.get_intelligence_stream(
        case_id=case_id, source_type=source_type, page=page, limit=limit
    )


@router.get("/api/v1/logs")
async def get_v1_logs(
    case_id: Optional[str] = Query(None),
    source_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
):
    """Direct alias for frontend SocmintView BACKEND_CONTRACT compatibility."""
    result = await IntelligenceService.get_intelligence_stream(
        case_id=case_id, source_type=source_type, page=page, limit=limit
    )
    return {
        "incidents": result["incidents"],
        "count": result["count"],
        "timestamp": result.get("case", {}).get(
            "updatedAt", "2026-09-18T18:45:00.000Z"
        ),
    }
