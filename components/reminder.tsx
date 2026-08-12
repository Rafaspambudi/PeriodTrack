"use client";

import { useEffect } from "react";
import { usePeriodData } from "@/hooks/use-period-data";
import { toIso } from "@/lib/cycle-calculations";

/** Mengirim notifikasi browser sekali sehari (saat tab terbuka). */
export function Reminder() {
  const { settings, updateSettings, prediction, ready } = usePeriodData();

  useEffect(() => {
    if (!ready || !settings.reminderEnabled) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const todayIso = toIso(new Date());
    if (settings.lastReminderDate === todayIso) return;

    const [h, m] = (settings.reminderTime ?? "08:00").split(":").map(Number);
    const now = new Date();
    if (now.getHours() < h || (now.getHours() === h && now.getMinutes() < m)) {
      return;
    }

    const buildMessage = (): string => {
      const days = prediction.daysUntil;
      // Terlambat: prediksi sudah lewat, dorong untuk mencatat periode baru
      if (days !== null && days < 0) {
        return "Perkiraan haid sudah lewat. Catat periode baru kamu di Luna.";
      }
      if (days !== null && days <= 1) {
        return days === 0
          ? "Perkiraan haid kamu mulai hari ini. Semangat ya!"
          : "Perkiraan haid kamu besok. Yuk siapkan diri!";
      }
      if (days !== null && days <= 5) {
        return `Haid diperkirakan ${days} hari lagi. Catat gejala harianmu ya.`;
      }
      if (
        prediction.fertileStart &&
        prediction.fertileEnd &&
        todayIso >= prediction.fertileStart &&
        todayIso <= prediction.fertileEnd
      ) {
        return "Kamu sedang dalam masa subur!";
      }
      return "Jangan lupa catat gejala dan mood kamu hari ini di Luna.";
    };

    try {
      new Notification("Luna — Period Tracker", {
        body: buildMessage(),
        icon: "/icon.svg",
      });
      updateSettings({ lastReminderDate: todayIso });
    } catch {
      // notifikasi gagal -> abaikan, coba lagi nanti
    }
  }, [
    ready,
    settings.reminderEnabled,
    settings.reminderTime,
    settings.lastReminderDate,
    prediction.daysUntil,
    prediction.fertileStart,
    prediction.fertileEnd,
    updateSettings,
  ]);

  return null;
}
