from fastapi import APIRouter, HTTPException, status
from app.models.syndicate_graph import PathResolveRequest, PathResolveResponse
from app.services.graph_service import GraphService

router = APIRouter(tags=["Path Resolution"])


@router.post("/api/path/resolve", response_model=PathResolveResponse)
async def resolve_path(payload: PathResolveRequest):
    """
    Computes shortest path between two graph nodes using Dijkstra algorithm.
    Validates node existence and computes path cost and Section 63 BSA evidence links.
    """
    src = payload.source or payload.sourceId
    tgt = payload.target or payload.targetId

    if not src or not tgt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both 'source' and 'target' node IDs must be provided.",
        )

    src = src.strip()
    tgt = tgt.strip()

    src_exists, tgt_exists, res = await GraphService.resolve_path(
        source_id=src,
        target_id=tgt,
        max_hops=payload.maxHops or 5,
        include_financial_only=bool(payload.includeFinancialOnly),
    )

    if not src_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source node '{src}' does not exist in the syndicate graph.",
        )

    if not tgt_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target node '{tgt}' does not exist in the syndicate graph.",
        )

    return res


@router.post("/api/v1/path/resolve", response_model=PathResolveResponse)
async def resolve_v1_path(payload: PathResolveRequest):
    """Direct alias for frontend BACKEND_CONTRACT compatibility."""
    return await resolve_path(payload)
