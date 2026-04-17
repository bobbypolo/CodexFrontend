---
name: frontend-review
description: Run the final frontend quality gate for visible UI changes. Use before completion for visible surfaces, state-heavy components, new interaction patterns, or work derived from a design source so regressions, accessibility gaps, missing states, and test coverage issues are called out independently.
---

# Frontend Review

Use this skill as the final UI quality gate.

## Review Order

1. Check for regressions and missing states.
2. Check for a11y and focus visibility issues.
3. Check responsive behavior.
4. Check fidelity to `DESIGN.md`, the intake packet, or the approved source.
5. Check that Storybook and Playwright coverage match the surface area.
6. Check that whole-page visuals and performance budgets are present where the task warrants them.

## Output Format

- findings first
- open questions second
- change summary only if there are no critical findings
