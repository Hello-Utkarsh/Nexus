from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # Kingpin, Mule, Phone, Bank Account, person, sim, etc.
    risk_score: float = 0.0
    metadata: Dict[str, Any] = Field(default_factory=dict)

    # Extra fields for frontend compatibility
    name: Optional[str] = None
    aliases: List[str] = Field(default_factory=list)
    confidence: float = 0.95
    role: Optional[str] = None
    community: int = 1
    communityName: Optional[str] = None
    flaggedSignal: Optional[str] = None
    metrics: Dict[str, Any] = Field(default_factory=dict)
    sourceIds: List[str] = Field(default_factory=list)
    telecom: Optional[Dict[str, Any]] = None
    financial: Optional[Dict[str, Any]] = None
    location: Optional[Dict[str, Any]] = None
    firstSeen: Optional[str] = None
    lastSeen: Optional[str] = None


class GraphEdge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    relation: str = "Associated"  # Transacted, Called, Associated, etc.
    weight: float = 1.0
    timestamp: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    # Extra fields for frontend compatibility
    type: Optional[str] = None
    label: Optional[str] = None
    confidence: float = 0.9
    amount: Optional[float] = None
    callCount: Optional[int] = None
    durationSeconds: Optional[int] = None
    sourceIds: List[str] = Field(default_factory=list)


class ClusterInfo(BaseModel):
    id: Any
    name: str
    nodeCount: int
    primaryRole: Optional[str] = None


class SyndicateGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    links: Optional[List[GraphEdge]] = None  # Frontend compatibility alias
    clusters: List[ClusterInfo] = Field(default_factory=list)
    centrality: Dict[str, float] = Field(default_factory=dict)
    metrics: Optional[Dict[str, Any]] = None


class PathResolveRequest(BaseModel):
    source: Optional[str] = None
    target: Optional[str] = None
    sourceId: Optional[str] = None  # Frontend compatibility
    targetId: Optional[str] = None  # Frontend compatibility
    maxHops: Optional[int] = 5
    includeFinancialOnly: Optional[bool] = False


class PathResolveResponse(BaseModel):
    path_exists: bool
    nodes: List[str]  # Ordered nodes
    path: List[str]  # Frontend compatibility alias
    edges: List[Dict[str, Any]] = Field(default_factory=list)
    total_cost: float = 0.0
    totalHops: int = 0
    totalAmount: float = 0.0
    evidenceChain: List[str] = Field(default_factory=list)
