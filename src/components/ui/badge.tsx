import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "default" | "accent" | "success" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-panel text-ink-2 ring-line/80",
  accent: "bg-accent/12 text-accent-strong ring-accent/18",
  success: "bg-teal/12 text-teal ring-teal/18",
  warning: "bg-gold/14 text-gold ring-gold/18",
  danger: "bg-danger/12 text-danger ring-danger/18",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] ring-1",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
