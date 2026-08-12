// ---- Perhitungan siklus menstruasi (pure functions, mudah di-test) ----
import { Droplets, Flame, Moon, Sprout, type LucideIcon } from "lucide-react";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
} from "date-fns";
import type {
  AppSettings,
  CyclePoint,
  CycleProgress,
  CycleSegment,
  CycleStats,
  DayStatus,
  PeriodEntry,
  Prediction,
} from "./types";

/** Konversi Date -> "yyyy-MM-dd" (ISO lokal). */
export function toIso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function sortPeriods(periods: PeriodEntry[]): PeriodEntry[] {
  return [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/** Pastikan endDate >= startDate (swap jika terbalik). */
export function normalizePeriod(p: {
  startDate: string;
  endDate: string;
}): { startDate: string; endDate: string } {
  const start = parseISO(p.startDate);
  const end = parseISO(p.endDate);
  if (isBefore(end, start)) {
    return { startDate: p.endDate, endDate: p.startDate };
  }
  return { startDate: p.startDate, endDate: p.endDate };
}

/** Apakah sebuah tanggal termasuk dalam rentang periode. */
export function isInPeriod(period: PeriodEntry, dateIso: string): boolean {
  return dateIso >= period.startDate && dateIso <= period.endDate;
}

/** Periode yang mencakup tanggal tertentu (dari histori). */
export function findPeriodOnDate(
  periods: PeriodEntry[],
  dateIso: string
): PeriodEntry | undefined {
  return sortPeriods(periods).find((p) => isInPeriod(p, dateIso));
}

/** Panjang tiap siklus (jarak antar tanggal mulai) + durasi haid. */
export function getCycleLengths(periods: PeriodEntry[]): CyclePoint[] {
  const sorted = sortPeriods(periods);
  const points: CyclePoint[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const duration =
      differenceInCalendarDays(parseISO(p.endDate), parseISO(p.startDate)) + 1;
    if (i === 0) {
      points.push({ startDate: p.startDate, length: 0, duration });
    } else {
      const length = differenceInCalendarDays(
        parseISO(p.startDate),
        parseISO(sorted[i - 1].startDate)
      );
      points.push({ startDate: p.startDate, length, duration });
    }
  }
  return points;
}

/** Statistik siklus dari histori periode. */
export function getCycleStats(periods: PeriodEntry[]): CycleStats {
  const points = getCycleLengths(periods);
  const lengths = points.filter((p) => p.length > 0).map((p) => p.length);
  return {
    periodCount: points.length,
    cycleLengths: points,
    averageCycleLength: lengths.length
      ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
      : null,
    averagePeriodDuration: points.length
      ? Math.round(
          points.reduce((a, p) => a + p.duration, 0) / points.length
        )
      : null,
    shortestCycle: lengths.length ? Math.min(...lengths) : null,
    longestCycle: lengths.length ? Math.max(...lengths) : null,
  };
}

/** Panjang siklus efektif: rata-rata histori, atau fallback ke pengaturan. */
export function getEffectiveCycleLength(
  periods: PeriodEntry[],
  settings: AppSettings
): number {
  return getCycleStats(periods).averageCycleLength ?? settings.defaultCycleLength;
}

/** Durasi haid efektif: rata-rata histori, atau fallback ke pengaturan. */
export function getEffectiveDuration(
  periods: PeriodEntry[],
  settings: AppSettings
): number {
  return (
    getCycleStats(periods).averagePeriodDuration ??
    settings.defaultPeriodDuration
  );
}

/** Prediksi periode berikutnya, ovulasi, masa subur, dan hari ke-siklus. */
export function getPrediction(
  periods: PeriodEntry[],
  settings: AppSettings,
  today: Date
): Prediction {
  const sorted = sortPeriods(periods);
  const last = sorted[sorted.length - 1];
  const empty: Prediction = {
    nextPeriodStart: null,
    nextPeriodEnd: null,
    daysUntil: null,
    ovulationDate: null,
    fertileStart: null,
    fertileEnd: null,
    dayOfCycle: null,
    isPredictedToday: false,
  };
  if (!last) return empty;

  const cycle = getEffectiveCycleLength(periods, settings);
  const duration = getEffectiveDuration(periods, settings);
  const nextStart = addDays(parseISO(last.startDate), cycle);
  const nextEnd = addDays(nextStart, duration - 1);
  const ovulation = addDays(nextStart, -14); // ovulasi ±14 hari sebelum haid berikutnya
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);
  const daysUntil = differenceInCalendarDays(nextStart, today);
  const dayOfCycle =
    differenceInCalendarDays(today, parseISO(last.startDate)) + 1;

  return {
    nextPeriodStart: toIso(nextStart),
    nextPeriodEnd: toIso(nextEnd),
    daysUntil,
    ovulationDate: toIso(ovulation),
    fertileStart: toIso(fertileStart),
    fertileEnd: toIso(fertileEnd),
    dayOfCycle,
    isPredictedToday: !isBefore(today, nextStart) && !isAfter(today, nextEnd),
  };
}

/**
 * Status sebuah tanggal: haid aktual, prediksi, ovulasi, masa subur,
 * atau fase folikular/luteal. Murni perhitungan — aman untuk SSR.
 */
export function getDayStatus(
  dateIso: string,
  periods: PeriodEntry[],
  settings: AppSettings
): DayStatus {
  const sorted = sortPeriods(periods);
  const cycle = getEffectiveCycleLength(periods, settings);
  const duration = getEffectiveDuration(periods, settings);

  // 1) Hari haid aktual?
  for (const p of sorted) {
    if (isInPeriod(p, dateIso)) return "period";
  }

  // 2) Anchor = periode terakhir yang mulai pada/tanggal sebelum hari ini
  let anchor: PeriodEntry | null = null;
  for (const p of sorted) {
    if (p.startDate <= dateIso) anchor = p;
    else break;
  }
  if (!anchor) return "none";

  const daysSince = differenceInCalendarDays(
    parseISO(dateIso),
    parseISO(anchor.startDate)
  );
  if (daysSince < 0) return "none";

  // 3) Hari dalam rentang prediksi haid berikutnya?
  if (daysSince >= cycle && daysSince < cycle + duration) return "predicted";

  // 4) Ovulasi diperkirakan cycle - 14 hari setelah awal siklus
  const ovDay = cycle - 14;
  if (daysSince >= ovDay - 5 && daysSince <= ovDay + 1) {
    return daysSince === ovDay ? "ovulation" : "fertile";
  }

  // 5) Folikular sebelum masa subur, luteal sesudahnya
  if (daysSince < ovDay - 5) return "follicular";
  return "luteal";
}

/** Status semua hari dalam satu bulan (Map tanggal -> status). */
export function getMonthDayStatuses(
  month: Date,
  periods: PeriodEntry[],
  settings: AppSettings
): Map<string, DayStatus> {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
  const map = new Map<string, DayStatus>();
  for (const d of days) {
    map.set(toIso(d), getDayStatus(toIso(d), periods, settings));
  }
  return map;
}

/**
 * Segmen fase siklus (menstruasi, folikular, masa subur, luteal)
 * untuk timeline visual. Berdasarkan siklus terakhir yang tercatat.
 */
export function getCycleSegments(
  periods: PeriodEntry[],
  settings: AppSettings,
  today: Date
): CycleSegment[] {
  const sorted = sortPeriods(periods);
  const last = sorted[sorted.length - 1];
  if (!last) return [];

  const cycle = getEffectiveCycleLength(periods, settings);
  const duration = getEffectiveDuration(periods, settings);
  const dayOfCycle =
    differenceInCalendarDays(today, parseISO(last.startDate)) + 1;
  const ovDay = Math.max(cycle - 14, duration + 7); // jaga jarak wajar

  const raw: { key: CycleSegment["key"]; startDay: number; endDay: number }[] = [
    { key: "menstrual", startDay: 1, endDay: Math.min(duration, cycle) },
    { key: "follicular", startDay: Math.min(duration, cycle) + 1, endDay: ovDay - 6 },
    { key: "fertile", startDay: Math.max(ovDay - 5, 1), endDay: Math.min(ovDay + 1, cycle) },
    { key: "luteal", startDay: ovDay + 2, endDay: cycle },
  ];

  const filtered = raw.filter(
    (s) => s.startDay <= s.endDay && s.endDay >= 1
  );

  // Saat terlambat (dayOfCycle > cycleLength), tandai segmen terakhir sebagai current
  const overdue = dayOfCycle > cycle;
  const lastKey = filtered[filtered.length - 1]?.key ?? "luteal";

  const segments = filtered.map((s) => {
    const isCurrent = overdue
      ? s.key === lastKey
      : dayOfCycle >= s.startDay && dayOfCycle <= s.endDay;      return {
        key: s.key,
        label: SEGMENT_LABEL[s.key],
        icon: SEGMENT_ICON[s.key],
        startDay: s.startDay,
        endDay: s.endDay,
        isCurrent,
      };
  });
  return segments;
}

const SEGMENT_LABEL: Record<CycleSegment["key"], string> = {
  menstrual: "Menstruasi",
  follicular: "Folikular",
  fertile: "Masa subur",
  luteal: "Luteal",
};

const SEGMENT_ICON: Record<CycleSegment["key"], LucideIcon> = {
  menstrual: Droplets,
  follicular: Sprout,
  fertile: Flame,
  luteal: Moon,
};

/** Progress siklus saat ini (persen 0..1) + segmen + hari ke-. */
export function getCycleProgress(
  periods: PeriodEntry[],
  settings: AppSettings,
  today: Date
): CycleProgress | null {
  const sorted = sortPeriods(periods);
  const last = sorted[sorted.length - 1];
  if (!last) return null;

  const cycleLength = getEffectiveCycleLength(periods, settings);
  const periodDuration = getEffectiveDuration(periods, settings);
  const dayOfCycle =
    differenceInCalendarDays(today, parseISO(last.startDate)) + 1;
  const clamped = Math.max(1, Math.min(dayOfCycle, cycleLength));
  const segments = getCycleSegments(periods, settings, today);
  const current = segments.find((s) => s.isCurrent) ?? null;

  return {
    cycleLength,
    periodDuration,
    dayOfCycle: clamped,
    percent: clamped / cycleLength,
    segments,
    currentKey: current?.key ?? null,
  };
}
