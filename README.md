# CodexFrontend

Codex-native frontend workspace for building, reviewing, and shipping UI with:

- Codex app + `gpt-5.4`
- repo-scoped `AGENTS.md`, skills, and custom subagents
- React + Vite + Tailwind v4 + Radix + Motion
- Storybook + Playwright + accessibility + visual baselines
- project-scoped MCP wiring for Figma, GitHub, Context7, shadcn, Playwright, and Chrome DevTools

## Quick start

```bash
pnpm install
pnpm dev
```

Quality loop:

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run storybook:build
pnpm run test:e2e
```

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

The repo-level Codex config scopes the MCP servers that matter for this
frontend workflow:

- `figma`
- `github`
- `context7`
- `shadcn`
- `playwright`
- `chrome_devtools`

Optional servers are present but disabled by default:

- `vercel`
- `magic21st`

Required environment variables:

- `GITHUB_TOKEN` for the GitHub MCP server
- `CHROMATIC_PROJECT_TOKEN` if you want Chromatic publish in CI

## GitHub Pages deploy

This repo includes a GitHub Pages workflow. Once Pages is enabled in the GitHub
repository, pushes to `main` will build the Vite app and deploy it to Pages.

Expected URL:

`https://bobbypolo.github.io/CodexFrontend/`
