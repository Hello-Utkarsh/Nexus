from fastapi import APIRouter
from app.models.syndicate_graph import SyndicateGraphResponse
from app.services.graph_service import GraphService

router = APIRouter(tags=["Syndicate Graph"])


@router.get("/api/syndicate/graph", response_model=SyndicateGraphResponse)
async def get_syndicate_graph():
    """
    Returns graph topology, Louvain community clusters, and centrality metrics.
    Supports both backend contract and frontend NetworkWorkbench.
    """
    return await GraphService.get_syndicate_graph()


@router.get("/api/v1/graph", response_model=SyndicateGraphResponse)
async def get_v1_graph():
    """Direct alias for frontend BACKEND_CONTRACT compatibility."""
    return await GraphService.get_syndicate_graph()
