"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  // Hindari hydration mismatch: ikon baru dirender setelah mount di client
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border bg-card text-foreground transition-all hover:scale-105 hover:bg-accent active:scale-95",
        className
      )}
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "dark" : "light"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="grid place-items-center"
          >
            {isDark ? (
              <Moon className="h-[18px] w-[18px]" />
            ) : (
              <Sun className="h-[18px] w-[18px]" />
            )}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
