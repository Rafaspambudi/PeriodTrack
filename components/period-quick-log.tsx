"use client";

import { useEffect, useState } from "react";
import { Droplets, Thermometer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SymptomIcon } from "./symptom-icon";
import { FLOW_OPTIONS, SYMPTOM_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PeriodEntry } from "@/lib/types";

/**
 * Editor cepat aliran, gejala, dan suhu basal untuk sebuah periode.
 * Dipakai di kartu "Hari ini" dan dialog log harian.
 */
export function PeriodQuickLog({
  period,
  onPatch,
}: {
  period: PeriodEntry;
  onPatch: (id: string, patch: Partial<PeriodEntry>) => void;
}) {
  const [temp, setTemp] = useState<string>("");

  useEffect(() => {
    setTemp(
      period.basalTemp === null || period.basalTemp === undefined
        ? ""
        : String(period.basalTemp)
    );
  }, [period.id, period.basalTemp]);

  const toggleSymptom = (s: (typeof SYMPTOM_LIST)[number]["value"]) => {
    const has = period.symptoms.includes(s);
    const next = has
      ? period.symptoms.filter((x) => x !== s)
      : [...period.symptoms, s];
    onPatch(period.id, { symptoms: next });
  };

  return (
    <div className="space-y-5">
      {/* Aliran */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Volume aliran
        </p>
        <div className="flex gap-2">
          {FLOW_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() =>
                onPatch(period.id, {
                  flow: period.flow === f.value ? null : f.value,
                })
              }
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-2xl border py-2.5 text-xs font-medium transition-colors",
                period.flow === f.value
                  ? "border-rose-400 bg-rose-400/10 text-rose-500 shadow-sm shadow-rose-200/50"
                  : "border-input hover:bg-accent"
              )}
            >
              {Array.from({ length: f.dots }).map((_, i) => (
                <Droplets key={i} className="h-3.5 w-3.5" />
              ))}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gejala */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Gejala hari ini
        </p>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_LIST.map((s) => {
            const active = period.symptoms.includes(s.value);
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleSymptom(s.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-violet-400 bg-violet-400/10 text-violet-600 shadow-sm shadow-violet-200/50 dark:text-violet-300"
                    : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <SymptomIcon symptom={s.value} className="h-3.5 w-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suhu basal */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Suhu basal tubuh (°C)
        </p>
        <div className="relative max-w-[180px]">
          <Thermometer className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            step="0.01"
            min="35"
            max="42"
            placeholder="36.70"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            onBlur={() =>
              onPatch(period.id, {
                basalTemp: temp === "" ? null : Number(temp),
              })
            }
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
