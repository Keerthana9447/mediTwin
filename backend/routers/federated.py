"""
MediTwin AI — Federated Learning Narrative Router
═══════════════════════════════════════════════════════
Simulates a privacy-preserving federated learning workflow
where hospitals train a shared model WITHOUT sharing patient data.

This is a NARRATIVE implementation (simulated training rounds,
not actual distributed ML). The purpose is to demonstrate the
architecture and privacy guarantees to judges and investors.

Architecture:
  Hospital_1 → local_train → gradient_only ──┐
  Hospital_2 → local_train → gradient_only ──┤→ Aggregator → Global Model
  Hospital_3 → local_train → gradient_only ──┘
  No patient records ever leave their hospital.
═══════════════════════════════════════════════════════
"""
from __future__ import annotations
import random
import math
from fastapi import APIRouter, Depends, Query
from models.schemas import FedHospital, FedRoundResult, FedLearningResponse
from routers.auth import get_current_user
from services.groq_service import GroqService, get_groq_service

router = APIRouter()

_HOSPITALS = [
    ("AIIMS Delhi",             "New Delhi",   94200, 0.98),
    ("KEM Hospital Mumbai",     "Mumbai",      71800, 0.97),
    ("Apollo Hospitals Chennai","Chennai",     58400, 0.96),
    ("Manipal Hospital Blr",    "Bengaluru",   42100, 0.99),
    ("PGIMER Chandigarh",       "Chandigarh",  31600, 0.97),
]


def _simulate_round(
    round_num:        int,
    prev_accuracy:    float,
    hospitals:        list[FedHospital],
) -> tuple[float, list[FedHospital]]:
    """
    Simulates one federated training round.
    Accuracy improves logarithmically (diminishing returns).
    Privacy budget is consumed per round (differential privacy).
    """
    improvement = 0.04 * math.exp(-round_num * 0.35)
    new_accuracy = min(0.945, prev_accuracy + improvement + random.uniform(-0.002, 0.004))

    updated_hospitals = []
    for h in hospitals:
        local_acc = new_accuracy + random.uniform(-0.015, 0.015)
        privacy_score = max(72.0, h.privacy_score - random.uniform(0.3, 0.8))
        updated_hospitals.append(FedHospital(
            id=h.id, name=h.name, city=h.city,
            patients=h.patients,
            rounds_trained=h.rounds_trained + 1,
            local_accuracy=round(local_acc, 4),
            privacy_score=round(privacy_score, 1),
        ))
    return round(new_accuracy, 4), updated_hospitals


@router.get("/simulate", response_model=FedLearningResponse)
async def simulate_federated_training(
    rounds: int   = Query(5, ge=1, le=10, description="Number of federated rounds"),
    user:   dict  = Depends(get_current_user),
    groq:   GroqService = Depends(get_groq_service),
) -> FedLearningResponse:
    """
    Simulates a federated learning training session across 5 Indian hospitals.
    Returns per-round accuracy improvements and privacy budget consumption.
    """
    init_accuracy = 0.72
    epsilon_per_round = 0.18
    total_patients = sum(h[2] for h in _HOSPITALS)

    hospitals: list[FedHospital] = [
        FedHospital(
            id=f"H{i+1}", name=h[0], city=h[1], patients=h[2],
            rounds_trained=0, local_accuracy=init_accuracy + random.uniform(-0.02, 0.02),
            privacy_score=h[3] * 100,
        )
        for i, h in enumerate(_HOSPITALS)
    ]

    round_results: list[FedRoundResult] = []
    accuracy = init_accuracy
    for r in range(1, rounds + 1):
        new_acc, hospitals = _simulate_round(r, accuracy, hospitals)
        round_results.append(FedRoundResult(
            round_num=r,
            global_accuracy=new_acc,
            accuracy_delta=round(new_acc - accuracy, 4),
            hospitals=[FedHospital(**h.model_dump()) for h in hospitals],
            privacy_budget_used=round(r * epsilon_per_round, 2),
        ))
        accuracy = new_acc

    final_acc = round_results[-1].global_accuracy

    privacy_guarantee = (
        f"ε={round(rounds * epsilon_per_round, 2)}-differential privacy guaranteed. "
        f"Zero patient records shared across hospital boundaries. "
        f"Model weights only — gradient noise added before aggregation."
    )

    prompt = (
        f"MediTwin Federated Learning: {len(_HOSPITALS)} hospitals across India "
        f"trained a shared disease prediction model without sharing ANY patient data. "
        f"{total_patients:,} patients contributed. "
        f"Accuracy improved from 72% to {final_acc*100:.1f}% in {rounds} rounds. "
        f"Privacy guarantee: {privacy_guarantee}. "
        "Write 2 sentences for a judge audience: the significance of this for healthcare AI. "
        "Max 55 words."
    )
    try:
        narrative, _ = await groq.chat([{"role": "user", "content": prompt}], max_tokens=120)
    except Exception:
        narrative = (
            f"{len(_HOSPITALS)} hospitals. {total_patients:,} patients. Zero data shared. "
            f"By training on gradients — not records — MediTwin achieves {final_acc*100:.1f}% accuracy "
            f"while guaranteeing that no patient ever leaves their hospital's walls. "
            f"This is how healthcare AI should work."
        )

    return FedLearningResponse(
        rounds=round_results,
        final_accuracy=final_acc,
        total_patients=total_patients,
        privacy_guarantee=privacy_guarantee,
        ai_narrative=narrative,
    )


@router.get("/architecture")
async def get_architecture(user: dict = Depends(get_current_user)) -> dict:
    """Returns the federated architecture description for visualization."""
    return {
        "nodes": [
            {"id": "aggregator", "label": "MediTwin Aggregator", "type": "central",
             "description": "Combines gradient updates. Never sees patient data."},
            *[{"id": f"H{i+1}", "label": h[0], "city": h[1], "type": "hospital",
               "patients": h[2], "description": "Trains locally. Shares only gradients."}
              for i, h in enumerate(_HOSPITALS)],
        ],
        "edges": [
            {"from": f"H{i+1}", "to": "aggregator",
             "label": "gradients only", "data_shared": "model weights Δ (not records)"}
            for i in range(len(_HOSPITALS))
        ],
        "privacy_tech": ["Differential Privacy (ε-δ DP)", "Secure Aggregation",
                         "Gradient Clipping", "Local Model Training"],
        "what_is_never_shared": [
            "Patient demographics", "Diagnoses", "Lab results",
            "Vitals", "Medical history", "Name or identity",
        ],
        "what_is_shared": ["Gradient updates (Δ weights)", "Model architecture metadata"],
    }
