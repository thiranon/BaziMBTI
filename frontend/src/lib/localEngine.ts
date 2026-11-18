import { Solar } from "lunar-javascript";
import {
  AnalyzeResponse,
  BaziData,
  CompareResponse,
  CrossBaziAnalysis,
  CrossInteraction,
  ElementType,
  IndividualOperatingManual,
  MbtiData,
  PairwiseSynergy,
  PillarInfo,
  ProfileInput,
  ProfileJSON,
} from "@/types";

const THAI_PROVINCE_LONGITUDES: Record<string, number> = {
  กรุงเทพมหานคร: 100.5018,
  เชียงใหม่: 98.9853,
  เชียงราย: 99.8325,
  ขอนแก่น: 102.836,
  นครราชสีมา: 102.0978,
  ชลบุรี: 100.9847,
  ภูเก็ต: 98.3923,
  สงขลา: 100.5951,
  นนทบุรี: 100.5147,
  ปทุมธานี: 100.525,
  สมุทรปราการ: 100.5998,
};

const HEAVENLY_STEMS: Record<
  string,
  { en: string; th: string; metaphor: string; element: ElementType; polarity: "Yang" | "Yin" }
> = {
  甲: {
    en: "Jia",
    th: "ไม้หยาง (甲)",
    metaphor: "ต้นไม้ใหญ่ที่เติบโตตรงไปตรงมา มีหลักการและวิสัยทัศน์ระยะยาว",
    element: "Wood",
    polarity: "Yang",
  },
  乙: {
    en: "Yi",
    th: "ไม้หยิน (乙)",
    metaphor: "เถาวัลย์หรือไม้ดอกที่ยืดหยุ่น ปรับตัวเก่ง ประสานงานนุ่มนวล",
    element: "Wood",
    polarity: "Yin",
  },
  丙: {
    en: "Bing",
    th: "ไฟหยาง (丙)",
    metaphor: "ดวงอาทิตย์ที่กระจายพลัง เปิดเผย กระตือรือร้น สร้างแรงบันดาลใจ",
    element: "Fire",
    polarity: "Yang",
  },
  丁: {
    en: "Ding",
    th: "ไฟหยิน (丁)",
    metaphor: "แสงเทียนหรือแสงดาวที่ให้ความอบอุ่น โฟกัสลึก มองเห็นรายละเอียดในความมืด",
    element: "Fire",
    polarity: "Yin",
  },
  戊: {
    en: "Wu",
    th: "ดินหยาง (戊)",
    metaphor: "ภูเขาสูงที่มั่นคง หนักแน่น เป็นที่พึ่งพิงและรักษาเสถียรภาพของทีม",
    element: "Earth",
    polarity: "Yang",
  },
  己: {
    en: "Ji",
    th: "ดินหยิน (己)",
    metaphor: "ดินอุดมสมบูรณ์ที่หล่อเลี้ยงและจัดการทรัพยากรเบื้องหลังได้อย่างรอบคอบ",
    element: "Earth",
    polarity: "Yin",
  },
  庚: {
    en: "Geng",
    th: "ทองหยาง (庚)",
    metaphor: "ดาบเหล็กกล้าที่เด็ดขาด ชัดเจน ตรงไปตรงมา แก้ปัญหาเชิงโครงสร้าง",
    element: "Metal",
    polarity: "Yang",
  },
  辛: {
    en: "Xin",
    th: "ทองหยิน (辛)",
    metaphor: "อัญมณีที่ประณีต รักความสมบูรณ์แบบ มีมาตรฐานสูงและใส่ใจคุณภาพ",
    element: "Metal",
    polarity: "Yin",
  },
  壬: {
    en: "Ren",
    th: "น้ำหยาง (壬)",
    metaphor: "มหาสมุทรหรือแม่น้ำสายใหญ่ที่ไหลเวียนไม่หยุดนิ่ง ไอเดียกว้างและพลิกแพลงไว",
    element: "Water",
    polarity: "Yang",
  },
  癸: {
    en: "Gui",
    th: "น้ำหยิน (癸)",
    metaphor: "สายฝนหรือน้ำค้างที่ซึมลึก ช่างสังเกต อ่านบรรยากาศและเข้าใจคนเก่ง",
    element: "Water",
    polarity: "Yin",
  },
};

const EARTHLY_BRANCHES: Record<string, { animal: string; element: ElementType }> = {
  子: { animal: "หนู (ชวด)", element: "Water" },
  丑: { animal: "วัว (ฉลู)", element: "Earth" },
  寅: { animal: "เสือ (ขาล)", element: "Wood" },
  卯: { animal: "กระต่าย (เถาะ)", element: "Wood" },
  辰: { animal: "มังกร (มะโรง)", element: "Earth" },
  巳: { animal: "งู (มะเส็ง)", element: "Fire" },
  午: { animal: "ม้า (มะเมีย)", element: "Fire" },
  未: { animal: "แพะ (มะแม)", element: "Earth" },
  申: { animal: "ลิง (วอก)", element: "Metal" },
  酉: { animal: "ไก่ (ระกา)", element: "Metal" },
  戌: { animal: "สุนัข (จอ)", element: "Earth" },
  亥: { animal: "หมู (กุน)", element: "Water" },
};

const BRANCH_CLASHES: Record<string, string> = {
  子: "午",
  午: "子",
  丑: "未",
  未: "丑",
  寅: "申",
  申: "寅",
  卯: "酉",
  酉: "卯",
  辰: "戌",
  戌: "辰",
  巳: "亥",
  亥: "巳",
};

const BRANCH_COMBINES: Record<string, string> = {
  子: "丑",
  丑: "子",
  寅: "亥",
  亥: "寅",
  卯: "戌",
  戌: "卯",
  辰: "酉",
  酉: "辰",
  巳: "申",
  申: "巳",
  午: "未",
  未: "午",
};

const MBTI_PROFILES: Record<
  string,
  {
    title: string;
    stack: string[];
    inferior_grip: string;
    raci_strength: string[];
    briefing_style: string;
  }
> = {
  INTP: {
    title: "The Architect / Logician",
    stack: [
      "Ti (Introverted Thinking)",
      "Ne (Extraverted Intuition)",
      "Si (Introverted Sensing)",
      "Fe (Extraverted Feeling)",
    ],
    inferior_grip:
      "Fe Grip: ภายใต้ความเครียดสะสม อาจปลีกตัวเงียบ ตัดขาดการสื่อสาร หรือหงุดหงิดกับความไร้เหตุผลทางอารมณ์ของคนรอบข้าง",
    raci_strength: [
      "A (Accountable - ออกแบบสถาปัตยกรรม/ระบบ)",
      "C (Consulted - วิเคราะห์จุดบอดและตรรกะ)",
    ],
    briefing_style:
      "บอกเป้าหมายและเหตุผลเชิงโครงสร้าง (Why & Logic) ให้พื้นที่คิดอิสระ หลีกเลี่ยงการสั่งงานแบบจุกจิกหรือไร้ที่มาที่ไป",
  },
  INTJ: {
    title: "The Mastermind / Strategist",
    stack: [
      "Ni (Introverted Intuition)",
      "Te (Extraverted Thinking)",
      "Fi (Introverted Feeling)",
      "Se (Extraverted Sensing)",
    ],
    inferior_grip:
      "Se Grip: เมื่อแผนพังหรือเจอสิ่งเร้าฉุกเฉินมากเกินไป อาจจมกับรายละเอียดปลีกย่อยหรือหงุดหงิดกับความไม่เป็นระเบียบ",
    raci_strength: [
      "A (Accountable - วางกลยุทธ์ระยะยาว)",
      "R (Responsible - คุมแผนงานซับซ้อน)",
    ],
    briefing_style:
      "สรุปประเด็นสำคัญ (Executive Summary) ภายใน 30 วินาที พร้อมตัวชี้วัดที่ชัดเจน ไม่ต้องอ้อมค้อม",
  },
  ENTP: {
    title: "The Visionary / Debater",
    stack: [
      "Ne (Extraverted Intuition)",
      "Ti (Introverted Thinking)",
      "Fe (Extraverted Feeling)",
      "Si (Introverted Sensing)",
    ],
    inferior_grip:
      "Si Grip: เมื่อต้องทำงานเอกสารซ้ำซากหรือกฎระเบียบเคร่งครัดเกินไป จะหมดพลังและผัดวันประกันพรุ่ง",
    raci_strength: [
      "C (Consulted - ระดมสมอง/หาทางออกนอกกรอบ)",
      "R (Responsible - งานบุกเบิก 0 ไป 1)",
    ],
    briefing_style:
      "ชวนคุยเป็นไอเดียและเปิดพื้นที่ให้ถกเถียง (Brainstorm) อย่าตีกรอบวิธีทำตั้งแต่ประโยคแรก",
  },
  ENTJ: {
    title: "The Commander",
    stack: [
      "Te (Extraverted Thinking)",
      "Ni (Introverted Intuition)",
      "Se (Extraverted Sensing)",
      "Fi (Introverted Feeling)",
    ],
    inferior_grip:
      "Fi Grip: ภายใต้ความกดดันสูงอาจรู้สึกโดดเดี่ยว หรือตัดสินคนอื่นด้วยมาตรฐานที่แข็งกระด้างเกินไป",
    raci_strength: [
      "A (Accountable - ผู้นำโปรเจกต์/ตัดสินใจเด็ดขาด)",
      "R (Responsible - ขับเคลื่อนเป้าหมาย)",
    ],
    briefing_style: "เน้นผลลัพธ์ (Outcome) ทางเลือกที่วิเคราะห์มาแล้ว และกรอบเวลาที่ชัดเจน",
  },
  ENFP: {
    title: "The Campaigner / Catalyst",
    stack: [
      "Ne (Extraverted Intuition)",
      "Fi (Introverted Feeling)",
      "Te (Extraverted Thinking)",
      "Si (Introverted Sensing)",
    ],
    inferior_grip:
      "Si Grip: เมื่อเจองานรูทีนหรือรายละเอียดปลีกย่อยจำนวนมาก อาจรู้สึกอึดอัด วิตกกังวล และหลุดโฟกัส",
    raci_strength: [
      "R (Responsible - งานครีเอทีฟ/สื่อสาร/สร้างแนวร่วม)",
      "C (Consulted - เติมมุมมองใหม่)",
    ],
    briefing_style:
      "เริ่มจากภาพใหญ่และคุณค่าของงานที่มีต่อผู้คน เปิดโอกาสให้แชร์ไอเดียก่อนลงรายละเอียด",
  },
  INFJ: {
    title: "The Advocate / Insightful Advisor",
    stack: [
      "Ni (Introverted Intuition)",
      "Fe (Extraverted Feeling)",
      "Ti (Introverted Thinking)",
      "Se (Extraverted Sensing)",
    ],
    inferior_grip:
      "Se Grip: เมื่อรับอารมณ์คนรอบข้างมากเกินไปจะเกิดภาวะล้า (Burnout) และต้องการเวลาอยู่เงียบๆ คนเดียว",
    raci_strength: [
      "C (Consulted - ที่ปรึกษาเชิงกลยุทธ์และคน)",
      "A (Accountable - งานที่ต้องใช้ความเข้าใจลึกซึ้ง)",
    ],
    briefing_style:
      "อธิบายความเชื่อมโยงของงานกับเป้าหมายรวม ให้เวลาเตรียมตัวก่อนประชุมใหญ่",
  },
  ISTJ: {
    title: "The Logistician / Inspector",
    stack: [
      "Si (Introverted Sensing)",
      "Te (Extraverted Thinking)",
      "Fi (Introverted Feeling)",
      "Ne (Extraverted Intuition)",
    ],
    inferior_grip:
      "Ne Grip: เมื่อเจอการเปลี่ยนแปลงกะทันหันโดยไม่มีแผนรองรับ อาจกังวลถึงผลกระทบเลวร้ายที่ควบคุมไม่ได้",
    raci_strength: [
      "R (Responsible - คุมมาตรฐาน/เอกสาร/ปฏิบัติการ)",
      "A (Accountable - ตรวจสอบความถูกต้อง)",
    ],
    briefing_style:
      "ส่งข้อมูลเป็นข้อๆ ชัดเจน มีขั้นตอน Reference อ้างอิงได้ และแจ้งล่วงหน้าหากมีการเปลี่ยนแผน",
  },
  ISFJ: {
    title: "The Defender / Supporter",
    stack: [
      "Si (Introverted Sensing)",
      "Fe (Extraverted Feeling)",
      "Ti (Introverted Thinking)",
      "Ne (Extraverted Intuition)",
    ],
    inferior_grip:
      "Ne Grip: เมื่อต้องแบกรับภาระเกินตัวเพราะเกรงใจคนอื่น อาจเก็บความเครียดไว้เงียบๆ จนระเบิด",
    raci_strength: [
      "R (Responsible - สนับสนุนทีม/ประสานงานละเอียด)",
      "I (Informed - ผู้รักษาความต่อเนื่องของงาน)",
    ],
    briefing_style:
      "สื่อสารด้วยความสุภาพ ชัดเจนเรื่องความคาดหวัง และคอยเช็กภาระงานไม่ให้ล้นมือ",
  },
  ESTJ: {
    title: "The Executive / Organizer",
    stack: [
      "Te (Extraverted Thinking)",
      "Si (Introverted Sensing)",
      "Ne (Extraverted Intuition)",
      "Fi (Introverted Feeling)",
    ],
    inferior_grip:
      "Fi Grip: เมื่อทีมทำงานไม่ได้ตามมาตรฐานที่วางไว้ อาจหงุดหงิดและสั่งการแบบเข้มงวดเกินไป",
    raci_strength: [
      "A (Accountable - บริหารจัดการปฏิบัติการ)",
      "R (Responsible - ปิดจ๊อบตามกำหนดเวลา)",
    ],
    briefing_style: "ตรงประเด็น มีตารางเวลา ผู้รับผิดชอบ และขั้นตอนตรวจสอบที่วัดผลได้",
  },
  ESFJ: {
    title: "The Consul / Harmonizer",
    stack: [
      "Fe (Extraverted Feeling)",
      "Si (Introverted Sensing)",
      "Ne (Extraverted Intuition)",
      "Ti (Introverted Thinking)",
    ],
    inferior_grip:
      "Ti Grip: เมื่อเกิดความขัดแย้งในทีม อาจโทษตัวเองหรือพยายามเอาใจทุกฝ่ายจนเสียจุดยืน",
    raci_strength: [
      "R (Responsible - ประสานงานข้ามฝ่าย/ดูแลลูกค้า)",
      "C (Consulted - บรรยากาศทีม)",
    ],
    briefing_style:
      "พูดคุยด้วยความเป็นมิตร ชื่นชมความร่วมมือ และระบุบทบาทของแต่ละคนให้ชัดเจน",
  },
  ISTP: {
    title: "The Virtuoso / Troubleshooter",
    stack: [
      "Ti (Introverted Thinking)",
      "Se (Extraverted Sensing)",
      "Ni (Introverted Intuition)",
      "Fe (Extraverted Feeling)",
    ],
    inferior_grip:
      "Fe Grip: เมื่อถูกกดดันทางอารมณ์หรือประชุมยืดเยื้อไร้สาระ จะปิดสวิตช์และถอยห่างทันที",
    raci_strength: [
      "R (Responsible - แก้ปัญหาเฉพาะหน้า/งานเทคนิค)",
      "C (Consulted - ประเมินความเป็นไปได้จริง)",
    ],
    briefing_style:
      "สั้น กระชับ บอกปัญหาและเครื่องมือที่มี แล้วปล่อยให้ลงมือแก้ด้วยตัวเอง",
  },
  ISFP: {
    title: "The Adventurer / Craftsman",
    stack: [
      "Fi (Introverted Feeling)",
      "Se (Extraverted Sensing)",
      "Ni (Introverted Intuition)",
      "Te (Extraverted Thinking)",
    ],
    inferior_grip:
      "Te Grip: เมื่อถูกบีบด้วยตัวเลขหรือกฎเกณฑ์แข็งทื่อมากเกินไป อาจรู้สึกหมดไฟและต่อต้านเงียบๆ",
    raci_strength: [
      "R (Responsible - งานออกแบบ/สุนทรียศาสตร์/ลงมือทำ)",
      "C (Consulted - ประสบการณ์ผู้ใช้)",
    ],
    briefing_style:
      "ให้ตัวอย่างภาพหรือ Mood & Tone ที่ชัดเจน เคารพพื้นที่ส่วนตัวในการสร้างสรรค์",
  },
  ESTP: {
    title: "The Entrepreneur / Dynamo",
    stack: [
      "Se (Extraverted Sensing)",
      "Ti (Introverted Thinking)",
      "Fe (Extraverted Feeling)",
      "Ni (Introverted Intuition)",
    ],
    inferior_grip:
      "Ni Grip: เมื่อติดอยู่ในสถานการณ์ที่ทำอะไรไม่ได้ทันที อาจหงุดหงิดหรือตัดสินใจเสี่ยงเกินไป",
    raci_strength: [
      "R (Responsible - เจรจาต่อรอง/ลุยงานเร่งด่วน)",
      "A (Accountable - แก้วิกฤตหน้างาน)",
    ],
    briefing_style:
      "คุยสั้นๆ เน้นการลงมือทำทันที เห็นผลลัพธ์ไว ไม่ต้องอ่านเอกสารยาว",
  },
  ESFP: {
    title: "The Entertainer / Performer",
    stack: [
      "Se (Extraverted Sensing)",
      "Fi (Introverted Feeling)",
      "Te (Extraverted Thinking)",
      "Ni (Introverted Intuition)",
    ],
    inferior_grip:
      "Ni Grip: เมื่อต้องวางแผนระยะยาวคนเดียวในสภาพแวดล้อมที่ตึงเครียด อาจกังวลและหลีกเลี่ยงปัญหา",
    raci_strength: [
      "R (Responsible - นำเสนอ/สร้างสีสันและพลังทีม)",
      "I (Informed - เชื่อมโยงผู้คน)",
    ],
    briefing_style:
      "คุยแบบโต้ตอบ สนุก กระชับ และเห็นภาพการนำไปใช้งานจริงทันที",
  },
  INFP: {
    title: "The Mediator / Idealist",
    stack: [
      "Fi (Introverted Feeling)",
      "Ne (Extraverted Intuition)",
      "Si (Introverted Sensing)",
      "Te (Extraverted Thinking)",
    ],
    inferior_grip:
      "Te Grip: เมื่อเจอความขัดแย้งรุนแรงหรือแรงกดดันด้านเวลา อาจวิจารณ์ตัวเองอย่างหนักหรือแข็งกร้าวผิดปกติ",
    raci_strength: [
      "C (Consulted - งานเขียน/คอนเทนต์/คุณค่าแบรนด์)",
      "R (Responsible - งานเชิงลึกที่ตรงกับความสนใจ)",
    ],
    briefing_style:
      "อธิบายความหมายและคุณค่าของงาน ให้เวลาคิดตกผลึก หลีกเลี่ยงการวิจารณ์ต่อหน้าคนหมู่มาก",
  },
  ENFJ: {
    title: "The Protagonist / Mentor",
    stack: [
      "Fe (Extraverted Feeling)",
      "Ni (Introverted Intuition)",
      "Se (Extraverted Sensing)",
      "Ti (Introverted Thinking)",
    ],
    inferior_grip:
      "Ti Grip: เมื่อทุ่มเทให้ทีมแต่ไม่ได้รับการตอบรับ อาจเก็บไปคิดวิเคราะห์วนเวียนและสงสัยในคุณค่าตัวเอง",
    raci_strength: [
      "A (Accountable - พัฒนาทีม/นำโปรเจกต์ร่วมมือ)",
      "R (Responsible - สื่อสารวิสัยทัศน์)",
    ],
    briefing_style:
      "พูดคุยถึงเป้าหมายร่วมของทีม เปิดโอกาสให้มีส่วนร่วมในการวางแผนและดูแลคน",
  },
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatPillar(ganZhi: string): PillarInfo {
  const stemChar = ganZhi[0];
  const branchChar = ganZhi[1];
  const stemInfo = HEAVENLY_STEMS[stemChar];
  const branchInfo = EARTHLY_BRANCHES[branchChar];
  return {
    raw: ganZhi,
    stem: stemChar,
    stem_th: stemInfo.th,
    stem_element: stemInfo.element,
    branch: branchChar,
    branch_animal: branchInfo.animal,
    branch_element: branchInfo.element,
  };
}

export function calculateBaziProfileLocal(
  birthDate: string,
  birthTime?: string | null,
  province: string = "กรุงเทพมหานคร"
): BaziData {
  const hasTime = Boolean(birthTime && birthTime.trim());
  const [y, m, d] = birthDate.split("-").map(Number);
  let hr = 12;
  let min = 0;

  if (hasTime && birthTime) {
    const parts = birthTime.trim().split(":").map(Number);
    hr = parts[0] ?? 12;
    min = parts[1] ?? 0;
  }

  // Use UTC timestamp arithmetic to avoid local timezone DST shifts
  const baseMs = Date.UTC(y, m - 1, d, hr, min, 0);
  const longitude = THAI_PROVINCE_LONGITUDES[province] ?? 100.5018;
  const offsetMinutes = hasTime ? (longitude - 105.0) * 4.0 : 0;
  const solarDate = new Date(baseMs + offsetMinutes * 60 * 1000);

  const sy = solarDate.getUTCFullYear();
  const sm = solarDate.getUTCMonth() + 1;
  const sd = solarDate.getUTCDate();
  const sh = solarDate.getUTCHours();
  const smin = solarDate.getUTCMinutes();

  const solar = Solar.fromYmdHms(sy, sm, sd, sh, smin, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  eightChar.setSect(2);

  const yearGz = eightChar.getYear();
  const monthGz = eightChar.getMonth();
  const dayGz = eightChar.getDay();
  const hourGz = hasTime ? eightChar.getTime() : null;

  const dayStemChar = dayGz[0];
  const dayMaster = HEAVENLY_STEMS[dayStemChar];

  const pillars = {
    year: formatPillar(yearGz),
    month: formatPillar(monthGz),
    day: formatPillar(dayGz),
    hour: hourGz ? formatPillar(hourGz) : null,
  };

  const branches = [
    pillars.year.branch,
    pillars.month.branch,
    pillars.day.branch,
    ...(pillars.hour ? [pillars.hour.branch] : []),
  ];

  const internalInteractions: string[] = [];
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const b1 = branches[i];
      const b2 = branches[j];
      if (BRANCH_CLASHES[b1] === b2) {
        internalInteractions.push(`ภายในดวงมีคู่ปะทะ (ชง): ${b1}-${b2}`);
      }
      if (BRANCH_COMBINES[b1] === b2) {
        internalInteractions.push(`ภายในดวงมีคู่ภาคี (ฮะ): ${b1}-${b2}`);
      }
    }
  }

  return {
    true_solar_time: hasTime ? `${sy}-${pad2(sm)}-${pad2(sd)} ${pad2(sh)}:${pad2(smin)}` : null,
    province,
    day_master: {
      char: dayStemChar,
      name_th: dayMaster.th,
      element: dayMaster.element,
      polarity: dayMaster.polarity,
      work_metaphor: dayMaster.metaphor,
    },
    pillars,
    internal_interactions: internalInteractions,
  };
}

export function getMbtiProfileLocal(mbtiCode: string): MbtiData {
  const cleanCode = mbtiCode.trim().toUpperCase();
  const parts = cleanCode.split("-");
  const baseType = parts[0];
  const identity = parts.length > 1 ? parts[1] : "A";
  const profile = MBTI_PROFILES[baseType];
  if (!profile) {
    throw new Error(`ไม่พบรหัส MBTI: ${mbtiCode}`);
  }

  const identityNote =
    identity === "A"
      ? "Assertive (-A): มั่นใจในตัวเอง รับมือแรงกดดันได้นิ่ง แต่อาจมองข้ามสัญญาณเตือนเล็กๆ น้อยๆ"
      : "Turbulent (-T): ละเอียดรอบคอบ ใส่ใจการพัฒนาตัวเองสูง แต่อาจเครียดหรือกังวลล่วงหน้าได้ง่าย";

  return {
    code: `${baseType}-${identity}`,
    base_type: baseType,
    identity,
    identity_note: identityNote,
    ...profile,
  };
}

export function buildProfileJsonLocal(payload: ProfileInput): ProfileJSON {
  const bazi = calculateBaziProfileLocal(payload.birth_date, payload.birth_time, payload.province);
  const mbti = getMbtiProfileLocal(payload.mbti);
  return {
    name: payload.name.trim(),
    role: (payload.role || "").trim() || "ไม่ระบุตำแหน่ง",
    birth_date: payload.birth_date,
    birth_time: payload.birth_time && payload.birth_time.trim() ? payload.birth_time : null,
    province: payload.province,
    bazi,
    mbti,
  };
}

export function analyzeLocal(payload: ProfileInput): AnalyzeResponse {
  const profile = buildProfileJsonLocal(payload);
  const dm = profile.bazi.day_master;
  const mbti = profile.mbti;
  const raciList = mbti.raci_strength;
  const primaryRaci = raciList.map((r) => r.split(" ")[0]).join(" / ");
  const internal = profile.bazi.internal_interactions;
  const internalNote =
    internal.length > 0 ? ` นอกจากนี้${internal[0]} จึงมักมีการคิดทบทวนหลายมุมในตัวเอง` : "";

  const manual: IndividualOperatingManual = {
    archetype_title: `${mbti.title} พลัง${dm.name_th}`,
    core_energy_summary: `ผสมผสานแกนพลังงาน${dm.name_th} (${dm.work_metaphor}) เข้ากับกระบวนการคิดแบบ ${mbti.code} (${mbti.stack[0]} นำ) ทำให้โดดเด่นทั้งการคิดเชิงโครงสร้างและการลงมือทำตามจังหวะของตนเอง${internalNote}`,
    natural_raci: {
      primary_role: primaryRaci,
      reason: `อ้างอิงจากจุดแข็ง ${mbti.code}: ${raciList.join(", ")}`,
      confidence_tag: "[กติกาโครงสร้าง]",
    },
    communication_cheat_sheet: [
      {
        rule: "วิธีบรีฟงานที่ได้ผลที่สุด",
        detail: mbti.briefing_style,
        confidence_tag: "[กติกาโครงสร้าง]",
      },
      {
        rule: `จังหวะการทำงานตามธรรมชาติ (${dm.name_th})`,
        detail: `มีสไตล์เหมือน${dm.work_metaphor} ควรจัดสภาพแวดล้อมให้สอดคล้องกับพลังงานธาตุ${dm.element}`,
        confidence_tag: "[แบบจำลองพฤติกรรม]",
      },
      {
        rule: `การปรับจูนตามมิติ ${mbti.identity} (${mbti.code})`,
        detail: mbti.identity_note,
        confidence_tag: "[แบบจำลองพฤติกรรม]",
      },
    ],
    stress_and_grip_protocol: {
      warning_signs: mbti.inferior_grip,
      teammate_support_guide:
        "ลดสิ่งเร้าหรือการตามงานถี่เกินไป ช่วยจัดลำดับความสำคัญ 1-2 ข้อแรกให้ชัดเจน และเปิดพื้นที่ให้จัดการงานทีละส่วนตามแนวทางที่ถนัด",
      confidence_tag: "[แบบจำลองพฤติกรรม]",
    },
    disclaimer:
      "ข้อมูลนี้เป็นการผสานกรอบอุปมาธาตุและจิตวิทยาบุคลิกภาพเพื่อใช้สื่อสารในทีม ไม่ใช่การประเมินผลการทำงานหรือคำวินิจฉัยทางการแพทย์",
  };

  return {
    profile,
    manual,
    synthesis_mode: "deterministic_fallback",
  };
}

export function compareBaziPillarsLocal(profileA: BaziData, profileB: BaziData): CrossBaziAnalysis {
  const pa = profileA.pillars;
  const pb = profileB.pillars;
  const interactions: CrossInteraction[] = [];

  if (pa.month.raw === pb.month.raw) {
    interactions.push({
      type: "Month Pillar Match (เสาเดือนตรงกันเป๊ะ)",
      level: "High Alignment",
      detail: `มีเสาเดือน ${pa.month.raw} เหมือนกัน แปลว่ามีค่านิยมการทำงานและมาตรฐานคุณภาพในทิศทางเดียวกัน`,
    });
  } else if (BRANCH_CLASHES[pa.month.branch] === pb.month.branch) {
    interactions.push({
      type: "Month Branch Clash (เสาเดือนปะทะ/ชง)",
      level: "Friction Alert",
      detail:
        "สไตล์การจัดลำดับความสำคัญและจังหวะการทำงานต่างกัน ควรตกลง KPI และ Scope งานเป็นลายลักษณ์อักษรตั้งแต่ต้น",
    });
  }

  if (BRANCH_COMBINES[pa.day.branch] === pb.day.branch) {
    interactions.push({
      type: "Day Branch Combine (เสาวันภาคี/ฮะ)",
      level: "Synergy",
      detail: "เคมีการสื่อสารเข้ากันได้ดี คุยกันเข้าใจง่ายและพร้อมช่วยเหลือกันในหน้างาน",
    });
  } else if (BRANCH_CLASHES[pa.day.branch] === pb.day.branch) {
    interactions.push({
      type: "Day Branch Clash (เสาวันปะทะ/ชง)",
      level: "Communication Care",
      detail:
        "มุมมองการแก้ปัญหาเฉพาะหน้ามักสวนทางกัน ช่วยอุดจุดบอดกันได้ดีแต่ต้องระวังการสื่อสารที่ตรงเกินไป",
    });
  }

  return {
    day_master_pair: `${profileA.day_master.name_th} + ${profileB.day_master.name_th}`,
    cross_interactions: interactions,
  };
}

export function compareLocal(inputA: ProfileInput, inputB: ProfileInput): CompareResponse {
  const personA = buildProfileJsonLocal(inputA);
  const personB = buildProfileJsonLocal(inputB);
  const crossBazi = compareBaziPillarsLocal(personA.bazi, personB.bazi);

  const dmA = personA.bazi.day_master;
  const dmB = personB.bazi.day_master;
  const mbtiA = personA.mbti;
  const mbtiB = personB.mbti;
  const interactions = crossBazi.cross_interactions;

  let baseScore = 78;
  for (const item of interactions) {
    if (item.level === "High Alignment" || item.level === "Synergy") {
      baseScore += 8;
    } else if (item.level === "Friction Alert" || item.level === "Communication Care") {
      baseScore -= 5;
    }
  }
  const synergyScore = Math.max(50, Math.min(98, baseScore));

  let alignTitle: string;
  let alignDetail: string;
  if (interactions.length > 0) {
    alignTitle = `${interactions[0].type} (${crossBazi.day_master_pair})`;
    alignDetail = interactions[0].detail;
  } else {
    alignTitle = `การผสานพลังระหว่าง ${dmA.name_th} และ ${dmB.name_th}`;
    alignDetail = `${personA.name} (${mbtiA.code}) ถนัด ${mbtiA.raci_strength[0]} ในขณะที่ ${personB.name} (${mbtiB.code}) ถนัด ${mbtiB.raci_strength[0]} สามารถแบ่งบทบาท RACI เสริมกันได้ชัดเจน`;
  }

  const synergy: PairwiseSynergy = {
    duo_codename: `คู่หู ${dmA.name_th.split(" ")[0]} x ${dmB.name_th.split(" ")[0]} (${mbtiA.base_type} + ${mbtiB.base_type})`,
    synergy_score: synergyScore,
    alignment_highlight: {
      title: alignTitle,
      detail: alignDetail,
      confidence_tag: "[กติกาโครงสร้าง]",
    },
    friction_triggers: [
      {
        scenario: "เมื่อต้องบรีฟงานด่วนหรือตัดสินใจภายใต้เวลาจำกัด",
        root_cause: `${personA.name} ใช้ ${mbtiA.stack[0]} เป็นแกนหลัก ส่วน ${personB.name} ใช้ ${mbtiB.stack[0]} เป็นแกนหลัก`,
        mitigation_rule: `เวลาคุยกับ ${personA.name}: ${mbtiA.briefing_style} | เวลาคุยกับ ${personB.name}: ${mbtiB.briefing_style}`,
        confidence_tag: "[กติกาโครงสร้าง]",
      },
      {
        scenario: "เมื่อเกิดความกดดันสะสมช่วงใกล้เดดไลน์ (The Grip)",
        root_cause: `${personA.name} อาจเกิด ${mbtiA.inferior_grip.split(":")[0]} และ ${personB.name} อาจเกิด ${mbtiB.inferior_grip.split(":")[0]}`,
        mitigation_rule:
          "ตกลงขอบเขตความรับผิดชอบ (RACI) เป็นลายลักษณ์อักษรตั้งแต่ต้นโปรเจกต์ และแยกเวลาระดมสมองออกจากเวลาตัดสินใจปิดงาน",
        confidence_tag: "[แบบจำลองพฤติกรรม]",
      },
    ],
    dos_and_donts: {
      do: [
        `แบ่งบทบาทตามจุดแข็ง: ให้ ${personA.name} โฟกัส ${mbtiA.raci_strength[0]} และ ${personB.name} โฟกัส ${mbtiB.raci_strength[0]}`,
        "สรุป Action Items และนิยามคำว่า 'เสร็จ (Definition of Done)' ร่วมกันหลังประชุมทุกครั้ง",
      ],
      dont: [
        "อย่าบรีฟงานสวนทางกับสไตล์ธรรมชาติของอีกฝ่ายโดยไม่บอกเหตุผลล่วงหน้า",
        "อย่าปล่อยให้ความเงียบหรือความเกรงใจสะสมจนเกิดภาวะ The Grip ช่วงท้ายโปรเจกต์",
      ],
    },
  };

  return {
    person_a: personA,
    person_b: personB,
    cross_bazi: crossBazi,
    synergy,
    synthesis_mode: "deterministic_fallback",
  };
}
