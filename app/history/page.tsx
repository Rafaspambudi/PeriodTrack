"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Download, FileText, History as HistoryIcon, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HistoryList } from "@/components/history-list";
import { Pagination } from "@/components/pagination";
import { LogPeriodDialog } from "@/components/log-period-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { usePeriodData } from "@/hooks/use-period-data";
import { sortPeriods } from "@/lib/cycle-calculations";
import { downloadCsv, periodsToCsv } from "@/lib/csv";
import { symptomLabel } from "@/lib/constants";
import { getTotalPeriodDays } from "@/lib/stats-helpers";
import type { PeriodDraft, PeriodInput } from "@/lib/types";

const PAGE_SIZE = 8;

export default function HistoryPage() {
  const { periods, stats, ready, addPeriod, updatePeriod, deletePeriod, clearAll } =
    usePeriodData();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{
    open: boolean;
    initial: PeriodDraft | null;
  }>({ open: false, initial: null });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const sortedDesc = useMemo(
    () => sortPeriods(periods).reverse(),
    [periods]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedDesc;
    return sortedDesc.filter((p) => {
      const haystack = [
        format(parseISO(p.startDate), "d MMMM yyyy", { locale: id }),
        format(parseISO(p.endDate), "d MMMM yyyy", { locale: id }),
        p.notes,
        ...p.symptoms.map(symptomLabel),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [sortedDesc, query]);

  const totalDays = useMemo(() => getTotalPeriodDays(periods), [periods]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered]
  );

  // Clamp halaman aktif jika jumlah halaman mengecil (mis. setelah hapus data)
  const currentPage = Math.min(page, totalPages);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedPeriods = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  const handleSave = (input: PeriodInput) => {
    if (dialog.initial?.id) {
      updatePeriod(dialog.initial.id, input);
    } else {
      addPeriod(input);
    }
    setDialog({ open: false, initial: null });
  };

  const handleExport = () => {
    downloadCsv("luna-period-tracker.csv", periodsToCsv(periods));
  };

  const handleExportPdf = async () => {
    const { exportPeriodsPdf } = await import("@/lib/pdf");
    exportPeriodsPdf(periods);
  };

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="h-14 animate-pulse rounded-3xl bg-muted/60" />
        <div className="h-80 animate-pulse rounded-3xl bg-muted/60" />
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div>
        <PageHeader
          title="Riwayat"
          description="Semua periode yang pernah kamu catat ada di sini."
        />
        <EmptyState
          icon={<HistoryIcon className="h-7 w-7" />}
          title="Belum Ada Riwayat"
          description="Catat periode pertamamu dari dashboard, lalu riwayat lengkap beserta durasi dan siklusnya akan muncul di sini."
          action={
            <Button asChild>
              <Link href="/">Ke Dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Riwayat"
        description={`${periods.length} periode tercatat. Cari berdasarkan bulan, gejala, atau catatan.`}
      >
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={handleExportPdf}>
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
        <Button variant="destructive-ghost" onClick={() => setConfirmClear(true)}>
          <Trash2 className="h-4 w-4" />
          Hapus Semua
        </Button>
      </PageHeader>

      {/* Ringkasan */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-rose-400/15 to-pink-400/10 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Total periode
          </p>
          <p className="mt-1 text-2xl font-bold">{periods.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-400/15 to-purple-400/10 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Total hari haid
          </p>
          <p className="mt-1 text-2xl font-bold">{totalDays} hari</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-400/15 to-amber-400/10 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Rata-rata siklus
          </p>
          <p className="mt-1 text-2xl font-bold">
            {stats.averageCycleLength ? `${stats.averageCycleLength} hari` : "—"}
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-fuchsia-400/15 to-pink-400/10 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Rata-rata durasi
          </p>
          <p className="mt-1 text-2xl font-bold">
            {stats.averagePeriodDuration
              ? `${stats.averagePeriodDuration} hari`
              : "—"}
          </p>
        </div>
      </div>

      {/* Pencarian */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1); // kembali ke halaman pertama saat mencari
          }}
          placeholder="Cari bulan (mis. Agustus), gejala, atau catatan..."
          className="rounded-2xl py-2.5 pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Tidak ada hasil untuk{" "}
          <span className="font-semibold text-foreground">“{query}”</span>.
        </div>
      ) : (
        <>
          <HistoryList
            periods={pagedPeriods}
            stats={stats}
            onEdit={(p) => setDialog({ open: true, initial: p })}
            onDelete={(id) => setDeleteId(id)}
          />
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}

      <LogPeriodDialog
        open={dialog.open}
        initial={dialog.initial}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        onSave={handleSave}
        onDelete={(id) => {
          deletePeriod(id);
          setDialog({ open: false, initial: null });
        }}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus periode ini?"
        description="Data periode yang dihapus tidak bisa dikembalikan."
        onConfirm={() => {
          if (deleteId) deletePeriod(deleteId);
        }}
      />

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Hapus semua data?"
        description="Seluruh riwayat periode akan dihapus permanen dari perangkat ini. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Hapus Semua"
        onConfirm={clearAll}
      />
    </div>
  );
}
