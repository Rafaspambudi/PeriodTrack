"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Bell,
  Database,
  Download,
  FileText,
  Flower2,
  FolderUp,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { usePeriodData } from "@/hooks/use-period-data";
import { downloadCsv, periodsToCsv } from "@/lib/csv";
import { createBackup, downloadBackup, parseBackup } from "@/lib/backup";
import { cn } from "@/lib/utils";

function SettingRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0 sm:pl-6">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const {
    periods,
    moodLogs,
    settings,
    ready,
    updateSettings,
    clearAll,
    importData,
  } = usePeriodData();
  const { theme, setTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);

  const [confirmClear, setConfirmClear] = useState(false);
  const [restoreJson, setRestoreJson] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [notifPermission, setNotifPermission] = useState<
    "granted" | "denied" | "default" | "unsupported"
  >("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotifPermission("unsupported");
      return;
    }
    setNotifPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  };

  const handleExportBackup = () => {
    downloadBackup(createBackup(periods, moodLogs, settings));
  };

  const handleExportPdf = async () => {
    const { exportPeriodsPdf } = await import("@/lib/pdf");
    exportPeriodsPdf(periods);
  };

  const handleRestoreFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseBackup(String(reader.result ?? ""));
      if (!parsed) {
        setRestoreError("File backup tidak valid. Pastikan file berasal dari Luna.");
        return;
      }
      setRestoreError(null);
      setRestoreJson(JSON.stringify(parsed));
    };
    reader.readAsText(file);
  };

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="h-14 animate-pulse rounded-3xl bg-muted/60" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-3xl bg-muted/60" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Pengaturan"
        description="Sesuaikan siklus default, reminder, tampilan, dan kelola datamu."
      />

      <div className="space-y-6">
        {/* Tampilan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-rose-400" />
              Tampilan
            </CardTitle>
            <CardDescription>
              Pilih tema yang paling nyaman untuk matamu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Terang", icon: Sun },
                { value: "dark", label: "Gelap", icon: Moon },
                { value: "system", label: "Sistem", icon: Monitor },
              ].map((t) => {
                const Icon = t.icon;
                const active = theme === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border py-4 text-sm font-medium transition-colors",
                      active
                        ? "border-rose-400 bg-rose-400/10 text-rose-500 shadow-sm shadow-rose-200/50"
                        : "border-input hover:bg-accent"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Default siklus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flower2 className="h-5 w-5 text-rose-400" />
              Default Siklus
            </CardTitle>
            <CardDescription>
              Digunakan sebagai dasar prediksi selama data historimu masih
              sedikit (kurang dari 2 periode).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="cycle-length">Panjang siklus default</Label>
                <Badge variant="default">
                  {settings.defaultCycleLength} hari
                </Badge>
              </div>
              <input
                id="cycle-length"
                type="range"
                min={20}
                max={45}
                step={1}
                value={settings.defaultCycleLength}
                onChange={(e) =>
                  updateSettings({ defaultCycleLength: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="period-duration">Durasi haid default</Label>
                <Badge variant="default">
                  {settings.defaultPeriodDuration} hari
                </Badge>
              </div>
              <input
                id="period-duration"
                type="range"
                min={2}
                max={10}
                step={1}
                value={settings.defaultPeriodDuration}
                onChange={(e) =>
                  updateSettings({ defaultPeriodDuration: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reminder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-rose-400" />
              Reminder
            </CardTitle>
            <CardDescription>
              Pengingat harian lewat notifikasi browser. Aktif selama tab Luna
              terbuka.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              <SettingRow
                icon={<Bell className="h-4 w-4" />}
                title="Aktifkan reminder harian"
                description="Dapatkan notifikasi perkiraan haid & masa subur setiap hari."
              >
                <Switch
                  checked={settings.reminderEnabled}
                  onCheckedChange={(v) =>
                    updateSettings({ reminderEnabled: v })
                  }
                />
              </SettingRow>
              <SettingRow
                icon={<Bell className="h-4 w-4" />}
                title="Jam pengingat"
                description="Pukul berapa notifikasi dikirim."
              >
                <Input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) =>
                    updateSettings({ reminderTime: e.target.value })
                  }
                  className="w-32"
                  disabled={!settings.reminderEnabled}
                />
              </SettingRow>
              <SettingRow
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Izin notifikasi browser"
                description={
                  notifPermission === "granted"
                    ? "Notifikasi sudah diizinkan."
                    : notifPermission === "denied"
                    ? "Notifikasi diblokir — izinkan lewat pengaturan browser."
                    : "Klik tombol untuk mengizinkan notifikasi."
                }
              >
                {notifPermission === "granted" ? (
                  <Badge variant="success">Diizinkan</Badge>
                ) : notifPermission === "unsupported" ? (
                  <Badge variant="secondary">Tidak didukung</Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestPermission}
                  >
                    Izinkan
                  </Button>
                )}
              </SettingRow>
            </div>
          </CardContent>
        </Card>

        {/* Data & privasi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-rose-400" />
              Data & Privasi
            </CardTitle>
            <CardDescription>
              Semua data tersimpan di localStorage perangkatmu — tidak pernah
              dikirim ke server mana pun. Rutin export backup agar aman.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              <SettingRow
                icon={<Download className="h-4 w-4" />}
                title="Export data (CSV / PDF)"
                description={`${periods.length} periode siap diexport. CSV untuk Excel/Sheets, PDF untuk dibagikan & dicetak.`}
              >
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={periods.length === 0}
                    onClick={() =>
                      downloadCsv("luna-period-tracker.csv", periodsToCsv(periods))
                    }
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={periods.length === 0}
                    onClick={handleExportPdf}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Export PDF
                  </Button>
                </div>
              </SettingRow>

              <SettingRow
                icon={<FolderUp className="h-4 w-4" />}
                title="Backup & restore (JSON)"
                description="Simpan seluruh data (periode, mood, pengaturan) lalu pulihkan kapan saja."
              >
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportBackup}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Backup
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5" />
                    Restore
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleRestoreFile(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </SettingRow>

              {restoreError && (
                <p className="py-3 text-sm text-destructive">{restoreError}</p>
              )}

              <SettingRow
                icon={<Trash2 className="h-4 w-4" />}
                title="Hapus semua data"
                description="Bersihkan seluruh riwayat periode & mood dari perangkat ini."
              >
                <Button
                  variant="destructive-ghost"
                  size="sm"
                  onClick={() => setConfirmClear(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus Semua
                </Button>
              </SettingRow>
            </div>
          </CardContent>
        </Card>

      </div>

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Hapus semua data?"
        description="Seluruh riwayat periode & mood akan dihapus permanen dari perangkat ini. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Hapus Semua"
        onConfirm={clearAll}
      />

      <ConfirmDialog
        open={restoreJson !== null}
        onOpenChange={(open) => !open && setRestoreJson(null)}
        title="Pulihkan dari backup?"
        description="Seluruh data saat ini akan DIGANTI dengan isi file backup. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Pulihkan"
        onConfirm={() => {
          if (restoreJson) {
            const parsed = parseBackup(restoreJson);
            if (parsed) {
              importData({
                periods: parsed.periods,
                moodLogs: parsed.moodLogs,
                settings: parsed.settings,
              });
              setRestoreError(null);
            }
          }
        }}
      />
    </div>
  );
}
