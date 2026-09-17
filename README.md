# CHAKRAVYUH 2.0
### AI-Powered Criminal Network Intelligence Platform

> **Turn fragmented intelligence into explainable networks of people, communications, money and locations.**

CHAKRAVYUH helps investigators connect structured and unstructured intelligence, discover hidden relationships, identify unusual patterns and trace every analytical finding back to its supporting evidence.

---

## 🚀 Core Intelligence Pipeline

```text
Fragmented Intelligence (FIR, CDR, Bank Ledgers)
        ↓
AI Entity Extraction (6 Standardized Entity Types)
        ↓
Entity Resolution (Multi-signal Candidate Matching)
        ↓
Relationship Discovery (5 Evidentiary Link Types)
        ↓
Interactive Knowledge Graph (HTML5 Canvas 60 FPS Engine)
        ↓
Explainable Pattern Detection (WHAT, WHY, EVIDENCE, ACTION)
        ↓
Evidence-Backed Insights & AI Copilot Decision Support
```

---

## ✨ Key Features

- **60 FPS Force-Directed Knowledge Graph:** Custom physics engine supporting inter-node repulsion (`-550`), collision damping (`40px`), smooth camera panning, and zooming (`0.3x` to `3.5x`).
- **Standardized Entity Schema:** 6 standardized entity types (`Person`, `Phone`, `Bank Account`, `Organization`, `Location`, `Vehicle`).
- **5 Evidentiary Relationship Types:** `Communication`, `Financial`, `Association`, `Location`, `Ownership`.
- **Entity Resolution Engine:** Candidate alias matching with multi-signal similarity breakdown (*Name 94%, Phone 100%, Location 81%, Context 88%*) and investigator controls (`[ Review ]`, `[ Link Entities ]`, `[ Ignore ]`).
- **Explainable Pattern Detection:** Heuristic anomaly detectors for circular hawala loops, off-hours communication bursts, multi-SIM hardware churn, and cross-community bridges with the **WHAT, WHY, EVIDENCE, CONFIDENCE, ACTION** framework.
- **Evidence Vault:** Filterable catalog of primary source records (FIR, CDR, Financial, Intel) with UTR/CDR citations.
- **Chronological Timeline Replay:** Replay scrubber tracking day-by-day network evolution with milestone stages.
- **AI Investigation Copilot:** Evidence-grounded assistant for interactive path queries, community analysis, and investigation summaries.
- **Investigation Analysis Report:** Court-admissible formal summary with entity centrality rankings, A4 print layout, and JSON export.
- **Modular FastAPI Backend:** Provider-agnostic service layer with REST endpoints for ingestion, extraction, resolution, and copilot queries.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Graph Engine:** Custom HTML5 Canvas 2D Force Physics Simulation + Monotone Chain Convex Hull algorithm
- **Backend:** FastAPI (Python 3.14), Pydantic, Uvicorn
- **Dataset:** Sanitized synthetic crime investigation dataset (*Case #382/2026*)

---

## 🏁 Quickstart Guide

### 1. Prerequisites
- **Node.js:** v18+ (v24 tested)
- **Python:** 3.11+ (3.14 tested)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Backend Setup
```bash
cd backend
python -m uvicorn main:app --port 8000
```
API Documentation (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ⚖️ Notice & Disclaimer
This repository is a prototype demonstration utilizing sanitized synthetic intelligence records (*Case #382/2026*). All identifiers, names, phone numbers, and accounts are fictional.
