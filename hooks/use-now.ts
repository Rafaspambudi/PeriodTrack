"use client";

import { useEffect, useState } from "react";

const sameCalendarDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Mengembalikan Date sekarang, diperbarui saat kalender berganti hari.
 *
 * Semua perhitungan di aplikasi ini berbasis hari (countdown, fase, prediksi),
 * jadi re-render hanya perlu terjadi ketika tanggal berganti — bukan setiap
 * detik/menit. Hal ini mencegah seluruh halaman re-render tiap 60 detik.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow((prev) => {
        const next = new Date();
        // Kembalikan referensi yang sama jika masih di hari yang sama,
        // sehingga React meng-skip re-render sepenuhnya.
        return sameCalendarDay(prev, next) ? prev : next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
