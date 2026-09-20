from typing import Dict, Any, List, Optional
from app.core.database import db_manager
from app.models.intelligence_log import IntelligenceLog, IntelligenceSourceType
from data.intelligenceData import (
    SYNTHETIC_DISCLAIMER,
    DEMO_CASE,
    INITIAL_ENTITIES,
    INITIAL_RELATIONSHIPS,
    SYNTHETIC_EVIDENCE_CATALOG,
    DETECTED_PATTERNS,
    POTENTIAL_ENTITY_MATCHES,
)


class IntelligenceService:
    @staticmethod
    async def get_intelligence_stream(
        case_id: Optional[str] = None,
        source_type: Optional[str] = None,
        page: int = 1,
        limit: int = 25,
    ) -> Dict[str, Any]:
        coll = db_manager.get_collection("intelligence_logs")
        query: Dict[str, Any] = {}
        if case_id:
            query["case_id"] = case_id
        if source_type:
            try:
                norm_st = IntelligenceSourceType.normalize(source_type)
                query["source_type"] = norm_st.value
            except ValueError:
                query["source_type"] = source_type

        total = await coll.count_documents(query)
        cursor = (
            coll.find(query).sort("timestamp", -1).skip((page - 1) * limit).limit(limit)
        )
        raw_logs = await cursor.to_list(length=limit)

        for l in raw_logs:
            if "_id" in l:
                l["_id"] = str(l["_id"])

        return {
            "syntheticDisclaimer": SYNTHETIC_DISCLAIMER,
            "case": DEMO_CASE,
            "entities": INITIAL_ENTITIES,
            "relationships": INITIAL_RELATIONSHIPS,
            "evidenceCatalog": SYNTHETIC_EVIDENCE_CATALOG,
            "detectedPatterns": DETECTED_PATTERNS,
            "potentialEntityMatches": POTENTIAL_ENTITY_MATCHES,
            "logs": raw_logs,
            "incidents": raw_logs,  # Frontend SocmintView compatibility
            "count": len(raw_logs),
            "pagination": {"page": page, "limit": limit, "total": total},
        }
