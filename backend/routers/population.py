"""
MediTwin AI — Population Health Intelligence Router
═══════════════════════════════════════════════════════
Scales MediTwin from individual predictions to regional intelligence.
Uses synthetic-but-realistic India district health data derived from
ICMR-INDIAB 2023 and National Family Health Survey (NFHS-5) patterns.

The data is clearly labeled synthetic/illustrative.
═══════════════════════════════════════════════════════
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, Query
from models.schemas import DistrictHealthData, PopHealthResponse
from routers.auth import get_current_user

router = APIRouter()

# Synthetic India district data (ICMR-INDIAB 2023 / NFHS-5 pattern basis)
# Each entry: district, state, lat, lng, diabetes%, hypertension%, heart%, population, alert_code
_DISTRICT_DATA = [
    ("Chennai", "Tamil Nadu",        13.09, 80.28, 26.3, 38.1, 14.2, 7200000, "HIGH_DM"),
    ("Coimbatore", "Tamil Nadu",     11.00, 76.97, 23.1, 35.2, 12.8, 3460000, None),
    ("Madurai", "Tamil Nadu",        9.93,  78.12, 21.4, 33.8, 11.6, 3040000, None),
    ("Mumbai", "Maharashtra",        19.08, 72.88, 18.6, 31.4, 13.1, 20700000, "URBAN_STRESS"),
    ("Pune", "Maharashtra",          18.52, 73.86, 17.2, 29.6, 11.4, 3130000, None),
    ("Nagpur", "Maharashtra",        21.14, 79.09, 15.8, 28.4, 10.2, 2890000, None),
    ("Ahmedabad", "Gujarat",         23.03, 72.58, 19.4, 32.8, 12.6, 7600000, None),
    ("Surat", "Gujarat",             21.17, 72.83, 16.2, 28.1, 10.8, 6100000, None),
    ("New Delhi", "Delhi",           28.70, 77.10, 20.4, 35.6, 14.8, 10900000, "AIR_QUALITY"),
    ("Bengaluru", "Karnataka",       12.97, 77.59, 17.8, 30.2, 11.6, 8440000, "SEDENTARY"),
    ("Mysuru", "Karnataka",          12.30, 76.64, 14.6, 26.4, 9.8, 1010000, None),
    ("Hyderabad", "Telangana",       17.38, 78.47, 22.6, 36.4, 13.8, 9630000, "HIGH_DM"),
    ("Visakhapatnam", "AP",          17.68, 83.22, 18.4, 30.1, 11.2, 2040000, None),
    ("Jaipur", "Rajasthan",          26.90, 75.80, 13.6, 26.8, 9.4, 3070000, None),
    ("Kolkata", "West Bengal",       22.57, 88.36, 16.8, 31.4, 12.2, 4500000, None),
    ("Thiruvananthapuram", "Kerala", 8.52,  76.94, 21.8, 34.6, 13.4, 1680000, "HIGH_DM"),
    ("Chandigarh", "Punjab",         30.73, 76.78, 14.4, 30.8, 11.8, 1060000, None),
    ("Ludhiana", "Punjab",           30.90, 75.86, 13.8, 29.6, 10.6, 1620000, None),
    ("Lucknow", "Uttar Pradesh",     26.84, 80.94, 11.2, 24.6, 8.4, 3400000, None),
    ("Kanpur", "Uttar Pradesh",      26.45, 80.33, 10.8, 23.4, 8.0, 2920000, None),
]

_ALERT_MESSAGES = {
    "HIGH_DM":     "Diabetes prevalence >20% — population screening recommended",
    "URBAN_STRESS":"Elevated stress-related cardiac risk — urban lifestyle advisory",
    "AIR_QUALITY": "Respiratory risk elevated — pollution correlates with +11% admission forecast",
    "SEDENTARY":   "Low physical activity index — preventive intervention opportunity",
}

def _risk_index(dm: float, htn: float, heart: float) -> float:
    """Composite risk index 0-100."""
    return round(min(100, dm * 1.8 + htn * 1.2 + heart * 1.5), 1)


@router.get("/districts", response_model=PopHealthResponse)
async def get_district_data(
    state: str = Query("all", description="Filter by state name or 'all'"),
    user:  dict = Depends(get_current_user),
) -> PopHealthResponse:
    """
    Returns synthetic population health data for Indian districts.
    Each district has disease prevalence rates and a composite risk index.
    """
    rows = _DISTRICT_DATA
    if state.lower() != "all":
        rows = [r for r in rows if r[1].lower() == state.lower()]

    districts = [
        DistrictHealthData(
            district=r[0], state=r[1], lat=r[2], lng=r[3],
            diabetes_prev=r[4], hypertension_prev=r[5], heart_prev=r[6],
            risk_index=_risk_index(r[4], r[5], r[6]),
            population=r[7],
            alert=_ALERT_MESSAGES.get(r[8]) if r[8] else None,
        )
        for r in rows
    ]

    nat_avg = {
        "diabetes":    round(sum(d.diabetes_prev    for d in districts) / len(districts), 1),
        "hypertension":round(sum(d.hypertension_prev for d in districts) / len(districts), 1),
        "heart":       round(sum(d.heart_prev        for d in districts) / len(districts), 1),
    }

    top_alerts = [
        f"{d.district} ({d.state}): {d.alert}"
        for d in sorted(districts, key=lambda x: x.risk_index, reverse=True)
        if d.alert
    ][:5]

    resource_gaps = [
        "Tamil Nadu & Telangana: Diabetes screening capacity insufficient for current prevalence",
        "Delhi NCR: Air quality intervention reduces projected respiratory admissions by ~11%",
        "Maharashtra urban centres: Cardiac rehab capacity below projected demand by 2028",
        "Kerala: Despite high DM prevalence, strong primary care coverage — model for other states",
    ]

    return PopHealthResponse(
        districts=districts,
        national_avg=nat_avg,
        top_alerts=top_alerts,
        resource_gaps=resource_gaps,
    )


@router.get("/alerts")
async def get_health_alerts(user: dict = Depends(get_current_user)) -> dict:
    """Returns active population health alerts with escalation levels."""
    return {
        "active_alerts": [
            {"level": "HIGH",   "district": "Chennai",     "type": "Diabetes Surge",
             "message": "Diabetes prevalence 26.3% — exceeds national average by 40%",
             "action": "Deploy mobile screening units to ward 12-18"},
            {"level": "HIGH",   "district": "Hyderabad",   "type": "Cardiac Risk",
             "message": "Dual burden: high diabetes + hypertension convergence",
             "action": "Increase cardiology outpatient capacity by 15%"},
            {"level": "MEDIUM", "district": "New Delhi",   "type": "Air Quality",
             "message": "AQI forecast >300 — expected +11% respiratory admissions",
             "action": "Pre-alert emergency departments; stock bronchodilators"},
            {"level": "MEDIUM", "district": "Bengaluru",   "type": "Sedentary Risk",
             "message": "Tech-sector workforce: <12% meeting exercise guidelines",
             "action": "Corporate wellness partnership opportunity identified"},
            {"level": "LOW",    "district": "Kerala State","type": "Best Practice",
             "message": "Kerala primary care model reducing DM complications by 28%",
             "action": "Replicate protocol in Maharashtra and Tamil Nadu"},
        ],
        "generated_at": "2026-06-30T00:00:00Z",
        "data_basis":   "Synthetic — ICMR-INDIAB 2023 pattern basis. For demonstration only.",
    }
