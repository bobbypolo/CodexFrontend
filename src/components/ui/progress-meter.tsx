import * as Progress from "@radix-ui/react-progress";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type ProgressMeterProps = {
  ariaLabel?: string;
  className?: string;
  indicatorClassName?: string;
  value: number;
};

export function ProgressMeter({
  ariaLabel = "Progress",
  className,
  indicatorClassName,
  value,
}: ProgressMeterProps) {
  return (
    <Progress.Root
      className={cn(
        "relative h-3 overflow-hidden rounded-full bg-ink-1/8",
        className,
      )}
      aria-label={ariaLabel}
      value={value}
    >
      <Progress.Indicator asChild>
        <motion.div
          className={cn(
            "h-full rounded-full bg-accent shadow-[0_0_18px_rgba(239,98,50,0.35)]",
            indicatorClassName,
          )}
          animate={{ width: `${value}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </Progress.Indicator>
    </Progress.Root>
  );
}
