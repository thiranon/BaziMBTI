const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/bazimbti";

export const STEM_IRASUTOYA_MAP: Record<string, string> = {
  "甲": `${BASE_PATH}/irasutoya/stem_jia.png`,   // ไม้หยาง - ต้นไม้ใหญ่
  "乙": `${BASE_PATH}/irasutoya/stem_yi.png`,    // ไม้หยิน - ต้นอ่อน/ใบไม้
  "丙": `${BASE_PATH}/irasutoya/stem_bing.png`,  // ไฟหยาง - ดวงอาทิตย์
  "丁": `${BASE_PATH}/irasutoya/stem_ding.png`,  // ไฟหยิน - แสงเทียน
  "戊": `${BASE_PATH}/irasutoya/stem_wu.png`,    // ดินหยาง - ภูเขา
  "己": `${BASE_PATH}/irasutoya/stem_ji.png`,    // ดินหยิน - แปลงเพาะปลูก
  "庚": `${BASE_PATH}/irasutoya/stem_geng.png`,  // ทองหยาง - ดาบเหล็กกล้า
  "辛": `${BASE_PATH}/irasutoya/stem_xin.png`,   // ทองหยิน - อัญมณี/คริสตัล
  "壬": `${BASE_PATH}/irasutoya/stem_ren.png`,   // น้ำหยาง - คลื่นมหาสมุทร
  "癸": `${BASE_PATH}/irasutoya/stem_gui.png`,   // น้ำหยิน - หยดน้ำ
};

export const BRANCH_IRASUTOYA_MAP: Record<string, string> = {
  "子": `${BASE_PATH}/irasutoya/branch_zi.png`,   // ชวด (หนู)
  "丑": `${BASE_PATH}/irasutoya/branch_chou.png`, // ฉลู (วัว)
  "寅": `${BASE_PATH}/irasutoya/branch_yin.png`,  // ขาล (เสือ)
  "卯": `${BASE_PATH}/irasutoya/branch_mao.png`,  // เถาะ (กระต่าย)
  "辰": `${BASE_PATH}/irasutoya/branch_chen.png`, // มะโรง (มังกร)
  "巳": `${BASE_PATH}/irasutoya/branch_si.png`,   // มะเส็ง (งู)
  "午": `${BASE_PATH}/irasutoya/branch_wu.png`,   // มะเมีย (ม้า)
  "未": `${BASE_PATH}/irasutoya/branch_wei.png`,  // มะแม (แพะ)
  "申": `${BASE_PATH}/irasutoya/branch_shen.png`, // วอก (ลิง)
  "酉": `${BASE_PATH}/irasutoya/branch_you.png`,  // ระกา (ไก่)
  "戌": `${BASE_PATH}/irasutoya/branch_xu.png`,   // จอ (สุนัข)
  "亥": `${BASE_PATH}/irasutoya/branch_hai.png`,  // กุน (หมู)
};

export const UI_IRASUTOYA = {
  gogyou: `${BASE_PATH}/irasutoya/gogyou.png`,
  teamCircle: `${BASE_PATH}/irasutoya/team_circle.png`,
  teamHuddle: `${BASE_PATH}/irasutoya/team_huddle.png`,
  meetingSmile: `${BASE_PATH}/irasutoya/meeting_smile.png`,
  stressCheck: `${BASE_PATH}/irasutoya/stress_check.png`,
};
