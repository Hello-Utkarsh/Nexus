import asyncio
import logging
import datetime
from typing import Dict, Any, List
from app.core.database import db_manager
from data.syndicateData import INITIAL_SYNDICATE_NODES, INITIAL_SYNDICATE_EDGES
from data.intelligenceData import SYNTHETIC_EVIDENCE_CATALOG

logger = logging.getLogger("chakravyuh.seed")

DEMO_CASES = [
    {
        "id": "case-382",
        "case_id": "case-382",
        "case_number": "Case #382/2026 (DEMO_DATA)",
        "title": "Purvanchal Syndicate Extortion & Hawala Ring (SYNTHETIC)",
        "directive": "OP: Operation Syndicate-Viper // FIR #382/2026",
        "lead_investigator_id": "STF-VNS-4491",
        "lead_investigator_name": "Inspector R. K. Singh",
        "assigned_io_ids": ["STF-VNS-4491", "IO-AMIT-104"],
        "unit": "UP-STF Special Cell (Varanasi / Lucknow Range)",
        "status": "CRITICAL ACTIVE",
        "entities_count": 42,
        "nodes_count": 87,
        "threat_level": "CRITICAL (Score: 96)",
        "last_updated": "2026-09-18 18:40 IST",
        "primary_target": "Vikramaditya @ Vicky Kashi (Kingpin)",
        "summary": "Inter-state organized syndicate operating extortion rings targeting real-estate developers in Varanasi, layered via Dubai Hawala accounts through Purvanchal Traders.",
        "bns_sections": [
            "Sec 111 (Organized Crime)",
            "Sec 308(4) (Extortion)",
            "PMLA Sec 3 & 4",
        ],
        "DEMO_DATA": True,
    },
    {
        "id": "case-104",
        "case_id": "case-104",
        "case_number": "Case #104/2026 (DEMO_DATA)",
        "title": "Cantt Railway Station Pre-activated SIM Racket (SYNTHETIC)",
        "directive": "OP: Operation Signal-Ghost // FIR #104/2026",
        "lead_investigator_id": "IO-AMIT-104",
        "lead_investigator_name": "Inspector Amit Verma",
        "assigned_io_ids": ["IO-AMIT-104"],
        "unit": "Cyber Crime PS Lucknow Range",
        "status": "UNDER SURVEILLANCE",
        "entities_count": 16,
        "nodes_count": 28,
        "threat_level": "HIGH (Score: 78)",
        "last_updated": "2026-09-17 14:15 IST",
        "primary_target": "Burner SIM Farm Facilitator (Sigra Cell)",
        "summary": "Black-market distribution of forged Aadhaar pre-activated SIMs utilized for extortion VoIP calls across eastern UP corridors.",
        "bns_sections": [
            "Sec 318(4) (Cheating)",
            "Sec 66 IT Act",
            "Sec 4 Telegraph Act",
        ],
        "DEMO_DATA": True,
    },
    {
        "id": "case-042",
        "case_id": "case-042",
        "case_number": "Case #042/2025 (DEMO_DATA)",
        "title": "Assi Ghat Midnight Telecom Burst (SYNTHETIC)",
        "directive": "OP: Operation Silent-Tower // FIR #042/2025",
        "lead_investigator_id": "DYSP-MISHRA-042",
        "lead_investigator_name": "DySP Rajeshwar Mishra",
        "assigned_io_ids": ["DYSP-MISHRA-042"],
        "unit": "Varanasi Commissionerate Special Operations",
        "status": "CLOSED/ARCHIVED",
        "entities_count": 19,
        "nodes_count": 31,
        "threat_level": "RESOLVED (Score: 45)",
        "last_updated": "2025-11-20 11:30 IST",
        "primary_target": "Sub-ordinate Cash Courier (Lanka Cell)",
        "summary": "Concluded investigation into nighttime BTS tower-dump bursts and localized extortion courier drops; accused charge-sheeted under Sec 308.",
        "bns_sections": ["Sec 308(2) (Extortion)", "Sec 61 (Conspiracy)"],
        "DEMO_DATA": True,
    },
]

DEMO_INTELLIGENCE_LOGS = [
    {
        "log_id": "soc-01",
        "case_id": "case-382",
        "source_type": "SOCMINT",
        "raw_content": "[DEMO_DATA Telegram Intercept] Telegram Channel: Purvanchal Logistics Ops. Handle: @vicky_kashi_direct. Consignment confirmed for 50L delivery at Assi Ghat transit depot. Handover to Tariq courier post-midnight. Route cleared via Cantonment. Payment via Axis Bank #9182 token.",
        "derived_entities": [
            {
                "name": "Vikramaditya @ Vicky Kashi",
                "type": "Kingpin",
                "confidence": 0.98,
                "role": "Syndicate Controller",
            },
            {
                "name": "Tariq Bhai @ Dubai Desk",
                "type": "Kingpin",
                "confidence": 0.95,
                "role": "Courier Desk",
            },
            {
                "name": "Axis Bank #9182",
                "type": "Bank Account",
                "confidence": 0.99,
                "role": "Laundering Token",
            },
        ],
        "timestamp": "2026-09-18T18:34:00.000Z",
        "metadata": {
            "platform": "Telegram Channel",
            "threatRating": "CRITICAL",
            "riskScore": 94,
        },
        "DEMO_DATA": True,
    },
    {
        "log_id": "fir-01",
        "case_id": "case-382",
        "source_type": "FIR",
        "raw_content": "[DEMO_DATA FIR Excerpt] FIR #382/2026 registered at PS Lanka, Varanasi against Vikramaditya @ Vicky Kashi and associates under BNS Sec 111, 308(4). Complainant Radheshyam Agrawal received extortion VoIP call demanding ₹50 Lakhs.",
        "derived_entities": [
            {
                "name": "Vikramaditya @ Vicky Kashi",
                "type": "Kingpin",
                "confidence": 0.98,
                "role": "Prime Accused",
            },
            {
                "name": "Radheshyam Agrawal",
                "type": "Victim",
                "confidence": 0.95,
                "role": "Complainant",
            },
        ],
        "timestamp": "2026-08-14T10:00:00.000Z",
        "metadata": {"police_station": "PS Lanka", "city": "Varanasi"},
        "DEMO_DATA": True,
    },
    {
        "log_id": "cdr-01",
        "case_id": "case-382",
        "source_type": "CDR",
        "raw_content": "[DEMO_DATA CDR Intercept] BTS Tower-VNS-71 (Assi Ghat) registered 142 call bursts from MSISDN +91-98110-23910 to Dubai Etisalat MSISDN +971-50-8192831 between 01:00 and 04:00 IST.",
        "derived_entities": [
            {
                "name": "Burner MSISDN #98110-23910",
                "type": "Phone",
                "confidence": 0.99,
                "role": "Caller",
            },
            {
                "name": "Tariq Dubai Relay +971-50-8192831",
                "type": "Phone",
                "confidence": 0.97,
                "role": "Receiver",
            },
        ],
        "timestamp": "2026-09-14T23:18:04.000Z",
        "metadata": {"tower": "BTS-UP-VNS-71", "interceptCount": 142},
        "DEMO_DATA": True,
    },
]

DEMO_EVIDENCE_RECORDS = [
    {
        "evidence_id": "evid-fir-1",
        "case_id": "case-382",
        "file_type": "Text",
        "file_url": "https://storage.internal.chakravyuh/evidence/fir_382_certified_copy.pdf",
        "citations": ["FIR #382/2026 PS Lanka", "GD Entry #382"],
        "provenance_chain": [
            "PS Lanka Records",
            "Certified C-DAC Digital Signature",
            "BSA Sec 63 Hash #e8b1092a",
        ],
        "title": "Certified FIR Deposition Dossier",
        "timestamp": "2026-08-14T11:00:00.000Z",
        "DEMO_DATA": True,
    },
    {
        "evidence_id": "evid-cdr-1",
        "case_id": "case-382",
        "file_type": "Text",
        "file_url": "https://storage.internal.chakravyuh/evidence/cdr_tower71_dump.csv",
        "citations": ["CDR-UP-VNS-18302", "Tower Dump Match Tower-71"],
        "provenance_chain": [
            "Telecom Provider Subpoena Response",
            "DoT Node Gateway",
            "BSA Sec 63 Certified",
        ],
        "title": "Tower 71 Assi Ghat Intercept CSV",
        "timestamp": "2026-09-14T23:30:00.000Z",
        "DEMO_DATA": True,
    },
    {
        "evidence_id": "evid-audio-1",
        "case_id": "case-382",
        "file_type": "Audio",
        "file_url": "https://storage.internal.chakravyuh/evidence/wt_log_902_intercept.wav",
        "citations": ["WT-LOG-902-TAP"],
        "provenance_chain": ["Lawful Intercept Gateway", "Voice Biometric 99.2% match"],
        "title": "Wiretap Intercept Audio Snippet",
        "timestamp": "2026-09-14T23:18:00.000Z",
        "DEMO_DATA": True,
    },
]

DEMO_AUDIT_LOGS = [
    {
        "log_id": "log-001",
        "user_id": "IPS-HQ-0102",
        "role": "SUPER_ADMIN",
        "action": "Exported BNSS Dossier",
        "endpoint": "/api/admin/export",
        "client_ip": "10.0.4.12",
        "timestamp": "2026-09-18 18:48:12 IST",
        "status_code": 200,
        "method": "POST",
        "officerId": "IPS-HQ-0102",
        "officerName": "DIG Vikramaditya Sen",
        "status": "200 OK",
        "severity": "SENSITIVE",
        "module": "Case Directives / BNSS 173",
        "details": "Generated complete syndicate evidentiary dossier for Special Court Session",
        "DEMO_DATA": True,
    },
    {
        "log_id": "log-002",
        "user_id": "STF-VNS-4491",
        "role": "ANALYST_IO",
        "action": "Queried Hawala Sub-graph",
        "endpoint": "/api/syndicate/graph",
        "client_ip": "10.0.12.8",
        "timestamp": "2026-09-18 18:44:05 IST",
        "status_code": 200,
        "method": "GET",
        "officerId": "STF-VNS-4491",
        "officerName": "Insp. R. K. Singh",
        "status": "200 OK",
        "severity": "INFO",
        "module": "Graph Engine / Hawala Layer",
        "details": "Traversed 3 hops from Purvanchal Traders to Al-Nahda Exchange (AED 42.5L)",
        "DEMO_DATA": True,
    },
]


async def seed_database():
    """Seeds database collections with synthetic DEMO_DATA."""
    await db_manager.connect()

    # 1. Syndicate Nodes
    nodes_coll = db_manager.get_collection("syndicate_nodes")
    await nodes_coll.delete_many({})
    annotated_nodes = [{**n, "DEMO_DATA": True} for n in INITIAL_SYNDICATE_NODES]
    await nodes_coll.insert_many(annotated_nodes)

    # 2. Syndicate Edges
    edges_coll = db_manager.get_collection("syndicate_edges")
    await edges_coll.delete_many({})
    annotated_edges = [{**e, "DEMO_DATA": True} for e in INITIAL_SYNDICATE_EDGES]
    await edges_coll.insert_many(annotated_edges)

    # 3. Cases
    cases_coll = db_manager.get_collection("cases")
    await cases_coll.delete_many({})
    await cases_coll.insert_many(DEMO_CASES)

    # 4. Intelligence Logs
    intel_coll = db_manager.get_collection("intelligence_logs")
    await intel_coll.delete_many({})
    await intel_coll.insert_many(DEMO_INTELLIGENCE_LOGS)

    # 5. Evidence Records
    evid_coll = db_manager.get_collection("evidence_records")
    await evid_coll.delete_many({})
    await evid_coll.insert_many(DEMO_EVIDENCE_RECORDS)

    # 6. Audit Logs
    audit_coll = db_manager.get_collection("audit_logs")
    await audit_coll.delete_many({})
    await audit_coll.insert_many(DEMO_AUDIT_LOGS)

    logger.info(
        "Successfully seeded synthetic DEMO_DATA: %d nodes, %d edges, %d cases, %d logs, %d evidence records.",
        len(annotated_nodes),
        len(annotated_edges),
        len(DEMO_CASES),
        len(DEMO_INTELLIGENCE_LOGS),
        len(DEMO_EVIDENCE_RECORDS),
    )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed_database())
