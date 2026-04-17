import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync, spawn } from "node:child_process";

const rootDir = resolve(import.meta.dirname, "..");

const requiredPaths = [
  "AGENTS.md",
  "DESIGN.md",
  ".codex/config.toml",
  ".codex/environments/environment.toml",
  ".agents/skills/frontend-studio/SKILL.md",
  ".agents/skills/frontend-build/SKILL.md",
  ".agents/skills/frontend-review/SKILL.md",
  ".agents/skills/frontend-polish/SKILL.md",
  "components.json",
  "src/lib/utils.ts",
  "design-references/README.md",
  "tests/visual/app.visual.spec.ts",
  "tests/performance/app.performance.spec.ts",
];

const optionalEnvVars = [
  {
    name: "GITHUB_TOKEN",
    message: "needed for authenticated GitHub MCP operations",
  },
  {
    name: "CHROMATIC_PROJECT_TOKEN",
    message: "needed for Chromatic publishing in CI and local publish runs",
  },
];

const results = [];
const requiredSkillPaths = requiredPaths.filter((candidate) =>
  candidate.startsWith(".agents/skills/"),
);
const agentRolePaths = [
  ".codex/agents/design-explorer.toml",
  ".codex/agents/frontend-implementer.toml",
  ".codex/agents/frontend-reviewer.toml",
];
const expectedEnabledMcpServers = new Set([
  "chrome_devtools",
  "context7",
  "figma",
  "github",
  "playwright",
  "shadcn",
]);
const expectedDisabledMcpServers = new Set([
  "arxiv",
  "browserbase",
  "crossref",
  "exa",
  "firecrawl",
  "magic21st",
  "openalex",
  "postgres",
  "sentry",
  "vercel",
]);

function push(level, label, detail) {
  results.push({ level, label, detail });
}

function validateSkillFrontmatter(relativePath) {
  const absolutePath = resolve(rootDir, relativePath);

  if (!existsSync(absolutePath)) {
    return;
  }

  const raw = readFileSync(absolutePath, "utf8");
  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

  if (!frontmatterMatch) {
    push("FAIL", relativePath, "missing YAML frontmatter delimited by ---");
    return;
  }

  const frontmatter = frontmatterMatch[1];
  const hasName = /^name:\s+\S+/m.test(frontmatter);
  const hasDescription = /^description:\s+.+/m.test(frontmatter);

  if (!hasName || !hasDescription) {
    push("FAIL", relativePath, "frontmatter must include non-empty name and description");
    return;
  }

  push("PASS", `${relativePath}#frontmatter`, "valid skill frontmatter");
}

function validateAgentRole(relativePath) {
  const absolutePath = resolve(rootDir, relativePath);

  if (!existsSync(absolutePath)) {
    return;
  }

  const raw = readFileSync(absolutePath, "utf8");
  const hasFlatDeveloperInstructions = /^\s*developer_instructions\s*=\s*"""/m.test(raw);
  const hasNestedInstructionsTable = /^\s*\[instructions\]\s*$/m.test(raw);

  if (hasNestedInstructionsTable) {
    push("FAIL", relativePath, "agent role must use a flat instructions string, not an [instructions] table");
    return;
  }

  if (!hasFlatDeveloperInstructions) {
    push("FAIL", relativePath, "agent role is missing a flat developer_instructions = \"\"\"...\"\"\" block");
    return;
  }

  push("PASS", `${relativePath}#schema`, "uses loader-compatible flat developer_instructions");
}

function shellWrappedNpx(invocation) {
  if (process.platform === "win32") {
    return ["cmd.exe", ["/d", "/s", "/c", `npx -y ${invocation}`]];
  }

  return ["npx", ["-y", ...invocation.split(" ")]];
}

function shellWrappedCommand(invocation) {
  if (process.platform === "win32") {
    return ["cmd.exe", ["/d", "/s", "/c", invocation]];
  }

  const [command, ...args] = invocation.split(" ");
  return [command, args];
}

async function probeStdioMcp(label, invocation, timeoutMs = 5_000) {
  const [command, args] = shellWrappedNpx(invocation);

  return await new Promise((resolveProbe) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let finished = false;

    const finalize = (level, detail) => {
      if (finished) {
        return;
      }

      finished = true;
      resolveProbe({ level, label, detail });
    };

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.once("error", (error) => {
      finalize("FAIL", `spawn failed: ${error.message}`);
    });

    child.once("exit", (code) => {
      const trimmed = `${stderr}\n${stdout}`.trim();
      const detail = trimmed ? trimmed.slice(0, 240) : `exited early with code ${code}`;
      finalize("FAIL", detail);
    });

    setTimeout(() => {
      if (child.exitCode === null) {
        child.kill();
        finalize("PASS", `stdio server stayed alive for ${timeoutMs}ms`);
        return;
      }

      const trimmed = `${stderr}\n${stdout}`.trim();
      const detail = trimmed
        ? trimmed.slice(0, 240)
        : `exited before ${timeoutMs}ms with code ${child.exitCode}`;
      finalize("FAIL", detail);
    }, timeoutMs);
  });
}

for (const relativePath of requiredPaths) {
  const absolutePath = resolve(rootDir, relativePath);

  if (existsSync(absolutePath)) {
    push("PASS", relativePath, "present");
  } else {
    push("FAIL", relativePath, "missing");
  }
}

for (const relativePath of requiredSkillPaths) {
  validateSkillFrontmatter(relativePath);
}

for (const relativePath of agentRolePaths) {
  validateAgentRole(relativePath);
}

const referenceDir = resolve(rootDir, "design-references");

if (existsSync(referenceDir)) {
  const referenceEntries = readdirSync(referenceDir).filter((entry) => !entry.startsWith("."));

  if (referenceEntries.length > 0) {
    push("PASS", "design-references/", `${referenceEntries.length} visible entry or entries`);
  } else {
    push("WARN", "design-references/", "directory exists but contains no visible reference packets yet");
  }
} else {
  push("FAIL", "design-references/", "missing");
}

for (const envVar of optionalEnvVars) {
  if (process.env[envVar.name]) {
    push("PASS", envVar.name, "available");
  } else {
    push("WARN", envVar.name, envVar.message);
  }
}

for (const [label, invocation] of [
  ["mcp:shadcn", "shadcn@latest mcp"],
  ["mcp:context7", "@upstash/context7-mcp"],
  ["mcp:playwright", "@executeautomation/playwright-mcp-server"],
  ["mcp:chrome_devtools", "chrome-devtools-mcp@latest"],
]) {
  const probe = await probeStdioMcp(label, invocation);
  push(probe.level, probe.label, probe.detail);
}

if (process.env.GITHUB_TOKEN) {
  push("PASS", "mcp:github", "token available for authenticated GitHub MCP operations");
} else {
  push("WARN", "mcp:github", "missing GITHUB_TOKEN for authenticated GitHub MCP operations");
}

try {
  const [command, args] = shellWrappedCommand("codex mcp list");
  const output = execFileSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const lines = output.split(/\r?\n/).filter(Boolean);

  for (const candidate of expectedEnabledMcpServers) {
    const line = lines.find((entry) => entry.toLowerCase().startsWith(candidate.toLowerCase()));

    if (!line) {
      push("FAIL", `mcp:${candidate}`, "missing from codex mcp list output");
      continue;
    }

    if (!/\benabled\b/i.test(line)) {
      push("FAIL", `mcp:${candidate}`, `expected enabled, got: ${line.trim()}`);
      continue;
    }

    push("PASS", `mcp:${candidate}`, "enabled at the repo layer");
  }

  for (const candidate of expectedDisabledMcpServers) {
    const line = lines.find((entry) => entry.toLowerCase().startsWith(candidate.toLowerCase()));

    if (!line) {
      push("PASS", `mcp:${candidate}`, "not listed as an active repo server");
      continue;
    }

    if (/\bdisabled\b/i.test(line)) {
      push("PASS", `mcp:${candidate}`, "disabled at the repo layer");
      continue;
    }

    push("FAIL", `mcp:${candidate}`, `expected disabled for this repo, got: ${line.trim()}`);
  }
} catch {
  push("WARN", "mcp:list", "Codex CLI unavailable; verify repo MCP overrides in the Codex app");
}

let hasFailures = false;

console.log("Frontend workflow doctor");
console.log("========================");

for (const result of results) {
  console.log(`${result.level.padEnd(4)} ${result.label} - ${result.detail}`);

  if (result.level === "FAIL") {
    hasFailures = true;
  }
}

if (hasFailures) {
  console.error("\nWorkflow doctor found blocking issues.");
  process.exit(1);
}

console.log("\nWorkflow doctor found no blocking issues.");
