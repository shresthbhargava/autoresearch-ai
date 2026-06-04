# 🔬 AutoResearch AI — Backend Setup Guide

## ⏱ Your 6-Hour Plan

| Time | Task |
|------|------|
| **Now → 30 min** | Set up env, install deps, run backend |
| **30 min → 1.5 hr** | Test APIs with Postman/curl |
| **1.5 → 3 hr** | Open frontend, test end-to-end BRD generation |
| **3 → 5 hr** | Polish demo, add your real data |
| **5 → 6 hr** | Rehearse demo script |

---

## Step 1 — Get Your Gemini API Key (5 min)

1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key

---

## Step 2 — Set Up Environment (10 min)

```bash
cd autoresearch

# Copy env template
cp .env.example .env

# Edit .env — add your GEMINI_API_KEY
nano .env   # or open in VS Code

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
# OR: venv\Scripts\activate      # Windows

# Install dependencies
pip install -r requirements.txt
```

---

## Step 3 — Run the Backend (2 min)

```bash
# From the autoresearch/ folder with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO: Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

---

## Step 4 — Test It (5 min)

**Health check:**
```bash
curl http://localhost:8000/api/health
```

**Generate a BRD (text input):**
```bash
curl -X POST http://localhost:8000/api/research/generate \
  -H "Content-Type: application/json" \
  -d '{
    "input_type": "text",
    "content": "Building an AI platform for automated research reports. Target users are business analysts who waste 3 hours daily compiling data from PDFs and websites. Our solution uses Gemini to extract insights and generate professional reports automatically.",
    "user_context": "Targeting enterprise B2B market, India and Southeast Asia"
  }'
```

You'll get back a full BRD JSON with agent trace.

---

## Step 5 — Open the Frontend (2 min)

Just open `frontend/index.html` in your browser. It talks directly to `localhost:8000`.

If you see CORS errors, the backend already has CORS enabled for all origins.

---

## Step 6 — GCS + BigQuery (Optional, for demo points)

These are gracefully disabled if not configured — the app works without them.

To enable:
1. Create a GCP project
2. Create a GCS bucket named `autoresearch-ai-brd-store`
3. Create a BigQuery dataset named `autoresearch`
4. Run the DDL in `app/services/bigquery_service.py` (the `CREATE_TABLES_SQL` at bottom)
5. Download a service account JSON, set `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check server + env vars |
| `/api/research/generate` | POST | Generate BRD (full JSON response) |
| `/api/research/stream` | POST | Stream BRD tokens (SSE) |
| `/api/research/{session_id}` | GET | Retrieve stored BRD from GCS |
| `/api/research/analytics` | GET | BigQuery analytics |

**Request body for `/generate`:**
```json
{
  "input_type": "text | pdf | image",
  "content": "text string OR base64 encoded file",
  "filename": "optional - for PDFs/images",
  "user_context": "optional extra hints"
}
```

---

## Project Structure

```
autoresearch/
├── app/
│   ├── main.py                    ← FastAPI app entry point
│   ├── api/
│   │   ├── health.py              ← Health check
│   │   └── research.py            ← Main BRD generation endpoints
│   ├── agents/
│   │   └── orchestrator.py        ← Multi-agent pipeline (5 agents)
│   ├── services/
│   │   ├── gemini_service.py      ← Gemini 1.5 Pro integration
│   │   ├── gcs_service.py         ← Google Cloud Storage
│   │   └── bigquery_service.py    ← BigQuery audit trail
│   └── models/
│       └── schemas.py             ← Pydantic models
├── frontend/
│   └── index.html                 ← Single-page frontend
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🎯 Mentor Questions You'll Be Ready For

**Q: How does the multi-agent system work?**
> "We have 5 specialized agents in a pipeline: InputAgent validates the input type, ExtractionAgent uses Gemini 1.5 Pro to extract structured business data from any modality, EnrichmentAgent fills gaps and adds defaults, BRDAgent generates the full document, and QualityAgent validates confidence scores. Each agent logs its reasoning to BigQuery — that's our explainability layer."

**Q: Why BigQuery?**
> "BigQuery stores every agent trace — inputs, confidence scores, extracted entities, processing time. This gives us a queryable audit trail. Any stakeholder can ask 'why did the system generate this requirement?' and we can show the exact agent reasoning. That's what makes our decisions explainable, not just accurate."

**Q: What's your multimodal pipeline?**
> "Gemini 1.5 Pro natively handles text, PDFs, and images in a single API call. We encode files as base64, pass them directly to Gemini with a structured extraction prompt, and get back JSON. No separate OCR pipeline, no preprocessing — Gemini handles it all."

**Q: How do you handle hallucination?**
> "Two ways: confidence scores (Gemini self-assesses certainty for each extraction), and the QualityAgent checks for missing required BRD sections before returning. Low-confidence outputs are flagged. We also store inputs in GCS so outputs are always traceable back to source material."

---

## 🏆 Demo Script (3 minutes)

**0:00 — Hook (20s)**
> "Every startup wastes weeks writing BRDs. AutoResearch AI does it in under 60 seconds from any input — text, PDF, even a screenshot of a whiteboard."

**0:20 — Live Demo (90s)**
1. Paste sample startup text into the frontend
2. Hit Generate
3. Watch the 5 agent steps light up green in real-time
4. Show the full BRD appearing — requirements, user stories, risks, timeline

**1:50 — Architecture (30s)**
> "Under the hood: Gemini 1.5 Pro for extraction and generation, Cloud Storage for every BRD stored as immutable artifact, BigQuery for our explainability audit trail — every agent reasoning step queryable."

**2:20 — Differentiation (30s)**
> "Three things set us apart: true multi-modal (not just text), explainable AI with full agent trace, and enterprise-ready output — not a summary, a full professional BRD."

**2:50 — Close (10s)**
> "We built this in 5 days. Here's what 5 weeks looks like..." [show roadmap slide]
