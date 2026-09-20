from typing import List, Optional
from pydantic import BaseModel, Field
import datetime


class InvestigationCase(BaseModel):
    id: str
    case_id: str
    case_number: str
    title: str
    directive: str
    lead_investigator_id: str
    lead_investigator_name: str
    assigned_io_ids: List[str] = Field(default_factory=list)
    unit: str
    status: str = (
        "CRITICAL ACTIVE"  # CRITICAL ACTIVE, UNDER SURVEILLANCE, CLOSED/ARCHIVED
    )
    entities_count: int = 0
    nodes_count: int = 0
    threat_level: str = "CRITICAL (Score: 96)"
    last_updated: str = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).strftime(
            "%Y-%m-%d %H:%M IST"
        )
    )
    primary_target: str
    summary: str
    bns_sections: List[str] = Field(default_factory=list)
