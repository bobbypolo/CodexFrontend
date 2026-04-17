---
name: frontend-build
description: Implement approved frontend direction for visible UI work. Use when the visual direction is already approved and the task is primarily execution, including shared-component work that needs Storybook stories, state coverage, or Playwright coverage.
---

# Frontend Build

Use this skill when the direction is approved and the task is implementation.

## Build Rules

- Start from the intake packet for visible UI work.
- Reuse local primitives first.
- Prefer editable source components over opaque packages.
- Keep styling on tokens and Tailwind v4 variables.
- Use Radix primitives for behavior-heavy controls.
- Add stories for shared components.
- Add Playwright coverage for critical interactions.

## Required Checks

- responsive behavior
- focus visibility
- loading, empty, and error states
- design fidelity against `DESIGN.md`
- whole-page visual coverage when the page itself changed
- performance budget coverage for high-visibility surfaces

## Exit Criteria

- code implemented
- states covered
- stories updated
- tests updated
- verification commands run
