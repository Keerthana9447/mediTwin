"""
MediTwin AI — Demo Mode Router
═══════════════════════════════════════════════════════════════
Provides 6 synthetic patient personas for hackathon demonstration.
Each patient highlights a different module's capability and is
designed for maximum emotional and clinical contrast.

Patients are crafted to showcase:
  arjun  → Health Time Machine (pre-diabetic trajectory)
  meena  → Family Twin (multi-generational cardiac risk)
  raj    → Preventive Impact ROI (smoker + lifestyle intervention)
  divya  → Report Analyzer (hidden abnormalities)
  suresh → Emergency Triage (critical multi-condition patient)
  ananya → Positive Prevention (low-risk, complacency warning)
═══════════════════════════════════════════════════════════════
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from routers.auth import get_current_user

router = APIRouter()

# ── 6 Synthetic Patient Personas ─────────────────────────────
DEMO_PATIENTS: dict[str, dict] = {
    "arjun": {
        "id": "demo-arjun",
        "label": "Arjun, 34 — Pre-diabetic Software Engineer",
        "highlight": "Time Machine",
        "story": "Stress + sleep debt → diabetes by 39 without intervention. Time Machine shows the fork in the road.",
        "emoji": "👨‍💻",
        "tag": "Pre-diabetic",
        "tag_color": "#ff9100",
        "profile": {
            "name": "Arjun Mehta", "age": 34, "gender": "male",
            "blood_group": "B+", "location": "Hyderabad",
            "vitals": {
                "heart_rate": 78, "systolic_bp": 128, "diastolic_bp": 82,
                "spo2": 96.2, "temperature": 98.4,
                "glucose": 112.0, "weight": 82.0, "height": 173.0
            },
            "lifestyle": {
                "sleep_hours": 5.5, "exercise_days_per_week": 2,
                "diet_quality": 5, "hydration_liters": 1.8,
                "stress_level": 7, "smoking": False, "alcohol_units_per_week": 4
            },
            "family_history": ["Paternal Type 2 Diabetes", "Maternal Hypertension"],
            "medical_history": ["Mild asthma", "Borderline fasting glucose 2024"],
            "current_medications": ["Cetirizine 10mg seasonal"],
            "allergies": []
        }
    },
    "meena": {
        "id": "demo-meena",
        "label": "Meena, 52 — Three Generations of Heart Disease",
        "highlight": "Family Twin",
        "story": "Father died of stroke at 60. Brother has hypertension. Her children's cardiac risk is 71% without her intervention.",
        "emoji": "👩",
        "tag": "Cardiac Family",
        "tag_color": "#ff1744",
        "profile": {
            "name": "Meena Krishnan", "age": 52, "gender": "female",
            "blood_group": "A+", "location": "Chennai",
            "vitals": {
                "heart_rate": 84, "systolic_bp": 148, "diastolic_bp": 94,
                "spo2": 97.1, "temperature": 98.8,
                "glucose": 128.0, "weight": 74.0, "height": 158.0
            },
            "lifestyle": {
                "sleep_hours": 6.0, "exercise_days_per_week": 1,
                "diet_quality": 6, "hydration_liters": 1.5,
                "stress_level": 6, "smoking": False, "alcohol_units_per_week": 0
            },
            "family_history": [
                "Father Heart Disease (age 48)",
                "Father Stroke (age 60)",
                "Brother Hypertension",
                "Paternal Grandfather Diabetes"
            ],
            "medical_history": ["Hypertension diagnosed 2020", "Borderline HbA1c 2024"],
            "current_medications": ["Amlodipine 5mg", "Losartan 50mg"],
            "allergies": []
        }
    },
    "raj": {
        "id": "demo-raj",
        "label": "Raj, 28 — Smoker, High Stress, Zero Exercise",
        "highlight": "Preventive ROI",
        "story": "Quitting smoking + 3 lifestyle changes saves Raj ₹14.2 lakhs and adds 4.5 years to his life expectancy.",
        "emoji": "🚬",
        "tag": "High Risk",
        "tag_color": "#ff1744",
        "profile": {
            "name": "Raj Sharma", "age": 28, "gender": "male",
            "blood_group": "O+", "location": "Mumbai",
            "vitals": {
                "heart_rate": 92, "systolic_bp": 138, "diastolic_bp": 88,
                "spo2": 94.0, "temperature": 98.6,
                "glucose": 95.0, "weight": 79.0, "height": 176.0
            },
            "lifestyle": {
                "sleep_hours": 5.0, "exercise_days_per_week": 0,
                "diet_quality": 4, "hydration_liters": 1.2,
                "stress_level": 9, "smoking": True, "alcohol_units_per_week": 10
            },
            "family_history": ["Paternal Heart Disease (age 55)"],
            "medical_history": [],
            "current_medications": [],
            "allergies": []
        }
    },
    "divya": {
        "id": "demo-divya",
        "label": "Divya, 45 — CBC Reveals 6 Hidden Abnormalities",
        "highlight": "Report Analyzer",
        "story": "Divya felt fine. Her uploaded CBC revealed low hemoglobin, high LDL, borderline HbA1c — conditions she had no idea about.",
        "emoji": "👩‍⚕️",
        "tag": "Hidden Risk",
        "tag_color": "#7c4dff",
        "profile": {
            "name": "Divya Nair", "age": 45, "gender": "female",
            "blood_group": "AB+", "location": "Kochi",
            "vitals": {
                "heart_rate": 74, "systolic_bp": 135, "diastolic_bp": 85,
                "spo2": 97.4, "temperature": 99.1,
                "glucose": 142.0, "weight": 67.0, "height": 161.0
            },
            "lifestyle": {
                "sleep_hours": 6.5, "exercise_days_per_week": 2,
                "diet_quality": 6, "hydration_liters": 2.0,
                "stress_level": 6, "smoking": False, "alcohol_units_per_week": 0
            },
            "family_history": ["Maternal Diabetes (age 58)", "Maternal Anemia"],
            "medical_history": ["Iron-deficiency anemia 2022", "HbA1c 6.1% (2025)"],
            "current_medications": ["Iron supplement 150mg"],
            "allergies": ["Penicillin"]
        }
    },
    "suresh": {
        "id": "demo-suresh",
        "label": "Suresh, 65 — Critical: 3 Active Emergency Alerts",
        "highlight": "Emergency Triage",
        "story": "Glucose 320, BP 172/108, SpO2 91% — MediTwin scores CRITICAL triage. Three simultaneous emergencies active.",
        "emoji": "🏥",
        "tag": "CRITICAL",
        "tag_color": "#ff1744",
        "profile": {
            "name": "Suresh Patel", "age": 65, "gender": "male",
            "blood_group": "B-", "location": "Ahmedabad",
            "vitals": {
                "heart_rate": 112, "systolic_bp": 172, "diastolic_bp": 108,
                "spo2": 91.0, "temperature": 100.4,
                "glucose": 320.0, "weight": 94.0, "height": 168.0
            },
            "lifestyle": {
                "sleep_hours": 4.5, "exercise_days_per_week": 0,
                "diet_quality": 3, "hydration_liters": 1.0,
                "stress_level": 8, "smoking": True, "alcohol_units_per_week": 14
            },
            "family_history": [
                "Father Stroke (age 68)",
                "Brother Heart Attack (age 55)",
                "Mother Diabetes"
            ],
            "medical_history": ["Type 2 Diabetes (2015)", "Hypertension (2012)", "CKD Stage 2"],
            "current_medications": ["Metformin 1000mg", "Amlodipine 10mg", "Atorvastatin 40mg"],
            "allergies": []
        }
    },
    "ananya": {
        "id": "demo-ananya",
        "label": "Ananya, 22 — Healthy Today, But Complacency Has a Cost",
        "highlight": "Time Machine (Positive)",
        "story": "Ananya is low risk today — but her Time Machine shows what 10 years of ignoring prevention looks like. The contrast is the warning.",
        "emoji": "🌟",
        "tag": "Low Risk",
        "tag_color": "#00ff9d",
        "profile": {
            "name": "Ananya Singh", "age": 22, "gender": "female",
            "blood_group": "A-", "location": "Delhi",
            "vitals": {
                "heart_rate": 68, "systolic_bp": 112, "diastolic_bp": 72,
                "spo2": 99.1, "temperature": 98.2,
                "glucose": 84.0, "weight": 55.0, "height": 163.0
            },
            "lifestyle": {
                "sleep_hours": 7.5, "exercise_days_per_week": 4,
                "diet_quality": 8, "hydration_liters": 2.5,
                "stress_level": 4, "smoking": False, "alcohol_units_per_week": 0
            },
            "family_history": ["Maternal Diabetes (age 58)"],
            "medical_history": [],
            "current_medications": [],
            "allergies": []
        }
    }
}


@router.get("/patients")
async def list_demo_patients(user: dict = Depends(get_current_user)) -> list[dict]:
    """Returns the catalogue of 6 demo patient personas (summary only, no full profile)."""
    return [
        {
            "id": k,
            "label": v["label"],
            "highlight": v["highlight"],
            "story": v["story"],
            "emoji": v["emoji"],
            "tag": v["tag"],
            "tag_color": v["tag_color"],
        }
        for k, v in DEMO_PATIENTS.items()
    ]


@router.get("/patient/{patient_id}")
async def get_demo_patient(
    patient_id: str,
    user: dict = Depends(get_current_user),
) -> dict:
    """Returns the full profile (including PatientProfile) for a specific demo patient."""
    if patient_id not in DEMO_PATIENTS:
        raise HTTPException(404, f"Demo patient '{patient_id}' not found. Valid IDs: {list(DEMO_PATIENTS.keys())}")
    return DEMO_PATIENTS[patient_id]
