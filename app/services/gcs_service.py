"""
Google Cloud Storage Service
Stores BRDs and uploaded files in GCS
"""
import os
import json
from datetime import datetime
from typing import Optional

# Lazy import so app works without GCS creds during dev
_gcs_client = None


def _get_client():
    global _gcs_client
    if _gcs_client is None:
        try:
            from google.cloud import storage
            _gcs_client = storage.Client()
        except Exception:
            return None
    return _gcs_client


BUCKET_NAME = os.environ.get("GCS_BUCKET", "autoresearch-ai-brd-store")


async def upload_brd(session_id: str, brd_data: dict) -> Optional[str]:
    """Upload generated BRD JSON to GCS. Returns gs:// URI."""
    client = _get_client()
    if not client:
        print("[GCS] No client - skipping upload (dev mode)")
        return None

    try:
        bucket = client.bucket(BUCKET_NAME)
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        blob_name = f"brds/{session_id}/{timestamp}_brd.json"
        blob = bucket.blob(blob_name)

        blob.upload_from_string(
            json.dumps(brd_data, indent=2),
            content_type="application/json"
        )
        uri = f"gs://{BUCKET_NAME}/{blob_name}"
        print(f"[GCS] Uploaded BRD: {uri}")
        return uri

    except Exception as e:
        print(f"[GCS] Upload failed: {e}")
        return None


async def upload_file(session_id: str, filename: str, file_bytes: bytes, mime_type: str) -> Optional[str]:
    """Upload raw input file to GCS for audit trail."""
    client = _get_client()
    if not client:
        return None

    try:
        bucket = client.bucket(BUCKET_NAME)
        blob_name = f"inputs/{session_id}/{filename}"
        blob = bucket.blob(blob_name)
        blob.upload_from_string(file_bytes, content_type=mime_type)
        return f"gs://{BUCKET_NAME}/{blob_name}"
    except Exception as e:
        print(f"[GCS] File upload failed: {e}")
        return None


async def get_brd(session_id: str) -> Optional[dict]:
    """Retrieve the latest BRD for a session."""
    client = _get_client()
    if not client:
        return None

    try:
        bucket = client.bucket(BUCKET_NAME)
        blobs = list(client.list_blobs(BUCKET_NAME, prefix=f"brds/{session_id}/"))
        if not blobs:
            return None
        latest = sorted(blobs, key=lambda b: b.name)[-1]
        return json.loads(latest.download_as_text())
    except Exception as e:
        print(f"[GCS] Get BRD failed: {e}")
        return None
