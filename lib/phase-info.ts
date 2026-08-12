import {
  CalendarClock,
  Droplets,
  Egg,
  Flame,
  Flower2,
  Moon,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { DayStatus } from "./types";

export interface PhaseInfo {
  status: DayStatus;
  label: string;
  icon: LucideIcon;
  description: string;
  tip: string;
}

/** Informasi tiap fase siklus untuk ditampilkan di UI (bahasa Indonesia). */
export const PHASE_INFO: Record<string, PhaseInfo> = {
  period: {
    status: "period",
    label: "Menstruasi",
    icon: Droplets,
    description:
      "Lapisan rahim meluruh dan keluar sebagai darah haid. Ini adalah hari ke-1 hingga ke-5 siklus.",
    tip: "Perbanyak cairan hangat, konsumsi makanan bergizi, dan jangan lupa istirahat yang cukup.",
  },
  predicted: {
    status: "predicted",
    label: "Perkiraan Haid",
    icon: CalendarClock,
    description:
      "Berdasarkan rata-rata siklusmu, haid diperkirakan dimulai pada rentang tanggal ini.",
    tip: "Siapkan perlengkapan, dan catat begitu haid benar-benar dimulai agar prediksi makin akurat.",
  },
  follicular: {
    status: "follicular",
    label: "Fase Folikular",
    icon: Sprout,
    description:
      "Kelenjar pituitari melepas FSH yang merangsang folikel di ovarium. Energi biasanya meningkat di fase ini.",
    tip: "Waktu yang baik untuk mulai olahraga atau mengerjakan proyek baru — semangatmu lagi tinggi!",
  },
  ovulation: {
    status: "ovulation",
    label: "Ovulasi",
    icon: Egg,
    description:
      "Sel telur dilepaskan dari ovarium (± hari ke-14). Ini adalah hari paling subur dalam siklusmu.",
    tip: "Jika merencanakan kehamilan, inilah waktu terbaik. Kalau tidak, gunakan proteksi ekstra.",
  },
  fertile: {
    status: "fertile",
    label: "Masa Subur",
    icon: Flame,
    description:
      "Jendela subur: sekitar 5 hari sebelum ovulasi sampai 1 hari setelahnya. Peluang pembuahan tinggi.",
    tip: "Perhatikan lendir serviks yang bening & elastis — pertanda masa subur sedang berlangsung.",
  },
  luteal: {
    status: "luteal",
    label: "Fase Luteal",
    icon: Moon,
    description:
      "Progesteron naik untuk mempersiapkan rahim. PMS seperti mood swing dan kembung sering muncul di fase ini.",
    tip: "Bersikap lembut pada diri sendiri. Kurangi kafein & garam, dan jaga pola tidur.",
  },
  none: {
    status: "none",
    label: "Belum Ada Data",
    icon: Flower2,
    description:
      "Catat hari pertama haidmu untuk mulai melihat prediksi siklus, fase, dan masa subur.",
    tip: "Cukup klik tanggal di kalender — butuh waktu kurang dari 10 detik!",
  },
};

export function getPhaseInfo(status: DayStatus): PhaseInfo {
  return PHASE_INFO[status] ?? PHASE_INFO.none;
}

/** Daftar fase untuk kartu edukasi di halaman statistik. */
export const PHASE_LIST_STATS: PhaseInfo[] = [
  PHASE_INFO.period,
  PHASE_INFO.follicular,
  PHASE_INFO.ovulation,
  PHASE_INFO.fertile,
  PHASE_INFO.luteal,
];
