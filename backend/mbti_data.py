from typing import Dict, Any

MBTI_PROFILES: Dict[str, Dict[str, Any]] = {
    "INTP": {
        "title": "The Architect / Logician",
        "stack": ["Ti (Introverted Thinking)", "Ne (Extraverted Intuition)", "Si (Introverted Sensing)", "Fe (Extraverted Feeling)"],
        "inferior_grip": "Fe Grip: ภายใต้ความเครียดสะสม อาจปลีกตัวเงียบ ตัดขาดการสื่อสาร หรือหงุดหงิดกับความไร้เหตุผลทางอารมณ์ของคนรอบข้าง",
        "raci_strength": ["A (Accountable - ออกแบบสถาปัตยกรรม/ระบบ)", "C (Consulted - วิเคราะห์จุดบอดและตรรกะ)"],
        "briefing_style": "บอกเป้าหมายและเหตุผลเชิงโครงสร้าง (Why & Logic) ให้พื้นที่คิดอิสระ หลีกเลี่ยงการสั่งงานแบบจุกจิกหรือไร้ที่มาที่ไป"
    },
    "INTJ": {
        "title": "The Mastermind / Strategist",
        "stack": ["Ni (Introverted Intuition)", "Te (Extraverted Thinking)", "Fi (Introverted Feeling)", "Se (Extraverted Sensing)"],
        "inferior_grip": "Se Grip: เมื่อแผนพังหรือเจอสิ่งเร้าฉุกเฉินมากเกินไป อาจจมกับรายละเอียดปลีกย่อยหรือหงุดหงิดกับความไม่เป็นระเบียบ",
        "raci_strength": ["A (Accountable - วางกลยุทธ์ระยะยาว)", "R (Responsible - คุมแผนงานซับซ้อน)"],
        "briefing_style": "สรุปประเด็นสำคัญ (Executive Summary) ภายใน 30 วินาที พร้อมตัวชี้วัดที่ชัดเจน ไม่ต้องอ้อมค้อม"
    },
    "ENTP": {
        "title": "The Visionary / Debater",
        "stack": ["Ne (Extraverted Intuition)", "Ti (Introverted Thinking)", "Fe (Extraverted Feeling)", "Si (Introverted Sensing)"],
        "inferior_grip": "Si Grip: เมื่อต้องทำงานเอกสารซ้ำซากหรือกฎระเบียบเคร่งครัดเกินไป จะหมดพลังและผัดวันประกันพรุ่ง",
        "raci_strength": ["C (Consulted - ระดมสมอง/หาทางออกนอกกรอบ)", "R (Responsible - งานบุกเบิก 0 ไป 1)"],
        "briefing_style": "ชวนคุยเป็นไอเดียและเปิดพื้นที่ให้ถกเถียง (Brainstorm) อย่าตีกรอบวิธีทำตั้งแต่ประโยคแรก"
    },
    "ENTJ": {
        "title": "The Commander",
        "stack": ["Te (Extraverted Thinking)", "Ni (Introverted Intuition)", "Se (Extraverted Sensing)", "Fi (Introverted Feeling)"],
        "inferior_grip": "Fi Grip: ภายใต้ความกดดันสูงอาจรู้สึกโดดเดี่ยว หรือตัดสินคนอื่นด้วยมาตรฐานที่แข็งกระด้างเกินไป",
        "raci_strength": ["A (Accountable - ผู้นำโปรเจกต์/ตัดสินใจเด็ดขาด)", "R (Responsible - ขับเคลื่อนเป้าหมาย)"],
        "briefing_style": "เน้นผลลัพธ์ (Outcome) ทางเลือกที่วิเคราะห์มาแล้ว และกรอบเวลาที่ชัดเจน"
    },
    "ENFP": {
        "title": "The Campaigner / Catalyst",
        "stack": ["Ne (Extraverted Intuition)", "Fi (Introverted Feeling)", "Te (Extraverted Thinking)", "Si (Introverted Sensing)"],
        "inferior_grip": "Si Grip: เมื่อเจองานรูทีนหรือรายละเอียดปลีกย่อยจำนวนมาก อาจรู้สึกอึดอัด วิตกกังวล และหลุดโฟกัส",
        "raci_strength": ["R (Responsible - งานครีเอทีฟ/สื่อสาร/สร้างแนวร่วม)", "C (Consulted - เติมมุมมองใหม่)"],
        "briefing_style": "เริ่มจากภาพใหญ่และคุณค่าของงานที่มีต่อผู้คน เปิดโอกาสให้แชร์ไอเดียก่อนลงรายละเอียด"
    },
    "INFJ": {
        "title": "The Advocate / Insightful Advisor",
        "stack": ["Ni (Introverted Intuition)", "Fe (Extraverted Feeling)", "Ti (Introverted Thinking)", "Se (Extraverted Sensing)"],
        "inferior_grip": "Se Grip: เมื่อรับอารมณ์คนรอบข้างมากเกินไปจะเกิดภาวะล้า (Burnout) และต้องการเวลาอยู่เงียบๆ คนเดียว",
        "raci_strength": ["C (Consulted - ที่ปรึกษาเชิงกลยุทธ์และคน)", "A (Accountable - งานที่ต้องใช้ความเข้าใจลึกซึ้ง)"],
        "briefing_style": "อธิบายความเชื่อมโยงของงานกับเป้าหมายรวม ให้เวลาเตรียมตัวก่อนประชุมใหญ่"
    },
    "ISTJ": {
        "title": "The Logistician / Inspector",
        "stack": ["Si (Introverted Sensing)", "Te (Extraverted Thinking)", "Fi (Introverted Feeling)", "Ne (Extraverted Intuition)"],
        "inferior_grip": "Ne Grip: เมื่อเจอการเปลี่ยนแปลงกะทันหันโดยไม่มีแผนรองรับ อาจกังวลถึงผลกระทบเลวร้ายที่ควบคุมไม่ได้",
        "raci_strength": ["R (Responsible - คุมมาตรฐาน/เอกสาร/ปฏิบัติการ)", "A (Accountable - ตรวจสอบความถูกต้อง)"],
        "briefing_style": "ส่งข้อมูลเป็นข้อๆ ชัดเจน มีขั้นตอน Reference อ้างอิงได้ และแจ้งล่วงหน้าหากมีการเปลี่ยนแผน"
    },
    "ISFJ": {
        "title": "The Defender / Supporter",
        "stack": ["Si (Introverted Sensing)", "Fe (Extraverted Feeling)", "Ti (Introverted Thinking)", "Ne (Extraverted Intuition)"],
        "inferior_grip": "Ne Grip: เมื่อต้องแบกรับภาระเกินตัวเพราะเกรงใจคนอื่น อาจเก็บความเครียดไว้เงียบๆ จนระเบิด",
        "raci_strength": ["R (Responsible - สนับสนุนทีม/ประสานงานละเอียด)", "I (Informed - ผู้รักษาความต่อเนื่องของงาน)"],
        "briefing_style": "สื่อสารด้วยความสุภาพ ชัดเจนเรื่องความคาดหวัง และคอยเช็กภาระงานไม่ให้ล้นมือ"
    },
    "ESTJ": {
        "title": "The Executive / Organizer",
        "stack": ["Te (Extraverted Thinking)", "Si (Introverted Sensing)", "Ne (Extraverted Intuition)", "Fi (Introverted Feeling)"],
        "inferior_grip": "Fi Grip: เมื่อทีมทำงานไม่ได้ตามมาตรฐานที่วางไว้ อาจหงุดหงิดและสั่งการแบบเข้มงวดเกินไป",
        "raci_strength": ["A (Accountable - บริหารจัดการปฏิบัติการ)", "R (Responsible - ปิดจ๊อบตามกำหนดเวลา)"],
        "briefing_style": "ตรงประเด็น มีตารางเวลา ผู้รับผิดชอบ และขั้นตอนตรวจสอบที่วัดผลได้"
    },
    "ESFJ": {
        "title": "The Consul / Harmonizer",
        "stack": ["Fe (Extraverted Feeling)", "Si (Introverted Sensing)", "Ne (Extraverted Intuition)", "Ti (Introverted Thinking)"],
        "inferior_grip": "Ti Grip: เมื่อเกิดความขัดแย้งในทีม อาจโทษตัวเองหรือพยายามเอาใจทุกฝ่ายจนเสียจุดยืน",
        "raci_strength": ["R (Responsible - ประสานงานข้ามฝ่าย/ดูแลลูกค้า)", "C (Consulted - บรรยากาศทีม)"],
        "briefing_style": "พูดคุยด้วยความเป็นมิตร ชื่นชมความร่วมมือ และระบุบทบาทของแต่ละคนให้ชัดเจน"
    },
    "ISTP": {
        "title": "The Virtuoso / Troubleshooter",
        "stack": ["Ti (Introverted Thinking)", "Se (Extraverted Sensing)", "Ni (Introverted Intuition)", "Fe (Extraverted Feeling)"],
        "inferior_grip": "Fe Grip: เมื่อถูกกดดันทางอารมณ์หรือประชุมยืดเยื้อไร้สาระ จะปิดสวิตช์และถอยห่างทันที",
        "raci_strength": ["R (Responsible - แก้ปัญหาเฉพาะหน้า/งานเทคนิค)", "C (Consulted - ประเมินความเป็นไปได้จริง)"],
        "briefing_style": "สั้น กระชับ บอกปัญหาและเครื่องมือที่มี แล้วปล่อยให้ลงมือแก้ด้วยตัวเอง"
    },
    "ISFP": {
        "title": "The Adventurer / Craftsman",
        "stack": ["Fi (Introverted Feeling)", "Se (Extraverted Sensing)", "Ni (Introverted Intuition)", "Te (Extraverted Thinking)"],
        "inferior_grip": "Te Grip: เมื่อถูกบีบด้วยตัวเลขหรือกฎเกณฑ์แข็งทื่อมากเกินไป อาจรู้สึกหมดไฟและต่อต้านเงียบๆ",
        "raci_strength": ["R (Responsible - งานออกแบบ/สุนทรียศาสตร์/ลงมือทำ)", "C (Consulted - ประสบการณ์ผู้ใช้)"],
        "briefing_style": "ให้ตัวอย่างภาพหรือ Mood & Tone ที่ชัดเจน เคารพพื้นที่ส่วนตัวในการสร้างสรรค์"
    },
    "ESTP": {
        "title": "The Entrepreneur / Dynamo",
        "stack": ["Se (Extraverted Sensing)", "Ti (Introverted Thinking)", "Fe (Extraverted Feeling)", "Ni (Introverted Intuition)"],
        "inferior_grip": "Ni Grip: เมื่อติดอยู่ในสถานการณ์ที่ทำอะไรไม่ได้ทันที อาจหงุดหงิดหรือตัดสินใจเสี่ยงเกินไป",
        "raci_strength": ["R (Responsible - เจรจาต่อรอง/ลุยงานเร่งด่วน)", "A (Accountable - แก้วิกฤตหน้างาน)"],
        "briefing_style": "คุยสั้นๆ เน้นการลงมือทำทันที เห็นผลลัพธ์ไว ไม่ต้องอ่านเอกสารยาว"
    },
    "ESFP": {
        "title": "The Entertainer / Performer",
        "stack": ["Se (Extraverted Sensing)", "Fi (Introverted Feeling)", "Te (Extraverted Thinking)", "Ni (Introverted Intuition)"],
        "inferior_grip": "Ni Grip: เมื่อต้องวางแผนระยะยาวคนเดียวในสภาพแวดล้อมที่ตึงเครียด อาจกังวลและหลีกเลี่ยงปัญหา",
        "raci_strength": ["R (Responsible - นำเสนอ/สร้างสีสันและพลังทีม)", "I (Informed - เชื่อมโยงผู้คน)"],
        "briefing_style": "คุยแบบโต้ตอบ สนุก กระชับ และเห็นภาพการนำไปใช้งานจริงทันที"
    },
    "INFP": {
        "title": "The Mediator / Idealist",
        "stack": ["Fi (Introverted Feeling)", "Ne (Extraverted Intuition)", "Si (Introverted Sensing)", "Te (Extraverted Thinking)"],
        "inferior_grip": "Te Grip: เมื่อเจอความขัดแย้งรุนแรงหรือแรงกดดันด้านเวลา อาจวิจารณ์ตัวเองอย่างหนักหรือแข็งกร้าวผิดปกติ",
        "raci_strength": ["C (Consulted - งานเขียน/คอนเทนต์/คุณค่าแบรนด์)", "R (Responsible - งานเชิงลึกที่ตรงกับความสนใจ)"],
        "briefing_style": "อธิบายความหมายและคุณค่าของงาน ให้เวลาคิดตกผลึก หลีกเลี่ยงการวิจารณ์ต่อหน้าคนหมู่มาก"
    },
    "ENFJ": {
        "title": "The Protagonist / Mentor",
        "stack": ["Fe (Extraverted Feeling)", "Ni (Introverted Intuition)", "Se (Extraverted Sensing)", "Ti (Introverted Thinking)"],
        "inferior_grip": "Ti Grip: เมื่อทุ่มเทให้ทีมแต่ไม่ได้รับการตอบรับ อาจเก็บไปคิดวิเคราะห์วนเวียนและสงสัยในคุณค่าตัวเอง",
        "raci_strength": ["A (Accountable - พัฒนาทีม/นำโปรเจกต์ร่วมมือ)", "R (Responsible - สื่อสารวิสัยทัศน์)"],
        "briefing_style": "พูดคุยถึงเป้าหมายร่วมของทีม เปิดโอกาสให้มีส่วนร่วมในการวางแผนและดูแลคน"
    },
}


def get_mbti_profile(mbti_code: str) -> Dict[str, Any]:
    """ดึงข้อมูล Cognitive Functions และ RACI จากรหัส MBTI (รองรับ -A / -T)"""
    clean_code = mbti_code.strip().upper()
    parts = clean_code.split("-")
    base_type = parts[0]
    identity = parts[1] if len(parts) > 1 else "A"

    profile = MBTI_PROFILES.get(base_type)
    if not profile:
        raise ValueError(f"ไม่พบรหัส MBTI: {mbti_code}")

    identity_note = (
        "Assertive (-A): มั่นใจในตัวเอง รับมือแรงกดดันได้นิ่ง แต่อาจมองข้ามสัญญาณเตือนเล็กๆ น้อยๆ"
        if identity == "A"
        else "Turbulent (-T): ละเอียดรอบคอบ ใส่ใจการพัฒนาตัวเองสูง แต่อาจเครียดหรือกังวลล่วงหน้าได้ง่าย"
    )

    return {
        "code": f"{base_type}-{identity}",
        "base_type": base_type,
        "identity": identity,
        "identity_note": identity_note,
        **profile,
    }