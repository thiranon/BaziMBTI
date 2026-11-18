"use client";

import React, { useEffect, useState } from "react";
import { ProfileInput } from "@/types";
import { Loader2, UserPlus } from "lucide-react";

const THAI_PROVINCES = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "เชียงราย",
  "ขอนแก่น",
  "นครราชสีมา",
  "ชลบุรี",
  "ภูเก็ต",
  "สงขลา",
  "นนทบุรี",
  "ปทุมธานี",
  "สมุทรปราการ",
];

const MBTI_TYPES = [
  "INTP", "INTJ", "ENTP", "ENTJ",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

interface ProfileFormProps {
  onSubmit: (data: ProfileInput) => Promise<void>;
  isLoading: boolean;
}

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [birthDate, setBirthDate] = useState("1995-08-15");
  const [birthTime, setBirthTime] = useState("10:30");
  const [unknownTime, setUnknownTime] = useState(false);
  const [province, setProvince] = useState("กรุงเทพมหานคร");
  const [mbtiBase, setMbtiBase] = useState("INTP");
  const [mbtiIdentity, setMbtiIdentity] = useState<"A" | "T">("A");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawMbti = params.get("mbti");
      if (rawMbti) {
        const cleaned = rawMbti.trim().toUpperCase();
        const [base, id] = cleaned.split("-");
        if (base && MBTI_TYPES.includes(base)) {
          setMbtiBase(base);
        }
        if (id === "A" || id === "T") {
          setMbtiIdentity(id);
        }
      }
    } catch {
      // Ignore URL parse errors
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;

    await onSubmit({
      name: name.trim(),
      role: role.trim() || "ไม่ระบุตำแหน่ง",
      birth_date: birthDate,
      birth_time: unknownTime ? null : birthTime || null,
      province,
      mbti: `${mbtiBase}-${mbtiIdentity}`,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            สร้างคู่มือการทำงาน (Work Operating Manual)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ข้อมูลประมวลผลแบบ In-Memory และเก็บเฉพาะใน Session เบราว์เซอร์ของคุณ (PDPA Privacy-First)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            ชื่อเล่น / ชื่อที่ใช้ในทีม *
          </label>
          <input
            type="text"
            required
            placeholder="เช่น นัท, เมย์, Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            ตำแหน่ง / สายงาน (Role)
          </label>
          <input
            type="text"
            placeholder="เช่น Backend Dev, Product Owner, Creative"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            วันเดือนปีเกิด (ค.ศ.) *
          </label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              เวลาเกิด (24 ชม.)
            </label>
            <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              ไม่ทราบเวลาเกิด
            </label>
          </div>
          <input
            type="time"
            disabled={unknownTime}
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            จังหวัดที่เกิด (ปรับ True Solar Time)
          </label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {THAI_PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                MBTI (16 Types) *
              </label>
              <a
                href="/mbti/"
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                ไม่แน่ใจไทป์? ทำแบบทดสอบฟรี →
              </a>
            </div>
            <select
              value={mbtiBase}
              onChange={(e) => setMbtiBase(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MBTI_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Identity
            </label>
            <select
              value={mbtiIdentity}
              onChange={(e) => setMbtiIdentity(e.target.value as "A" | "T")}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="A">-A (Assertive)</option>
              <option value="T">-T (Turbulent)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            กำลังคำนวณผังธาตุและสังเคราะห์คู่มือทำงาน...
          </>
        ) : (
          <>สร้างคู่มือประจำตัวและบันทึกเข้าทีม</>
        )}
      </button>
    </form>
  );
}
