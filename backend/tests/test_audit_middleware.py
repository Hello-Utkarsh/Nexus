import pytest
from app.models.common import UserRole
from app.core.security import create_access_token


def test_audit_logs_recording_and_retrieval(client):
    super_admin_token = create_access_token(
        user_id="IPS-HQ-0102", role=UserRole.SUPER_ADMIN
    )
    analyst_token = create_access_token(
        user_id="STF-VNS-4491", role=UserRole.ANALYST_IO
    )

    # Perform an action that triggers audit interceptor
    resp = client.get(
        "/api/syndicate/graph", headers={"Authorization": f"Bearer {analyst_token}"}
    )
    assert resp.status_code == 200

    # Retrieve audit logs as Super Admin
    resp_logs = client.get(
        "/api/admin/audit-logs",
        headers={"Authorization": f"Bearer {super_admin_token}"},
    )
    assert resp_logs.status_code == 200
    data = resp_logs.json()
    assert "data" in data
    assert "pagination" in data
    assert len(data["data"]) > 0

    # Check that secrets or auth tokens are NEVER logged
    for log_item in data["data"]:
        details = str(log_item.get("details", ""))
        action = str(log_item.get("action", ""))
        assert "bearer" not in details.lower()
        assert "password" not in details.lower()
        assert "bearer" not in action.lower()
