from fastapi import APIRouter, Depends, Request, HTTPException, status
from typing import Optional, Dict, Any
from app.models.common import AuthenticatedUser
from app.models.intelligence_log import IngestResponse
from app.middleware.auth import get_current_user
from app.services.ingestion_service import IngestionService

router = APIRouter(tags=["Ingestion"])


@router.post("/api/ingest", response_model=IngestResponse)
async def ingest_intelligence(
    request: Request, current_user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Authenticated evidence and intelligence ingestion pipeline.
    Accepts both JSON payloads and Multi-part Form uploads.
    Verifies case access, parses content, extracts entities, and attaches Section 63 BSA provenance.
    """
    content_type = request.headers.get("content-type", "")
    case_id = "case-382"
    source_type = "FIR"
    content = ""
    metadata: Dict[str, Any] = {}

    if "application/json" in content_type:
        try:
            body = await request.json()
            case_id = body.get("case_id") or body.get("caseId") or case_id
            source_type = (
                body.get("source_type") or body.get("sourceType") or source_type
            )
            content = (
                body.get("raw_content") or body.get("text") or body.get("content") or ""
            )
            metadata = body.get("metadata") or {}
        except Exception:
            pass
    elif "multipart/form-data" in content_type:
        form = await request.form()
        case_id = form.get("case_id") or form.get("caseId") or case_id
        source_type = form.get("source_type") or form.get("sourceType") or source_type
        content = form.get("raw_content") or form.get("text") or ""
        file_obj = form.get("file")
        if file_obj and hasattr(file_obj, "filename"):
            content += f"\n[Attached file: {file_obj.filename}]"
            metadata["filename"] = file_obj.filename
            metadata["content_type"] = getattr(
                file_obj, "content_type", "application/octet-stream"
            )
    else:
        try:
            body = await request.json()
            case_id = body.get("case_id") or body.get("caseId") or case_id
            source_type = (
                body.get("source_type") or body.get("sourceType") or source_type
            )
            content = body.get("raw_content") or body.get("text") or ""
            metadata = body.get("metadata") or {}
        except Exception:
            pass

    if not case_id or not str(case_id).strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Validation error: 'case_id' must be provided.",
        )

    if not content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Validation error: 'raw_content' or text content must be provided.",
        )

    client_ip = request.client.host if request.client else "127.0.0.1"

    return await IngestionService.process_ingestion(
        user=current_user,
        case_id=case_id,
        source_type_str=source_type,
        raw_content=content,
        metadata=metadata,
        client_ip=client_ip,
    )
