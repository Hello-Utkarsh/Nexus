import uuid
import datetime
import logging
from typing import Optional, Dict, Any, List
from app.core.database import db_manager
from app.models.audit_log import AuditLog

logger = logging.getLogger("chakravyuh.audit")


class AuditService:
    @staticmethod
    async def record_log(
        user_id: str,
        role: str,
        action: str,
        endpoint: str,
        client_ip: str,
        method: str = "GET",
        status_code: int = 200,
        severity: str = "INFO",
        module: str = "System",
        details: Optional[str] = None,
    ) -> AuditLog:
        log_id = f"log-{uuid.uuid4().hex[:8]}"
        now_str = datetime.datetime.now(datetime.timezone.utc).strftime(
            "%Y-%m-%d %H:%M:%S IST"
        )

        status_text = (
            f"{status_code} OK" if status_code < 400 else f"{status_code} BLOCKED"
        )

        log_entry = AuditLog(
            log_id=log_id,
            user_id=user_id,
            role=role,
            action=action,
            endpoint=endpoint,
            client_ip=client_ip,
            timestamp=now_str,
            status_code=status_code,
            method=method,
            officerId=user_id,
            status=status_text,
            severity=severity,
            module=module,
            details=details or f"Executed {method} on {endpoint}",
        )

        try:
            coll = db_manager.get_collection("audit_logs")
            await coll.insert_one(log_entry.model_dump())
        except Exception as e:
            logger.error("Failed to write to audit_logs: %s", e)

        return log_entry

    @staticmethod
    async def get_logs(
        page: int = 1,
        limit: int = 25,
        severity: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        coll = db_manager.get_collection("audit_logs")
        query: Dict[str, Any] = {}
        if severity:
            query["severity"] = severity
        if user_id:
            query["user_id"] = user_id

        total = await coll.count_documents(query)
        cursor = (
            coll.find(query).sort("timestamp", -1).skip((page - 1) * limit).limit(limit)
        )
        items = await cursor.to_list(length=limit)

        # Clean out any internal fields like _id
        cleaned = []
        for it in items:
            if "_id" in it:
                it["_id"] = str(it["_id"])
            cleaned.append(it)

        return {
            "data": cleaned,
            "logs": cleaned,  # For frontend AuditDock compatibility
            "totalQueries": total,
            "pagination": {"page": page, "limit": limit, "total": total},
        }
