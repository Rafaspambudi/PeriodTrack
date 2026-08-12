import {
  AlertCircle,
  Angry,
  CloudSun,
  Frown,
  Meh,
  MoonStar,
  Smile,
  type LucideIcon,
} from "lucide-react";
import type {
  AppSettings,
  FlowLevel,
  Mood,
  Symptom,
} from "./types";

export const STORAGE_KEYS = {
  periods: "luna.periods.v1",
  moodLogs: "luna.moods.v1",
  settings: "luna.settings.v1",
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  defaultCycleLength: 28,
  defaultPeriodDuration: 5,
  reminderEnabled: false,
  reminderTime: "08:00",
  lastReminderDate: null,
};

export const SYMPTOM_LIST: { value: Symptom; label: string }[] = [
  { value: "cramps", label: "Kram perut" },
  { value: "headache", label: "Sakit kepala" },
  { value: "mood", label: "Mood swing" },
  { value: "acne", label: "Jerawat" },
  { value: "fatigue", label: "Mudah lelah" },
  { value: "bloating", label: "Perut kembung" },
  { value: "backache", label: "Nyeri punggung" },
  { value: "nausea", label: "Mual" },
  { value: "cravings", label: "Ngidam" },
  { value: "insomnia", label: "Sulit tidur" },
];

export function symptomLabel(symptom: Symptom): string {
  return SYMPTOM_LIST.find((s) => s.value === symptom)?.label ?? symptom;
}

export const FLOW_OPTIONS: { value: FlowLevel; label: string; dots: number }[] = [
  { value: "light", label: "Ringan", dots: 1 },
  { value: "medium", label: "Sedang", dots: 2 },
  { value: "heavy", label: "Berat", dots: 3 },
];

export function flowLabel(flow: FlowLevel | null): string {
  return FLOW_OPTIONS.find((f) => f.value === flow)?.label ?? "Belum diisi";
}

export const MOOD_META: {
  value: Mood;
  label: string;
  icon: LucideIcon;
  dot: string;
  hex: string;
  chip: string;
}[] = [
  {
    value: "happy",
    label: "Bahagia",
    icon: Smile,
    dot: "bg-emerald-400",
    hex: "#34d399",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-500 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    value: "calm",
    label: "Tenang",
    icon: CloudSun,
    dot: "bg-sky-400",
    hex: "#38bdf8",
    chip: "border-sky-200 bg-sky-50 text-sky-500 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-300",
  },
  {
    value: "neutral",
    label: "Netral",
    icon: Meh,
    dot: "bg-slate-300",
    hex: "#94a3b8",
    chip: "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-400/30 dark:bg-slate-500/10 dark:text-slate-300",
  },
  {
    value: "anxious",
    label: "Cemas",
    icon: AlertCircle,
    dot: "bg-amber-400",
    hex: "#fbbf24",
    chip: "border-amber-200 bg-amber-50 text-amber-500 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300",
  },
  {
    value: "sad",
    label: "Sedih",
    icon: Frown,
    dot: "bg-blue-400",
    hex: "#60a5fa",
    chip: "border-blue-200 bg-blue-50 text-blue-500 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    value: "irritable",
    label: "Mudah marah",
    icon: Angry,
    dot: "bg-orange-400",
    hex: "#fb923c",
    chip: "border-orange-200 bg-orange-50 text-orange-500 dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-300",
  },
  {
    value: "tired",
    label: "Lelah",
    icon: MoonStar,
    dot: "bg-violet-400",
    hex: "#a78bfa",
    chip: "border-violet-200 bg-violet-50 text-violet-500 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-300",
  },
];

export function moodMeta(mood: Mood | null | undefined) {
  return MOOD_META.find((m) => m.value === mood) ?? null;
}
