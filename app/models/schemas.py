from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class InputType(str, Enum):
    TEXT = "text"
    PDF = "pdf"
    IMAGE = "image"
    URL = "url"


class ResearchRequest(BaseModel):
    session_id: Optional[str] = None
    input_type: InputType = InputType.TEXT
    content: str  # text content or base64 encoded file
    filename: Optional[str] = None
    user_context: Optional[str] = None  # extra hints from user


class BRDSection(BaseModel):
    title: str
    content: str
    confidence: float  # 0-1, how confident the model is


class AgentTrace(BaseModel):
    step: str
    agent: str
    output_summary: str
    tokens_used: Optional[int] = None


class BRDResponse(BaseModel):
    session_id: str
    status: str
    brd: Optional[dict] = None
    agent_trace: List[AgentTrace] = []
    processing_time_ms: int
    gcs_uri: Optional[str] = None
    bigquery_row_id: Optional[str] = None


class SessionSummary(BaseModel):
    session_id: str
    created_at: str
    input_count: int
    brd_generated: bool
    overall_confidence: float
