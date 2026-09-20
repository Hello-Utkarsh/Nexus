import pytest
from app.models.common import UserRole
from app.core.security import create_access_token


def test_my_cases_rbac_analyst_vs_admin(client):
    analyst_token = create_access_token(
        user_id="STF-VNS-4491", role=UserRole.ANALYST_IO
    )
    admin_token = create_access_token(user_id="SP-CYBER-8801", role=UserRole.ADMIN)

    # Analyst IO
    resp_analyst = client.get(
        "/api/investigations/my-cases",
        headers={"Authorization": f"Bearer {analyst_token}"},
    )
    assert resp_analyst.status_code == 200
    cases_analyst = resp_analyst.json()["cases"]
    # Only cases assigned to STF-VNS-4491
    for c in cases_analyst:
        assert (
            "STF-VNS-4491" in c["assigned_io_ids"]
            or c["lead_investigator_id"] == "STF-VNS-4491"
        )

    # Admin
    resp_admin = client.get(
        "/api/investigations/my-cases",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp_admin.status_code == 200
    cases_admin = resp_admin.json()["cases"]
    assert len(cases_admin) >= len(cases_analyst)


def test_ingest_intelligence_with_provenance_and_audit(client):
    analyst_token = create_access_token(
        user_id="STF-VNS-4491", role=UserRole.ANALYST_IO
    )

    payload = {
        "case_id": "case-382",
        "source_type": "CDR",
        "raw_content": "Assi Ghat Tower 71 dump: Call burst from Vikramaditya @ Vicky Kashi to Dubai Desk Tariq Bhai.",
        "metadata": {"tower_id": "BTS-UP-VNS-71"},
    }

    resp = client.post(
        "/api/ingest",
        json=payload,
        headers={"Authorization": f"Bearer {analyst_token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "processed"
    assert data["case_id"] == "case-382"
    assert "log_id" in data
    assert len(data["derived_entities"]) >= 1
    # Check that provenance chain contains BSA integrity
    assert any("BSA_SEC_63" in p for p in data["provenance_chain"])
    assert any(data["log_id"] in p for p in data["provenance_chain"])


def test_ingest_unauthorized_case_returns_403(client):
    # Officer not assigned to case-042
    other_token = create_access_token(user_id="STF-VNS-4491", role=UserRole.ANALYST_IO)

    payload = {
        "case_id": "case-042",  # Only DYSP-MISHRA-042 is assigned
        "source_type": "FIR",
        "raw_content": "Deposition report attempt",
    }

    resp = client.post(
        "/api/ingest", json=payload, headers={"Authorization": f"Bearer {other_token}"}
    )
    assert resp.status_code == 403
    assert "Access denied" in resp.json()["detail"]


def test_ingest_empty_content_returns_400(client):
    analyst_token = create_access_token(
        user_id="STF-VNS-4491", role=UserRole.ANALYST_IO
    )
    payload = {
        "case_id": "case-382",
        "source_type": "FIR",
        "raw_content": "   ",
    }
    resp = client.post(
        "/api/ingest",
        json=payload,
        headers={"Authorization": f"Bearer {analyst_token}"},
    )
    assert resp.status_code == 400
    assert "Validation error" in resp.json()["detail"]
