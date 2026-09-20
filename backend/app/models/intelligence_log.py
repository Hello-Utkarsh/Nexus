from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import datetime


class IntelligenceSourceType(str, Enum):
    FIR = "FIR"
    CDR = "CDR"
    STR = "STR"
    SOCMINT = "SOCMINT"

    @classmethod
    def normalize(cls, val: str) -> "IntelligenceSourceType":
        clean = val.strip().upper()
        if clean in ("FIR", "CASE", "DEPOSITION"):
            return cls.FIR
        if clean in ("CDR", "IPDR", "TELECOM"):
            return cls.CDR
        if clean in ("STR", "FINANCIAL", "HAWALA", "BANK"):
            return cls.STR
        if clean in ("SOCMINT", "OSINT", "DARKWEB", "TELEGRAM"):
            return cls.SOCMINT
        return cls.FIR


class DerivedEntity(BaseModel):
    name: str
    type: str
    confidence: float = 0.95
    role: Optional[str] = None
    provenance_log_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class IntelligenceLog(BaseModel):
    log_id: str
    case_id: str
    source_type: IntelligenceSourceType
    raw_content: str
    derived_entities: List[DerivedEntity] = Field(default_factory=list)
    timestamp: str = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
    metadata: Dict[str, Any] = Field(default_factory=dict)


class IngestRequest(BaseModel):
    case_id: str = "case-382"
    source_type: str = "FIR"
    raw_content: Optional[str] = None
    text: Optional[str] = None  # Alias
    metadata: Dict[str, Any] = Field(default_factory=dict)


class IngestResponse(BaseModel):
    status: str = "processed"
    log_id: str
    case_id: str
    source_type: str
    stages: List[str] = Field(default_factory=list)
    derived_entities: List[DerivedEntity] = Field(default_factory=list)
    extracted_summary: Dict[str, Any] = Field(default_factory=dict)
    provenance_chain: List[str] = Field(default_factory=list)
