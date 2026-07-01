"""
MediTwin AI — FastAPI Backend
Run from the backend/ directory:
  uvicorn main:app --reload --port 8000
"""
from __future__ import annotations
import os, logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("meditwin")

# Import routers AFTER load_dotenv so env vars are available
from routers import auth, health, ai, reports, triage, family, timemachine, preventive, ml, demo, story, parallel, wearable, population, federated
import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    logger.info("🗄️  SQLite database ready (backend/meditwin.db)")
    logger.info("🧬 MediTwin AI starting — clinical risk engine ready (FINDRISC/Framingham/WHO, no pre-training needed)")
    logger.info("✅ Ready on http://localhost:8000  |  Docs: http://localhost:8000/docs")
    yield
    logger.info("🔻 MediTwin AI shutting down")


app = FastAPI(
    title="MediTwin AI",
    description="AI-powered Digital Health Twin Platform — Groq openai/gpt-oss-120b",
    version="1.0.0",
    lifespan=lifespan,
)

ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,    prefix="/api/v1/auth",    tags=["Auth"])
app.include_router(health.router,  prefix="/api/v1/health",  tags=["Health"])
app.include_router(ai.router,      prefix="/api/v1/ai",      tags=["AI Engine"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(triage.router,  prefix="/api/v1/triage",  tags=["Triage"])
app.include_router(family.router,     prefix="/api/v1/family",     tags=["Module 1: Family Health Twin"])
app.include_router(timemachine.router,prefix="/api/v1/timemachine",tags=["Module 2: Health Time Machine"])
app.include_router(preventive.router, prefix="/api/v1/preventive", tags=["Module 3: Preventive Impact"])
app.include_router(ml.router,         prefix="/api/v1/ml",         tags=["ML Validation Engine (Real Trained Models + SHAP)"])
app.include_router(demo.router,       prefix="/api/v1/demo",        tags=["Demo Mode"])
app.include_router(story.router,      prefix="/api/v1/story",       tags=["Story Mode"])
app.include_router(parallel.router,   prefix="/api/v1/parallel",    tags=["Parallel Universe Simulator"])
app.include_router(wearable.router,   prefix="/api/v1/wearable",    tags=["Wearable Digital Twin"])
app.include_router(population.router, prefix="/api/v1/population",  tags=["Population Health Intelligence"])
app.include_router(federated.router,  prefix="/api/v1/federated",   tags=["Federated Learning"])

from routers import consensus
app.include_router(consensus.router,  prefix="/api/v1/consensus",   tags=["Multi-Agent Specialist Consensus"])


@app.get("/")
async def root() -> dict:
    return {
        "service": "MediTwin AI",
        "version": "1.0.0",
        "status":  "operational",
        "model":   os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),
        "docs":    "http://localhost:8000/docs",
    }


@app.get("/health")
async def health_check() -> dict:
    return {"status": "healthy"}
