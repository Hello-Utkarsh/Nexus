from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
import datetime


class AuditLog(BaseModel):
    log_id: str
    user_id: str
    role: str
    action: str
    endpoint: str
    client_ip: str
    timestamp: str = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).strftime(
            "%Y-%m-%d %H:%M:%S IST"
        )
    )
    status_code: int = 200
    method: str = "GET"

    # Frontend AuditDock & Contract fields
    id: Optional[str] = None
    officerId: Optional[str] = None
    officerName: Optional[str] = None
    status: str = "200 OK"
    severity: str = "INFO"  # INFO, SENSITIVE, CRITICAL
    module: str = "General System"
    details: Optional[str] = None

    def model_post_init(self, __context: Any) -> None:
        if not self.id:
            self.id = self.log_id
        if not self.officerId:
            self.officerId = self.user_id
        if not self.officerName:
            self.officerName = f"Officer ({self.user_id})"
