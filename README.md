<div align="center">

# 🌸 Luna — Period Tracker

**Pelacak siklus menstruasi yang modern, aesthetic, dan 100% privasi.**

![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-pink?style=for-the-badge)

**Demo / Live:** *(tambahkan link Vercel setelah deploy, mis. `https://luna-tracker.vercel.app`)*

</div>

---

## ✨ Tentang Proyek

**Luna** adalah aplikasi pelacak siklus menstruasi yang dirancang **indah, responsif, dan sangat menjaga privasi**. Semua data tersimpan **hanya di perangkatmu (localStorage)** — tanpa backend, tanpa database, tanpa API key, dan tetap berfungsi **offline**.

Dibangun di atas **Next.js 14 (App Router)**, **TypeScript**, dan **Tailwind CSS**, Luna menggabungkan kalender interaktif, prediksi siklus otomatis, tracking harian, hingga analisis statistik dalam satu antarmuka pastel yang menenangkan.

> ⚠️ **Catatan medis:** Prediksi siklus adalah **estimasi** berdasarkan rata-rata datamu dan bersifat informatif, **bukan** nasihat medis. Jika mengalami masalah kesehatan, konsultasikan dengan profesional.

---

## 🚀 Fitur Utama

### 📅 Kalender & Prediksi
- Kalender interaktif — klik tanggal untuk menandai periode
- **Prediksi otomatis**: periode berikutnya, ovulasi, & masa subur
- Highlight **fase siklus** (menstruasi → folikular → ovulasi → luteal)
- Countdown *"X hari lagi"* + ring progress siklus + timeline fase

### 📝 Tracking Harian
- **Mood harian** — 7 pilihan mood dengan ikon elegan
- **Gejala** — 10 jenis (kram, sakit kepala, kembung, dll.)
- **Volume aliran** (ringan / sedang / berat), **catatan**, & **suhu basal tubuh**
- Log harian lengkap terhubung dengan kalender

### 📊 Statistik & Riwayat
- Grafik **panjang siklus & durasi haid** (Recharts)
- **Gejala paling sering** & distribusi mood
- Penilaian **keteraturan siklus** (rata-rata, terpendek, terpanjang)
- Riwayat dengan **pencarian** & pagination

### 💾 Data & Ekspor
- **Export PDF** — laporan rapi berisi ringkasan + tabel riwayat (jsPDF)
- **Export CSV** — mudah dibuka di spreadsheet
- **Backup & restore JSON** — migrasi antar perangkat

### ⚙️ Pengaturan & Kenyamanan
- Panjang siklus & durasi haid default
- **Reminder** via browser notification
- Mode **terang / gelap** (tema pastel pink–lavender–peach)
- Animasi halus **Framer Motion**, mobile-first & fully responsive

---

## 🧰 Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| [Next.js 14](https://nextjs.org/) | Framework React (App Router) |
| [React 18](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling & tema |
| [shadcn/ui + Radix UI](https://ui.shadcn.com/) | Komponen aksesibel |
| [Framer Motion](https://www.framer.com/motion/) | Animasi transisi |
| [Recharts](https://recharts.org/) | Grafik & statistik |
| [date-fns](https://date-fns.org/) | Manipulasi tanggal |
| [jspdf](https://github.com/parallax/jsPDF) | Export PDF |
| [lucide-react](https://lucide.dev/) | Ikon |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark / light mode |

---

## 📸 Screenshot

> *(Tambahkan tangkapan layar di sini. Contoh:)*
>
> ```
> ![Dashboard](public/screenshots/dashboard.png)
> ![Statistik](public/screenshots/stats.png)
> ```

---

## 🚀 Cara Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) ≥ 18.17
- npm (sudah termasuk bersama Node.js)

### Instalasi & Menjalankan

```bash
# 1. Clone repositori
git clone https://github.com/<username>/luna-period-tracker.git
cd luna-period-tracker

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. 🎉

### Script yang Tersedia

| Script | Fungsi |
|--------|--------|
| `npm run dev` | Menjalankan dev server |
| `npm run build` | Build produksi + typecheck + lint |
| `npm start` | Menjalankan hasil build |
| `npm run lint` | Cek ESLint |
| `npm run typecheck` | Cek TypeScript (`tsc --noEmit`) |


---

## ▲ Deploy ke Vercel

Tanpa konfigurasi tambahan — **tidak ada environment variable wajib**.

**Cara otomatis (dashboard):**
1. Push project ke GitHub/GitLab
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Framework preset **Next.js** terdeteksi otomatis → klik **Deploy**

**Cara CLI:**
```bash
npm i -g vercel
vercel        # deploy preview
vercel --prod # deploy production
```

---

## 📁 Struktur Project

```
├── app/
│   ├── page.tsx               # Dashboard (kalender, countdown, hari ini)
│   ├── history/page.tsx       # Riwayat lengkap + export CSV/PDF
│   ├── stats/page.tsx         # Statistik & grafik (lazy-loaded)
│   ├── settings/page.tsx      # Pengaturan (siklus, reminder, tema)
│   ├── layout.tsx             # Layout utama, font, metadata SEO
│   └── globals.css            # Tema pastel light/dark
├── components/
│   ├── ui/                    # Komponen shadcn/ui (button, card, dialog, dll.)
│   └── ...                    # Komponen fitur (kalender, kartu, grafik, nav)
├── hooks/
│   ├── use-local-storage.ts   # Custom hook localStorage (SSR-safe)
│   └── use-period-data.ts     # Data utama + CRUD
├── lib/
│   ├── cycle-calculations.ts  # Logika perhitungan siklus (pure & testable)
│   ├── stats-helpers.ts       # Perhitungan statistik & keteraturan
│   ├── csv.ts / pdf.ts        # Export CSV & PDF
│   ├── backup.ts              # Backup & restore JSON
│   └── types.ts / constants.ts / phase-info.ts / utils.ts
```


---

## 🔒 Privasi

- **Semua data tersimpan di localStorage** perangkat — tidak pernah dikirim ke server.
- Tanpa akun, tanpa tracking, tanpa analitik pihak ketiga.
- Data antar-tab **tersinkron otomatis** via event `storage`.
- Gunakan fitur **Backup & Restore** untuk memindahkan data antar perangkat.

---

## 🗺️ Roadmap (Ide Selanjutnya)

- [ ] PWA — install sebagai aplikasi di HP
- [ ] Sinkronisasi akun (opsional, enkripsi end-to-end)
- [ ] Widget / notifikasi perangkat
- [ ] Multi-bahasa (EN/ID)
- [ ] Mode periode/persiapan kehamilan
- [ ] Unit test untuk logika perhitungan siklus

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. **Fork** repositori ini
2. Buat branch fitur (`git checkout -b fitur/keren`)
3. **Commit** perubahanmu (`git commit -m 'feat: tambah fitur keren'`)
4. **Push** ke branch (`git push origin fitur/keren`)
5. Buka **Pull Request**

---

## 📝 Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat file [`LICENSE`](LICENSE) untuk detail.

---

<div align="center">

Dibuat dengan 💜 untuk membantu kamu lebih memahami siklus tubuhmu.

**Luna** · *Period Track* · 🌸

</div>

