"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Flower2, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "./progress-ring";
import { cn } from "@/lib/utils";
import type { CycleProgress } from "@/lib/types";

const SEGMENT_STYLE: Record<string, string> = {
  menstrual: "bg-gradient-to-r from-rose-400 to-pink-400",
  follicular: "bg-gradient-to-r from-orange-300 to-amber-300",
  fertile: "bg-gradient-to-r from-violet-300 to-purple-300",
  luteal: "bg-gradient-to-r from-fuchsia-300 to-pink-300",
};

const SEGMENT_DOT: Record<string, string> = {
  menstrual: "bg-rose-400",
  follicular: "bg-orange-300",
  fertile: "bg-violet-400",
  luteal: "bg-fuchsia-300",
};

const SEGMENT_CHIP: Record<string, string> = {
  menstrual: "bg-rose-400/10 text-rose-500",
  follicular: "bg-orange-400/10 text-orange-500",
  fertile: "bg-violet-400/10 text-violet-500",
  luteal: "bg-fuchsia-400/10 text-fuchsia-500",
};

export const CycleOverview = memo(function CycleOverview({
  progress,
}: {
  progress: CycleProgress | null;
}) {
  if (!progress || progress.segments.length === 0) {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-rose-50 to-violet-50 dark:from-rose-500/10 dark:to-violet-500/10">
        <CardContent className="p-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            <Waves className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-semibold">Pantau Perkembangan Siklus</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Setelah mencatat periode, timeline fase siklus dan progressnya akan
            tampil di sini.
          </p>
        </CardContent>
      </Card>
    );
  }

  const current = progress.segments.find((s) => s.isCurrent);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <ProgressRing percent={progress.percent} size={92} stroke={9}>
            <div className="text-center">
              <p className="text-xl font-bold leading-none">{progress.dayOfCycle}</p>
              <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                / {progress.cycleLength} hari
              </p>
            </div>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Siklus saat ini
            </p>
            <h3 className="mt-0.5 flex min-w-0 items-center gap-2 text-lg font-semibold">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-400/10 text-rose-500">
                {current ? (
                  <current.icon className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Flower2 className="h-4 w-4" />
                )}
              </span>
              <span className="truncate">{current?.label ?? "Menstruasi"}</span>
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Hari ke-{progress.dayOfCycle} · {Math.round(progress.percent * 100)}%
              selesai
            </p>
          </div>
        </div>

        {/* Bar fase */}
        <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-muted/60">
          {progress.segments.map((s) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn(
                "relative h-full",
                SEGMENT_STYLE[s.key],
                s.isCurrent && "ring-2 ring-foreground/60 ring-offset-1 ring-offset-card"
              )}
              style={{
                width: `${((s.endDay - s.startDay + 1) / progress.cycleLength) * 100}%`,
              }}
              title={`${s.label}: hari ${s.startDay}–${s.endDay}`}
            />
          ))}
        </div>

        {/* Daftar fase */}
        <ul className="mt-4 space-y-1.5">
          {progress.segments.map((s) => (
            <li
              key={s.key}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-sm transition-colors",
                s.isCurrent
                  ? "bg-primary/8 font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                  SEGMENT_CHIP[s.key]
                )}
              >
                <s.icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="truncate">{s.label}</span>
              <span className="ml-auto text-xs">
                Hari {s.startDay}
                {s.endDay > s.startDay ? `–${s.endDay}` : ""}
              </span>
              {s.isCurrent && (
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  KAMU DI SINI
                </span>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-center gap-1.5 rounded-2xl bg-secondary/60 p-3 text-xs text-muted-foreground">
          <Flower2 className="h-3.5 w-3.5 shrink-0 text-rose-400" />
          Estimasi berdasarkan rata-rata siklus {progress.cycleLength} hari dan
          durasi haid {progress.periodDuration} hari.
        </p>
      </CardContent>
    </Card>
  );
});
