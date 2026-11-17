export type ElementType = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export interface PillarInfo {
  raw: string;
  stem: string;
  stem_th: string;
  stem_element: ElementType;
  branch: string;
  branch_animal: string;
  branch_element: ElementType;
}

export interface DayMasterInfo {
  char: string;
  name_th: string;
  element: ElementType;
  polarity: "Yang" | "Yin";
  work_metaphor: string;
}

export interface BaziData {
  true_solar_time: string | null;
  province: string;
  day_master: DayMasterInfo;
  pillars: {
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;
    hour: PillarInfo | null;
  };
  internal_interactions: string[];
}

export interface MbtiData {
  code: string;
  base_type: string;
  identity: string;
  identity_note: string;
  title: string;
  stack: string[];
  inferior_grip: string;
  raci_strength: string[];
  briefing_style: string;
}

export interface ProfileJSON {
  name: string;
  role: string;
  birth_date: string;
  birth_time: string | null;
  province: string;
  bazi: BaziData;
  mbti: MbtiData;
}

export interface ProfileInput {
  name: string;
  birth_date: string;
  birth_time?: string | null;
  province: string;
  mbti: string;
  role?: string;
}

export interface NaturalRaci {
  primary_role: string;
  reason: string;
  confidence_tag: string;
}

export interface CommunicationRule {
  rule: string;
  detail: string;
  confidence_tag: string;
}

export interface StressProtocol {
  warning_signs: string;
  teammate_support_guide: string;
  confidence_tag: string;
}

export interface IndividualOperatingManual {
  archetype_title: string;
  core_energy_summary: string;
  natural_raci: NaturalRaci;
  communication_cheat_sheet: CommunicationRule[];
  stress_and_grip_protocol: StressProtocol;
  disclaimer: string;
}

export interface AnalyzeResponse {
  profile: ProfileJSON;
  manual: IndividualOperatingManual;
  synthesis_mode: "llm" | "deterministic_fallback";
}

export interface CrossInteraction {
  type: string;
  level: string;
  detail: string;
}

export interface CrossBaziAnalysis {
  day_master_pair: string;
  cross_interactions: CrossInteraction[];
}

export interface FrictionTrigger {
  scenario: string;
  root_cause: string;
  mitigation_rule: string;
  confidence_tag: string;
}

export interface PairwiseSynergy {
  duo_codename: string;
  synergy_score: number;
  alignment_highlight: {
    title: string;
    detail: string;
    confidence_tag: string;
  };
  friction_triggers: FrictionTrigger[];
  dos_and_donts: {
    do: string[];
    dont: string[];
  };
}

export interface CompareResponse {
  person_a: ProfileJSON;
  person_b: ProfileJSON;
  cross_bazi: CrossBaziAnalysis;
  synergy: PairwiseSynergy;
  synthesis_mode: "llm" | "deterministic_fallback";
}
