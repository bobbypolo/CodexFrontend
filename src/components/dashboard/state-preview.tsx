import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Boxes, LoaderCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type SurfaceState = "loading" | "ready" | "error" | "empty";

type StatePreviewProps = {
  state: SurfaceState;
  onReset: () => void;
};

export function StatePreview({ state, onReset }: StatePreviewProps) {
  return (
    <Card className="relative min-h-[260px] overflow-hidden p-6">
      <AnimatePresence mode="wait">
        {state === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex h-full min-h-[212px] flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Badge tone="warning">Syncing</Badge>
              <LoaderCircle className="h-5 w-5 animate-spin text-accent" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-40 rounded-full bg-ink-1/10" />
              <div className="h-4 w-full rounded-full bg-ink-1/8" />
              <div className="h-4 w-4/5 rounded-full bg-ink-1/8" />
              <div className="h-4 w-3/5 rounded-full bg-ink-1/8" />
            </div>
            <p className="text-sm text-ink-3">
              Pulling design context, component contracts, and runtime health.
            </p>
          </motion.div>
        ) : null}

        {state === "ready" ? (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex h-full min-h-[212px] flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Badge tone="success">Ready</Badge>
              <Sparkles className="h-5 w-5 text-teal" />
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold">
                Release rail is aligned
              </h3>
              <p className="max-w-md text-sm leading-6 text-ink-2">
                Tokens, interactive states, and verification gates are in a clean handoff
                state. This is the steady-state surface the scaffold is optimized for.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Ship preview</Button>
              <Button size="sm" variant="secondary">
                Open handoff notes
              </Button>
            </div>
          </motion.div>
        ) : null}

        {state === "error" ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex h-full min-h-[212px] flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Badge tone="danger">Error</Badge>
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold">
                Contract drift detected
              </h3>
              <p className="max-w-md text-sm leading-6 text-ink-2">
                The design tokens and runtime component props are out of sync. This screen
                gives you a concrete failure state instead of silently degrading.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" onClick={onReset}>
                Re-run sync
              </Button>
              <Button size="sm" variant="ghost">
                Inspect diff
              </Button>
            </div>
          </motion.div>
        ) : null}

        {state === "empty" ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex h-full min-h-[212px] flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Badge tone="accent">Empty</Badge>
              <Boxes className="h-5 w-5 text-accent" />
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-semibold">
                No reviewers queued
              </h3>
              <p className="max-w-md text-sm leading-6 text-ink-2">
                Empty states are styled with the same system language as active states, so
                the product never falls back to a generic placeholder.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" onClick={onReset}>
                Seed demo data
              </Button>
              <Button size="sm" variant="secondary" disabled>
                Assign reviewer
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
