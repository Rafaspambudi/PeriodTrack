"use client";

import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SymptomIcon } from "./symptom-icon";
import { flowLabel, SYMPTOM_LIST } from "@/lib/constants";
import type { CycleStats, PeriodEntry } from "@/lib/types";

export function HistoryList({
  periods,
  stats,
  onEdit,
  onDelete,
}: {
  periods: PeriodEntry[];
  stats: CycleStats;
  onEdit: (p: PeriodEntry) => void;
  onDelete: (id: string) => void;
}) {
  const cycleByStart = new Map(
    stats.cycleLengths
      .filter((p) => p.length > 0)
      .map((p) => [p.startDate, p.length])
  );

  const flowBadge = (p: PeriodEntry) => {
    if (!p.flow) return null;
    return (
      <Badge variant={p.flow === "light" ? "peach" : p.flow === "medium" ? "default" : "destructive"}>
        {flowLabel(p.flow)}
      </Badge>
    );
  };

  return (
    <>
      {/* Tabel desktop */}
      <div className="hidden overflow-x-auto rounded-3xl border bg-card shadow-soft md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 font-medium">Mulai</th>
              <th className="px-5 py-3.5 font-medium">Selesai</th>
              <th className="px-5 py-3.5 font-medium">Durasi</th>
              <th className="px-5 py-3.5 font-medium">Siklus</th>
              <th className="px-5 py-3.5 font-medium">Aliran</th>
              <th className="px-5 py-3.5 font-medium">Gejala</th>
              <th className="px-5 py-3.5 font-medium">Suhu</th>
              <th className="px-5 py-3.5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p, i) => {
              const duration =
                Math.round(
                  (parseISO(p.endDate).getTime() -
                    parseISO(p.startDate).getTime()) /
                    86400000
                ) + 1;
              return (
                <tr
                  key={p.id}
                  className={cnRow(i, periods.length)}
                >
                  <td className="whitespace-nowrap px-5 py-3.5 font-semibold">
                    {format(parseISO(p.startDate), "EEE, d MMM yyyy", { locale: id })}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">
                    {format(parseISO(p.endDate), "EEE, d MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-5 py-3.5">{duration} hari</td>
                  <td className="px-5 py-3.5">
                    {cycleByStart.has(p.startDate) ? (
                      `${cycleByStart.get(p.startDate)} hari`
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">{flowBadge(p)}</td>
                  <td className="px-5 py-3.5">
                    {p.symptoms.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        {p.symptoms.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            title={
                              SYMPTOM_LIST.find((x) => x.value === s)?.label ?? s
                            }
                          >
                            <SymptomIcon symptom={s} className="h-4 w-4 text-muted-foreground" />
                          </span>
                        ))}
                        {p.symptoms.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{p.symptoms.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {p.basalTemp !== null ? `${p.basalTemp}°C` : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Kartu mobile */}
      <div className="space-y-3 md:hidden">
        {periods.map((p, i) => {
          const duration =
            Math.round(
              (parseISO(p.endDate).getTime() - parseISO(p.startDate).getTime()) /
                86400000
            ) + 1;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="rounded-3xl border bg-card p-4 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {format(parseISO(p.startDate), "d MMMM yyyy", { locale: id })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    s.d.{" "}
                    {format(parseISO(p.endDate), "d MMMM yyyy", { locale: id })} ·{" "}
                    {duration} hari
                    {cycleByStart.has(p.startDate) &&
                      ` · siklus ${cycleByStart.get(p.startDate)} hari`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {flowBadge(p)}
                {p.symptoms.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    <SymptomIcon symptom={s} className="h-3 w-3" />
                  </span>
                ))}
                {p.basalTemp !== null && (
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
                    {p.basalTemp}°C
                  </span>
                )}
              </div>
              {p.notes && (
                <p className="mt-2.5 rounded-xl bg-secondary/50 p-2.5 text-xs text-muted-foreground">
                  {p.notes}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function cnRow(i: number, total: number): string {
  return i === total - 1
    ? "border-transparent"
    : "border-b transition-colors hover:bg-accent/40";
}
