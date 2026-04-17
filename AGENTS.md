# Frontend Workflow

This repository is a Codex-native frontend project. The repository contract is
not optional.

## Use The Right Entry Point

Use `$frontend-studio` for:
- new screens
- new flows
- high-visibility components
- design-system changes
- major responsive or layout work
- Figma-driven implementation
- any task that starts from screenshots, mocks, or state references

Use `$frontend-build` when:
- the visual direction is already approved
- the task is primarily implementation
- the work needs Storybook stories, state coverage, or Playwright tests

Use `$frontend-review` before completion for:
- visible UI changes
- state-heavy components
- new interaction patterns
- anything derived from a design source

Use `$frontend-polish` only for:
- small visual adjustments
- hierarchy, spacing, or motion refinement
- one-note iterations that should stay narrow

## Design Source Order

1. If a live Figma source exists, pull Figma MCP context first.
2. For visible UI work, capture reference inputs before coding:
   - desktop and mobile screenshots where available
   - at least one loading, empty, or error reference if the flow has those states
   - a short manifest under `design-references/` describing the source and intended fidelity
3. If direction is unclear, resolve direction into `DESIGN.md` before coding.
4. If structure is known but treatment is undecided, use 21st-style variation
   exploration, then normalize the winner into local components.
5. If the design system already has the answer, build directly.

## Design Intake Gate

Before implementation starts on visible UI work, capture a source packet with:
- source type and canonical link or identifier
- local reference asset paths under `design-references/<task-slug>/`
- required state references for loading, empty, error, and responsive behavior
- explicit fallback approval when no live design source exists yet

Rules:
- Storybook, Chromatic, and Playwright regression snapshots are verification artifacts,
  not upstream design intake.
- `design-explorer` should mark intake as complete or missing evidence.
- `frontend-implementer` should not start visible UI work without an intake packet.
- `frontend-reviewer` should fail review when the intended source cannot be defended.

## Stack Rules

- Reuse local components before adding new ones.
- Treat shadcn patterns as editable source code, not opaque dependencies.
- Use Radix primitives for behavior-heavy controls.
- Use Tailwind v4 theme variables and repository tokens.
- Use Motion only when it improves feedback, hierarchy, or comprehension.
- Keep accessibility and keyboard behavior explicit.

## Required States

Every shared component or user-facing flow must account for:
- default
- hover
- focus
- active
- disabled
- loading
- skeleton where relevant
- empty
- error
- validation where relevant
- overflow and truncation
- mobile behavior
- dark mode if the surface supports it
- keyboard-only behavior

## Required Artifacts

- Update `DESIGN.md` for high-impact UI work.
- Add or update `design-references/` artifacts when the task is driven by screenshots,
  Figma frames, or state references.
- Add or update Storybook stories for shared components.
- Add or update Playwright coverage for critical interactive flows.
- Keep whole-page visual regression coverage for key surfaces, not only component stories.
- Keep a performance budget note or test for high-visibility surfaces.
- Leave concise verification notes in the final response after browser checks.

## Required Commands Before Completion

Run these commands unless the user explicitly tells you not to:
- `pnpm run workflow:doctor`
- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run storybook:build`
- `pnpm run test:e2e`

## Delegation Rules

- Use the `design-explorer` agent for discovery and design-source alignment.
- Use the `frontend-implementer` agent for code changes.
- Use the `frontend-reviewer` agent for independent review.
- The reviewer should not be the same agent that implemented the work.

## Definition Of Done

The task is not done until:
- the rendered UI matches the intended source closely enough to defend
- states are covered
- the interaction flow is testable
- the review lane has no unresolved findings
