"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  History,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "Riwayat", icon: History },
  { href: "/stats", label: "Statistik", icon: BarChart3 },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

function Brand() {
  return (
    <div className="px-1">
      <p className="font-display text-xl font-semibold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-500 dark:from-rose-300 dark:to-violet-300">
        Period Tracker
      </p>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors duration-200",
        active
          ? "bg-gradient-to-r from-rose-400/15 to-violet-400/15 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] transition-transform group-hover:scale-110",
          active && "text-primary"
        )}
      />
      {label}
      {active && (
        <motion.span
          layoutId="nav-active-dot"
          className="ml-auto h-2 w-2 rounded-full bg-primary shadow-md shadow-primary/50"
        />
      )}
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-transparent bg-card/55 px-5 py-6 backdrop-blur-lg lg:flex">
        <Brand />
        <nav className="mt-8 flex flex-1 flex-col gap-1.5">
          {LINKS.map((link) => (
            <NavLink key={link.href} {...link} active={isActive(link.href)} />
          ))}
        </nav>
        <div className="rounded-2xl border bg-card/80 p-3 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">Mode tampilan</p>
              <p className="text-[11px] text-muted-foreground">
                Terang / Gelap
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Top bar mobile */}
      <header className="sticky top-[max(0px,env(safe-area-inset-top))] z-40 flex items-center justify-between border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-lg lg:hidden">
        <Brand />
        <ThemeToggle />
      </header>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 sm:inset-x-4 lg:hidden">
        <div className="flex items-center justify-around rounded-2xl border bg-card/90 p-1.5 shadow-xl backdrop-blur-lg">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition-colors",
                  active
                    ? "bg-gradient-to-b from-rose-400/15 to-violet-400/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    active && "scale-110"
                  )}
                />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
