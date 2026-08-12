"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  BarChart3,
  CalendarCheck2,
  LineChart as LineChartIcon,
  Smile,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { usePeriodData } from "@/hooks/use-period-data";
import { PHASE_LIST_STATS } from "@/lib/phase-info";
import { getCycleRegularity, getMoodStats } from "@/lib/stats-helpers";

// Grafik Recharts dimuat lazy (hanya di sisi klien) untuk performa
const StatsCharts = dynamic(() => import("@/components/stats-charts"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-6">
      <div className="h-80 animate-pulse rounded-3xl bg-muted/60" />
      <div className="h-80 animate-pulse rounded-3xl bg-muted/60" />
    </div>
  ),
});

function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "text-rose-400",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className={accent}>{icon}</span>
          <span className="text-xs font-medium uppercase tracking-wider">
            {label}
          </span>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function StatsPage() {
  const { periods, moodLogs, stats, ready } = usePeriodData();
  const regularity = ready ? getCycleRegularity(periods) : null;
  const moodStats = ready ? getMoodStats(moodLogs) : { total: 0, counts: [] };

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="h-14 animate-pulse rounded-3xl bg-muted/60" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted/60" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-3xl bg-muted/60" />
      </div>
    );
  }

  if (periods.length < 2) {
    return (
      <div>
        <PageHeader
          title="Statistik"
          description="Lihat pola siklusmu lewat grafik dan ringkasan."
        />
        <EmptyState
          icon={<BarChart3 className="h-7 w-7" />}
          title="Butuh Minimal 2 Periode"
          description="Statistik siklus dihitung dari jarak antar periode. Catat minimal 2 periode dari dashboard agar grafik dan rata-ratanya muncul."
          action={
            <Button asChild>
              <Link href="/">Catat Periode di Dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Statistik"
        description="Pola siklus, durasi, gejala, dan moodmu dalam satu tampilan."
      />

      {/* Ringkasan */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Rata-rata siklus"
          value={stats.averageCycleLength ? `${stats.averageCycleLength} hari` : "—"}
          icon={<LineChartIcon className="h-4 w-4" />}
        />
        <StatCard
          label="Terpendek"
          value={stats.shortestCycle ? `${stats.shortestCycle} hari` : "—"}
          icon={<TrendingDown className="h-4 w-4" />}
          accent="text-sky-400"
        />
        <StatCard
          label="Terpanjang"
          value={stats.longestCycle ? `${stats.longestCycle} hari` : "—"}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="text-violet-400"
        />
        <StatCard
          label="Durasi haid"
          value={stats.averagePeriodDuration ? `${stats.averagePeriodDuration} hari` : "—"}
          icon={<CalendarCheck2 className="h-4 w-4" />}
          sub="rata-rata"
          accent="text-orange-400"
        />
        <StatCard
          label="Total periode"
          value={String(stats.periodCount)}
          icon={<BarChart3 className="h-4 w-4" />}
          sub="tercatat"
          accent="text-emerald-400"
        />
      </div>

      {/* Keteraturan siklus */}
      {regularity && (
        <Card className="mb-6 overflow-hidden">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
            <div
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg ${
                regularity.isRegular
                  ? "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-emerald-300/40"
                  : "bg-gradient-to-br from-amber-400 to-orange-400 shadow-amber-300/40"
              }`}
            >
              {regularity.isRegular ? (
                <Sparkles className="h-6 w-6" />
              ) : (
                <Stethoscope className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">
                Siklusmu{" "}
                {regularity.isRegular ? "cukup teratur" : "masih bervariasi"}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {regularity.withinCount} dari {regularity.total} siklus berada
                dalam ±3 hari dari rata-rata ({regularity.average} hari).
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-500">
                {Math.round(regularity.percent * 100)}%
              </p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                keteraturan
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grafik */}
      <StatsCharts
        points={stats.cycleLengths}
        periods={periods}
        moodLogs={moodLogs}
      />

      {/* Mood ringkasan */}
      {moodStats.total > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-rose-400" />
              Ringkasan Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {moodStats.counts.map((m) => (
                <Badge key={m.mood} variant="secondary" className="px-3 py-1.5 text-sm">
                  <m.icon className="h-3.5 w-3.5" />
                  {m.label}{" "}
                  <span className="ml-1 font-bold text-primary">
                    {m.count}×
                  </span>
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Total {moodStats.total} hari mood tercatat. Catat mood setiap hari
              untuk melihat pola emosimu sepanjang siklus.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Kartu edukasi fase */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Memahami Fase Siklus</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PHASE_LIST_STATS.map((p) => (
            <div
              key={p.status}
              className="rounded-2xl border bg-background/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/40"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-400/10 text-rose-500">
                  <p.icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <Badge variant="secondary">{p.label}</Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {p.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
