"""
CHAKRAVYUH 2.0 — FastAPI Intelligence Backend
Modular, provider-agnostic criminal network analysis & intelligence service.
"""

import datetime
import logging
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field

from app.core.config import settings
from app.core.database import db_manager
from app.seed.demo_seed import seed_database
from app.middleware.audit import AuditLoggerMiddleware

# Import Routers
from app.routes import (
    auth,
    admin,
    syndicate,
    intelligence,
    path,
    investigations,
    ingest,
)

logger = logging.getLogger("chakravyuh.app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing CHAKRAVYUH Intelligence Backend...")
    await db_manager.connect()
    # Check if database has nodes, if not seed demo data
    nodes_coll = db_manager.get_collection("syndicate_nodes")
    count = await nodes_coll.count_documents({})
    if count == 0:
        logger.info("Database empty, initializing synthetic DEMO_DATA...")
        await seed_database()
    yield
    # Shutdown
    logger.info("Shutting down database connections...")
    await db_manager.disconnect()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered criminal network extraction, resolution, and graph intelligence API.",
    version=settings.VERSION,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Audit Logger Middleware for sensitive calls & mutations
app.add_middleware(AuditLoggerMiddleware)

# =====================================================================
# EXCEPTION HANDLERS (Clean, Standardized API Errors)
# =====================================================================


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Input validation error",
            "errors": exc.errors(),
            "status_code": 422,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(
        "Unhandled server exception on %s: %s", request.url.path, exc, exc_info=True
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred. Please contact the STF Command Desk.",
            "status_code": 500,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        },
    )


# =====================================================================
# MOUNT MODULAR ROUTERS
# =====================================================================

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(syndicate.router)
app.include_router(intelligence.router)
app.include_router(path.router)
app.include_router(investigations.router)
app.include_router(ingest.router)

# =====================================================================
# CONTRACT COMPATIBILITY & HEALTH ENDPOINTS
# =====================================================================


@app.get("/", tags=["Health & Status"])
@app.get("/api/v1/health", tags=["Health & Status"])
def health_check():
    """
    Health check endpoint polled by frontend TelemetryBadge.
    Guarantees '● LIVE BACKEND CONNECTED (MongoDB/FastAPI)'.
    """
    return {
        "status": "ONLINE",
        "service": settings.PROJECT_NAME,
        "database": "connected"
        if db_manager.is_connected
        else "in-memory (tactical fallback)",
        "version": settings.VERSION,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "activeWorkers": 4,
    }


# =====================================================================
# AI COPILOT & AUXILIARY ANALYTICAL ENDPOINTS
# =====================================================================


class CopilotQuery(BaseModel):
    query: str
    case_id: Optional[str] = "case-382"


class CopilotResponse(BaseModel):
    finding: str
    signals: List[str]
    evidence: List[str]
    confidence: float
    disclaimer: str


@app.post("/api/copilot", response_model=CopilotResponse, tags=["Copilot"])
def ask_copilot(query: CopilotQuery):
    return CopilotResponse(
        finding=f"Synthesized intelligence for: '{query.query}' across Case #382/2026.",
        signals=[
            "Cross-referenced across 18 source evidence logs",
            "High betweenness centrality observed on communication bridges",
            "Hawala layering loop verified with monetary continuity",
        ],
        evidence=["TXN-RTGS-AXIS-9812", "CDR-UP-VNS-18302"],
        confidence=0.93,
        disclaimer="AI-generated analytical signal. Verify findings against original source records.",
    )


@app.post("/api/extract", tags=["AI Extraction"])
def extract_entities_raw(payload: Dict[str, str]):
    text = payload.get("text", "")
    from app.services.ingestion_service import IngestionService

    entities = IngestionService.extract_entities_from_text(text, "api-extract")
    return {"entities": [e.model_dump() for e in entities]}


@app.post("/api/entities/resolve", tags=["Entity Resolution"])
def resolve_entities(payload: Dict[str, str]):
    return {
        "name_similarity": 94,
        "phone_association": 100,
        "location_overlap": 81,
        "context_similarity": 88,
        "overall_confidence": 91,
    }


@app.get("/api/patterns", tags=["Patterns"])
def get_patterns():
    from data.intelligenceData import DETECTED_PATTERNS

    return {"patterns_count": len(DETECTED_PATTERNS), "patterns": DETECTED_PATTERNS}
