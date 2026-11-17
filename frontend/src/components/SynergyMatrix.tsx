"use client";

import React, { useState } from "react";
import { AnalyzeResponse, CompareResponse } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Flame,
  Handshake,
  Loader2,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";

interface SynergyMatrixProps {
  savedProfiles: AnalyzeResponse[];
  onCompare: (personA: AnalyzeResponse, personB: AnalyzeResponse) => Promise<void>;
  compareResult: CompareResponse | null;
  isComparing: boolean;
}

export default function SynergyMatrix({
  savedProfiles,
  onCompare,
  compareResult,
  isComparing,
}: SynergyMatrixProps) {
  const [indexA, setIndexA] = useState<number>(0);
  const [indexB, setIndexB] = useState<number>(savedProfiles.length > 1 ? 1 : 0);

  if (savedProfiles.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center space-y-2">
        <Users className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          ต้องมีโปรไฟล์สมาชิกในทีมอย่างน้อย 2 คนเพื่อเปรียบเทียบ
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          กรุณาเพิ่มข้อมูลสมาชิกในแท็บ &ldquo;My Work Manual&rdquo; ให้ครบ 2 คนขึ้นไป
          ระบบจะเก็บไว้ใน Session Memory เพื่อนำมาวิเคราะห์ Pairwise Synergy ที่นี่
        </p>
      </div>
    );
  }

  const handleRunCompare = async () => {
    const pA = savedProfiles[indexA];
    const pB = savedProfiles[indexB];
    if (!pA || !pB) return;
    await onCompare(pA, pB);
  };

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Handshake className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              จับคู่วิเคราะห์เคมีการทำงาน (Pairwise Team Synergy Matrix)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              เลือกเพื่อนร่วมงาน 2 คนเพื่อดูจุดเสริมพลัง (Power Combo), โอกาสปะทะ (Friction Triggers) และกติกาทำงานร่วมกัน
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              สมาชิกคนที่ 1 (Person A)
            </label>
            <select
              value={indexA}
              onChange={(e) => setIndexA(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              {savedProfiles.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.profile.name} ({item.profile.mbti.code} • ดิถี{item.profile.bazi.day_master.name_th})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              สมาชิกคนที่ 2 (Person B)
            </label>
            <select
              value={indexB}
              onChange={(e) => setIndexB(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              {savedProfiles.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.profile.name} ({item.profile.mbti.code} • ดิถี{item.profile.bazi.day_master.name_th})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleRunCompare}
          disabled={isComparing}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 transition-colors"
        >
          {isComparing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังคำนวณปฏิกิริยาข้ามดวงและพลวัตทีม...
            </>
          ) : (
            <>วิเคราะห์ความเข้ากันได้ของคู่นี้</>
          )}
        </button>
      </div>

      {/* Comparison Result */}
      {compareResult && (
        <div className="space-y-5">
          {/* Top Synergy Score Card */}
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Pairwise Operating Protocol • {compareResult.cross_bazi.day_master_pair}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {compareResult.synergy.duo_codename}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {compareResult.person_a.name} ({compareResult.person_a.mbti.code}) ×{" "}
                  {compareResult.person_b.name} ({compareResult.person_b.mbti.code})
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3 shadow-sm">
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Synergy Metric
                  </div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {compareResult.synergy.synergy_score}/100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Power Combo & Cross-Pillar Interactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Power Combo (จุดร่วมที่ส่งเสริมกันที่สุด)
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {compareResult.synergy.alignment_highlight.confidence_tag}
                </span>
              </div>
              <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                {compareResult.synergy.alignment_highlight.title}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {compareResult.synergy.alignment_highlight.detail}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Flame className="w-5 h-5 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  ปฏิกิริยาข้ามดวง (Cross-Pillar BaZi Interactions)
                </h4>
              </div>
              {compareResult.cross_bazi.cross_interactions.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ไม่พบคู่ชงหรือคู่ฮะโดยตรงระหว่างเสาเดือนและเสาวัน พลังงานเป็นกลาง สามารถปรับจูนตามกระบวนการ MBTI และ RACI ได้เลย
                </p>
              ) : (
                <div className="space-y-2">
                  {compareResult.cross_bazi.cross_interactions.map((ix, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span>{ix.type}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                          {ix.level}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{ix.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Friction Triggers & Mitigation */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                จุดเสี่ยงขัดแย้งและกติกาป้องกันดราม่า (Friction Triggers & Mitigation Rules)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compareResult.synergy.friction_triggers.map((ft, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      สถานการณ์ที่ {idx + 1}: {ft.scenario}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0">
                      {ft.confidence_tag}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong>สาเหตุเชิงโครงสร้าง:</strong> {ft.root_cause}
                  </p>
                  <div className="rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50 p-2.5 text-indigo-950 dark:text-indigo-200">
                    <strong>กติกาตกลงร่วมกัน (Mitigation Rule):</strong> {ft.mitigation_rule}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 space-y-3">
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Do&apos;s (สิ่งที่ควรทำเมื่อร่วมงานกัน)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                {compareResult.synergy.dos_and_donts.do.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-5 space-y-3">
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                Don&apos;ts (สิ่งที่ควรหลีกเลี่ยง)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                {compareResult.synergy.dos_and_donts.dont.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
