"""
MediTwin AI — Wearable Digital Twin Router
═══════════════════════════════════════════════════════
Generates synthetic smartwatch data streams that simulate
continuous physiological monitoring. Uses a random-walk
algorithm grounded in the patient's clinical risk profile.

Anomaly detection triggers when any reading crosses a
clinically significant threshold — producing alerts that
feed into the Emergency Triage module.
═══════════════════════════════════════════════════════
"""
from __future__ import annotations
import random
import math
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends
from models.schemas import WearableReading, WearableStreamRequest
from routers.auth import get_current_user
from services.clinical_risk_service import ClinicalRiskService, get_clinical_risk_service

router = APIRouter()


def _base_hr(vitals: dict[str, Any], risks: dict[str, float]) -> int:
    """Derive baseline resting heart rate from clinical profile."""
    hr = vitals.get("heart_rate", 72)
    if risks.get("Stress Syndrome", 0) > 50:
        hr += random.randint(4, 10)
    if vitals.get("bmi", 25) > 28:
        hr += random.randint(2, 6)
    return max(50, min(110, hr))


def _generate_reading(
    base_hr: int,
    base_spo2: float,
    stress_base: int,
    steps_so_far: int,
    hour_of_day: int,
    is_active: bool,
    prev: WearableReading | None = None,
) -> WearableReading:
    """Generates one wearable reading using a correlated random walk."""
    if is_active:
        hr = base_hr + random.randint(20, 45)
    else:
        hr = base_hr + random.randint(-8, 8)
    if prev:
        hr = int(hr * 0.3 + prev.heart_rate * 0.7)
    hr = max(45, min(155, hr))

    spo2 = base_spo2 + random.uniform(-0.8, 0.4)
    if prev:
        spo2 = spo2 * 0.2 + prev.spo2 * 0.8
    spo2 = round(max(92, min(99.9, spo2)), 1)

    new_steps = steps_so_far
    if 7 <= hour_of_day <= 21:
        new_steps += random.randint(0, 180) if is_active else random.randint(0, 30)

    stress_drift = math.sin(hour_of_day / 24 * 2 * math.pi) * 15
    stress = int(stress_base + stress_drift + random.randint(-8, 8))
    if prev:
        stress = int(stress * 0.25 + prev.stress_score * 0.75)
    stress = max(0, min(100, stress))

    hrv = int(65 - stress * 0.4 + random.randint(-5, 5))
    hrv = max(15, min(120, hrv))

    skin_temp = 36.2 + random.uniform(-0.3, 0.3)
    if is_active:
        skin_temp += random.uniform(0.2, 0.8)
    skin_temp = round(skin_temp, 1)

    anomaly: str | None = None
    if hr > 130:
        anomaly = f"Elevated heart rate: {hr} bpm"
    elif spo2 < 94:
        anomaly = f"Low SpO2: {spo2}%"
    elif stress > 85:
        anomaly = "Critical stress level detected"
    elif hrv < 20:
        anomaly = f"Low HRV: {hrv}ms — possible cardiac strain"

    return WearableReading(
        timestamp=datetime.utcnow().isoformat(),
        heart_rate=hr,
        spo2=spo2,
        steps_today=new_steps,
        stress_score=stress,
        sleep_last_night=round(random.uniform(5.0, 8.5), 1),
        hrv_ms=hrv,
        skin_temp_c=skin_temp,
        anomaly=anomaly,
    )


@router.post("/stream")
async def generate_wearable_stream(
    body:     WearableStreamRequest,
    user:     dict                = Depends(get_current_user),
    clinical: ClinicalRiskService = Depends(get_clinical_risk_service),
) -> dict:
    """
    Generates a synthetic time-series of wearable readings.
    Each reading is clinically grounded in the patient's risk profile.
    """
    profile = body.base_profile.model_dump()
    v       = profile.get("vitals", {})
    lif     = profile.get("lifestyle", {})
    v["bmi"] = round(v.get("weight", 70) / ((v.get("height", 170) / 100) ** 2), 1)
    profile["vitals"] = v

    risks      = {r.disease: r.probability for r in clinical.predict_all_risks(profile)}
    base_hr    = _base_hr(v, risks)
    base_spo2  = v.get("spo2", 97.0)
    stress_base = int(lif.get("stress_level", 5) * 10)

    readings: list[dict] = []
    steps    = 0
    prev     = None
    hour_now = datetime.utcnow().hour

    n = min(body.duration_seconds, 120)
    for i in range(n):
        hour = (hour_now + i // 60) % 24
        is_active = random.random() < 0.25
        r = _generate_reading(base_hr, base_spo2, stress_base, steps, hour, is_active, prev)
        steps = r.steps_today
        prev  = r
        readings.append(r.model_dump())

    alerts = [r["anomaly"] for r in readings if r.get("anomaly")]
    return {
        "patient_name":    body.patient_name,
        "total_readings":  len(readings),
        "readings":        readings,
        "alerts":          list(dict.fromkeys(alerts)),
        "daily_steps":     steps,
        "avg_hr":          int(sum(r["heart_rate"] for r in readings) / len(readings)),
        "avg_spo2":        round(sum(r["spo2"] for r in readings) / len(readings), 1),
        "avg_stress":      int(sum(r["stress_score"] for r in readings) / len(readings)),
        "risk_context":    {d: round(p, 1) for d, p in risks.items()},
    }


@router.get("/live")
async def get_live_reading(
    user: dict = Depends(get_current_user),
) -> WearableReading:
    """Returns a single synthetic live wearable reading for polling-based live display."""
    hr      = random.randint(62, 88)
    spo2    = round(random.uniform(96.0, 99.0), 1)
    anomaly = "Elevated HR: consider rest" if hr > 95 else None
    return WearableReading(
        timestamp=datetime.utcnow().isoformat(),
        heart_rate=hr, spo2=spo2,
        steps_today=random.randint(1200, 8400),
        stress_score=random.randint(28, 65),
        sleep_last_night=round(random.uniform(5.5, 8.0), 1),
        hrv_ms=random.randint(32, 78),
        skin_temp_c=round(random.uniform(35.8, 36.9), 1),
        anomaly=anomaly,
    )
