import pytest
from app.models.common import UserRole
from app.core.security import create_access_token


def test_login_and_me(client):
    # Login as Super Admin
    resp = client.post("/api/auth/login", json={"service_id": "IPS-HQ-0102"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["role"] == "SUPER_ADMIN"

    token = data["access_token"]
    # Verify /api/auth/me with Bearer token
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["user_id"] == "IPS-HQ-0102"
    assert me_data["role"] == "SUPER_ADMIN"


def test_unauthenticated_requests_return_401(client):
    # Attempting to access protected endpoints without token
    resp = client.get("/api/admin/audit-logs")
    assert resp.status_code == 401
    assert "Authentication required" in resp.json()["detail"]

    resp = client.get("/api/investigations/my-cases")
    assert resp.status_code == 401


def test_invalid_token_returns_401(client):
    resp = client.get(
        "/api/admin/audit-logs", headers={"Authorization": "Bearer invalid.fake.token"}
    )
    assert resp.status_code == 401


def test_rbac_super_admin_vs_analyst_io(client):
    # Super Admin token
    super_admin_token = create_access_token(
        user_id="IPS-HQ-0102", role=UserRole.SUPER_ADMIN
    )
    # Analyst IO token
    analyst_token = create_access_token(
        user_id="STF-VNS-4491", role=UserRole.ANALYST_IO
    )

    # Super Admin should access /api/admin/audit-logs
    resp_super = client.get(
        "/api/admin/audit-logs",
        headers={"Authorization": f"Bearer {super_admin_token}"},
    )
    assert resp_super.status_code == 200
    assert "data" in resp_super.json()
    assert "pagination" in resp_super.json()

    # Analyst IO should receive 403 Forbidden on /api/admin/audit-logs
    resp_analyst = client.get(
        "/api/admin/audit-logs", headers={"Authorization": f"Bearer {analyst_token}"}
    )
    assert resp_analyst.status_code == 403
    assert "SUPER_ADMIN" in resp_analyst.json()["detail"]


def test_forged_role_in_request_body_or_query_is_ignored(client):
    # Analyst tries to claim SUPER_ADMIN in query/body
    analyst_token = create_access_token(
        user_id="STF-VNS-4491", role=UserRole.ANALYST_IO
    )

    resp = client.get(
        "/api/admin/audit-logs?role=SUPER_ADMIN&user_id=IPS-HQ-0102",
        headers={"Authorization": f"Bearer {analyst_token}"},
    )
    # Must still be rejected with 403 Forbidden based on verified token
    assert resp.status_code == 403
