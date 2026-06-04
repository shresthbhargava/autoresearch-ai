"""
Gemini AI Service
Handles text, image, and document processing via Gemini 1.5 Pro
"""

import os
import base64
import json
from typing import Optional
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import traceback
import os

print("GEMINI KEY FOUND:", bool(os.getenv("GEMINI_API_KEY")))
print("KEY PREFIX:", os.getenv("GEMINI_API_KEY", "")[:10])
print("KEY =", os.getenv("GEMINI_API_KEY"))
print("GOOGLE_API_KEY =", os.getenv("GOOGLE_API_KEY"))
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Use gemini-1.5-pro for multimodal support
model = genai.GenerativeModel(
    model_name="gemini-2.5-pro",
    safety_settings={
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    }
)

EXTRACT_PROMPT = """You are a business analyst AI. Extract ALL key information from the following input.

Return ONLY valid JSON with this structure:
{
  "business_name": "string or null",
  "problem_statement": "string",
  "target_users": ["list of user types"],
  "proposed_solution": "string",
  "key_features": ["list of features"],
  "tech_stack": ["list of technologies"],
  "market_size": "string or null",
  "competitors": ["list or empty"],
  "business_model": "string or null",
  "success_metrics": ["list"],
  "risks": ["list"],
  "confidence": 0.0
}

Set confidence (0-1) based on how much usable information was found.
Input: {content}"""

BRD_PROMPT = """You are a Senior Product Manager. Generate a complete, professional BRD.

Based on this extracted data: {extracted_data}

Return ONLY valid JSON with this BRD structure:
{
  "title": "BRD: [Project Name]",
  "version": "1.0",
  "date": "[today]",
  "executive_summary": "2-3 sentence summary",
  "problem_statement": {
    "current_situation": "string",
    "pain_points": ["list"],
    "impact": "string"
  },
  "objectives": ["list of SMART objectives"],
  "scope": {
    "in_scope": ["list"],
    "out_of_scope": ["list"]
  },
  "stakeholders": [
    {"role": "string", "responsibility": "string"}
  ],
  "functional_requirements": [
    {"id": "FR-001", "requirement": "string", "priority": "High/Medium/Low"}
  ],
  "non_functional_requirements": [
    {"id": "NFR-001", "requirement": "string", "category": "Performance/Security/Scalability"}
  ],
  "user_stories": [
    {"id": "US-001", "as_a": "string", "i_want": "string", "so_that": "string", "acceptance_criteria": ["list"]}
  ],
  "technical_architecture": {
    "overview": "string",
    "components": ["list"],
    "data_flow": "string",
    "tech_stack": ["list"]
  },
  "success_metrics": [
    {"metric": "string", "target": "string", "measurement": "string"}
  ],
  "risks": [
    {"risk": "string", "probability": "High/Medium/Low", "impact": "High/Medium/Low", "mitigation": "string"}
  ],
  "timeline": [
    {"phase": "string", "duration": "string", "deliverables": ["list"]}
  ],
  "overall_confidence": 0.0
}"""


async def extract_information(content: str, input_type: str, filename: Optional[str] = None) -> dict:
    """Extract structured information from any input type."""
    try:
        if input_type == "image":
            # Decode base64 image
            image_data = base64.b64decode(content)
            image_part = {
                "mime_type": _get_mime_type(filename or "image.jpg"),
                "data": image_data
            }
            prompt = f"Extract ALL business/startup information from this image. {EXTRACT_PROMPT.format(content='[see image above]')}"
            response = model.generate_content([prompt, image_part])
        elif input_type == "pdf":
            # For PDFs, decode base64 and send as document
            pdf_data = base64.b64decode(content)
            pdf_part = {
                "mime_type": "application/pdf",
                "data": pdf_data
            }
            prompt = EXTRACT_PROMPT.format(content="[see PDF document above]")
            response = model.generate_content([prompt, pdf_part])
        else:
            # Plain text or URL content
            prompt = EXTRACT_PROMPT.format(content=content[:8000])
            response = model.generate_content(prompt)

        raw = response.text.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
                
        print("========== GEMINI RAW ==========")
        print(raw)
        print("================================")        
        return json.loads(raw.strip())

    except Exception as e:
        return {
            "problem_statement": content[:200],
            "key_features": [],
            "target_users": [],
            "proposed_solution": "Could not extract - check input",
            "confidence": 0.2,
            "error": str(e)
        }


async def generate_brd(extracted_data: dict) -> dict:
    try:
        prompt = BRD_PROMPT.replace(
            "{extracted_data}",
            json.dumps(extracted_data, indent=2)
        )

        response = model.generate_content(prompt)

        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        return json.loads(raw.strip())
    
    

    except Exception as e:
        print("===== FULL ERROR =====")
        traceback.print_exc()
        print("======================")
        return {
            "title": "BRD Generation Failed",
            "error": str(e),
            "overall_confidence": 0.0
        }


async def generate_brd_streaming(extracted_data: dict):
    prompt = BRD_PROMPT.replace(
        "{extracted_data}",
        json.dumps(extracted_data, indent=2)
    )

    response = model.generate_content(prompt, stream=True)

    for chunk in response:
        if chunk.text:
            yield chunk.text


def _get_mime_type(filename: str) -> str:
    ext = filename.lower().split(".")[-1]
    return {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
        "pdf": "application/pdf"
    }.get(ext, "image/jpeg")
