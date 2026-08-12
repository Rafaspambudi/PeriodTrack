"use client";

import { useEffect, useState } from "react";
import { Droplets, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SymptomIcon } from "./symptom-icon";
import { FLOW_OPTIONS, SYMPTOM_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { FlowLevel, PeriodDraft, PeriodInput, Symptom } from "@/lib/types";

export function LogPeriodDialog({
  open,
  initial,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial: PeriodDraft | null;
  onOpenChange: (open: boolean) => void;
  onSave: (input: PeriodInput) => void;
  onDelete?: (id: string) => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flow, setFlow] = useState<FlowLevel | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState("");
  const [basalTemp, setBasalTemp] = useState("");

  // Muat data ke form setiap dialog dibuka
  useEffect(() => {
    if (open && initial) {
      setStartDate(initial.startDate);
      setEndDate(initial.endDate);
      setFlow(initial.flow ?? null);
      setSymptoms(initial.symptoms ?? []);
      setNotes(initial.notes ?? "");
      setBasalTemp(
        initial.basalTemp === null || initial.basalTemp === undefined
          ? ""
          : String(initial.basalTemp)
      );
    }
  }, [open, initial]);

  const isEdit = Boolean(initial?.id);
  const valid = startDate !== "" && endDate !== "";

  const toggleSymptom = (s: Symptom) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSave = () => {
    if (!valid) return;
    onSave({
      startDate,
      endDate,
      flow,
      symptoms,
      notes,
      basalTemp: basalTemp === "" ? null : Number(basalTemp),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Periode" : "Catat Periode Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui detail periode ini."
              : "Pilih rentang tanggal, lalu lengkapi detailnya (opsional)."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start-date">Tanggal mulai</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end-date">Tanggal selesai</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Volume aliran</Label>
            <div className="grid grid-cols-3 gap-2">
              {FLOW_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFlow(f.value === flow ? null : f.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl border py-2.5 text-xs font-medium transition-colors",
                    flow === f.value
                      ? "border-rose-400 bg-rose-400/10 text-rose-500"
                      : "border-input hover:bg-accent"
                  )}
                >
                  <span className="flex items-end gap-0.5">
                    {Array.from({ length: f.dots }).map((_, i) => (
                      <Droplets key={i} className="h-3.5 w-3.5" />
                    ))}
                  </span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gejala (boleh lebih dari satu)</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SYMPTOM_LIST.map((s) => {
                const active = symptoms.includes(s.value);
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => toggleSymptom(s.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                      active
                        ? "border-violet-400 bg-violet-400/10 text-violet-600 dark:text-violet-300"
                        : "border-input hover:bg-accent"
                    )}
                  >
                    <SymptomIcon
                      symptom={s.value}
                      className="h-3.5 w-3.5 shrink-0"
                    />
                    <span className="truncate">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bbt">Suhu basal tubuh (°C) — opsional</Label>
            <Input
              id="bbt"
              type="number"
              step="0.01"
              min="35"
              max="42"
              placeholder="contoh: 36.70"
              value={basalTemp}
              onChange={(e) => setBasalTemp(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              placeholder="Tulis catatan harianmu di sini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          {isEdit && onDelete && initial?.id && (
            <Button
              variant="destructive-ghost"
              className="mr-auto"
              onClick={() => {
                onDelete(initial.id!);
                onOpenChange(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button variant="gradient" disabled={!valid} onClick={handleSave}>
            {isEdit ? "Simpan Perubahan" : "Simpan Periode"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
