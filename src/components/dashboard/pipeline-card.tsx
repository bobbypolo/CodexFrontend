import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ProgressMeter } from "@/components/ui/progress-meter";

type PipelineCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  status: string;
  progress: number;
  checkpoints: string[];
};

export function PipelineCard({
  icon: Icon,
  title,
  description,
  status,
  progress,
  checkpoints,
}: PipelineCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-panel-inverse text-canvas">
          <Icon className="h-5 w-5" />
        </div>
        <Badge tone={progress > 85 ? "success" : progress > 60 ? "accent" : "warning"}>
          {status}
        </Badge>
      </div>

      <div className="mt-5 space-y-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between text-sm text-ink-3">
          <span>Completion</span>
          <span>{progress}%</span>
        </div>
        <ProgressMeter value={progress} />
      </div>

      <ul className="mt-6 space-y-3 text-sm text-ink-2">
        {checkpoints.map((checkpoint) => (
          <li
            key={checkpoint}
            className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-3"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span>{checkpoint}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
