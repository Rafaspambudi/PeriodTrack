"use client";

import { motion } from "framer-motion";
import { MOOD_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Mood } from "@/lib/types";

/** Pemilih mood harian dengan ikon konsisten. onChange(null) untuk menghapus. */
export function MoodPicker({
  value,
  onChange,
  compact = false,
}: {
  value: Mood | null;
  onChange: (mood: Mood | null) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap", compact ? "gap-1.5" : "gap-2")}>
      {MOOD_META.map((m) => {
        const active = value === m.value;
        const Icon = m.icon;
        return (
          <motion.button
            key={m.value}
            type="button"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(active ? null : m.value)}
            aria-label={m.label}
            title={m.label}
            className={cn(
              "grid place-items-center rounded-2xl border transition-all duration-200",
              compact ? "h-11 w-11" : "h-12 w-12",
              m.chip,
              active
                ? "scale-105 shadow-md ring-2 ring-current ring-offset-2 ring-offset-background"
                : "shadow-sm hover:shadow"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                active && "scale-110"
              )}
              strokeWidth={2}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
