export const WORKFLOW_VERSION = "2026.04.17.1";

export const MANAGED_FILES = [
  ".agents/skills/frontend-build/SKILL.md",
  ".agents/skills/frontend-build/agents/openai.yaml",
  ".agents/skills/frontend-polish/SKILL.md",
  ".agents/skills/frontend-polish/agents/openai.yaml",
  ".agents/skills/frontend-review/SKILL.md",
  ".agents/skills/frontend-review/agents/openai.yaml",
  ".agents/skills/frontend-studio/SKILL.md",
  ".agents/skills/frontend-studio/agents/openai.yaml",
  ".agents/skills/frontend-studio/references/design-rules.md",
  ".agents/skills/frontend-studio/references/frontend-contract.md",
  ".agents/skills/frontend-studio/references/state-matrix.md",
  ".agents/skills/frontend-studio/references/tool-routing.md",
  ".codex/config.toml",
  ".codex/agents/design-explorer.toml",
  ".codex/agents/frontend-implementer.toml",
  ".codex/agents/frontend-reviewer.toml",
  ".codex/environments/environment.toml",
  ".github/workflows/frontend-verification.yml",
  "scripts/bootstrap-workflow.mjs",
  "scripts/workflow-doctor.mjs",
];

export const SCAFFOLD_ONLY_FILES = [
  ".env.example",
  ".github/workflows/deploy-pages.yml",
  ".storybook/main.ts",
  ".storybook/preview.ts",
  "AGENTS.md",
  "DESIGN.md",
  "components.json",
  "design-references/README.md",
  "design-references/reference-manifest.example.json",
  "playwright.config.ts",
  "src/lib/utils.ts",
  "stories/App.stories.tsx",
  "stories/Button.stories.tsx",
  "stories/foundations/StateMatrix.stories.tsx",
  "stories/foundations/VerificationHarness.stories.tsx",
  "tests/README.md",
  "tests/a11y/app.a11y.spec.ts",
  "tests/a11y/storybook-a11y.spec.ts",
  "tests/e2e/app.spec.ts",
  "tests/e2e/storybook-smoke.spec.ts",
  "tests/performance/app.performance.spec.ts",
  "tests/utils/storybook.ts",
  "tests/visual/app.visual.spec.ts",
  "tests/visual/storybook-visual.spec.ts",
];

export const WORKFLOW_METADATA_PATH = ".codex/frontend-workflow.json";

export const PACKAGE_SCRIPT_NAMES = [
  "workflow:bootstrap",
  "workflow:doctor",
  "verify",
  "storybook",
  "storybook:build",
  "test:e2e",
  "test:e2e:a11y",
  "test:e2e:performance",
  "test:e2e:visual",
  "chromatic",
];

export const PACKAGE_DEV_DEPENDENCY_NAMES = [
  "@axe-core/playwright",
  "@playwright/test",
  "@storybook/addon-a11y",
  "@storybook/addon-docs",
  "@storybook/react-vite",
  "chromatic",
  "playwright",
  "storybook",
];

export const ENV_TEMPLATE_KEYS = ["GITHUB_TOKEN", "CHROMATIC_PROJECT_TOKEN"];
