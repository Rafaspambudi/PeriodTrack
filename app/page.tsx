"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  ChevronRight,
  NotebookPen,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PeriodCalendar } from "@/components/period-calendar";
import { CountdownCard } from "@/components/countdown-card";
import { CycleOverview } from "@/components/cycle-overview";
import { TodayCard } from "@/components/today-card";
import { HeroBanner } from "@/components/hero-banner";
import { LogPeriodDialog } from "@/components/log-period-dialog";
import { DailyLogDialog } from "@/components/daily-log-dialog";
import { usePeriodData } from "@/hooks/use-period-data";
import {
  findPeriodOnDate,
  getDayStatus,
  getMonthDayStatuses,
  normalizePeriod,
  toIso,
} from "@/lib/cycle-calculations";
import type { Mood, PeriodDraft, PeriodEntry, PeriodInput } from "@/lib/types";

function StatMini({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-3.5 transition-colors hover:bg-secondary/80">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const {
    periods,
    settings,
    ready,
    now,
    stats,
    prediction,
    cycleProgress,
    moodByDate,
    addPeriod,
    updatePeriod,
    deletePeriod,
    setMood,
  } = usePeriodData();

  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [pendingStart, setPendingStart] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{
    open: boolean;
    initial: PeriodDraft | null;
  }>({ open: false, initial: null });
  const [dailyLog, setDailyLog] = useState<{ open: boolean; date: string }>({
    open: false,
    date: "",
  });

  const todayIso = toIso(now);
  const dailyLogDate = dailyLog.date || todayIso;

  const monthStatus = useMemo(
    () => getMonthDayStatuses(viewMonth, periods, settings),
    [viewMonth, periods, settings]
  );
  const todayStatus = useMemo(
    () => getDayStatus(todayIso, periods, settings),
    [todayIso, periods, settings]
  );
  const coveringPeriod = useMemo(
    () => findPeriodOnDate(periods, todayIso),
    [periods, todayIso]
  );
  const todayMood = moodByDate.get(todayIso) ?? null;

  const openNewPeriod = useCallback(() => {
    setPendingStart(null);
    setDialog({ open: true, initial: { startDate: todayIso, endDate: todayIso } });
  }, [todayIso]);

  const openDailyLog = useCallback(() => {
    setDailyLog({ open: true, date: todayIso });
  }, [todayIso]);

  const handleMonthChange = useCallback((dir: 1 | -1) => {
    setViewMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  }, []);

  const handleToday = useCallback(() => setViewMonth(new Date()), []);

  const handleMoodChange = useCallback(
    (mood: Mood | null) => setMood(todayIso, mood),
    [todayIso, setMood]
  );

  const handleEditPeriod = useCallback((p: PeriodEntry) => {
    setDialog({ open: true, initial: p });
  }, []);

  const handleDayClick = useCallback(
    (iso: string) => {
      const existing = findPeriodOnDate(periods, iso);
      if (existing) {
        setPendingStart(null);
        setDialog({ open: true, initial: existing });
        return;
      }
      if (!pendingStart) {
        setPendingStart(iso);
        return;
      }
      const norm = normalizePeriod({ startDate: pendingStart, endDate: iso });
      setPendingStart(null);
      setDialog({ open: true, initial: norm });
    },
    [periods, pendingStart]
  );

  const handleSave = useCallback(
    (input: PeriodInput) => {
      if (dialog.initial?.id) {
        updatePeriod(dialog.initial.id, input);
      } else {
        addPeriod(input);
      }
      setDialog({ open: false, initial: null });
    },
    [dialog.initial, addPeriod, updatePeriod]
  );

  const recentPeriods = useMemo(
    () =>
      [...periods]
        .sort((a, b) => b.startDate.localeCompare(a.startDate))
        .slice(0, 3),
    [periods]
  );

  if (!ready) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl bg-muted/60" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-3xl bg-muted/60 lg:col-span-2" />
          <div className="h-96 animate-pulse rounded-3xl bg-muted/60" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-3xl bg-muted/60 lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-3xl bg-muted/60" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Hero */}
      <HeroBanner
        now={now}
        todayStatus={todayStatus}
        prediction={prediction}
        onNewPeriod={openNewPeriod}
        onDailyLog={openDailyLog}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kalender */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-400/10 text-rose-500">
                  <CalendarDays className="h-5 w-5" />
                </span>
                Kalender Siklus
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Ketuk tanggal untuk menandai periode, atau ketuk hari haid untuk
                mengedit.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={openDailyLog}>
                <NotebookPen className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log Harian</span>
              </Button>
              <Button variant="gradient" size="sm" onClick={openNewPeriod}>
                <CalendarPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tambah</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PeriodCalendar
              month={viewMonth}
              dayStatus={monthStatus}
              periods={periods}
              moodByDate={moodByDate}
              pendingStart={pendingStart}
              onDayClick={handleDayClick}
              onMonthChange={handleMonthChange}
              onToday={handleToday}
            />
          </CardContent>
        </Card>

        {/* Countdown + overview siklus */}
        <div className="space-y-6">
          <CountdownCard
            prediction={prediction}
            stats={stats}
            progress={cycleProgress}
            onStart={openNewPeriod}
          />
          <CycleOverview progress={cycleProgress} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hari ini */}
        <div className="lg:col-span-2">
          <TodayCard
            status={todayStatus}
            prediction={prediction}
            coveringPeriod={coveringPeriod}
            todayMood={todayMood}
            onMoodChange={handleMoodChange}
            onPatchPeriod={updatePeriod}
            onEditPeriod={handleEditPeriod}
            onStartPeriod={openNewPeriod}
            onDailyLog={openDailyLog}
          />
        </div>

        {/* Statistik cepat + periode terbaru */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-rose-400" />
                Statistik Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <StatMini
                label="Siklus rata-rata"
                value={
                  stats.averageCycleLength
                    ? `${stats.averageCycleLength} hari`
                    : "—"
                }
                sub={stats.periodCount > 1 ? "dari histori" : "pakai default"}
              />
              <StatMini
                label="Durasi haid"
                value={
                  stats.averagePeriodDuration
                    ? `${stats.averagePeriodDuration} hari`
                    : "—"
                }
                sub="rata-rata"
              />
              <StatMini
                label="Periode tercatat"
                value={String(stats.periodCount)}
                sub="total"
              />
              <StatMini
                label="Siklus terpendek"
                value={stats.shortestCycle ? `${stats.shortestCycle} hari` : "—"}
                sub={
                  stats.longestCycle ? `terpanjang ${stats.longestCycle} hari` : ""
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">Periode Terbaru</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/history" className="text-primary">
                  Semua
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentPeriods.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Belum ada periode tercatat.
                </div>
              ) : (
                <ul className="space-y-3">
                  {recentPeriods.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => handleEditPeriod(p)}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-400/20 to-violet-400/20 text-rose-500">
                            <span className="text-sm font-bold">
                              {format(parseISO(p.startDate), "d", { locale: id })}
                            </span>
                          </span>
                          <div>
                            <p className="text-sm font-medium">
                              {format(parseISO(p.startDate), "MMMM yyyy", {
                                locale: id,
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.startDate === p.endDate
                                ? "1 hari"
                                : `${Math.round(
                                    (parseISO(p.endDate).getTime() -
                                      parseISO(p.startDate).getTime()) /
                                      86400000
                                  ) + 1} hari`}
                              {p.symptoms.length > 0 &&
                                ` · ${p.symptoms.length} gejala`}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog periode */}
      <LogPeriodDialog
        open={dialog.open}
        initial={dialog.initial}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        onSave={handleSave}
        onDelete={(id) => {
          deletePeriod(id);
          setDialog({ open: false, initial: null });
        }}
      />

      {/* Dialog log harian */}
      <DailyLogDialog
        open={dailyLog.open}
        dateIso={dailyLogDate}
        mood={moodByDate.get(dailyLogDate) ?? null}
        coveringPeriod={findPeriodOnDate(periods, dailyLogDate)}
        onOpenChange={(open) => setDailyLog((d) => ({ ...d, open }))}
        onMoodChange={(mood) => setMood(dailyLogDate, mood)}
        onPatchPeriod={updatePeriod}
      />
    </motion.div>
  );
}
