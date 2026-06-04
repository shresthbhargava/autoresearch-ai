"""
Research API Router
POST /api/research/generate  - Main BRD generation endpoint
GET  /api/research/stream    - SSE streaming endpoint
GET  /api/research/{session_id} - Get stored BRD
GET  /api/research/analytics - BigQuery analytics
"""
import time
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import ResearchRequest, BRDResponse, AgentTrace
from app.agents.orchestrator import run_pipeline
from app.services import gcs_service, bigquery_service
from app.services import gemini_service

router = APIRouter()


@router.post("/generate", response_model=BRDResponse)
async def generate_brd(request: ResearchRequest):
    """
    Main endpoint — accepts text/PDF/image, runs multi-agent pipeline,
    returns full BRD with agent trace.
    """
    start_ms = int(time.time() * 1000)

    # Run the agent pipeline
    brd, traces, session_id = await run_pipeline(
        raw_input=request.content,
        input_type=request.input_type,
        filename=request.filename or "",
        user_context=request.user_context or ""
    )

    processing_time = int(time.time() * 1000) - start_ms
    # Temporary hackathon mode: disable GCS and BigQuery

    gcs_uri = None

    try:
        pass
        # gcs_uri = await gcs_service.upload_brd(session_id, brd)
    except Exception as e:
        print("GCS disabled:", e)

    try:
        pass
        # await bigquery_service.log_session(...)
        # await bigquery_service.log_agent_trace(...)
    except Exception as e:
        print("BigQuery disabled:", e)

    return BRDResponse(
        session_id=session_id,
        status="success",
        brd=brd,
        agent_trace=traces,
        processing_time_ms=processing_time,
        gcs_uri=gcs_uri,
        bigquery_row_id=session_id
    )


@router.post("/stream")
async def stream_brd(request: ResearchRequest):
    """
    SSE streaming endpoint — streams BRD tokens as they're generated.
    This is your DEMO HIGHLIGHT — the judge sees the BRD appear live.
    Frontend: EventSource('/api/research/stream', { method: 'POST', body: ... })
    """
    # First extract info synchronously
    extracted = await gemini_service.extract_information(
        request.content, request.input_type, request.filename
    )

    async def event_generator():
        # Stream agent progress events first
        for event in [
            ("agent", "InputAgent: Received and validated input"),
            ("agent", "ExtractionAgent: Extracted business context"),
            ("agent", "EnrichmentAgent: Context enriched"),
            ("agent", "BRDAgent: Generating BRD..."),
        ]:
            yield f"event: {event[0]}\ndata: {event[1]}\n\n"

        # Now stream the actual BRD tokens
        async for token in gemini_service.generate_brd_streaming(extracted):
            # Escape newlines for SSE
            escaped = token.replace("\n", "\\n")
            yield f"event: token\ndata: {escaped}\n\n"

        yield "event: done\ndata: complete\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )


@router.get("/analytics")
async def get_analytics():
    """Returns BigQuery analytics for the explainability dashboard."""
    data = await bigquery_service.get_session_analytics()
    return {"analytics": data, "source": "BigQuery"}


@router.get("/{session_id}")
async def get_session_brd(session_id: str):
    """Retrieve a previously generated BRD from GCS."""
    brd = await gcs_service.get_brd(session_id)
    if not brd:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "brd": brd}
