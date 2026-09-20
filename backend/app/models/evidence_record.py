from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import datetime


class EvidenceFileType(str, Enum):
    TEXT = "Text"
    VIDEO = "Video"
    AUDIO = "Audio"


class EvidenceRecord(BaseModel):
    evidence_id: str
    case_id: str
    file_type: EvidenceFileType
    file_url: str
    citations: List[str] = Field(default_factory=list)
    provenance_chain: List[str] = Field(default_factory=list)
    source_name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    timestamp: str = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
    metadata: Dict[str, Any] = Field(default_factory=dict)
