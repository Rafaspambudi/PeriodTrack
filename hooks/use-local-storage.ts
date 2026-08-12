"use client";

import { useEffect, useState } from "react";

/**
 * useLocalStorage — SSR-safe wrapper untuk localStorage.
 * Nilai baru dibaca setelah mount (tidak ada hydration mismatch),
 * dan setiap perubahan otomatis disimpan kembali ke localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  // Baca dari localStorage setelah mount (client-only)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // data korup -> abaikan, pakai initialValue
    }
    setReady(true);
  }, [key]);

  // Simpan setiap kali nilai berubah (setelah siap)
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage penuh / private mode -> abaikan
    }
  }, [key, ready, value]);

  // Sinkron antar tab
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue) as T);
        } catch {
          // abaikan data yang tidak valid
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [value, setValue, ready] as const;
}
