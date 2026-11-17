"use client";

import React from "react";
import { BaziData, ElementType, PillarInfo } from "@/types";
import { Compass, Sparkles } from "lucide-react";

const ELEMENT_BADGE: Record<ElementType, string> = {
  Wood: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Fire: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
  Earth: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  Metal: "bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  Water: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
};

const ELEMENT_TH: Record<ElementType, string> = {
  Wood: "ไม้",
  Fire: "ไฟ",
  Earth: "ดิน",
  Metal: "ทอง",
  Water: "น้ำ",
};

interface SinglePillarBoxProps {
  label: string;
  sublabel: string;
  pillar: PillarInfo | null;
  isDayMaster?: boolean;
}

function SinglePillarBox({ label, sublabel, pillar, isDayMaster }: SinglePillarBoxProps) {
  if (!pillar) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 flex flex-col items-center justify-center text-center min-h-[140px] bg-slate-50/50 dark:bg-slate-900/40">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">{sublabel}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500">ไม่ระบุเวลาเกิด</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-3 flex flex-col items-center text-center transition-all ${
        isDayMaster
          ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-sm"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        {isDayMaster && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-medium">
            Day Master
          </span>
        )}
      </div>
      <span className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">{sublabel}</span>

      <div className="text-2xl font-bold tracking-widest text-slate-900 dark:text-white my-1">
        {pillar.raw}
      </div>

      <div className="w-full space-y-1.5 mt-1">
        <div
          className={`text-xs px-2 py-0.5 rounded border font-medium ${
            ELEMENT_BADGE[pillar.stem_element]
          }`}
        >
          {pillar.stem_th}
        </div>
        <div
          className={`text-xs px-2 py-0.5 rounded border font-medium ${
            ELEMENT_BADGE[pillar.branch_element]
          }`}
        >
          {pillar.branch_animal} ({ELEMENT_TH[pillar.branch_element]})
        </div>
      </div>
    </div>
  );
}

interface PillarCardProps {
  bazi: BaziData;
}

export default function PillarCard({ bazi }: PillarCardProps) {
  const { day_master, pillars, true_solar_time, province, internal_interactions } = bazi;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              โครงสร้าง 4 เสาหลัก (BaZi Four Pillars)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              จังหวัด: {province}{" "}
              {true_solar_time
                ? `• เวลาสุริยคติจริง (TST): ${true_solar_time} น.`
                : "• คำนวณแบบ 3 เสา (ไม่ระบุเวลาเกิด)"}
            </p>
          </div>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
            ELEMENT_BADGE[day_master.element]
          }`}
        >
          ดิถี {day_master.name_th}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SinglePillarBox label="เสายาม" sublabel="ความคิด/ลูกทีม" pillar={pillars.hour} />
        <SinglePillarBox label="เสาวัน" sublabel="ตัวตนหลัก" pillar={pillars.day} isDayMaster />
        <SinglePillarBox label="เสาเดือน" sublabel="งาน/บรรทัดฐาน" pillar={pillars.month} />
        <SinglePillarBox label="เสาปี" sublabel="ภาพลักษณ์/สังคม" pillar={pillars.year} />
      </div>

      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>อุปมาพลังงานการทำงาน (Day Master Metaphor):</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {day_master.work_metaphor}
        </p>
        {internal_interactions.length > 0 && (
          <div className="pt-1 flex flex-wrap gap-1.5">
            {internal_interactions.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px]"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
