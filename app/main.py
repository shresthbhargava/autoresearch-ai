from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import research, health

app = FastAPI(
    title="AutoResearch AI",
    description="Autonomous Research & BRD Generation Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(research.router, prefix="/api/research", tags=["research"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
