---
name: frontend-studio
description: Establish the design-source and implementation contract for substantial frontend work. Use for new screens, new flows, high-visibility components, design-system changes, major responsive or layout work, Figma-driven implementation, or any task that starts from screenshots, mocks, or state references.
---

# Frontend Studio

Use this skill to start or reframe any substantial frontend task.

## When To Use

- new page or screen
- new user flow
- high-visibility component
- design-system evolution
- Figma-driven implementation
- work that needs a clear tool path before coding

## Workflow

1. Identify whether a live design source exists.
2. Route to the correct upstream source:
   - Figma first when a design exists
   - reference screenshots and state captures under `design-references/` for visible UI
   - `DESIGN.md` when the repo already captured direction
   - a variant exploration lane when structure is known but style is open
3. Emit a short implementation contract:
   - page purpose
   - core layout structure
   - source-of-truth references and any intentional deviations
   - shared components to reuse
   - new states that must be covered
    - tests and stories that will be required
   - whether whole-page visual regression and a performance budget apply
4. Delegate discovery to `design-explorer` if the task is ambiguous.
5. Hand the contract to `frontend-implementer`.
6. Require `frontend-reviewer` before calling the work done.

## Required Output

- design-source summary
- reference-image summary
- implementation contract
- verification plan
- whether `DESIGN.md` needs an update
