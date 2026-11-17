from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from lunar_python import Solar

# ลองจิจูดจังหวัดหลักในไทย (เทียบกับเส้นแวงมาตรฐาน UTC+7 คือ 105.0°E)
# หมายเหตุ: 1 องศา = 4 นาที (เช่น กรุงเทพฯ 100.5°E จะช้ากว่าเวลานาฬิกาประมาณ 18 นาที)
THAI_PROVINCE_LONGITUDES: Dict[str, float] = {
    "กรุงเทพมหานคร": 100.5018,
    "เชียงใหม่": 98.9853,
    "เชียงราย": 99.8325,
    "ขอนแก่น": 102.8360,
    "นครราชสีมา": 102.0978,
    "ชลบุรี": 100.9847,
    "ภูเก็ต": 98.3923,
    "สงขลา": 100.5951,
    "นนทบุรี": 100.5147,
    "ปทุมธานี": 100.5250,
    "สมุทรปราการ": 100.5998,
}

# พจนานุกรมราศีบน (10 Heavenly Stems - ก้านฟ้า)
HEAVENLY_STEMS: Dict[str, Dict[str, str]] = {
    "甲": {"en": "Jia", "th": "ไม้หยาง (甲)", "metaphor": "ต้นไม้ใหญ่ที่เติบโตตรงไปตรงมา มีหลักการและวิสัยทัศน์ระยะยาว", "element": "Wood", "polarity": "Yang"},
    "乙": {"en": "Yi", "th": "ไม้หยิน (乙)", "metaphor": "เถาวัลย์หรือไม้ดอกที่ยืดหยุ่น ปรับตัวเก่ง ประสานงานนุ่มนวล", "element": "Wood", "polarity": "Yin"},
    "丙": {"en": "Bing", "th": "ไฟหยาง (丙)", "metaphor": "ดวงอาทิตย์ที่กระจายพลัง เปิดเผย กระตือรือร้น สร้างแรงบันดาลใจ", "element": "Fire", "polarity": "Yang"},
    "丁": {"en": "Ding", "th": "ไฟหยิน (丁)", "metaphor": "แสงเทียนหรือแสงดาวที่ให้ความอบอุ่น โฟกัสลึก มองเห็นรายละเอียดในความมืด", "element": "Fire", "polarity": "Yin"},
    "戊": {"en": "Wu", "th": "ดินหยาง (戊)", "metaphor": "ภูเขาสูงที่มั่นคง หนักแน่น เป็นที่พึ่งพิงและรักษาเสถียรภาพของทีม", "element": "Earth", "polarity": "Yang"},
    "己": {"en": "Ji", "th": "ดินหยิน (己)", "metaphor": "ดินอุดมสมบูรณ์ที่หล่อเลี้ยงและจัดการทรัพยากรเบื้องหลังได้อย่างรอบคอบ", "element": "Earth", "polarity": "Yin"},
    "庚": {"en": "Geng", "th": "ทองหยาง (庚)", "metaphor": "ดาบเหล็กกล้าที่เด็ดขาด ชัดเจน ตรงไปตรงมา แก้ปัญหาเชิงโครงสร้าง", "element": "Metal", "polarity": "Yang"},
    "辛": {"en": "Xin", "th": "ทองหยิน (辛)", "metaphor": "อัญมณีที่ประณีต รักความสมบูรณ์แบบ มีมาตรฐานสูงและใส่ใจคุณภาพ", "element": "Metal", "polarity": "Yin"},
    "壬": {"en": "Ren", "th": "น้ำหยาง (壬)", "metaphor": "มหาสมุทรหรือแม่น้ำสายใหญ่ที่ไหลเวียนไม่หยุดนิ่ง ไอเดียกว้างและพลิกแพลงไว", "element": "Water", "polarity": "Yang"},
    "癸": {"en": "Gui", "th": "น้ำหยิน (癸)", "metaphor": "สายฝนหรือน้ำค้างที่ซึมลึก ช่างสังเกต อ่านบรรยากาศและเข้าใจคนเก่ง", "element": "Water", "polarity": "Yin"},
}

# พจนานุกรมราศีล่าง (12 Earthly Branches - กิ่งดิน)
EARTHLY_BRANCHES: Dict[str, Dict[str, str]] = {
    "子": {"animal": "หนู (ชวด)", "element": "Water"},
    "丑": {"animal": "วัว (ฉลู)", "element": "Earth"},
    "寅": {"animal": "เสือ (ขาล)", "element": "Wood"},
    "卯": {"animal": "กระต่าย (เถาะ)", "element": "Wood"},
    "辰": {"animal": "มังกร (มะโรง)", "element": "Earth"},
    "巳": {"animal": "งู (มะเส็ง)", "element": "Fire"},
    "午": {"animal": "ม้า (มะเมีย)", "element": "Fire"},
    "未": {"animal": "แพะ (มะแม)", "element": "Earth"},
    "申": {"animal": "ลิง (วอก)", "element": "Metal"},
    "酉": {"animal": "ไก่ (ระกา)", "element": "Metal"},
    "戌": {"animal": "สุนัข (จอ)", "element": "Earth"},
    "亥": {"animal": "หมู (กุน)", "element": "Water"},
}

# คู่ปะทะ (Clash - ชง) ของราศีล่าง
BRANCH_CLASHES: Dict[str, str] = {
    "子": "午", "午": "子",
    "丑": "未", "未": "丑",
    "寅": "申", "申": "寅",
    "卯": "酉", "酉": "卯",
    "辰": "戌", "戌": "辰",
    "巳": "亥", "亥": "巳",
}

# คู่ภาคี (Combine - ฮะ) ของราศีล่าง
BRANCH_COMBINES: Dict[str, str] = {
    "子": "丑", "丑": "子",
    "寅": "亥", "亥": "寅",
    "卯": "戌", "戌": "卯",
    "辰": "酉", "酉": "辰",
    "巳": "申", "申": "巳",
    "午": "未", "未": "午",
}


def calculate_true_solar_time(dt: datetime, province: str = "กรุงเทพมหานคร") -> datetime:
    """คำนวณเวลาสุริยคติที่แท้จริง (True Solar Time) เทียบกับเส้นแวงมาตรฐาน UTC+7 (105°E)"""
    longitude = THAI_PROVINCE_LONGITUDES.get(province, 100.5018)
    offset_minutes = (longitude - 105.0) * 4.0
    return dt + timedelta(minutes=offset_minutes)


def _format_pillar(gan_zhi: str) -> Dict[str, Any]:
    stem_char = gan_zhi[0]
    branch_char = gan_zhi[1]
    stem_info = HEAVENLY_STEMS[stem_char]
    branch_info = EARTHLY_BRANCHES[branch_char]
    return {
        "raw": gan_zhi,
        "stem": stem_char,
        "stem_th": stem_info["th"],
        "stem_element": stem_info["element"],
        "branch": branch_char,
        "branch_animal": branch_info["animal"],
        "branch_element": branch_info["element"],
    }


def calculate_bazi_profile(
    birth_date: str,
    birth_time: Optional[str] = None,
    province: str = "กรุงเทพมหานคร"
) -> Dict[str, Any]:
    """คำนวณผังดวง 4 เสาจากวันเดือนปีและเวลาเกิด"""
    has_time = bool(birth_time and birth_time.strip())
    if has_time:
        raw_dt = datetime.strptime(f"{birth_date} {birth_time}", "%Y-%m-%d %H:%M")
        solar_dt = calculate_true_solar_time(raw_dt, province)
    else:
        # กรณีไม่ทราบเวลาเกิด ใช้เที่ยงวันเพื่อกันรอยต่อวันคลาดเคลื่อน แต่จะไม่แสดงเสายาม
        raw_dt = datetime.strptime(f"{birth_date} 12:00", "%Y-%m-%d %H:%M")
        solar_dt = raw_dt

    solar = Solar.fromYmdHms(
        solar_dt.year, solar_dt.month, solar_dt.day,
        solar_dt.hour, solar_dt.minute, 0
    )
    lunar = solar.getLunar()
    eight_char = lunar.getEightChar()

    # ใช้กติกาเปลี่ยนวันใหม่ตอน 23:00 น. (晚子时) หรือ 00:00 น. ตามมาตรฐานสากล (Sect 2 = 00:00)
    eight_char.setSect(2)

    year_gz = eight_char.getYear()
    month_gz = eight_char.getMonth()
    day_gz = eight_char.getDay()
    hour_gz = eight_char.getTime() if has_time else None

    day_stem_char = day_gz[0]
    day_master = HEAVENLY_STEMS[day_stem_char]

    pillars = {
        "year": _format_pillar(year_gz),
        "month": _format_pillar(month_gz),
        "day": _format_pillar(day_gz),
        "hour": _format_pillar(hour_gz) if hour_gz else None,
    }

    # ตรวจสอบปฏิกิริยาภายในดวง (Internal Clashes / Combines)
    branches = [p["branch"] for p in pillars.values() if p is not None]
    internal_interactions: List[str] = []
    for i in range(len(branches)):
        for j in range(i + 1, len(branches)):
            b1, b2 = branches[i], branches[j]
            if BRANCH_CLASHES.get(b1) == b2:
                internal_interactions.append(f"ภายในดวงมีคู่ปะทะ (ชง): {b1}-{b2}")
            if BRANCH_COMBINES.get(b1) == b2:
                internal_interactions.append(f"ภายในดวงมีคู่ภาคี (ฮะ): {b1}-{b2}")

    return {
        "true_solar_time": solar_dt.strftime("%Y-%m-%d %H:%M") if has_time else None,
        "province": province,
        "day_master": {
            "char": day_stem_char,
            "name_th": day_master["th"],
            "element": day_master["element"],
            "polarity": day_master["polarity"],
            "work_metaphor": day_master["metaphor"],
        },
        "pillars": pillars,
        "internal_interactions": internal_interactions,
    }


def compare_bazi_pillars(profile_a: Dict[str, Any], profile_b: Dict[str, Any]) -> Dict[str, Any]:
    """วิเคราะห์ปฏิกิริยาข้ามดวง (Cross-Pillar Interactions) ระหว่างเพื่อนร่วมงาน 2 คน"""
    pa = profile_a["pillars"]
    pb = profile_b["pillars"]
    interactions: List[Dict[str, str]] = []

    # 1. เช็กเสาเดือน (แกนการทำงาน ค่านิยม และมาตรฐานในออฟฟิศ)
    if pa["month"]["raw"] == pb["month"]["raw"]:
        interactions.append({
            "type": "Month Pillar Match (เสาเดือนตรงกันเป๊ะ)",
            "level": "High Alignment",
            "detail": f"มีเสาเดือน {pa['month']['raw']} เหมือนกัน แปลว่ามีค่านิยมการทำงานและมาตรฐานคุณภาพในทิศทางเดียวกัน"
        })
    elif BRANCH_CLASHES.get(pa["month"]["branch"]) == pb["month"]["branch"]:
        interactions.append({
            "type": "Month Branch Clash (เสาเดือนปะทะ/ชง)",
            "level": "Friction Alert",
            "detail": "สไตล์การจัดลำดับความสำคัญและจังหวะการทำงานต่างกัน ควรตกลง KPI และ Scope งานเป็นลายลักษณ์อักษรตั้งแต่ต้น"
        })

    # 2. เช็กเสาวัน (แกนตัวตนและการสื่อสารระดับบุคคล)
    if BRANCH_COMBINES.get(pa["day"]["branch"]) == pb["day"]["branch"]:
        interactions.append({
            "type": "Day Branch Combine (เสาวันภาคี/ฮะ)",
            "level": "Synergy",
            "detail": "เคมีการสื่อสารเข้ากันได้ดี คุยกันเข้าใจง่ายและพร้อมช่วยเหลือกันในหน้างาน"
        })
    elif BRANCH_CLASHES.get(pa["day"]["branch"]) == pb["day"]["branch"]:
        interactions.append({
            "type": "Day Branch Clash (เสาวันปะทะ/ชง)",
            "level": "Communication Care",
            "detail": "มุมมองการแก้ปัญหาเฉพาะหน้ามักสวนทางกัน ช่วยอุดจุดบอดกันได้ดีแต่ต้องระวังการสื่อสารที่ตรงเกินไป"
        })

    return {
        "day_master_pair": f"{profile_a['day_master']['name_th']} + {profile_b['day_master']['name_th']}",
        "cross_interactions": interactions,
    }