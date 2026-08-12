"use client";

import { memo } from "react";
import { Droplets, Lightbulb, Pencil, Smile } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoodPicker } from "./mood-picker";
import { PeriodQuickLog } from "./period-quick-log";
import { moodMeta } from "@/lib/constants";
import { getPhaseInfo } from "@/lib/phase-info";
import type { DayStatus, Mood, PeriodEntry, Prediction } from "@/lib/types";

export const TodayCard = memo(function TodayCard({
  status,
  prediction,
  coveringPeriod,
  todayMood,
  onMoodChange,
  onPatchPeriod,
  onEditPeriod,
  onStartPeriod,
  onDailyLog,
}: {
  status: DayStatus;
  prediction: Prediction;
  coveringPeriod: PeriodEntry | undefined;
  todayMood: Mood | null;
  onMoodChange: (mood: Mood | null) => void;
  onPatchPeriod: (id: string, patch: Partial<PeriodEntry>) => void;
  onEditPeriod: (period: PeriodEntry) => void;
  onStartPeriod: () => void;
  onDailyLog: () => void;
}) {
  const phase = getPhaseInfo(status);
  const mood = moodMeta(todayMood);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-400/10 text-rose-500">
              <phase.icon className="h-5 w-5" strokeWidth={2} />
            </span>
            Hari Ini
            {prediction.dayOfCycle !== null && status !== "none" && (
              <Badge variant="secondary" className="ml-2">
                Hari ke-{prediction.dayOfCycle}
              </Badge>
            )}
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {coveringPeriod ? (
              <>
                Kamu sedang haid — catat detail harianmu di bawah ini
              </>
            ) : status === "predicted" ? (
              <>
                Haid diperkirakan{" "}
                <span className="font-semibold text-foreground">
                  {prediction.daysUntil !== null && prediction.daysUntil >= 0
                    ? `${prediction.daysUntil} hari lagi`
                    : "hari ini"}
                </span>
              </>
            ) : (
              phase.description
            )}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDailyLog}>
          <Smile className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Log harian</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mood hari ini */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Mood hari ini
            </p>
            {mood && (
              <Badge variant="violet">
                <mood.icon className="h-3 w-3" />
                {mood.label}
              </Badge>
            )}
          </div>
          <MoodPicker value={todayMood} onChange={onMoodChange} compact />
        </div>

        {coveringPeriod ? (
          <>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-rose-500/10 px-4 py-3">
              <p className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 shrink-0 text-rose-500" />
                Menstruasi{" "}
                {prediction.dayOfCycle !== null && (
                  <span className="font-semibold">
                    — hari ke-{prediction.dayOfCycle}
                  </span>
                )}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditPeriod(coveringPeriod)}
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            </div>
            <PeriodQuickLog period={coveringPeriod} onPatch={onPatchPeriod} />
          </>
        ) : (
          <>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {phase.description}
              </p>
              <div className="mt-2.5 flex items-start gap-2 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>{phase.tip}</span>
              </div>
            </div>
            {status === "predicted" && (
              <Button variant="gradient" size="sm" onClick={onStartPeriod}>
                Catat sekarang
              </Button>
            )}
            {status === "none" && (
              <Button variant="outline" size="sm" onClick={onStartPeriod}>
                Catat periode pertamamu
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});
