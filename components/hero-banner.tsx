"use client";

import { memo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CalendarHeart,
  CalendarPlus,
  Droplets,
  Flower2,
  NotebookPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPhaseInfo } from "@/lib/phase-info";
import { capitalize } from "@/lib/utils";
import type { DayStatus, Prediction } from "@/lib/types";

export const HeroBanner = memo(function HeroBanner({
  now,
  todayStatus,
  prediction,
  onNewPeriod,
  onDailyLog,
}: {
  now: Date;
  todayStatus: DayStatus;
  prediction: Prediction;
  onNewPeriod: () => void;
  onDailyLog: () => void;
}) {
  const phase = getPhaseInfo(todayStatus);
  const days = prediction.daysUntil;

  const subtitle =
    todayStatus === "none"
      ? "Mulai catat siklusmu hari ini — prediksi & masa subur otomatis menyusul."
      : todayStatus === "period" || todayStatus === "predicted"
      ? phase.description
      : `Kamu sedang berada di fase ${phase.label.toLowerCase()} — ${phase.description}`;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-rose-100/80 bg-gradient-to-br from-rose-50 via-white to-violet-50 p-6 text-foreground shadow-soft sm:p-8 dark:border-white/10 dark:from-rose-100 dark:via-white dark:to-violet-100">
      {/* Dekorasi pastel */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-rose-200/60 blur-3xl dark:bg-rose-300/40" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-violet-200/60 blur-3xl dark:bg-violet-300/40" />
      <div className="pointer-events-none absolute -top-10 left-1/3 h-40 w-40 rounded-full bg-orange-100/70 blur-3xl dark:bg-orange-200/30" />
      <Flower2 className="pointer-events-none absolute -bottom-8 -right-6 h-44 w-44 -rotate-12 text-rose-300/40 dark:text-rose-400/20" />

      <div className="relative">
        <p className="text-sm font-medium text-black/75">
          {capitalize(format(now, "EEEE, d MMMM yyyy", { locale: id }))}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-black sm:text-4xl">
          Halo Ella, selamat datang!{" "}
          <Flower2 className="inline-block h-7 w-7 animate-float text-black/60" />
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/80">
          {subtitle}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {prediction.dayOfCycle !== null && todayStatus !== "none" && (
            <Badge className="border-rose-200/70 bg-white/70 text-black shadow-sm backdrop-blur">
              Hari ke-{prediction.dayOfCycle} siklus
            </Badge>
          )}
          {todayStatus === "period" && (
            <Badge className="border-rose-200/70 bg-white/70 text-black shadow-sm backdrop-blur">
              <Droplets className="h-3 w-3" />
              Sedang haid
            </Badge>
          )}
          {days !== null && days >= 0 && days <= 7 && (
            <Badge className="border-rose-200/70 bg-white/70 text-black shadow-sm backdrop-blur">
              <CalendarClock className="h-3 w-3" />
              Haid dalam {days} hari
            </Badge>
          )}
          {days !== null && days < 0 && (
            <Badge className="border-rose-200/70 bg-white/70 text-black shadow-sm backdrop-blur">
              <CalendarHeart className="h-3 w-3" />
              Catat periode barumu
            </Badge>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={onNewPeriod}
              className="border border-rose-200/80 bg-white text-black shadow-lg shadow-rose-200/50 hover:bg-rose-50 hover:shadow-xl"
            >
              <CalendarPlus className="h-4 w-4" />
              Catat Periode
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              size="lg"
              onClick={onDailyLog}
              className="border-rose-200/70 bg-white/70 text-black backdrop-blur hover:bg-white"
            >
              <NotebookPen className="h-4 w-4" />
              Log Harian
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
