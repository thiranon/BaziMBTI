"use client";

import React, { useEffect, useState } from "react";
import { AnalyzeResponse, CompareResponse, ProfileInput } from "@/types";
import ProfileForm from "@/components/ProfileForm";
import ManualView from "@/components/ManualView";
import SynergyMatrix from "@/components/SynergyMatrix";
import { UI_IRASUTOYA } from "@/lib/irasutoya";
import { BookOpen, Monitor, Moon, ShieldAlert, Sun, Trash2, Users } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SESSION_STORAGE_KEY = "team_synergy_profiles_v1";
const THEME_STORAGE_KEY = "team_synergy_theme";
type ThemeMode = "system" | "light" | "dark";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"manual" | "compare">("manual");
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [systemDark, setSystemDark] = useState(false);

  const [savedProfiles, setSavedProfiles] = useState<AnalyzeResponse[]>([]);
  const [selectedProfileIdx, setSelectedProfileIdx] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AnalyzeResponse[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProfiles(parsed);
        }
      }
      const savedTheme = sessionStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
        setThemeMode(savedTheme);
      }
    } catch {
      // Ignore invalid session state
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mediaQuery.matches);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const isDarkEffective = themeMode === "system" ? systemDark : themeMode === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkEffective) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkEffective]);

  const handleCycleTheme = () => {
    const nextMode: ThemeMode =
      themeMode === "system" ? (systemDark ? "light" : "dark") : themeMode === "dark" ? "light" : "system";
    setThemeMode(nextMode);
    try {
      sessionStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {
      // Ignore storage errors
    }
  };

  const saveToSession = (list: AnalyzeResponse[]) => {
    setSavedProfiles(list);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleAnalyzeSubmit = async (input: ProfileInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP Error ${res.status}`);
      }

      const data: AnalyzeResponse = await res.json();
      const updated = [data, ...savedProfiles];
      saveToSession(updated);
      setSelectedProfileIdx(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ไม่สามารถเชื่อมต่อ Backend API ได้";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async (personA: AnalyzeResponse, personB: AnalyzeResponse) => {
    setIsComparing(true);
    setErrorMsg(null);
    try {
      const payload = {
        person_a: {
          name: personA.profile.name,
          role: personA.profile.role,
          birth_date: personA.profile.birth_date,
          birth_time: personA.profile.birth_time,
          province: personA.profile.province,
          mbti: personA.profile.mbti.code,
        },
        person_b: {
          name: personB.profile.name,
          role: personB.profile.role,
          birth_date: personB.profile.birth_date,
          birth_time: personB.profile.birth_time,
          province: personB.profile.province,
          mbti: personB.profile.mbti.code,
        },
      };

      const res = await fetch(`${API_BASE}/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP Error ${res.status}`);
      }

      const data: CompareResponse = await res.json();
      setCompareResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ไม่สามารถเปรียบเทียบข้อมูลได้";
      setErrorMsg(msg);
    } finally {
      setIsComparing(false);
    }
  };

  const handleClearSession = () => {
    saveToSession([]);
    setCompareResult(null);
    setSelectedProfileIdx(0);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const currentManual = savedProfiles[selectedProfileIdx] || null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={UI_IRASUTOYA.gogyou}
              alt="Five Elements"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Team Synergy &amp; Work Manual Engine
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                BaZi Four Pillars × MBTI Cognitive Functions × RACI Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Navigation Tabs */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setActiveTab("manual")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "manual"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                My Work Manual
              </button>
              <button
                onClick={() => setActiveTab("compare")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "compare"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Team Matrix ({savedProfiles.length})
              </button>
            </div>

            {/* Theme Toggle (System / Light / Dark) */}
            <button
              onClick={handleCycleTheme}
              title={
                themeMode === "system"
                  ? `โหมดตามระบบอัตโนมัติ (${isDarkEffective ? "Dark" : "Light"})`
                  : `โหมด ${themeMode === "dark" ? "Dark" : "Light"} (คลิกเพื่อสลับ)`
              }
              aria-label="Toggle Theme Mode"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {themeMode === "system" ? (
                <>
                  <Monitor className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">System</span>
                </>
              ) : isDarkEffective ? (
                <>
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {errorMsg && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/50 dark:border-rose-800 p-4 text-xs text-rose-800 dark:text-rose-200">
            <strong>เกิดข้อผิดพลาด:</strong> {errorMsg}
          </div>
        )}

        {activeTab === "manual" ? (
          <div className="space-y-6">
            <ProfileForm onSubmit={handleAnalyzeSubmit} isLoading={isLoading} />

            {/* Session Roster Pills */}
            {savedProfiles.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    สมาชิกใน Session ({savedProfiles.length}):
                  </span>
                  {savedProfiles.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedProfileIdx(idx)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        selectedProfileIdx === idx
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {item.profile.name} ({item.profile.mbti.code})
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleClearSession}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  ล้างข้อมูล Session
                </button>
              </div>
            )}

            {currentManual && <ManualView data={currentManual} />}
          </div>
        ) : (
          <SynergyMatrix
            savedProfiles={savedProfiles}
            onCompare={handleCompare}
            compareResult={compareResult}
            isComparing={isComparing}
          />
        )}
      </main>

      {/* Disclaimer Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 sm:px-6 mt-12">
        <div className="max-w-6xl mx-auto flex items-start sm:items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong>ข้อจำกัดความรับผิดชอบ (Disclaimer):</strong> ระบบนี้ใช้โครงสร้างธาตุตามปฏิทินสุริยคติ (BaZi)
            เป็นกรอบอุปมาเชิงพลังงานควบคู่กับจิตวิทยา MBTI และ RACI เพื่อส่งเสริมการสื่อสารและความเข้าใจในทีมเท่านั้น
            ไม่ใช่การทำนายโชคชะตา ไม่ใช่เกณฑ์ประเมินผลปฏิบัติงาน (HR Evaluation) และไม่บันทึกข้อมูลส่วนบุคคลลงฐานข้อมูลถาวร (Stateless &amp; PDPA-First)
          </p>
        </div>
      </footer>
    </div>
  );
}
