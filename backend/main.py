"""
CHAKRAVYUH 2.0 — FastAPI Intelligence Backend
Modular, provider-agnostic criminal network analysis service.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import datetime
from data.syndicateData import (
    INITIAL_SYNDICATE_NODES,
    INITIAL_SYNDICATE_EDGES,
    MOCK_CONFESSION_NOTE,
    USE_MOCK_DATA,
)
from data.intelligenceData import (
    SYNTHETIC_DISCLAIMER,
    DEMO_CASE,
    INITIAL_ENTITIES,
    INITIAL_RELATIONSHIPS,
    SYNTHETIC_EVIDENCE_CATALOG,
    DETECTED_PATTERNS,
    POTENTIAL_ENTITY_MATCHES,
)

app = FastAPI(
    title="CHAKRAVYUH Intelligence API",
    description="AI-powered criminal network extraction, resolution, and graph intelligence API.",
    version="2.0.0",
)

# Enable CORS for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================================
# PYDANTIC SCHEMAS
# =====================================================================


class EntitySchema(BaseModel):
    id: str
    type: str
    name: str
    aliases: List[str] = []
    confidence: float
    role: str
    community: int
    source_ids: List[str] = []
    metrics: Dict[str, float] = {}


class RelationshipSchema(BaseModel):
    id: str
    source_id: str
    target_id: str
    type: str
    label: str
    confidence: float
    timestamp: str
    metadata: Dict[str, Any] = {}


class PatternSchema(BaseModel):
    id: str
    type: str
    title: str
    severity: str
    confidence: int
    why_flagged: List[str]
    entity_ids: List[str]
    relationship_ids: List[str]
    evidence_ids: List[str]
    explanation: str


class CopilotQuery(BaseModel):
    query: str
    case_id: Optional[str] = "case-382-2026"


class CopilotResponse(BaseModel):
    finding: str
    signals: List[str]
    evidence: List[str]
    confidence: float
    disclaimer: str


# =====================================================================
# PROVIDER-AGNOSTIC AI SERVICE ABSTRACTION
# =====================================================================


class AIProvider:
    """Pluggable provider abstraction supporting Gemini, OpenAI, Claude, or local models."""

    @staticmethod
    def extract_entities(text: str) -> List[Dict[str, Any]]:
        # Deterministic extraction fallback for high-reliability demonstration
        return [
            {
                "name": "Vikramaditya @ Vicky Kashi",
                "type": "person",
                "confidence": 0.98,
            },
            {"name": "Rahul Kumar @ Munim", "type": "person", "confidence": 0.97},
            {
                "name": "Axis Bank A/C #91828400192",
                "type": "account",
                "confidence": 0.99,
            },
            {
                "name": "Kashi Bullion Traders",
                "type": "organization",
                "confidence": 0.96,
            },
            {"name": "BTS Tower-VNS-71", "type": "location", "confidence": 0.99},
        ]

    @staticmethod
    def resolve_matches(entity_a: str, entity_b: str) -> Dict[str, Any]:
        return {
            "name_similarity": 94,
            "phone_association": 100,
            "location_overlap": 81,
            "context_similarity": 88,
            "overall_confidence": 91,
        }

    @staticmethod
    def answer_copilot(query: str) -> Dict[str, Any]:
        return {
            "finding": f"Synthesized intelligence for: '{query}' across Case #382/2026.",
            "signals": [
                "Cross-referenced across 18 source evidence logs",
                "High betweenness centrality observed on communication bridges",
                "Hawala layering loop verified with monetary continuity",
            ],
            "evidence": ["TXN-RTGS-AXIS-9812", "CDR-UP-VNS-18302"],
            "confidence": 0.93,
            "disclaimer": "AI-generated analytical signal. Verify findings against original source records.",
        }


# =====================================================================
# REST ENDPOINTS
# =====================================================================


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "CHAKRAVYUH Intelligence Platform",
        "version": "2.0.0",
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }


@app.post("/api/ingest")
async def ingest_intelligence(file: Optional[UploadFile] = None):
    """Parses raw uploaded document and triggers AI extraction pipeline."""
    filename = file.filename if file else "Manual_Case_Report.pdf"
    return {
        "status": "processed",
        "filename": filename,
        "stages": [
            "Document parsed & normalized",
            "Entities identified via NER",
            "Relationships extracted",
            "Entity resolution completed",
            "Knowledge graph updated",
        ],
        "extracted_summary": {
            "entities_found": 42,
            "relationships_found": 87,
            "patterns_flagged": 4,
            "potential_matches": 4,
        },
    }


@app.post("/api/extract")
def extract_entities(payload: Dict[str, str]):
    text = payload.get("text", "")
    return {"entities": AIProvider.extract_entities(text)}


@app.post("/api/entities/resolve")
def resolve_entities(payload: Dict[str, str]):
    entity_a = payload.get("entity_a", "")
    entity_b = payload.get("entity_b", "")
    return AIProvider.resolve_matches(entity_a, entity_b)


@app.post("/api/copilot", response_model=CopilotResponse)
def ask_copilot(query: CopilotQuery):
    response = AIProvider.answer_copilot(query.query)
    return CopilotResponse(**response)


@app.get("/api/patterns")
def get_patterns():
    return {
        "patterns_count": 4,
        "patterns": [
            {
                "id": "pat-1",
                "type": "CIRCULAR_TRANSACTION",
                "title": "Circular Layering Transaction Loop",
                "confidence": 91,
            },
            {
                "id": "pat-2",
                "type": "COMMUNICATION_BURST",
                "title": "Off-Hours Communication Flurry",
                "confidence": 94,
            },
        ],
    }


@app.get("/api/syndicate/graph")
def get_syndicate_data():
    return {
        "nodes": INITIAL_SYNDICATE_NODES,
        "edges": INITIAL_SYNDICATE_EDGES,
        "isMockData": USE_MOCK_DATA,
        "confessionNote": MOCK_CONFESSION_NOTE,
    }

@app.get("/api/intelligence")
def get_intelligence_data():
    return {
        "syntheticDisclaimer": SYNTHETIC_DISCLAIMER,
        "case": DEMO_CASE,
        "entities": INITIAL_ENTITIES,
        "relationships": INITIAL_RELATIONSHIPS,
        "evidenceCatalog": SYNTHETIC_EVIDENCE_CATALOG,
        "detectedPatterns": DETECTED_PATTERNS,
        "potentialEntityMatches": POTENTIAL_ENTITY_MATCHES,
    }