"use client";

import { memo } from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { CalendarHeart, Flower2, HeartPulse, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "./progress-ring";
import type { CycleProgress, CycleStats, Prediction } from "@/lib/types";

function formatRange(startIso: string | null, endIso: string | null): string {
  if (!startIso) return "—";
  const s = format(parseISO(startIso), "d MMMM", { locale: id });
  if (!endIso || startIso === endIso) return s;
  const e = format(parseISO(endIso), "d MMMM", { locale: id });
  const sameMonth = startIso.slice(0, 7) === endIso.slice(0, 7);
  return sameMonth
    ? `${format(parseISO(startIso), "d")} – ${e}`
    : `${s} – ${e}`;
}

export const CountdownCard = memo(function CountdownCard({
  prediction,
  stats,
  progress,
  onStart,
}: {
  prediction: Prediction;
  stats: CycleStats;
  progress: CycleProgress | null;
  onStart: () => void;
}) {
  const days = prediction.daysUntil;

  if (prediction.nextPeriodStart === null) {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-rose-50 to-violet-50 dark:from-rose-500/10 dark:to-violet-500/10">
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-brand text-white shadow-glow"
          >
            <Flower2 className="h-7 w-7" />
          </motion.div>
          <h3 className="mt-4 font-semibold">Mulai Lacak Siklusmu</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Catat periode pertamamu untuk mendapatkan prediksi, fase siklus, dan
            masa subur otomatis.
          </p>
          <Button variant="gradient" size="sm" className="mt-5" onClick={onStart}>
            <CalendarHeart className="h-4 w-4" />
            Catat Periode
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Ring progress siklus */}
          {progress && (
            <ProgressRing percent={progress.percent} size={88} stroke={8}>
              <div className="text-center">
                <p className="text-lg font-bold leading-none">
                  {progress.dayOfCycle}
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                  hari ke-
                </p>
              </div>
            </ProgressRing>
          )}

          {/* Countdown */}
          <div className="min-w-0 flex-1 text-right">
            <div className="flex items-center justify-end gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <HeartPulse className="h-4 w-4 text-rose-400" />
              Periode berikutnya
            </div>

            {days !== null && days > 0 && (
              <div className="mt-2 flex items-end justify-end gap-2">
                <motion.span
                  key={days}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="text-4xl font-bold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-500 sm:text-5xl"
                >
                  {days}
                </motion.span>
                <span className="pb-1 text-sm font-medium text-muted-foreground">
                  hari lagi
                </span>
              </div>
            )}
        {days !== null && days === 0 && (
          <p className="mt-2 flex items-center justify-end gap-2 text-2xl font-bold">
            Hari ini!
            <Flower2 className="h-6 w-6 text-rose-400" />
          </p>
        )}
            {days !== null && days < 0 && (
              <p className="mt-2 text-sm font-medium text-amber-500 dark:text-amber-400">
                Sudah lewat {Math.abs(days)} hari — catat periode baru ya!
              </p>
            )}

            <p className="mt-1.5 text-sm text-muted-foreground">
              Perkiraan:{" "}
              <span className="font-semibold text-foreground">
                {formatRange(prediction.nextPeriodStart, prediction.nextPeriodEnd)}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3 transition-colors hover:bg-violet-500/15">
            <div className="flex items-center gap-1.5 text-xs font-medium text-violet-500 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              Masa subur
            </div>
            <p className="mt-1 text-sm font-semibold">
              {formatRange(prediction.fertileStart, prediction.fertileEnd)}
            </p>
            {prediction.ovulationDate && (
              <p className="text-[11px] text-muted-foreground">
                Ovulasi{" "}
                {format(parseISO(prediction.ovulationDate), "d MMMM", {
                  locale: id,
                })}
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-rose-500/10 p-3 transition-colors hover:bg-rose-500/15">
            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
              <HeartPulse className="h-3.5 w-3.5" />
              Rata-rata siklus
            </div>
            <p className="mt-1 text-sm font-semibold">
              {stats.averageCycleLength ?? "—"} hari
            </p>
            <p className="text-[11px] text-muted-foreground">
              Durasi haid ±{stats.averagePeriodDuration ?? "—"} hari
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
