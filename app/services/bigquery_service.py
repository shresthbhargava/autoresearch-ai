"""
BigQuery Service
Stores session metadata, agent traces, confidence scores for explainability.
This is AutoResearch's "audit trail" — a major differentiator for judges.
"""
import os
import uuid
import json
from datetime import datetime
from typing import Optional, List

_bq_client = None

PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "your-project-id")
DATASET = os.environ.get("BQ_DATASET", "autoresearch")
TABLE_SESSIONS = f"{PROJECT_ID}.{DATASET}.sessions"
TABLE_TRACES = f"{PROJECT_ID}.{DATASET}.agent_traces"


def _get_client():
    global _bq_client
    if _bq_client is None:
        try:
            from google.cloud import bigquery
            _bq_client = bigquery.Client(project=PROJECT_ID)
        except Exception:
            return None
    return _bq_client


async def log_session(
    session_id: str,
    input_type: str,
    confidence: float,
    brd_title: str,
    gcs_uri: Optional[str],
    processing_time_ms: int
) -> Optional[str]:
    """Log BRD generation session to BigQuery."""
    client = _get_client()
    if not client:
        print("[BQ] No client - skipping log (dev mode)")
        return session_id

    try:
        row = {
            "session_id": session_id,
            "created_at": datetime.utcnow().isoformat(),
            "input_type": input_type,
            "confidence_score": confidence,
            "brd_title": brd_title,
            "gcs_uri": gcs_uri or "",
            "processing_time_ms": processing_time_ms,
        }
        errors = client.insert_rows_json(TABLE_SESSIONS, [row])
        if errors:
            print(f"[BQ] Insert errors: {errors}")
            return None
        return session_id
    except Exception as e:
        print(f"[BQ] Log session failed: {e}")
        return None


async def log_agent_trace(
    session_id: str,
    traces: List[dict]
) -> None:
    """Log agent reasoning steps for explainability dashboard."""
    client = _get_client()
    if not client:
        return

    try:
        rows = [
            {
                "session_id": session_id,
                "trace_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat(),
                "step": t.get("step", ""),
                "agent": t.get("agent", ""),
                "output_summary": t.get("output_summary", "")[:1000],
                "tokens_used": t.get("tokens_used", 0),
            }
            for t in traces
        ]
        errors = client.insert_rows_json(TABLE_TRACES, rows)
        if errors:
            print(f"[BQ] Trace insert errors: {errors}")
    except Exception as e:
        print(f"[BQ] Log trace failed: {e}")


async def get_session_analytics() -> List[dict]:
    """Query BigQuery for dashboard analytics."""
    client = _get_client()
    if not client:
        return []

    try:
        query = f"""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_sessions,
                AVG(confidence_score) as avg_confidence,
                AVG(processing_time_ms) as avg_processing_ms,
                COUNTIF(confidence_score > 0.7) as high_confidence_count
            FROM `{TABLE_SESSIONS}`
            GROUP BY date
            ORDER BY date DESC
            LIMIT 30
        """
        rows = client.query(query).result()
        return [dict(row) for row in rows]
    except Exception as e:
        print(f"[BQ] Analytics query failed: {e}")
        return []


# BigQuery table creation DDL (run once)
CREATE_TABLES_SQL = """
-- Sessions table
CREATE TABLE IF NOT EXISTS `{project}.{dataset}.sessions` (
    session_id STRING NOT NULL,
    created_at TIMESTAMP,
    input_type STRING,
    confidence_score FLOAT64,
    brd_title STRING,
    gcs_uri STRING,
    processing_time_ms INT64
);

-- Agent traces table (explainability)
CREATE TABLE IF NOT EXISTS `{project}.{dataset}.agent_traces` (
    session_id STRING NOT NULL,
    trace_id STRING,
    timestamp TIMESTAMP,
    step STRING,
    agent STRING,
    output_summary STRING,
    tokens_used INT64
);
""".format(project=PROJECT_ID, dataset=DATASET)
