"use client";

import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CyclePoint, MoodLog, PeriodEntry } from "@/lib/types";
import {
  getMoodStats,
  getSymptomFrequencies,
} from "@/lib/stats-helpers";
import { moodMeta } from "@/lib/constants";

function ChartTooltip({
  active,
  payload,
  label,
  unit,
  prefix,
}: TooltipProps<number, string> & { unit?: string; prefix?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-2xl border bg-card px-3.5 py-2.5 text-xs shadow-xl">
      <p className="font-semibold">{label}</p>
      <p className="mt-0.5 text-muted-foreground">
        {prefix ?? ""}
        {value}
        {unit ? ` ${unit}` : ""}
      </p>
    </div>
  );
}

export function CycleLengthChart({
  data,
}: {
  data: { label: string; length: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 12, left: -20, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            opacity={0.12}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<ChartTooltip unit="hari" />}
            cursor={{
              stroke: "hsl(var(--muted-foreground))",
              strokeDasharray: "4 4",
              opacity: 0.3,
            }}
          />
          <Line
            type="monotone"
            dataKey="length"
            stroke="#f472b6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#f472b6", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DurationChart({
  data,
}: {
  data: { label: string; duration: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, left: -20, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            opacity={0.12}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<ChartTooltip unit="hari" />}
            cursor={{ fill: "hsl(var(--muted-foreground))", opacity: 0.08 }}
          />
          <Bar
            dataKey="duration"
            fill="#a78bfa"
            radius={[8, 8, 0, 0]}
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SymptomChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            opacity={0.12}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={104}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<ChartTooltip unit="kali" />}
            cursor={{ fill: "hsl(var(--muted-foreground))", opacity: 0.08 }}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={18}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={
                  ["#f472b6", "#a78bfa", "#fb923c", "#e879f9", "#fbbf24", "#60a5fa"][
                    i % 6
                  ]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MoodChart({
  data,
}: {
  data: { label: string; count: number; color: string }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            opacity={0.12}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={96}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<ChartTooltip unit="hari" />}
            cursor={{ fill: "hsl(var(--muted-foreground))", opacity: 0.08 }}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={18}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Komponen default: semua grafik statistik. */
export default function StatsCharts({
  points,
  periods,
  moodLogs,
}: {
  points: CyclePoint[];
  periods: PeriodEntry[];
  moodLogs: MoodLog[];
}) {
  const cycleData = points
    .filter((p) => p.length > 0)
    .map((p) => ({
      label: format(parseISO(p.startDate), "dd MMM", { locale: id }),
      length: p.length,
    }));
  const durationData = points.map((p) => ({
    label: format(parseISO(p.startDate), "dd MMM", { locale: id }),
    duration: p.duration,
  }));

  const symptoms = getSymptomFrequencies(periods)
    .slice(0, 6)
    .map((s) => ({ label: s.label, count: s.count }));
  const moodStats = getMoodStats(moodLogs);
  const moodData = moodStats.counts.map((m) => {
    const meta = moodMeta(m.mood);
    return {
      label: m.label,
      count: m.count,
      color: meta?.hex ?? "#94a3b8",
    };
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Panjang Siklus per Periode</CardTitle>
          <CardDescription>
            Jarak antar tanggal mulai haid (dalam hari)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CycleLengthChart data={cycleData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Durasi Haid per Periode</CardTitle>
          <CardDescription>
            Berapa lama haid berlangsung tiap periode (dalam hari)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DurationChart data={durationData} />
        </CardContent>
      </Card>

      {symptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gejala Paling Sering</CardTitle>
            <CardDescription>
              Seberapa sering tiap gejala muncul di seluruh periodemu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SymptomChart data={symptoms} />
          </CardContent>
        </Card>
      )}

      {moodData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mood Sepanjang Siklus</CardTitle>
            <CardDescription>
              Distribusi mood harian yang kamu catat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodChart data={moodData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
