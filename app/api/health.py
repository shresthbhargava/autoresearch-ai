from fastapi import APIRouter
import os

router = APIRouter()

@router.get("/health")
async def health():
    return {
        "status": "ok",
        "gemini_key_set": bool(os.environ.get("GEMINI_API_KEY")),
        "gcs_bucket": os.environ.get("GCS_BUCKET", "not set"),
        "gcp_project": os.environ.get("GCP_PROJECT_ID", "not set"),
    }
