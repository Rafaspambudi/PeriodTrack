"use client";

import { memo, useMemo, useRef, useState } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { id } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { cn, capitalize } from "@/lib/utils";
import { toIso } from "@/lib/cycle-calculations";
import { moodMeta } from "@/lib/constants";
import type { DayStatus, Mood, PeriodEntry } from "@/lib/types";
import { PHASE_INFO } from "@/lib/phase-info";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function statusClasses(status: DayStatus): string {
  switch (status) {
    case "period":
      return "bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md shadow-rose-400/40";
    case "predicted":
      return "border border-dashed border-rose-400/70 bg-rose-200/50 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200";
    case "ovulation":
      return "bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-md shadow-violet-400/40";
    case "fertile":
      return "bg-violet-200/70 text-violet-700 dark:bg-violet-400/25 dark:text-violet-200";
    case "follicular":
      return "bg-orange-200/60 text-orange-700 dark:bg-orange-400/20 dark:text-orange-200";
    case "luteal":
      return "bg-fuchsia-200/50 text-fuchsia-700 dark:bg-fuchsia-400/20 dark:text-fuchsia-200";
    default:
      return "text-foreground/80 hover:bg-primary/10";
  }
}

export interface PeriodCalendarProps {
  month: Date;
  dayStatus: Map<string, DayStatus>;
  periods: PeriodEntry[];
  moodByDate?: Map<string, Mood>;
  pendingStart: string | null;
  onDayClick: (iso: string) => void;
  onMonthChange: (dir: 1 | -1) => void;
  onToday: () => void;
}

export const PeriodCalendar = memo(function PeriodCalendar({
  month,
  dayStatus,
  periods,
  moodByDate,
  pendingStart,
  onDayClick,
  onMonthChange,
  onToday,
}: PeriodCalendarProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Arah animasi geser antar bulan
  const prevMonthRef = useRef(month);
  const dirRef = useRef(1);
  if (!isSameMonth(prevMonthRef.current, month)) {
    dirRef.current = month > prevMonthRef.current ? 1 : -1;
    prevMonthRef.current = month;
  }

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const out: Date[] = [];
    let cur = start;
    while (cur <= end) {
      out.push(cur);
      cur = addDays(cur, 1);
    }
    return out;
  }, [month]);

  const periodByDate = useMemo(() => {
    const map = new Map<string, PeriodEntry>();
    for (const p of periods) {
      let d = parseISO(p.startDate);
      const end = parseISO(p.endDate);
      while (d <= end) {
        const iso = toIso(d);
        if (!map.has(iso)) map.set(iso, p);
        d = addDays(d, 1);
      }
    }
    return map;
  }, [periods]);

  const inPendingRange = (iso: string): boolean => {
    if (!pendingStart || !hovered) return false;
    const a = pendingStart < hovered ? pendingStart : hovered;
    const b = pendingStart < hovered ? hovered : pendingStart;
    return iso >= a && iso <= b;
  };

  return (
    <div>
      {/* Header bulan */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-foreground">
          {capitalize(format(month, "MMMM yyyy", { locale: id }))}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() => onMonthChange(-1)}
            className="grid h-9 w-9 place-items-center rounded-full border bg-card transition-all hover:bg-accent hover:scale-105 active:scale-90"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="rounded-full bg-gradient-to-r from-rose-400/15 to-violet-400/15 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all hover:scale-105 active:scale-95"
          >
            Hari ini
          </button>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            onClick={() => onMonthChange(1)}
            className="grid h-9 w-9 place-items-center rounded-full border bg-card transition-all hover:bg-accent hover:scale-105 active:scale-90"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Grid hari */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={format(month, "yyyy-MM")}
          initial={{ opacity: 0, x: 28 * dirRef.current }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 * dirRef.current }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="mb-2 grid grid-cols-7">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="pb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map((d) => {
              const iso = toIso(d);
              const inMonth = isSameMonth(d, month);
              const status = dayStatus.get(iso) ?? "none";
              const today = isSameDay(d, new Date());
              const period = periodByDate.get(iso);
              const mood = moodByDate?.get(iso) ?? null;
              const moodM = moodMeta(mood);
              const rangePreview = inPendingRange(iso) && inMonth;
              const isRangeEdge =
                rangePreview && (iso === pendingStart || iso === hovered);

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={!inMonth}
                  onClick={() => inMonth && onDayClick(iso)}
                  onMouseEnter={() => setHovered(iso)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "calendar-day relative flex aspect-square w-full flex-col items-center justify-center rounded-2xl text-sm transition-all duration-150",
                    statusClasses(status),
                    !inMonth && "opacity-30",
                    today &&
                      !["period", "ovulation"].includes(status) &&
                      "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    rangePreview && "bg-primary/20",
                    isRangeEdge && "ring-2 ring-primary"
                  )}
                >
                  <span className={cn("text-xs sm:text-sm", today && "font-bold")}>
                    {format(d, "d")}
                  </span>

                  {status === "period" && (
                    <span className="mt-0.5 flex items-center gap-0.5">
                      {Array.from({
                        length:
                          period?.flow === "heavy"
                            ? 3
                            : period?.flow === "medium"
                            ? 2
                            : 1,
                      }).map((_, i) => (
                        <span
                          key={i}
                          className="h-1 w-1 rounded-full bg-white/90"
                        />
                      ))}
                    </span>
                  )}

                  {/* Indikator mood */}
                  {moodM && (
                    <span
                      className={cn(
                        "absolute right-1 top-1 h-1.5 w-1.5 rounded-full",
                        moodM.dot
                      )}
                      title={`Mood: ${moodM.label}`}
                    />
                  )}

                  {/* Indikator gejala pada hari haid */}
                  {status === "period" &&
                    period &&
                    period.symptoms.length > 0 && (
                      <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-white shadow-sm" />
                    )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Hint saat memilih rentang */}
      <div className="mt-4 min-h-5 text-xs text-muted-foreground">
        {pendingStart ? (
          <span className="animate-fade-in-up inline-flex items-center gap-1.5 font-medium text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Rentang dimulai{" "}
            {format(parseISO(pendingStart), "d MMMM", { locale: id })} — klik
            tanggal selesai (atau klik lagi tanggal yang sama untuk 1 hari).
          </span>
        ) : (
          <span className="inline-flex items-start gap-1.5">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            Ketuk tanggal untuk menandai periode · ketuk hari haid untuk
            mengedit · titik warna = mood harian.
          </span>
        )}
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
        {(
          [
            "period",
            "predicted",
            "follicular",
            "fertile",
            "ovulation",
            "luteal",
          ] as DayStatus[]
        ).map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          >
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                s === "period" &&
                  "bg-gradient-to-br from-rose-400 to-pink-500",
                s === "predicted" &&
                  "border border-dashed border-rose-400 bg-rose-200/70 dark:bg-rose-400/20",
                s === "follicular" && "bg-orange-300 dark:bg-orange-400/50",
                s === "fertile" && "bg-violet-200 dark:bg-violet-400/50",
                s === "ovulation" &&
                  "bg-gradient-to-br from-violet-400 to-purple-500",
                s === "luteal" && "bg-fuchsia-300 dark:bg-fuchsia-400/50"
              )}
            />
            {PHASE_INFO[s].label}
          </span>
        ))}
      </div>
    </div>
  );
});
