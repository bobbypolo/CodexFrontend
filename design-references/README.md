# Design References

Store upstream design intake packets here.

Recommended structure:

- `design-references/<task-slug>/manifest.json`
- `design-references/<task-slug>/desktop.png`
- `design-references/<task-slug>/mobile.png`
- `design-references/<task-slug>/state-loading.png`
- `design-references/<task-slug>/state-empty.png`
- `design-references/<task-slug>/state-error.png`

Rules:

- Keep source-of-truth references here before implementation.
- Use local screenshots, exported mocks, or notes that point to a Figma file or node.
- Do not store Playwright or Storybook regression baselines here.
- Record deliberate deviations from the source in the packet manifest.
