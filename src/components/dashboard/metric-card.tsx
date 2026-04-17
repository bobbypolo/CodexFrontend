import type { LucideIcon } from "lucide-react";

import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
  tone?: "default" | "accent" | "success" | "warning";
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  tone = "default",
}: MetricCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-1 text-canvas">
          <Icon className="h-5 w-5" />
        </div>
        <Badge tone={tone}>{trend}</Badge>
      </div>
      <div className="mt-5 space-y-2">
        <p className="text-sm text-ink-3">{label}</p>
        <div className="flex items-end justify-between gap-3">
          <p className="font-display text-3xl font-semibold tracking-tight">{value}</p>
          <ArrowUpRight className="h-4 w-4 text-accent" />
        </div>
      </div>
    </Card>
  );
}
