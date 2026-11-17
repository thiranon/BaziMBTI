import pytest
from bazi_engine import calculate_bazi_profile, compare_bazi_pillars
from mbti_data import get_mbti_profile
from main import (
    CompareInput,
    ProfileInput,
    analyze_endpoint,
    calculate_endpoint,
    compare_endpoint,
)


def test_lichun_year_boundary():
    """ทดสอบรอยต่อวันเปลี่ยนปีนักษัตรจีน (Lichun ประมาณ 4 ก.พ.)"""
    # เกิดวันที่ 3 ก.พ. 2024 (ยังเป็นปีเถาะ 癸卯)
    before_lichun = calculate_bazi_profile("2024-02-03", "10:00", "กรุงเทพมหานคร")
    assert before_lichun["pillars"]["year"]["raw"] == "癸卯"

    # เกิดวันที่ 5 ก.พ. 2024 (เข้าสู่ปีมะโรง 甲辰 แล้ว)
    after_lichun = calculate_bazi_profile("2024-02-05", "10:00", "กรุงเทพมหานคร")
    assert after_lichun["pillars"]["year"]["raw"] == "甲辰"


def test_unknown_birth_time():
    """ทดสอบกรณีเพื่อนร่วมงานไม่ทราบเวลาเกิด ระบบต้องไม่พังและคืนค่า hour เป็น None"""
    profile = calculate_bazi_profile("1995-08-15", None, "เชียงใหม่")
    assert profile["pillars"]["hour"] is None
    assert profile["true_solar_time"] is None
    assert profile["day_master"]["char"] != ""


def test_mbti_lookup():
    """ทดสอบการดึงข้อมูล MBTI และ RACI"""
    intp = get_mbti_profile("intp-a")
    assert intp["code"] == "INTP-A"
    assert "Ti" in intp["stack"][0]


def test_pairwise_comparison():
    """ทดสอบการเปรียบเทียบดวง 2 คน"""
    p1 = calculate_bazi_profile("1990-05-10", "09:30", "กรุงเทพมหานคร")
    p2 = calculate_bazi_profile("1992-11-20", "14:15", "กรุงเทพมหานคร")
    result = compare_bazi_pillars(p1, p2)
    assert "day_master_pair" in result
    assert isinstance(result["cross_interactions"], list)


def test_fastapi_endpoints():
    """ทดสอบ Endpoints /calculate, /analyze และ /compare ของ FastAPI"""
    p1 = ProfileInput(
        name="Alice",
        birth_date="1995-08-15",
        birth_time="10:30",
        province="กรุงเทพมหานคร",
        mbti="INTP-A",
        role="Developer",
    )
    p2 = ProfileInput(
        name="Bob",
        birth_date="1993-02-10",
        birth_time=None,
        province="เชียงใหม่",
        mbti="ENTJ-T",
        role="Product Manager",
    )

    calc_res = calculate_endpoint(p1)
    assert calc_res["name"] == "Alice"
    assert calc_res["bazi"]["pillars"]["hour"] is not None
    assert calc_res["mbti"]["code"] == "INTP-A"

    analyze_res = analyze_endpoint(p1)
    assert "manual" in analyze_res
    assert "archetype_title" in analyze_res["manual"]
    assert "natural_raci" in analyze_res["manual"]

    compare_res = compare_endpoint(CompareInput(person_a=p1, person_b=p2))
    assert "synergy" in compare_res
    assert "duo_codename" in compare_res["synergy"]
    assert 0 <= compare_res["synergy"]["synergy_score"] <= 100
