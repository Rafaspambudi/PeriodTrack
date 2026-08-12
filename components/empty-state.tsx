import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card/60 px-6 py-16 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-brand text-white shadow-glow">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
