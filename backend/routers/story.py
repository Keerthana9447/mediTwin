"""
MediTwin AI — Story Mode Router
═══════════════════════════════════════════════════════════════
Generates 5-act emotional health narratives for judge presentation.

Each act is a structured beat in the patient's health journey:
  Act 1 — Who They Are         (present-tense, human, vivid)
  Act 2 — The Warning Signs    (clinical signals in plain language)
  Act 3 — The Dark Future      (5-year status-quo with numbers)
  Act 4 — The Turning Point    (3 concrete interventions)
  Act 5 — The Future They Choose (5-year prevention scenario)
═══════════════════════════════════════════════════════════════
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Body, Depends
from routers.auth import get_current_user
from services.groq_service import GroqService, get_groq_service
from services.clinical_risk_service import ClinicalRiskService, get_clinical_risk_service
from services.time_machine_service import TimeMachineService, get_time_machine_service

router = APIRouter()

_ACT_TITLES = [
    "Who They Are",
    "The Warning Signs",
    "The Dark Future",
    "The Turning Point",
    "The Future They Choose",
]
_ACT_ICONS = ["👤", "⚠️", "📉", "💡", "🌟"]
_ACT_COLORS = ["#00e5ff", "#ff9100", "#ff1744", "#7c4dff", "#00ff9d"]


def _build_fallback_acts(
    profile: dict[str, Any],
    risks: list[Any],
    score: int,
    sq5: dict,
    pv5: dict,
) -> list[dict]:
    """Static fallback if Groq is unavailable during demo."""
    name = profile.get("name", "the patient")
    age  = profile.get("age", 35)
    v    = profile.get("vitals", {})
    lif  = profile.get("lifestyle", {})

    top = sorted(risks, key=lambda r: r.probability, reverse=True)
    top_disease  = top[0].disease   if top else "metabolic risk"
    top_risk_pct = top[0].probability if top else 38

    sq_score = sq5["future_health_score"]
    pv_score = pv5["future_health_score"]
    sq_age   = sq5["future_age"]

    sleep   = lif.get("sleep_hours", 6)
    stress  = lif.get("stress_level", 6)
    smoking = lif.get("smoking", False)

    texts = [
        # Act 1
        (
            f"{name} is {age}, driven and ambitious — "
            f"sleeping {sleep} hours, carrying a stress level of {stress}/10, "
            f"and running on the quiet assumption that their body will keep up indefinitely."
        ),
        # Act 2
        (
            f"The signals are already here: glucose at {v.get('glucose', 112)} mg/dL — borderline. "
            f"Blood pressure at {v.get('systolic_bp', 128)}/{v.get('diastolic_bp', 82)} — creeping upward. "
            f"{top_disease} risk at {top_risk_pct:.0f}%."
            + (" Smoking adds ~5 biological years on top of everything else." if smoking else "")
        ),
        # Act 3
        (
            f"In 5 years, if nothing changes: Health Score drops from {score} to {sq_score}/100. "
            f"{top_disease} risk reaches {min(top_risk_pct + 18, 92):.0f}%. "
            f"At age {sq_age}, the first prescription gets written. This is the preventable future."
        ),
        # Act 4
        (
            f"Three changes — not a lifestyle overhaul, just three changes. "
            f"Walk 10,000 steps daily. Sleep 8 hours. Halve refined sugar intake. "
            f"These three decisions take 45 extra minutes a day and the math is unambiguous."
        ),
        # Act 5
        (
            f"With those three habits sustained over 5 years: Health Score stays at {pv_score}/100. "
            f"{top_disease} risk stays below {max(top_risk_pct - 22, 10):.0f}%. "
            f"At age {pv5['future_age']}, {name} is not managing a chronic disease — they're preventing one. "
            f"That is the future MediTwin makes visible."
        ),
    ]
    return [
        {
            "act":   i + 1,
            "title": _ACT_TITLES[i],
            "icon":  _ACT_ICONS[i],
            "color": _ACT_COLORS[i],
            "text":  texts[i],
        }
        for i in range(5)
    ]


@router.post("/generate")
async def generate_story(
    profile: dict[str, Any]     = Body(...),
    user:    dict               = Depends(get_current_user),
    groq:    GroqService        = Depends(get_groq_service),
    clinical:ClinicalRiskService= Depends(get_clinical_risk_service),
    tm:      TimeMachineService = Depends(get_time_machine_service),
) -> dict:
    """
    Generates the full 5-act health story for Story Mode presentation.
    Falls back to rich static content if Groq is unavailable.
    """
    # Pre-compute BMI
    v = profile.get("vitals", {})
    ht = v.get("height", 170) or 170
    v["bmi"] = round(v.get("weight", 70) / ((ht / 100) ** 2), 1)
    profile["vitals"] = v

    # Compute risks and projections (all local — no external dependency)
    risks     = clinical.predict_all_risks(profile)
    score     = clinical.compute_health_score(profile)
    sq5       = tm.project(profile, 5, with_prevention=False)
    pv5       = tm.project(profile, 5, with_prevention=True)

    top_risks_sorted = sorted(risks, key=lambda r: r.probability, reverse=True)
    risk_str  = ", ".join(f"{r.disease}: {r.probability:.0f}%" for r in top_risks_sorted[:3])
    name      = profile.get("name", "Patient")
    age       = profile.get("age", 35)

    # Build context dict passed to Groq
    ctx: dict[str, Any] = {
        "name":        name,
        "age":         age,
        "health_score": score,
        "risks":       risk_str,
        "vitals":      v,
        "lifestyle":   profile.get("lifestyle", {}),
        "sq_score_5yr": sq5["future_health_score"],
        "pv_score_5yr": pv5["future_health_score"],
        "sq_age_5yr":   sq5["future_age"],
        "pv_age_5yr":   pv5["future_age"],
    }

    # Try Groq — fall back gracefully
    acts: list[dict] = []
    try:
        for act_num in range(1, 6):
            text = await groq.story_act(act_num, name, ctx)
            acts.append({
                "act":   act_num,
                "title": _ACT_TITLES[act_num - 1],
                "icon":  _ACT_ICONS[act_num - 1],
                "color": _ACT_COLORS[act_num - 1],
                "text":  text,
            })
    except Exception:
        acts = _build_fallback_acts(profile, top_risks_sorted, score, sq5, pv5)

    return {
        "patient_name":           name,
        "patient_age":            age,
        "health_score":           score,
        "top_risk":               {
            "disease":     top_risks_sorted[0].disease     if top_risks_sorted else "metabolic",
            "probability": top_risks_sorted[0].probability if top_risks_sorted else 38,
        },
        "status_quo_score_5yr":  sq5["future_health_score"],
        "prevention_score_5yr":  pv5["future_health_score"],
        "score_saved":           pv5["future_health_score"] - sq5["future_health_score"],
        "acts":                  acts,
    }
