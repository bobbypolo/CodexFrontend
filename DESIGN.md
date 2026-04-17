# Design Direction

## Product Role

This repository demonstrates a Codex-native frontend workflow. The UI should
feel like a serious operator console for design and engineering teams, not a
generic template dashboard.

## Tone

- Editorial rather than corporate
- Warm neutrals with sharp accent color
- Dense enough for experts, calm enough for reviews
- Motion used to clarify transitions, never to decorate empty space

## Visual Principles

- Use a soft paper-toned foundation instead of plain white.
- Pair rounded surfaces with strong typography so the interface does not become
  soft or cute.
- Prefer large display type, tight tracking, and generous negative space at the
  top of a page.
- Use atmospheric gradients and layered panels instead of flat backgrounds.

## Interaction Principles

- Fast path actions should remain visible above the fold.
- State changes should be explicit, especially around review and verification.
- Dense information should be chunked into panels with clear titles and
  evidence.
- Keyboard focus must remain visible against warm backgrounds.

## Component Notes

- Primary buttons should feel decisive and warm.
- Secondary actions should read as system controls, not equal CTAs.
- Panels should feel physical, with mild translucency and tight borders.
- Tabs should work as workflow lanes, not anonymous navigation pills.

## Verification Notes

For visible UI work, capture:
- desktop layout behavior
- mobile layout behavior
- focus treatment
- one clear note about hierarchy and one clear note about density

## Reference Intake

For any new page, flow, or high-visibility component:
- store screenshots, mock exports, or Figma frame references under `design-references/`
- include at least desktop and mobile references when both exist
- include non-happy-path references when the flow has loading, empty, or error states
- record the intended fidelity and any deliberate deviations in a small manifest

If no visual source exists yet, resolve the target direction here before implementation.

## Runtime Quality Notes

- Whole-page visual regression should cover the key surface in Playwright, not only Storybook stories.
- High-visibility surfaces should carry an explicit performance budget note or Playwright budget check.
