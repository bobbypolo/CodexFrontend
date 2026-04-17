# CodexFrontend

Codex-native frontend workspace for building, reviewing, and shipping UI with:

- Codex app + `gpt-5.4`
- repo-scoped `AGENTS.md`, skills, and custom subagents
- React + Vite + Tailwind v4 + Radix + Motion
- Storybook + Playwright + accessibility + visual baselines
- project-scoped MCP wiring for Figma, GitHub, Context7, shadcn, Playwright, and Chrome DevTools

## Quick start

```bash
node ./scripts/bootstrap-workflow.mjs
pnpm dev
```

Quality loop:

```bash
pnpm run verify
```

Expected local runtime:

- Node 24.x
- Corepack enabled
- Playwright Chromium installed through the bootstrap script

## Design source intake

Visible UI work should start with an intake packet, not a coding prompt alone.

- Put source screenshots, mock exports, and fidelity notes under `design-references/<task-slug>/`.
- Capture desktop and mobile references when both exist.
- Capture loading, empty, and error references when those states matter.
- Treat Storybook, Chromatic, and Playwright screenshots as verification outputs, not upstream design inputs.

## Codex app setup

The project is already configured for project-level Codex overrides in:

- `.codex/config.toml`
- `.codex/environments/environment.toml`
- `.codex/agents/*`
- `.agents/skills/*`

When you open this repo in the Codex app, trust the project so Codex loads the
repo-scoped `.codex/config.toml` and `AGENTS.md` instructions.

The Codex app action bar is wired with:

- `Run` -> Vite dev server on `http://127.0.0.1:4173`
- `Storybook` -> Storybook on `http://127.0.0.1:6006`
- `Typecheck`
- `Build`
- `Test`

## MCP expectations

The repo-level Codex config explicitly enables the MCP servers that matter for this
frontend workflow and disables unrelated global servers that may exist in your
home Codex config:

- `figma`
- `github`
- `context7`
- `shadcn`
- `playwright`
- `chrome_devtools`

Figma-driven work requires a local OAuth session:

```bash
codex mcp login figma
```

Optional servers are present but disabled by default:

- `vercel`
- `magic21st`

Required environment variables:

- `GITHUB_TOKEN` for the GitHub MCP server
- `CHROMATIC_PROJECT_TOKEN` if you want Chromatic publish in CI

The repo also ships a local doctor:

```bash
pnpm run workflow:doctor
```

It checks the workflow files, reference-intake scaffold, and visible MCP status
when the Codex CLI is available.

## Verification lanes

- Storybook covers component states and review stories.
- Playwright covers smoke, accessibility, whole-page visual regression, and performance budgets.
- Chromatic publishes Storybook snapshots when the token is configured. It is a
  publish lane, not the only visual gate.

Useful commands:

```bash
pnpm run test:e2e:visual
pnpm run test:e2e:performance
```

## Deploying To Other Projects

Use this repository as the source-of-truth workflow and apply it onto another
project root by path:

```bash
pnpm run workflow:deploy -- --target F:\Path\To\YourProject
pnpm run workflow:update -- --target F:\Path\To\YourProject
```

Add `--dry-run` to preview changes and `--install` to run the target project's
package-manager install after `package.json` changes. The target path must
already be a project root with `package.json`.

Ownership rules:

- `workflow:update` overwrites managed workflow internals such as `.codex/**`,
  `.agents/skills/**`, `scripts/bootstrap-workflow.mjs`,
  `scripts/workflow-doctor.mjs`, and
  `.github/workflows/frontend-verification.yml`.
- `workflow:update` does not overwrite scaffold-only files that projects are
  expected to customize, including `AGENTS.md`, `DESIGN.md`,
  `.storybook/main.ts`, `.storybook/preview.ts`, `playwright.config.ts`,
  `stories/**`, and `tests/**`.
- Scaffold-only files are copied only when missing, unless
  `--force-scaffolds` is passed intentionally.

Supported Playwright overrides:

- `PLAYWRIGHT_SKIP_WEBSERVER=1`
- `PLAYWRIGHT_STORYBOOK_COMMAND="..."`
- `PLAYWRIGHT_APP_COMMAND="..."`
- `STORYBOOK_URL=http://127.0.0.1:6006`

## GitHub Pages deploy

This repo includes a GitHub Pages workflow. Once Pages is enabled in the GitHub
repository, pushes to `main` will build the Vite app and deploy it to Pages.

Expected URL:

`https://bobbypolo.github.io/CodexFrontend/`
