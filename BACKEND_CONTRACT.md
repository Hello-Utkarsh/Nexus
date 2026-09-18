# CHAKRAVYUH-OS: Backend Interface Contract & Integration Guide

**Author**: Antigravity Client Architecture Team  
**Target Backend Engineer**: Utkarsh  
**Stack**: FastAPI (Python 3.10+) + MongoDB  
**Default Host**: `http://localhost:8000`  
**Frontend Timeout Safeguard**: `2500ms` (automatic fallback to airgapped tactical dataset if offline)

---

## 1. Quick Start (FastAPI Setup in 5 Minutes)

### CORS Configuration
Ensure FastAPI allows Next.js requests from `http://localhost:3000`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CHAKRAVYUH Intelligence Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 2. API Endpoints Specification

### Endpoint 1: Health & Telemetry Status
- **Route**: `GET /api/v1/health`
- **Purpose**: Polled by frontend telemetry badge to toggle `● LIVE BACKEND CONNECTED (MongoDB/FastAPI)`.
- **Response Schema (`200 OK`)**:
```json
{
  "status": "ONLINE",
  "timestamp": "2026-09-18T18:45:00.000Z",
  "database": "connected",
  "version": "1.0.0",
  "activeWorkers": 4
}
```

---

### Endpoint 2: Syndicate Graph Topology
- **Route**: `GET /api/v1/graph`
- **Purpose**: Supplies full entity node list, directional relationship vectors, community clusters, and graph density metrics to the interactive 2D Network Workbench.
- **Response Schema (`200 OK`)**:
```json
{
  "nodes": [
    {
      "id": "ent-vicky",
      "type": "person",
      "name": "Vikramaditya @ Vicky Kashi",
      "aliases": ["Pandit Ji", "VK-7"],
      "confidence": 0.98,
      "role": "High Network Influence / Central Facilitator",
      "community": 1,
      "communityName": "Coordination Cell",
      "flaggedSignal": "High Betweenness Centrality (0.94)",
      "metrics": {
        "degree": 24,
        "betweenness": 0.942,
        "pageRank": 0.285,
        "inDegree": 19,
        "outDegree": 5
      },
      "sourceIds": ["evid-fir-1", "evid-cdr-1"],
      "telecom": {
        "imei": "864291040819284",
        "linkedMsisdns": ["+91-98110-23910"],
        "callCount": 142,
        "activeTower": "Tower-VNS-71 (Assi)"
      },
      "financial": {
        "accountNumber": "91828400192",
        "bankName": "Axis Bank",
        "inflow": 4250000,
        "outflow": 1850000
      },
      "firstSeen": "2026-08-12",
      "lastSeen": "2026-09-15"
    }
  ],
  "links": [
    {
      "id": "rel-01",
      "source": "ent-vicky",
      "target": "ent-purvanchal",
      "type": "association",
      "label": "Beneficial Owner / Direct Controller",
      "confidence": 0.96,
      "timestamp": "2026-08-14",
      "sourceIds": ["evid-fir-1"]
    },
    {
      "id": "rel-03",
      "source": "ent-vicky",
      "target": "ent-tariq",
      "type": "financial",
      "label": "Hawala Layering Directive",
      "confidence": 0.94,
      "amount": 4250000,
      "timestamp": "2026-09-14",
      "sourceIds": ["evid-cdr-1"]
    }
  ],
  "clusters": [
    { "id": 1, "name": "Coordination Cell", "nodeCount": 8, "primaryRole": "Executive Command" },
    { "id": 2, "name": "Hawala Channel (UAE / Mumbai)", "nodeCount": 11, "primaryRole": "Layering & Settlement" },
    { "id": 3, "name": "Burner SIM Distribution (Cantt)", "nodeCount": 9, "primaryRole": "Telecom Obfuscation" }
  ],
  "metrics": {
    "density": 0.042,
    "totalRecords": 129,
    "totalNodes": 42,
    "totalLinks": 87,
    "averageDegree": 4.14
  }
}
```

---

### Endpoint 3: Intelligence & OSINT Feeds
- **Route**: `GET /api/v1/logs`
- **Purpose**: Powers the 3-Column SOCMINT & Dark Web OSINT Radar (`SocmintView.tsx`).
- **Response Schema (`200 OK`)**:
```json
{
  "incidents": [
    {
      "id": "soc-01",
      "platform": "Telegram Channel",
      "channelName": "Purvanchal Logistics Ops (Encrypted)",
      "handle": "@vicky_kashi_direct",
      "timestamp": "14 mins ago (18:34 IST)",
      "rawExcerpt": "Consignment confirmed for 50L delivery at Assi Ghat transit depot. Handover to Tariq courier post-midnight. Route cleared via Cantonment. Payment via Axis Bank #9182 token.",
      "highlightedEntities": ["50L delivery at Assi Ghat", "Axis Bank #9182", "Tariq courier"],
      "associatedNodeId": "ent-vicky",
      "associatedNodeName": "Vikramaditya @ Vicky Kashi",
      "threatRating": "CRITICAL",
      "riskScore": 94,
      "flaggedKeywords": ["#AssiGhatDepot", "#Hawala50L", "#TariqCourier"],
      "entityIdsToMap": ["ent-vicky", "ent-purvanchal", "ent-tariq"]
    }
  ],
  "count": 1,
  "timestamp": "2026-09-18T18:45:00.000Z"
}
```

---

### Endpoint 4: Shortest Path & Hawala Conduit Resolution
- **Route**: `POST /api/v1/path/resolve`
- **Purpose**: Computes Dijkstra shortest path, Hawala layering hop chain, and Section 63 BSA evidence links between any two target nodes.
- **Request Body (`application/json`)**:
```json
{
  "sourceId": "ent-vicky",
  "targetId": "ent-al-nahda",
  "maxHops": 5,
  "includeFinancialOnly": false
}
```
- **Response Schema (`200 OK`)**:
```json
{
  "path": ["ent-vicky", "ent-tariq", "ent-axis", "ent-al-nahda"],
  "totalHops": 2,
  "totalAmount": 4250000,
  "evidenceChain": [
    "GD-ENTRY-382-LANKA",
    "CDR-DUMP-71",
    "AXIS-STMT-9182",
    "WT-LOG-902-TAP"
  ]
}
```

---

### Endpoint 5: Audit Logs & Telemetry Ledger
- **Route**: `GET /api/v1/audit`
- **Purpose**: Powers the Super Admin Audit Dock (`AuditDock.tsx`).
- **Response Schema (`200 OK`)**:
```json
{
  "logs": [
    {
      "id": "log-001",
      "timestamp": "2026-09-18 18:48:12 IST",
      "officerId": "IPS-HQ-0102",
      "officerName": "DIG Vikramaditya Sen",
      "action": "Exported BNSS Dossier",
      "status": "200 OK",
      "severity": "SENSITIVE",
      "module": "Case Directives / BNSS 173",
      "details": "Generated complete syndicate evidentiary dossier for Special Court Session"
    }
  ],
  "totalQueries": 1
}
```

---

## 3. MongoDB Collection Mapping Reference

| MongoDB Collection | Python Pydantic Model | Primary Key | Key Query Index |
|---|---|---|---|
| `entities` | `class GraphNode(BaseModel)` | `id` (str) | `{ "type": 1, "community": 1 }` |
| `relationships` | `class GraphLink(BaseModel)` | `id` (str) | `{ "source": 1, "target": 1 }` |
| `intelligence_incidents` | `class Incident(BaseModel)` | `id` (str) | `{ "platform": 1, "threatRating": 1 }` |
| `audit_ledger` | `class AuditEntry(BaseModel)` | `id` (str) | `{ "timestamp": -1, "severity": 1 }` |

---

## 4. Frontend Failover Guarantee
If the FastAPI server is stopped or returns non-200 responses:
1. The frontend catches errors silently within 2500ms.
2. The UI switches the status badge to:  
   `● EMBEDDED INTEL CACHE (Airgapped Fallback)`
3. All views render the full synthetic intelligence dataset with zero white screens.
