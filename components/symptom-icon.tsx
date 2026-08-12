import {
  Activity,
  Brain,
  CircleDot,
  Cookie,
  Moon,
  MoonStar,
  PersonStanding,
  Smile,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { Symptom } from "@/lib/types";

const ICONS: Record<Symptom, LucideIcon> = {
  cramps: Activity,
  headache: Brain,
  mood: Smile,
  acne: Sparkles,
  fatigue: Moon,
  bloating: CircleDot,
  backache: PersonStanding,
  nausea: Waves,
  cravings: Cookie,
  insomnia: MoonStar,
};

export function SymptomIcon({
  symptom,
  className,
}: {
  symptom: Symptom;
  className?: string;
}) {
  const Icon = ICONS[symptom] ?? Sparkles;
  return <Icon className={className ?? "h-4 w-4"} />;
}
