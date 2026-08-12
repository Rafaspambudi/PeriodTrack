// ---- Export laporan PDF (jsPDF + jspdf-autotable, 100% client-side) ----
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getCycleStats } from "./cycle-calculations";
import { flowLabel, symptomLabel } from "./constants";
import { getTotalPeriodDays } from "./stats-helpers";
import type { PeriodEntry } from "./types";

/** Bersihkan karakter non-ASCII (emoji, aksen) agar aman untuk font PDF. */
function sanitize(s: string): string {
  return s.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
}

/** Generate laporan PDF berisi ringkasan + tabel seluruh riwayat periode. */
export function exportPeriodsPdf(periods: PeriodEntry[]): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const stats = getCycleStats(periods);
  const sorted = [...periods].sort((a, b) =>
    b.startDate.localeCompare(a.startDate)
  );
  const cycleByStart = new Map(
    stats.cycleLengths
      .filter((p) => p.length > 0)
      .map((p) => [p.startDate, p.length])
  );

  // ---- Header berwarna ----
  doc.setFillColor(244, 114, 182);
  doc.rect(0, 0, pageWidth, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Period Tracker", 40, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Laporan Siklus Menstruasi", 40, 58);
  doc.setFontSize(9);
  doc.text(
    `Dibuat ${format(new Date(), "d MMMM yyyy", { locale: id })} · ${sorted.length} periode tercatat`,
    40,
    74
  );

  // ---- Ringkasan ----
  const totalDays = getTotalPeriodDays(periods);
  const leftSummary = [
    `Rata-rata siklus: ${stats.averageCycleLength ?? "-"} hari`,
    `Siklus terpendek: ${stats.shortestCycle ?? "-"} hari`,
    `Total hari haid: ${totalDays} hari`,
  ];
  const rightSummary = [
    `Rata-rata durasi haid: ${stats.averagePeriodDuration ?? "-"} hari`,
    `Siklus terpanjang: ${stats.longestCycle ?? "-"} hari`,
    `Total periode: ${stats.periodCount}`,
  ];

  doc.setTextColor(70, 60, 65);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Ringkasan", 40, 120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let y = 138;
  for (let i = 0; i < 3; i++) {
    doc.setTextColor(90, 80, 85);
    doc.text(leftSummary[i] ?? "", 40, y);
    doc.text(rightSummary[i] ?? "", pageWidth / 2 + 20, y);
    y += 16;
  }

  // ---- Tabel riwayat ----
  autoTable(doc, {
    startY: y + 8,
    head: [
      ["No", "Mulai", "Selesai", "Durasi", "Siklus", "Aliran", "Gejala", "Suhu", "Catatan"],
    ],
    body: sorted.map((p, i) => {
      const duration =
        Math.round(
          (parseISO(p.endDate).getTime() - parseISO(p.startDate).getTime()) /
            86400000
        ) + 1;
      return [
        String(i + 1),
        format(parseISO(p.startDate), "dd MMM yyyy", { locale: id }),
        format(parseISO(p.endDate), "dd MMM yyyy", { locale: id }),
        `${duration} hari`,
        cycleByStart.has(p.startDate) ? `${cycleByStart.get(p.startDate)} hari` : "-",
        flowLabel(p.flow),
        sanitize(p.symptoms.map(symptomLabel).join(", ")) || "-",
        p.basalTemp !== null ? `${p.basalTemp}\u00B0C` : "-",
        sanitize(p.notes) || "-",
      ];
    }),
    styles: { fontSize: 8, cellPadding: 5, overflow: "linebreak", textColor: [70, 60, 65] },
    headStyles: { fillColor: [244, 114, 182], textColor: 255, fontStyle: "bold", fontSize: 8 },
    alternateRowStyles: { fillColor: [255, 243, 248] },
    columnStyles: {
      6: { cellWidth: 72 }, // gejala
      8: { cellWidth: 90 }, // catatan
    },
    margin: { left: 40, right: 40 },
  });

  // ---- Footer nomor halaman ----
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(160, 150, 155);
    doc.text(
      `Halaman ${i} dari ${pages}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" }
    );
  }

  const stamp = format(new Date(), "yyyy-MM-dd");
  doc.save(`period-tracker-report-${stamp}.pdf`);
}
