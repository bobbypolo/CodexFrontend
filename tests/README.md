# Verification lane

This scaffold keeps the verification rail isolated from runtime code:

- Storybook owns component review, interaction stories, and state coverage under `stories/**`.
- Playwright owns smoke, accessibility, and visual regression checks under `tests/**`.
- Chromatic is wired as a publish lane once `CHROMATIC_PROJECT_TOKEN` is configured.

Conventions:

- Keep upstream source screenshots and mock exports in `design-references/**`; do not mix them with regression baselines.
- Keep high-signal reference stories in `stories/foundations/**` for shared states and review heuristics.
- Put user-flow smoke coverage in `tests/e2e/**`.
- Put axe-driven accessibility checks in `tests/a11y/**`.
- Put screenshot assertions in `tests/visual/**`.
- Put runtime budget checks in `tests/performance/**`.
- The workflow expects Storybook, Playwright, and Chromatic dependencies to be declared in `package.json`; until then, CI skips those jobs by design instead of failing on missing tooling outside this lane.
- Use `STORYBOOK_URL` to point Playwright at a remote Storybook.
- Use `PLAYWRIGHT_SKIP_WEBSERVER=1` when CI or another process is already serving Storybook.
- Use `PLAYWRIGHT_STORYBOOK_COMMAND` to override the default `npx storybook dev` startup command.
- Use `PLAYWRIGHT_APP_COMMAND` to override the default Vite startup command.
