"use client";

import React, { useState } from "react";
import { AnalyzeResponse } from "@/types";
import PillarCard from "./PillarCard";
import { STEM_IRASUTOYA_MAP, UI_IRASUTOYA } from "@/lib/irasutoya";
import {
  AlertTriangle,
  Brain,
  Check,
  Copy,
  MessageSquare,
  ShieldCheck,
  Target,
} from "lucide-react";

interface ManualViewProps {
  data: AnalyzeResponse;
}

export default function ManualView({ data }: ManualViewProps) {
  const { profile, manual, synthesis_mode } = data;
  const [copied, setCopied] = useState(false);
  const stemAvatar = STEM_IRASUTOYA_MAP[profile.bazi.day_master.char] || UI_IRASUTOYA.gogyou;

  const handleCopySummary = async () => {
    const summaryText = [
      `📘 คู่มือการทำงานของ ${profile.name} (${profile.role})`,
      `• ฉายา: ${manual.archetype_title}`,
      `• โครงสร้าง: ดิถี${profile.bazi.day_master.name_th} | MBTI: ${profile.mbti.code}`,
      `• บทบาท RACI ที่ถนัด: ${manual.natural_raci.primary_role} — ${manual.natural_raci.reason}`,
      `• พลังงานหลัก: ${manual.core_energy_summary}`,
      `• วิธีบรีฟงาน:`,
      ...manual.communication_cheat_sheet.map(
        (c, i) => `  ${i + 1}. ${c.rule}: ${c.detail} ${c.confidence_tag}`
      ),
      `• สัญญาณความเครียด (The Grip): ${manual.stress_and_grip_protocol.warning_signs}`,
      `• วิธีซัพพอร์ต: ${manual.stress_and_grip_protocol.teammate_support_guide}`,
    ].join("\n");

    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={stemAvatar}
              alt={profile.bazi.day_master.name_th}
              className="w-20 h-20 object-contain rounded-2xl bg-white dark:bg-slate-800 p-2 border border-indigo-100 dark:border-slate-700 shadow-sm shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  {profile.mbti.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {profile.role}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  โหมดสังเคราะห์: {synthesis_mode === "llm" ? "AI Synthesis" : "Deterministic Engine"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {profile.name} — “{manual.archetype_title}”
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {manual.core_energy_summary}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                คัดลอกแล้ว!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                คัดลอกการ์ดสรุป
              </>
            )}
          </button>
        </div>
      </div>

      {/* Four Pillars + MBTI Cognitive Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <PillarCard bazi={profile.bazi} />
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ลำดับฟังก์ชันคิด (Cognitive Stack)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{profile.mbti.title}</p>
            </div>
          </div>

          <div className="space-y-2">
            {profile.mbti.stack.map((fn, idx) => {
              const roles = ["Dominant (แกนนำ)", "Auxiliary (สนับสนุน)", "Tertiary (ผ่อนคลาย)", "Inferior (จุดเปราะบาง)"];
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{fn}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{roles[idx]}</span>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50 p-3 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                บทบาท RACI ตามธรรมชาติ: {manual.natural_raci.primary_role}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                {manual.natural_raci.confidence_tag}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {manual.natural_raci.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Communication Cheat Sheet & Stress Protocol */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Communication Cheat Sheet (วิธีบรีฟและคุยงาน)
              </h3>
            </div>
            <img
              src={UI_IRASUTOYA.meetingSmile}
              alt="Meeting"
              className="w-10 h-10 object-contain"
            />
          </div>

          <div className="space-y-3">
            {manual.communication_cheat_sheet.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {idx + 1}. {item.rule}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                    {item.confidence_tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Stress &amp; Grip Protocol (คู่มือรับมือยามฉุกเฉิน)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {manual.stress_and_grip_protocol.confidence_tag}
                </span>
              </div>
            </div>
            <img
              src={UI_IRASUTOYA.stressCheck}
              alt="Stress Check"
              className="w-10 h-10 object-contain"
            />
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-rose-200/70 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-3.5 space-y-1">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                สัญญาณเตือนเมื่อพลังงานตึงเครียด (Warning Signs):
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {manual.stress_and_grip_protocol.warning_signs}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 space-y-1">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                วิธีที่เพื่อนร่วมทีมควรซัพพอร์ต (Teammate Support Guide):
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {manual.stress_and_grip_protocol.teammate_support_guide}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
