import json
import os
import re
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field

from bazi_engine import (
    THAI_PROVINCE_LONGITUDES,
    calculate_bazi_profile,
    compare_bazi_pillars,
)
from mbti_data import MBTI_PROFILES, get_mbti_profile
from prompts import (
    INDIVIDUAL_SYSTEM_PROMPT,
    PAIRWISE_SYSTEM_PROMPT,
    build_individual_user_prompt,
    build_pairwise_user_prompt,
)

load_dotenv()

LLM_BASE_URL = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY", "ollama")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen2.5:7b")

app = FastAPI(
    title="Team Synergy & Operating Manual Engine (BaZi + MBTI + RACI)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProfileInput(BaseModel):
    name: str = Field(..., min_length=1, description="ชื่อเล่นสำหรับแสดงผล")
    birth_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="YYYY-MM-DD")
    birth_time: Optional[str] = Field(default=None, description="HH:MM (เว้นว่างได้หากไม่ทราบ)")
    province: str = Field(default="กรุงเทพมหานคร", description="จังหวัดที่เกิด")
    mbti: str = Field(..., min_length=4, description="เช่น INTP-A, ENFP-T")
    role: Optional[str] = Field(default="", description="ตำแหน่งหรือสายงาน")


class CompareInput(BaseModel):
    person_a: ProfileInput
    person_b: ProfileInput


def _extract_json(raw_text: str) -> Dict[str, Any]:
    """แกะ JSON ออกจากข้อความตอบกลับของ LLM แม้จะมี Markdown code fence ติดมา"""
    cleaned = raw_text.strip()
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", cleaned, re.DOTALL)
    if fence_match:
        cleaned = fence_match.group(1)
    else:
        first_brace = cleaned.find("{")
        last_brace = cleaned.rfind("}")
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            cleaned = cleaned[first_brace : last_brace + 1]
    return json.loads(cleaned)


def _call_llm_json(system_prompt: str, user_prompt: str) -> Optional[Dict[str, Any]]:
    """เรียก OpenAI-compatible API (รองรับ Ollama และ Cloud LLM) คืนค่า None หากเชื่อมต่อไม่ได้"""
    if os.getenv("DISABLE_LLM", "").lower() in ("1", "true", "yes"):
        return None
    try:
        timeout_sec = float(os.getenv("LLM_TIMEOUT", "15.0"))
        client = OpenAI(
            base_url=LLM_BASE_URL,
            api_key=LLM_API_KEY,
            timeout=timeout_sec,
            max_retries=0,
        )
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
        )
        content = response.choices[0].message.content or ""
        return _extract_json(content)
    except Exception:
        return None


def _build_fallback_individual_manual(
    profile: Dict[str, Any]
) -> Dict[str, Any]:
    """สร้างคู่มือการทำงานแบบ Deterministic Fallback กรณีไม่ได้เปิด LLM หรือเชื่อมต่อไม่ได้"""
    dm = profile["bazi"]["day_master"]
    mbti = profile["mbti"]
    raci_list: List[str] = mbti["raci_strength"]
    primary_raci = " / ".join(r.split(" ")[0] for r in raci_list)
    internal = profile["bazi"]["internal_interactions"]
    internal_note = (
        f" นอกจากนี้{internal[0]} จึงมักมีการคิดทบทวนหลายมุมในตัวเอง"
        if internal
        else ""
    )

    return {
        "archetype_title": f"{mbti['title']} พลัง{dm['name_th']}",
        "core_energy_summary": (
            f"ผสมผสานแกนพลังงาน{dm['name_th']} ({dm['work_metaphor']}) "
            f"เข้ากับกระบวนการคิดแบบ {mbti['code']} ({mbti['stack'][0]} นำ) "
            f"ทำให้โดดเด่นทั้งการคิดเชิงโครงสร้างและการลงมือทำตามจังหวะของตนเอง{internal_note}"
        ),
        "natural_raci": {
            "primary_role": primary_raci,
            "reason": f"อ้างอิงจากจุดแข็ง {mbti['code']}: {', '.join(raci_list)}",
            "confidence_tag": "[กติกาโครงสร้าง]",
        },
        "communication_cheat_sheet": [
            {
                "rule": "วิธีบรีฟงานที่ได้ผลที่สุด",
                "detail": mbti["briefing_style"],
                "confidence_tag": "[กติกาโครงสร้าง]",
            },
            {
                "rule": f"จังหวะการทำงานตามธรรมชาติ ({dm['name_th']})",
                "detail": f"มีสไตล์เหมือน{dm['work_metaphor']} ควรจัดสภาพแวดล้อมให้สอดคล้องกับพลังงานธาตุ{dm['element']}",
                "confidence_tag": "[แบบจำลองพฤติกรรม]",
            },
            {
                "rule": f"การปรับจูนตามมิติ {mbti['identity']} ({mbti['code']})",
                "detail": mbti["identity_note"],
                "confidence_tag": "[แบบจำลองพฤติกรรม]",
            },
        ],
        "stress_and_grip_protocol": {
            "warning_signs": mbti["inferior_grip"],
            "teammate_support_guide": (
                "ลดสิ่งเร้าหรือการตามงานถี่เกินไป ช่วยจัดลำดับความสำคัญ 1-2 ข้อแรกให้ชัดเจน "
                "และเปิดพื้นที่ให้จัดการงานทีละส่วนตามแนวทางที่ถนัด"
            ),
            "confidence_tag": "[แบบจำลองพฤติกรรม]",
        },
        "disclaimer": (
            "ข้อมูลนี้เป็นการผสานกรอบอุปมาธาตุและจิตวิทยาบุคลิกภาพเพื่อใช้สื่อสารในทีม "
            "ไม่ใช่การประเมินผลการทำงานหรือคำวินิจฉัยทางการแพทย์"
        ),
    }


def _build_fallback_pairwise_synergy(
    person_a: Dict[str, Any],
    person_b: Dict[str, Any],
    cross_bazi: Dict[str, Any],
) -> Dict[str, Any]:
    """สร้างผลการเปรียบเทียบทีม 2 คนแบบ Deterministic Fallback กรณีไม่ได้เปิด LLM"""
    dm_a = person_a["bazi"]["day_master"]
    dm_b = person_b["bazi"]["day_master"]
    mbti_a = person_a["mbti"]
    mbti_b = person_b["mbti"]
    interactions = cross_bazi["cross_interactions"]

    base_score = 78
    for item in interactions:
        if item["level"] in ("High Alignment", "Synergy"):
            base_score += 8
        elif item["level"] in ("Friction Alert", "Communication Care"):
            base_score -= 5
    synergy_score = max(50, min(98, base_score))

    if interactions:
        first_ix = interactions[0]
        align_title = f"{first_ix['type']} ({cross_bazi['day_master_pair']})"
        align_detail = first_ix["detail"]
    else:
        align_title = f"การผสานพลังระหว่าง {dm_a['name_th']} และ {dm_b['name_th']}"
        align_detail = (
            f"{person_a['name']} ({mbti_a['code']}) ถนัด {mbti_a['raci_strength'][0]} "
            f"ในขณะที่ {person_b['name']} ({mbti_b['code']}) ถนัด {mbti_b['raci_strength'][0]} "
            "สามารถแบ่งบทบาท RACI เสริมกันได้ชัดเจน"
        )

    friction_triggers = [
        {
            "scenario": "เมื่อต้องบรีฟงานด่วนหรือตัดสินใจภายใต้เวลาจำกัด",
            "root_cause": (
                f"{person_a['name']} ใช้ {mbti_a['stack'][0]} เป็นแกนหลัก "
                f"ส่วน {person_b['name']} ใช้ {mbti_b['stack'][0]} เป็นแกนหลัก"
            ),
            "mitigation_rule": (
                f"เวลาคุยกับ {person_a['name']}: {mbti_a['briefing_style']} | "
                f"เวลาคุยกับ {person_b['name']}: {mbti_b['briefing_style']}"
            ),
            "confidence_tag": "[กติกาโครงสร้าง]",
        },
        {
            "scenario": "เมื่อเกิดความกดดันสะสมช่วงใกล้เดดไลน์ (The Grip)",
            "root_cause": (
                f"{person_a['name']} อาจเกิด {mbti_a['inferior_grip'].split(':')[0]} "
                f"และ {person_b['name']} อาจเกิด {mbti_b['inferior_grip'].split(':')[0]}"
            ),
            "mitigation_rule": (
                "ตกลงขอบเขตความรับผิดชอบ (RACI) เป็นลายลักษณ์อักษรตั้งแต่ต้นโปรเจกต์ "
                "และแยกเวลาระดมสมองออกจากเวลาตัดสินใจปิดงาน"
            ),
            "confidence_tag": "[แบบจำลองพฤติกรรม]",
        },
    ]

    return {
        "duo_codename": f"คู่หู {dm_a['name_th'].split(' ')[0]} x {dm_b['name_th'].split(' ')[0]} ({mbti_a['base_type']} + {mbti_b['base_type']})",
        "synergy_score": synergy_score,
        "alignment_highlight": {
            "title": align_title,
            "detail": align_detail,
            "confidence_tag": "[กติกาโครงสร้าง]",
        },
        "friction_triggers": friction_triggers,
        "dos_and_donts": {
            "do": [
                f"แบ่งบทบาทตามจุดแข็ง: ให้ {person_a['name']} โฟกัส {mbti_a['raci_strength'][0]} และ {person_b['name']} โฟกัส {mbti_b['raci_strength'][0]}",
                "สรุป Action Items และนิยามคำว่า 'เสร็จ (Definition of Done)' ร่วมกันหลังประชุมทุกครั้ง",
            ],
            "dont": [
                f"อย่าบรีฟงานสวนทางกับสไตล์ธรรมชาติของอีกฝ่ายโดยไม่บอกเหตุผลล่วงหน้า",
                "อย่าปล่อยให้ความเงียบหรือความเกรงใจสะสมจนเกิดภาวะ The Grip ช่วงท้ายโปรเจกต์",
            ],
        },
    }


def _build_profile_json(payload: ProfileInput) -> Dict[str, Any]:
    try:
        bazi_data = calculate_bazi_profile(
            birth_date=payload.birth_date,
            birth_time=payload.birth_time,
            province=payload.province,
        )
        mbti_data = get_mbti_profile(payload.mbti)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "name": payload.name.strip(),
        "role": (payload.role or "").strip() or "ไม่ระบุตำแหน่ง",
        "birth_date": payload.birth_date,
        "birth_time": payload.birth_time if payload.birth_time and payload.birth_time.strip() else None,
        "province": payload.province,
        "bazi": bazi_data,
        "mbti": mbti_data,
    }


@app.get("/health")
def health_check() -> Dict[str, Any]:
    return {
        "status": "ok",
        "provinces": list(THAI_PROVINCE_LONGITUDES.keys()),
        "mbti_types": list(MBTI_PROFILES.keys()),
    }


@app.post("/calculate")
def calculate_endpoint(payload: ProfileInput) -> Dict[str, Any]:
    """คำนวณโครงสร้าง BaZi 4 เสา + เวลาสุริยคติแท้จริง + MBTI/RACI แบบ Deterministic"""
    return _build_profile_json(payload)


@app.post("/analyze")
def analyze_endpoint(payload: ProfileInput) -> Dict[str, Any]:
    """คำนวณ ProfileJSON และสร้างคู่มือการทำงานส่วนบุคคล (Individual Operating Manual)"""
    profile = _build_profile_json(payload)
    user_prompt = build_individual_user_prompt(
        nickname=profile["name"],
        role=profile["role"],
        bazi_data=profile["bazi"],
        mbti_data=profile["mbti"],
    )
    llm_result = _call_llm_json(INDIVIDUAL_SYSTEM_PROMPT, user_prompt)
    if llm_result and "archetype_title" in llm_result:
        manual = llm_result
        mode = "llm"
    else:
        manual = _build_fallback_individual_manual(profile)
        mode = "deterministic_fallback"

    return {
        "profile": profile,
        "manual": manual,
        "synthesis_mode": mode,
    }


@app.post("/compare")
def compare_endpoint(payload: CompareInput) -> Dict[str, Any]:
    """วิเคราะห์ปฏิกิริยาข้ามดวงและสร้างคู่มือการทำงานร่วมกันเป็นคู่ (Pairwise Team Synergy)"""
    profile_a = _build_profile_json(payload.person_a)
    profile_b = _build_profile_json(payload.person_b)
    cross_bazi = compare_bazi_pillars(profile_a["bazi"], profile_b["bazi"])

    user_prompt = build_pairwise_user_prompt(
        person_a=profile_a,
        person_b=profile_b,
        cross_bazi=cross_bazi,
    )
    llm_result = _call_llm_json(PAIRWISE_SYSTEM_PROMPT, user_prompt)
    if llm_result and "duo_codename" in llm_result:
        synergy = llm_result
        mode = "llm"
    else:
        synergy = _build_fallback_pairwise_synergy(profile_a, profile_b, cross_bazi)
        mode = "deterministic_fallback"

    return {
        "person_a": profile_a,
        "person_b": profile_b,
        "cross_bazi": cross_bazi,
        "synergy": synergy,
        "synthesis_mode": mode,
    }
