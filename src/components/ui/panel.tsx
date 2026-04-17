import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface),transparent_4%)] shadow-[0_30px_90px_-45px_rgba(6,14,24,0.7)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
