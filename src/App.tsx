import { useEffect, useState } from "react";

import {
  Activity,
  Blocks,
  Bot,
  Braces,
  Brush,
  CircleHelp,
  LayoutTemplate,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  SwatchBook,
  Waypoints,
} from "lucide-react";
import { motion } from "motion/react";

import { MetricCard } from "@/components/dashboard/metric-card";
import {
  PipelineCard,
} from "@/components/dashboard/pipeline-card";
import {
  StatePreview,
  type SurfaceState,
} from "@/components/dashboard/state-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";

const metrics = [
  {
    icon: LayoutTemplate,
    label: "System surfaces",
    value: "18",
    trend: "+4 ready",
    tone: "accent" as const,
  },
  {
    icon: ShieldCheck,
    label: "Verification score",
    value: "94%",
    trend: "stable",
    tone: "success" as const,
  },
  {
    icon: Activity,
    label: "Runtime budget",
    value: "46 ms",
    trend: "below cap",
    tone: "warning" as const,
  },
];

const workflowLanes = [
  {
    icon: Brush,
    title: "Design rail",
    description:
      "Translate ideation into reusable design tokens, page patterns, and code-friendly component contracts.",
    status: "Connected",
    progress: 88,
    checkpoints: [
      "Figma source is mapped to real components",
      "Tokens are expressed through Tailwind theme variables",
      "Hero and navigation patterns are documented in code",
    ],
  },
  {
    icon: Braces,
    title: "Implementation rail",
    description:
      "Compose Radix primitives, Motion transitions, and maintainable React components without baking in opaque dependencies.",
    status: "Shipping",
    progress: 76,
    checkpoints: [
      "Shared primitives live under src/components/ui",
      "Surface states are explicit, not implied",
      "The page shell scales from tablet to widescreen",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Verification rail",
    description:
      "Keep visual and interaction quality observable so the scaffold can grow into Storybook, browser automation, and CI later.",
    status: "Guarded",
    progress: 69,
    checkpoints: [
      "Critical statuses are visible in one dashboard",
      "Empty, loading, success, and failure states are all styled",
      "Controls preserve keyboard and focus affordances",
    ],
  },
];

const activityFeed = [
  {
    title: "Design sync ingested",
    detail: "Token pass aligned Figma naming to the local palette and typography system.",
    time: "4 min ago",
  },
  {
    title: "Component contract stabilized",
    detail: "Tabs, badges, cards, buttons, and progress primitives are now composable.",
    time: "12 min ago",
  },
  {
    title: "Preview queue trimmed",
    detail: "One empty-state surface and one failure surface remain visible for review.",
    time: "19 min ago",
  },
];

const tokenSwatches = [
  { name: "Canvas", className: "bg-canvas", textClassName: "text-ink-1" },
  { name: "Panel", className: "bg-panel", textClassName: "text-ink-1" },
  {
    name: "Accent",
    className: "bg-accent",
    textClassName: "text-canvas",
  },
  {
    name: "Signal",
    className: "bg-teal",
    textClassName: "text-canvas",
  },
  { name: "Ink", className: "bg-panel-inverse", textClassName: "text-canvas" },
];

export default function App() {
  const [surfaceState, setSurfaceState] = useState<SurfaceState>("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSurfaceState("ready");
    }, 1400);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,98,50,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(18,110,102,0.12),transparent_24%),radial-gradient(circle_at_bottom,rgba(191,139,18,0.12),transparent_30%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[30px] border border-line/70 bg-white/60 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/brand-mark.svg"
              alt="Codex Frontend"
              className="h-12 w-12 rounded-2xl"
            />
            <div>
              <p className="label-kicker">Codex native frontend baseline</p>
              <h1 className="font-display text-xl font-semibold tracking-tight">
                Control Room
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge>React + Vite</Badge>
            <Badge tone="accent">Tailwind v4</Badge>
            <Badge tone="success">Radix + Motion</Badge>
            <Button size="sm" variant="secondary">
              Review system map
            </Button>
            <Button size="sm">Ship preview</Button>
          </div>
        </header>

        <main className="grid gap-6">
          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="shell-panel overflow-hidden p-7 sm:p-8"
            >
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="label-kicker">Distinctive, maintainable, state-complete</p>
                  <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                    A frontend workflow shell built to move from design context to
                    runtime evidence without losing taste.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-ink-2 sm:text-lg">
                    This starter keeps the implementation substrate practical while giving
                    the UI a clear point of view: editorial typography, warm materials,
                    explicit states, and a dashboard that makes the pipeline legible.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button size="lg">Open delivery rail</Button>
                    <Button size="lg" variant="secondary">
                      Inspect state lab
                    </Button>
                    <Button size="lg" variant="ghost">
                      View component tokens
                    </Button>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {[
                      "default",
                      "hover/focus",
                      "active",
                      "disabled",
                      "loading",
                      "empty",
                      "error",
                      "responsive",
                    ].map((label) => (
                      <Badge key={label} tone="default">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <Card className="relative overflow-hidden p-5">
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-accent/12 blur-3xl" />
                    <CardHeader className="relative">
                      <Badge tone="warning" className="w-fit">
                        Release posture
                      </Badge>
                      <CardTitle className="mt-2 text-2xl">Sprint 12 handoff</CardTitle>
                      <CardDescription>
                        Current scaffold quality, visual drift, and runtime confidence in
                        one glance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative mt-6 space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-ink-3">
                          <span>Readiness</span>
                          <span>82%</span>
                        </div>
                        <ProgressMeter value={82} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-[24px] bg-white/70 p-4">
                          <p className="text-sm text-ink-3">Drift risk</p>
                          <p className="mt-2 font-display text-3xl font-semibold">Low</p>
                        </div>
                        <div className="rounded-[24px] bg-white/70 p-4">
                          <p className="text-sm text-ink-3">Open blockers</p>
                          <p className="mt-2 font-display text-3xl font-semibold">02</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-5">
                    <div className="grid gap-3">
                      {[
                        "Design context -> tokens -> components",
                        "Interactive primitives -> page composition",
                        "Runtime signals -> visual verification -> ship",
                      ].map((step, index) => (
                        <div
                          key={step}
                          className="flex items-center gap-3 rounded-[22px] bg-white/70 px-4 py-3"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-1 text-canvas">
                            0{index + 1}
                          </div>
                          <p className="text-sm font-medium text-ink-2">{step}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 * index, ease: "easeOut" }}
                >
                  <MetricCard {...metric} />
                </motion.div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
            <div className="grid gap-6">
              <div className="grid gap-6 xl:grid-cols-3">
                {workflowLanes.map((lane) => (
                  <PipelineCard key={lane.title} {...lane} />
                ))}
              </div>

              <Card className="p-6 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="label-kicker">State lab</p>
                    <CardTitle className="mt-3 text-3xl">
                      Surface coverage without placeholder design
                    </CardTitle>
                    <CardDescription className="mt-3 max-w-2xl">
                      The scaffold includes a small state console so your baseline already
                      demonstrates how loading, success, failure, empty, disabled, and
                      keyboard-focus affordances behave.
                    </CardDescription>
                  </div>

                  <Tooltip content="A credible scaffold needs explicit failure and empty states, not just a polished happy path.">
                    <button className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/75 text-ink-2 transition hover:bg-white">
                      <CircleHelp className="h-5 w-5" />
                      <span className="sr-only">Why state coverage matters</span>
                    </button>
                  </Tooltip>
                </div>

                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="states">State lab</TabsTrigger>
                    <TabsTrigger value="tokens">Tokens</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                      <Card className="p-5">
                        <CardHeader>
                          <CardTitle>Implementation notes</CardTitle>
                          <CardDescription>
                            The substrate is intentionally simple so more app-specific
                            patterns can grow on top without rewriting the shell.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-6 grid gap-3 sm:grid-cols-2">
                          {[
                            {
                              icon: Blocks,
                              title: "Composable primitives",
                              detail: "Cards, badges, tabs, buttons, and progress surfaces are shared.",
                            },
                            {
                              icon: Waypoints,
                              title: "Clear data flow",
                              detail: "The dashboard can be rewired from static data to live API state later.",
                            },
                            {
                              icon: Sparkles,
                              title: "Purposeful motion",
                              detail: "Motion is limited to hierarchy, state change, and progress feedback.",
                            },
                            {
                              icon: Bot,
                              title: "Workflow-aware framing",
                              detail: "The page already speaks the language of design, build, and review.",
                            },
                          ].map(({ icon: Icon, title, detail }) => (
                            <div
                              key={title}
                              className="rounded-[24px] bg-white/70 p-4"
                            >
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-1 text-canvas">
                                <Icon className="h-5 w-5" />
                              </div>
                              <h4 className="mt-4 font-display text-lg font-semibold">
                                {title}
                              </h4>
                              <p className="mt-2 text-sm leading-6 text-ink-2">{detail}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="p-5">
                        <CardHeader>
                          <CardTitle>Quality gates</CardTitle>
                          <CardDescription>
                            These surfaces are staged to drop cleanly into Storybook,
                            browser automation, and CI once those paths are owned.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-6 space-y-4">
                          {[
                            ["Visual distinctness", "Editorial typography + warm material palette"],
                            ["Interaction coverage", "Hover, focus, disabled, loading, empty, and failure states"],
                            ["Responsive discipline", "Two-column shell collapses to stacked rails on smaller screens"],
                            ["Extensibility", "Reusable primitives and token-driven styling"],
                          ].map(([title, detail]) => (
                            <div
                              key={title}
                              className="flex items-start gap-3 rounded-[22px] bg-white/70 px-4 py-4"
                            >
                              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal" />
                              <div>
                                <p className="font-medium text-ink-1">{title}</p>
                                <p className="mt-1 text-sm leading-6 text-ink-2">{detail}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="states">
                    <div className="grid gap-4 lg:grid-cols-[0.78fr_1fr]">
                      <Card className="p-5">
                        <CardHeader>
                          <CardTitle>State switches</CardTitle>
                          <CardDescription>
                            Trigger representative states and confirm the visual language stays
                            coherent across each one.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-6 space-y-6">
                          <div className="grid gap-3">
                            {([
                              ["loading", "Loading"],
                              ["ready", "Ready"],
                              ["error", "Error"],
                              ["empty", "Empty"],
                            ] as Array<[SurfaceState, string]>).map(([value, label]) => (
                              <Button
                                key={value}
                                variant={surfaceState === value ? "primary" : "secondary"}
                                className="justify-between"
                                onClick={() => setSurfaceState(value)}
                              >
                                <span>{label}</span>
                                <span className="text-xs uppercase tracking-[0.2em] opacity-70">
                                  demo
                                </span>
                              </Button>
                            ))}
                          </div>

                          <div className="rounded-[24px] bg-white/70 p-4">
                            <p className="text-sm text-ink-3">Control examples</p>
                            <div className="mt-4 flex flex-wrap gap-3">
                              <Button size="sm">Primary</Button>
                              <Button size="sm" variant="secondary">
                                Secondary
                              </Button>
                              <Button size="sm" variant="ghost">
                                Ghost
                              </Button>
                              <Button size="sm" variant="secondary" disabled>
                                Disabled
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <StatePreview
                        state={surfaceState}
                        onReset={() => setSurfaceState("ready")}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="tokens">
                    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                      <Card className="p-5">
                        <CardHeader>
                          <CardTitle>Palette and rhythm</CardTitle>
                          <CardDescription>
                            Tailwind theme tokens keep the foundation explicit and easy to
                            extend later.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                          {tokenSwatches.map((swatch) => (
                            <div
                              key={swatch.name}
                              className={`rounded-[24px] ${swatch.className} p-4 ${swatch.textClassName}`}
                            >
                              <p className="text-xs uppercase tracking-[0.25em] opacity-70">
                                token
                              </p>
                              <p className="mt-6 font-display text-xl font-semibold">
                                {swatch.name}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="p-5">
                        <CardHeader>
                          <CardTitle>Type pairings</CardTitle>
                          <CardDescription>
                            The scaffold uses a display face for hierarchy and a calmer text
                            face for body copy, avoiding a generic system-stack look.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-6 space-y-4">
                          <div className="rounded-[24px] bg-white/70 p-5">
                            <p className="label-kicker">Display / Sora</p>
                            <p className="mt-3 font-display text-4xl font-semibold tracking-tight">
                              Build taste into the substrate
                            </p>
                          </div>
                          <div className="rounded-[24px] bg-white/70 p-5">
                            <p className="label-kicker">Body / IBM Plex Sans</p>
                            <p className="mt-3 text-base leading-7 text-ink-2">
                              A design system scaffold should be obvious to extend, obvious
                              to audit, and hard to accidentally flatten into generic UI.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Badge tone="accent">
                              <SwatchBook className="h-3.5 w-3.5" />
                              tokenized
                            </Badge>
                            <Badge tone="success">
                              <MessagesSquare className="h-3.5 w-3.5" />
                              reviewable
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            <div className="grid gap-6">
              <Card className="p-5">
                <CardHeader>
                  <p className="label-kicker">Activity feed</p>
                  <CardTitle className="mt-2 text-2xl">What changed in this pass</CardTitle>
                  <CardDescription>
                    A compact audit trail makes the scaffold feel operational instead of
                    decorative.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-6 space-y-4">
                  {activityFeed.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[24px] bg-white/70 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-ink-1">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-ink-2">{item.detail}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-ink-3">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="p-5">
                <CardHeader>
                  <p className="label-kicker">Component queue</p>
                  <CardTitle className="mt-2 text-2xl">Next surfaces to extract</CardTitle>
                  <CardDescription>
                    The page is intentionally built from reusable pieces so this queue can
                    grow into a real design system roadmap.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-6 space-y-4">
                  {[
                    ["Command palette", "Radix dialog + list surface", "queued"],
                    ["Notification center", "Timed alert stack and state reducer", "planned"],
                    ["Data table shell", "Sort, filter, empty, and loading states", "ready"],
                  ].map(([title, detail, status]) => (
                    <div
                      key={title}
                      className="flex items-center justify-between gap-4 rounded-[24px] bg-white/70 px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-ink-1">{title}</p>
                        <p className="mt-1 text-sm text-ink-2">{detail}</p>
                      </div>
                      <Badge tone={status === "ready" ? "success" : "default"}>
                        {status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
