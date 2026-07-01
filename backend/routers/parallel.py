"""
MediTwin AI — Parallel Universe Health Simulator
═══════════════════════════════════════════════════════
Three simultaneous health futures, computed in parallel.

Timeline A: Status quo (no changes)
Timeline B: Lifestyle intervention (user-defined)
Timeline C: Medical intervention (aggressive treatment)

Each timeline is an independent call to TimeMachineService.project_yearly_trajectory()
with different lifestyle_overrides applied to the base profile.
═══════════════════════════════════════════════════════
"""
from __future__ import annotations
import copy
from typing import Any

from fastapi import APIRouter, Depends
from models.schemas import (
    ParallelSimRequest, ParallelSimResponse,
    TimelineConfig, TimelineResult, YearDataPoint,
)
from routers.auth import get_current_user
from services.groq_service import GroqService, get_groq_service
from services.time_machine_service import TimeMachineService, get_time_machine_service

router = APIRouter()

# Default 3-timeline configuration if client doesn't specify
DEFAULT_TIMELINES = [
    TimelineConfig(
        label="Timeline A — Status Quo",
        description="Current habits continue unchanged for 10 years.",
        color="#ff1744",
        lifestyle_overrides={},
    ),
    TimelineConfig(
        label="Timeline B — Lifestyle Shift",
        description="Better sleep, exercise, quit smoking. No medication.",
        color="#ff9100",
        lifestyle_overrides={
            "smoking": False,
            "sleep_hours": 8.0,
            "exercise_days_per_week": 4,
            "diet_quality": 8,
            "stress_level": 5,
            "alcohol_units_per_week": 2,
        },
    ),
    TimelineConfig(
        label="Timeline C — Full Intervention",
        description="Lifestyle shift + medical treatment + monitoring.",
        color="#00ff9d",
        lifestyle_overrides={
            "smoking": False,
            "sleep_hours": 8.0,
            "exercise_days_per_week": 5,
            "diet_quality": 9,
            "stress_level": 3,
            "alcohol_units_per_week": 0,
            "hydration_liters": 2.5,
        },
    ),
]


def _apply_overrides(profile: dict[str, Any], overrides: dict[str, Any]) -> dict[str, Any]:
    """Deep-copies profile and applies lifestyle overrides."""
    p = copy.deepcopy(profile)
    lif = p.get("lifestyle", {})
    for key, val in overrides.items():
        lif[key] = val
    p["lifestyle"] = lif
    v = p.get("vitals", {})
    if v.get("height") and v.get("weight"):
        v["bmi"] = round(v["weight"] / ((v["height"] / 100) ** 2), 1)
    p["vitals"] = v
    return p


def _yearly_to_schema(pts: list[dict]) -> list[YearDataPoint]:
    return [
        YearDataPoint(
            year=pt["year"], age=pt["age"],
            health_score=pt["health_score"],
            risks=pt["risks"],
            biological_age=pt["biological_age"],
        )
        for pt in pts
    ]


@router.post("/simulate", response_model=ParallelSimResponse)
async def parallel_simulate(
    body:  ParallelSimRequest,
    user:  dict               = Depends(get_current_user),
    tm:    TimeMachineService = Depends(get_time_machine_service),
    groq:  GroqService        = Depends(get_groq_service),
) -> ParallelSimResponse:
    """
    Computes 2–3 parallel health trajectories simultaneously.
    Returns year-by-year risk trajectories for all timelines,
    enabling the side-by-side chart visualization.
    """
    profile = body.base_profile.model_dump()
    profile["vitals"]["bmi"] = round(
        profile["vitals"]["weight"] / ((profile["vitals"]["height"] / 100) ** 2), 1
    )

    timelines = body.timelines if body.timelines else DEFAULT_TIMELINES

    results: list[TimelineResult] = []
    for i, tl in enumerate(timelines[:3]):
        modified = _apply_overrides(profile, tl.lifestyle_overrides)
        with_prev = len(tl.lifestyle_overrides) > 0
        trajectory_raw = tm.project_yearly_trajectory(modified, body.years, with_prevention=with_prev)
        endpoint = trajectory_raw[-1] if trajectory_raw else {}
        results.append(TimelineResult(
            timeline_id=i,
            label=tl.label,
            description=tl.description,
            color=tl.color,
            trajectory=_yearly_to_schema(trajectory_raw),
            endpoint_summary={
                "health_score":    endpoint.get("health_score", 0),
                "biological_age":  endpoint.get("biological_age", 0),
                "top_risk":        max(endpoint.get("risks", {}).items(), key=lambda x: x[1], default=("None", 0)),
            },
        ))

    name = profile.get("name", "Patient")
    age  = profile.get("age", 35)
    sq_score  = results[0].endpoint_summary.get("health_score", 0) if results else 0
    pv_score  = results[-1].endpoint_summary.get("health_score", 0) if results else 0
    prompt = (
        f"MediTwin Parallel Universe: {name}, {age}y. Three {body.years}-year futures computed. "
        f"Timeline A (status quo): Health Score {sq_score}/100. "
        f"Timeline C (full intervention): Health Score {pv_score}/100. "
        f"Gap: {pv_score - sq_score} points. "
        "Write 2 cinematic sentences: the story of the fork in the road. "
        "Specific, human, powerful. Max 60 words."
    )
    try:
        narrative, _ = await groq.chat([{"role": "user", "content": prompt}], max_tokens=120)
    except Exception:
        narrative = (
            f"At {age + body.years}, {name} faces three completely different lives — "
            f"all of them determined by choices made today. "
            f"The gap between Timeline A and Timeline C: {pv_score - sq_score} health score points, "
            f"and every year of biological age that separates them."
        )

    return ParallelSimResponse(
        patient_name=name,
        patient_age=age,
        timelines=results,
        ai_narrative=narrative,
    )
