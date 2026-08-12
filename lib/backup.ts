// ---- Backup & restore data (JSON) ----
import type {
  AppSettings,
  BackupData,
  MoodLog,
  PeriodEntry,
} from "./types";

export function createBackup(
  periods: PeriodEntry[],
  moodLogs: MoodLog[],
  settings: AppSettings
): BackupData {
  return {
    app: "luna",
    version: 1,
    exportedAt: new Date().toISOString(),
    periods,
    moodLogs,
    settings,
  };
}

/** Validasi & parsing JSON backup. Mengembalikan null jika tidak valid. */
export function parseBackup(json: string): BackupData | null {
  try {
    const data = JSON.parse(json);
    if (data?.app !== "luna" || data?.version !== 1) return null;
    if (!Array.isArray(data.periods) || !Array.isArray(data.moodLogs)) {
      return null;
    }
    const validPeriods = data.periods.filter(
      (p: PeriodEntry) =>
        typeof p?.id === "string" &&
        typeof p?.startDate === "string" &&
        typeof p?.endDate === "string"
    );
    const validMoods = data.moodLogs.filter(
      (m: MoodLog) => typeof m?.date === "string" && typeof m?.mood === "string"
    );
    const settings: AppSettings = {
      defaultCycleLength:
        typeof data.settings?.defaultCycleLength === "number"
          ? data.settings.defaultCycleLength
          : 28,
      defaultPeriodDuration:
        typeof data.settings?.defaultPeriodDuration === "number"
          ? data.settings.defaultPeriodDuration
          : 5,
      reminderEnabled: Boolean(data.settings?.reminderEnabled),
      reminderTime:
        typeof data.settings?.reminderTime === "string"
          ? data.settings.reminderTime
          : "08:00",
      lastReminderDate:
        typeof data.settings?.lastReminderDate === "string"
          ? data.settings.lastReminderDate
          : null,
    };
    return {
      app: "luna",
      version: 1,
      exportedAt: String(data.exportedAt ?? ""),
      periods: validPeriods,
      moodLogs: validMoods,
      settings,
    };
  } catch {
    return null;
  }
}

export function downloadBackup(backup: BackupData): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `luna-backup-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
