"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./use-local-storage";
import { useNow } from "./use-now";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/lib/constants";
import {
  getCycleProgress,
  getCycleStats,
  getPrediction,
  normalizePeriod,
} from "@/lib/cycle-calculations";
import type {
  AppSettings,
  Mood,
  MoodLog,
  PeriodEntry,
  PeriodInput,
} from "@/lib/types";
import { makeId } from "@/lib/utils";

export function usePeriodData() {
  const [periods, setPeriods, periodsReady] = useLocalStorage<PeriodEntry[]>(
    STORAGE_KEYS.periods,
    []
  );
  const [moodLogs, setMoodLogs, moodsReady] = useLocalStorage<MoodLog[]>(
    STORAGE_KEYS.moodLogs,
    []
  );
  const [settings, setSettings, settingsReady] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );

  const now = useNow();
  const ready = periodsReady && moodsReady && settingsReady;

  const stats = useMemo(() => getCycleStats(periods), [periods]);
  const prediction = useMemo(
    () => getPrediction(periods, settings, now),
    [periods, settings, now]
  );
  const cycleProgress = useMemo(
    () => getCycleProgress(periods, settings, now),
    [periods, settings, now]
  );
  const moodByDate = useMemo(() => {
    const map = new Map<string, Mood>();
    for (const log of moodLogs) map.set(log.date, log.mood);
    return map;
  }, [moodLogs]);

  const addPeriod = useCallback(
    (input: PeriodInput) => {
      const { startDate, endDate } = normalizePeriod({
        startDate: input.startDate,
        endDate: input.endDate,
      });
      setPeriods((prev) => [
        ...prev,
        {
          id: makeId(),
          startDate,
          endDate,
          flow: input.flow,
          symptoms: input.symptoms,
          notes: input.notes,
          basalTemp: input.basalTemp,
        },
      ]);
    },
    [setPeriods]
  );

  const updatePeriod = useCallback(
    (id: string, patch: Partial<PeriodEntry>) => {
      setPeriods((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const merged = { ...p, ...patch };
          const { startDate, endDate } = normalizePeriod(merged);
          return { ...merged, startDate, endDate };
        })
      );
    },
    [setPeriods]
  );

  const deletePeriod = useCallback(
    (id: string) => {
      setPeriods((prev) => prev.filter((p) => p.id !== id));
    },
    [setPeriods]
  );

  /** Set mood harian (null = hapus log mood hari itu). */
  const setMood = useCallback(
    (date: string, mood: Mood | null) => {
      setMoodLogs((prev) => {
        const rest = prev.filter((m) => m.date !== date);
        if (!mood) return rest;
        return [...rest, { date, mood }];
      });
    },
    [setMoodLogs]
  );

  const clearAll = useCallback(() => {
    setPeriods([]);
    setMoodLogs([]);
  }, [setPeriods, setMoodLogs]);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [setSettings]
  );

  /** Ganti seluruh data (untuk restore backup). */
  const importData = useCallback(
    (data: { periods: PeriodEntry[]; moodLogs: MoodLog[]; settings: AppSettings }) => {
      setPeriods(data.periods);
      setMoodLogs(data.moodLogs);
      setSettings(data.settings);
    },
    [setPeriods, setMoodLogs, setSettings]
  );

  return {
    periods,
    moodLogs,
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
    clearAll,
    updateSettings,
    importData,
  };
}
