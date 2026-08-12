import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Background } from "@/components/background";
import { PageTransition } from "@/components/page-transition";
import { Reminder } from "@/components/reminder";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#16121f" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Luna — Period Tracker",
    template: "%s · Luna",
  },
  description:
    "Pelacak siklus menstruasi yang modern, aesthetic, dan privasi terjaga. Prediksi haid, masa subur, fase siklus, mood, gejala, dan statistik — semua tersimpan aman di perangkatmu.",
  keywords: [
    "period tracker",
    "pelacak siklus menstruasi",
    "kalender haid",
    "prediksi ovulasi",
    "masa subur",
    "pelacak mood",
    "kesehatan wanita",
  ],
  authors: [{ name: "Luna" }],
  openGraph: {
    title: "Luna — Period Tracker",
    description:
      "Lacak siklus menstruasi dengan kalender interaktif, prediksi haid, masa subur, mood, dan statistik lengkap. Data 100% tersimpan di perangkatmu.",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${playfair.variable} font-sans`}
      >
        <Providers>
          <Background />
          <Nav />
          <main className="lg:pl-64">
            <div className="mx-auto w-full max-w-5xl px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pt-6 lg:px-10 lg:pb-16 lg:pt-10">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
          <Reminder />
        </Providers>
      </body>
    </html>
  );
}
