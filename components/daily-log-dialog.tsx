"use client";

import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Droplets, NotebookPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MoodPicker } from "./mood-picker";
import { PeriodQuickLog } from "./period-quick-log";
import { moodMeta } from "@/lib/constants";
import { capitalize } from "@/lib/utils";
import type { Mood, PeriodEntry } from "@/lib/types";

/** Log harian: mood + (jika sedang haid) aliran/gejala/suhu periode. */
export function DailyLogDialog({
  open,
  dateIso,
  mood,
  coveringPeriod,
  onOpenChange,
  onMoodChange,
  onPatchPeriod,
}: {
  open: boolean;
  dateIso: string;
  mood: Mood | null;
  coveringPeriod: PeriodEntry | undefined;
  onOpenChange: (open: boolean) => void;
  onMoodChange: (mood: Mood | null) => void;
  onPatchPeriod: (id: string, patch: Partial<PeriodEntry>) => void;
}) {
  const meta = moodMeta(mood);
  const isToday = dateIso === format(new Date(), "yyyy-MM-dd");
  const dayOfCycle = coveringPeriod
    ? differenceInCalendarDays(
        parseISO(dateIso),
        parseISO(coveringPeriod.startDate)
      ) + 1
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <NotebookPen className="h-5 w-5 text-rose-400" />
            Log Harian
          </DialogTitle>
          <DialogDescription>
            {capitalize(
              format(parseISO(dateIso), "EEEE, d MMMM yyyy", { locale: id })
            )}
            {isToday ? " · hari ini" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mood */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Bagaimana perasaanmu?
              </p>
            {meta && (
              <Badge variant="violet">
                <meta.icon className="h-3 w-3" />
                {meta.label}
              </Badge>
            )}
            </div>
            <MoodPicker value={mood} onChange={onMoodChange} />
          </div>

          {/* Jika sedang haid */}
          {coveringPeriod ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 px-4 py-3">
                <Droplets className="h-4 w-4 shrink-0 text-rose-500" />
                <p className="text-sm">
                  Kamu sedang haid{" "}
                  {dayOfCycle !== null && (
                    <span className="font-semibold">(hari ke-{dayOfCycle})</span>
                  )}
                  — catat detail harianmu:
                </p>
              </div>
              <PeriodQuickLog period={coveringPeriod} onPatch={onPatchPeriod} />
            </div>
          ) : (
            <p className="rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
              {mood
                ? "Terima kasih sudah mencatat moodmu. Semangat terus!"
                : "Pilih mood di atas — catatan mood harian membantu kamu melihat pola emosi sepanjang siklus."}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
