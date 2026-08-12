"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Membangun daftar halaman untuk ditampilkan, dengan elipsis ("…")
 * saat jumlah halaman banyak. Selalu menyertakan halaman pertama &
 * terakhir, serta jendela ±1 di sekitar halaman aktif.
 */
function buildPageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, totalPages]);
  for (let i = page - 1; i <= page + 1; i++) {
    if (i >= 1 && i <= totalPages) set.add(i);
  }
  const sorted = Array.from(set).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const window = buildPageWindow(page, totalPages);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="shrink-0 text-center text-xs text-muted-foreground sm:text-left">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">{start}–{end}</span> dari{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> periode
      </p>

      <div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-0.5">
        {/* Prev */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Halaman sebelumnya"
          className="grid h-9 w-9 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Nomor halaman */}
        {window.map((item, i) =>
          item === "…" ? (
            <span
              key={`gap-${i}`}
              className="grid h-9 w-9 place-items-center text-xs text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "grid h-9 min-w-9 place-items-center rounded-full px-2.5 text-sm font-medium transition-colors",
                item === page
                  ? "bg-gradient-to-r from-rose-400 to-violet-400 text-white shadow-md shadow-rose-400/30"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Halaman berikutnya"
          className="grid h-9 w-9 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
