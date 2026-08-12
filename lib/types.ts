// ---- Tipe data inti aplikasi period tracker ----
import type { LucideIcon } from "lucide-react";

export type FlowLevel = "light" | "medium" | "heavy";

export type Symptom =
  | "cramps"
  | "headache"
  | "mood"
  | "acne"
  | "fatigue"
  | "bloating"
  | "backache"
  | "nausea"
  | "cravings"
  | "insomnia";

/** Mood harian yang bisa dicatat setiap hari (tidak hanya saat haid). */
export type Mood =
  | "happy"
  | "calm"
  | "neutral"
  | "anxious"
  | "sad"
  | "irritable"
  | "tired";

/** Satu periode yang dicatat pengguna. Tanggal dalam format ISO yyyy-MM-dd. */
export interface PeriodEntry {
  id: string;
  startDate: string;
  endDate: string;
  flow: FlowLevel | null;
  symptoms: Symptom[];
  notes: string;
  basalTemp: number | null;
}

/** Log mood harian (satu entri per tanggal). */
export interface MoodLog {
  date: string;
  mood: Mood;
}

/** Draft periode untuk dialog (edit membawa data lama, create hanya tanggal). */
export type PeriodDraft = Partial<Omit<PeriodEntry, "startDate" | "endDate">> & {
  startDate: string;
  endDate: string;
};

/** Input saat membuat / mengedit periode. */
export interface PeriodInput {
  startDate: string;
  endDate: string;
  flow: FlowLevel | null;
  symptoms: Symptom[];
  notes: string;
  basalTemp: number | null;
}

/** Status sebuah hari di kalender. */
export type DayStatus =
  | "period" // hari haid aktual (dicatat)
  | "predicted" // prediksi haid berikutnya
  | "ovulation" // hari ovulasi (estimasi)
  | "fertile" // jendela masa subur
  | "follicular" // fase folikular
  | "luteal" // fase luteal
  | "none"; // tidak ada data

/** Satu titik data siklus (untuk grafik & statistik). */
export interface CyclePoint {
  startDate: string;
  length: number; // jarak (hari) dari awal periode sebelumnya (0 untuk periode pertama)
  duration: number; // lama haid dalam hari (inklusif)
}

export interface CycleStats {
  periodCount: number;
  cycleLengths: CyclePoint[];
  averageCycleLength: number | null;
  averagePeriodDuration: number | null;
  shortestCycle: number | null;
  longestCycle: number | null;
}

export interface Prediction {
  nextPeriodStart: string | null;
  nextPeriodEnd: string | null;
  daysUntil: number | null; // negatif = sudah lewat
  ovulationDate: string | null;
  fertileStart: string | null;
  fertileEnd: string | null;
  dayOfCycle: number | null; // hari ke-berapa siklus hari ini (1 = hari pertama haid)
  isPredictedToday: boolean;
}

/** Segmen fase siklus untuk timeline (hari ke-1 s.d. hari ke-C). */
export interface CycleSegment {
  key: "menstrual" | "follicular" | "fertile" | "luteal";
  label: string;
  icon: LucideIcon;
  startDay: number; // 1-based, inklusif
  endDay: number; // inklusif
  isCurrent: boolean;
}

export interface CycleProgress {
  cycleLength: number;
  periodDuration: number;
  dayOfCycle: number;
  percent: number; // 0..1
  segments: CycleSegment[];
  currentKey: CycleSegment["key"] | null;
}

export interface AppSettings {
  defaultCycleLength: number;
  defaultPeriodDuration: number;
  reminderEnabled: boolean;
  reminderTime: string; // format "HH:mm"
  lastReminderDate: string | null;
}

/** Format data backup JSON. */
export interface BackupData {
  app: "luna";
  version: 1;
  exportedAt: string;
  periods: PeriodEntry[];
  moodLogs: MoodLog[];
  settings: AppSettings;
}
