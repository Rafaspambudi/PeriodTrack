// ---- Statistik tambahan: gejala, mood, keteraturan siklus ----
import type { LucideIcon } from "lucide-react";
import { MOOD_META, SYMPTOM_LIST } from "./constants";
import { getCycleStats } from "./cycle-calculations";
import type { Mood, MoodLog, PeriodEntry, Symptom } from "./types";

export interface SymptomFrequency {
  symptom: Symptom;
  label: string;
  count: number;
}

/** Frekuensi tiap gejala di seluruh periode (urut dari paling sering). */
export function getSymptomFrequencies(periods: PeriodEntry[]): SymptomFrequency[] {
  const counts = new Map<Symptom, number>();
  for (const p of periods) {
    for (const s of p.symptoms) {
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
  }
  return SYMPTOM_LIST.map((s) => ({
    symptom: s.value,
    label: s.label,
    count: counts.get(s.value) ?? 0,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
}

export interface MoodStat {
  mood: Mood;
  label: string;
  icon: LucideIcon;
  count: number;
}

/** Distribusi mood harian yang tercatat. */
export function getMoodStats(moodLogs: MoodLog[]): {
  total: number;
  counts: MoodStat[];
} {
  const counts = new Map<Mood, number>();
  for (const log of moodLogs) {
    counts.set(log.mood, (counts.get(log.mood) ?? 0) + 1);
  }
  return {
    total: moodLogs.length,
    counts: MOOD_META.map((m) => ({
      mood: m.value,
      label: m.label,
      icon: m.icon,
      count: counts.get(m.value) ?? 0,
    })).filter((s) => s.count > 0),
  };
}

export interface CycleRegularity {
  average: number;
  total: number;
  withinCount: number;
  percent: number; // 0..1 — proporsi siklus yang berada dalam ±3 hari dari rata-rata
  isRegular: boolean;
}

/** Seberapa teratur siklusmu (dalam ±3 hari dari rata-rata). */
export function getCycleRegularity(periods: PeriodEntry[]): CycleRegularity | null {
  const stats = getCycleStats(periods);
  const lengths = stats.cycleLengths
    .filter((p) => p.length > 0)
    .map((p) => p.length);
  if (lengths.length === 0 || stats.averageCycleLength === null) return null;
  const avg = stats.averageCycleLength;
  const within = lengths.filter((l) => Math.abs(l - avg) <= 3).length;
  return {
    average: avg,
    total: lengths.length,
    withinCount: within,
    percent: within / lengths.length,
    isRegular: within / lengths.length >= 0.8,
  };
}

/** Total hari haid dari semua periode (untuk ringkasan riwayat). */
export function getTotalPeriodDays(periods: PeriodEntry[]): number {
  return periods.reduce((acc, p) => {
    const dur =
      Math.round(
        (new Date(p.endDate).getTime() - new Date(p.startDate).getTime()) /
          86400000
      ) + 1;
    return acc + Math.max(dur, 1);
  }, 0);
}
