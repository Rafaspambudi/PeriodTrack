// ---- Export data ke CSV (BOM untuk kompatibilitas Excel) ----
import { format, parseISO } from "date-fns";
import { sortPeriods } from "./cycle-calculations";
import { flowLabel } from "./constants";
import type { PeriodEntry } from "./types";

function escapeCsv(value: string | number | null | undefined): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function periodsToCsv(periods: PeriodEntry[]): string {
  const header = [
    "No",
    "Mulai",
    "Selesai",
    "Durasi (hari)",
    "Aliran",
    "Gejala",
    "Suhu Basal (C)",
    "Catatan",
  ];

  const rows = sortPeriods(periods).map((p, i) => [
    String(i + 1),
    format(parseISO(p.startDate), "yyyy-MM-dd"),
    format(parseISO(p.endDate), "yyyy-MM-dd"),
    String(
      Math.round(
        (parseISO(p.endDate).getTime() - parseISO(p.startDate).getTime()) /
          86400000
      ) + 1
    ),
    flowLabel(p.flow),
    p.symptoms.join(", "),
    p.basalTemp === null ? "" : String(p.basalTemp),
    p.notes,
  ]);

  const lines = [header, ...rows].map((row) => row.map(escapeCsv).join(","));
  // BOM agar karakter non-ASCII terbaca benar di Excel
  return "\uFEFF" + lines.join("\r\n");
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

