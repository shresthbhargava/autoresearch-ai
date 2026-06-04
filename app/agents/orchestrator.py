"""
Multi-Agent Orchestrator
Implements a LangGraph-style pipeline with explicit agent steps.
Each agent has a clear responsibility — this gives you the "explainable AI" story.

Pipeline:
  InputAgent → ExtractionAgent → EnrichmentAgent → BRDAgent → QualityAgent
"""
import uuid
import time
from typing import List, Tuple
from app.services import gemini_service
from app.models.schemas import AgentTrace


class AgentState:
    """Shared state passed between agents."""
    def __init__(self, session_id: str, raw_input: str, input_type: str):
        self.session_id = session_id
        self.raw_input = raw_input
        self.input_type = input_type
        self.extracted_data: dict = {}
        self.enriched_data: dict = {}
        self.brd: dict = {}
        self.quality_report: dict = {}
        self.traces: List[AgentTrace] = []
        self.filename: str = ""

    def add_trace(self, step: str, agent: str, summary: str, tokens: int = 0):
        self.traces.append(AgentTrace(
            step=step,
            agent=agent,
            output_summary=summary,
            tokens_used=tokens
        ))


async def run_pipeline(
    raw_input: str,
    input_type: str,
    filename: str = "",
    user_context: str = ""
) -> Tuple[dict, List[AgentTrace], str]:
    """
    Run the full multi-agent pipeline.
    Returns: (brd_dict, traces, session_id)
    """
    session_id = str(uuid.uuid4())[:8]
    state = AgentState(session_id, raw_input, input_type)
    state.filename = filename

    # ─── Agent 1: Input Validation ───────────────────────────────────────
    state.add_trace(
        step="1",
        agent="InputAgent",
        summary=f"Received {input_type} input. Length: {len(raw_input)} chars. Filename: {filename or 'N/A'}"
    )

    # ─── Agent 2: Information Extraction ─────────────────────────────────
    state.add_trace(
        step="2",
        agent="ExtractionAgent",
        summary="Sending to Gemini 1.5 Pro for structured information extraction..."
    )

    extracted = await gemini_service.extract_information(raw_input, input_type, filename)
    state.extracted_data = extracted

    confidence = extracted.get("confidence", 0.5)
    features = extracted.get("key_features", [])
    state.add_trace(
        step="2",
        agent="ExtractionAgent",
        summary=f"Extracted: problem='{extracted.get('problem_statement','?')[:80]}...', "
                f"{len(features)} features, confidence={confidence:.0%}"
    )

    # ─── Agent 3: Context Enrichment ─────────────────────────────────────
    enriched = dict(extracted)
    if user_context:
        enriched["user_provided_context"] = user_context

    # Add standard enrichment defaults if missing
    if not enriched.get("tech_stack"):
        enriched["tech_stack"] = ["Gemini 1.5 Pro", "Vertex AI", "Cloud Storage", "BigQuery", "FastAPI"]
    if not enriched.get("success_metrics"):
        enriched["success_metrics"] = ["BRD generation time < 60s", "Confidence score > 0.75", "User satisfaction > 4/5"]

    state.enriched_data = enriched
    state.add_trace(
        step="3",
        agent="EnrichmentAgent",
        summary=f"Enriched with defaults. Tech stack: {enriched.get('tech_stack', [])}. "
                f"User context appended: {bool(user_context)}"
    )

    # ─── Agent 4: BRD Generation ──────────────────────────────────────────
    state.add_trace(
        step="4",
        agent="BRDAgent",
        summary="Generating full BRD document via Gemini. Sections: Executive Summary, Problem, Scope, "
                "FR/NFR, User Stories, Architecture, Risks, Timeline..."
    )

    brd = await gemini_service.generate_brd(state.enriched_data)
    state.brd = brd

    fr_count = len(brd.get("functional_requirements", []))
    us_count = len(brd.get("user_stories", []))
    state.add_trace(
        step="4",
        agent="BRDAgent",
        summary=f"BRD generated: '{brd.get('title','?')}'. "
                f"{fr_count} functional requirements, {us_count} user stories."
    )

    # ─── Agent 5: Quality Check ───────────────────────────────────────────
    missing = []
    for field in ["executive_summary", "functional_requirements", "user_stories", "risks", "timeline"]:
        if not brd.get(field):
            missing.append(field)

    overall_confidence = brd.get("overall_confidence", confidence)
    quality_status = "PASS" if len(missing) == 0 and overall_confidence > 0.5 else "PARTIAL"

    state.quality_report = {
        "status": quality_status,
        "missing_sections": missing,
        "overall_confidence": overall_confidence
    }
    state.add_trace(
        step="5",
        agent="QualityAgent",
        summary=f"Quality check: {quality_status}. Missing sections: {missing or 'none'}. "
                f"Overall confidence: {overall_confidence:.0%}"
    )

    return state.brd, state.traces, session_id
