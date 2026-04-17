import { existsSync, readdirSync } from "node:fs";
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

function push(level, label, detail) {
  results.push({ level, label, detail });
}

function shellWrappedNpx(invocation) {
  if (process.platform === "win32") {
    return ["cmd.exe", ["/d", "/s", "/c", `npx -y ${invocation}`]];
  }

  return ["npx", ["-y", ...invocation.split(" ")]];
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
  const command = process.platform === "win32" ? "codex.cmd" : "codex";
  const output = execFileSync(command, ["mcp", "list"], {
    cwd: rootDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const figmaLine = output
    .split(/\r?\n/)
    .find((candidate) => candidate.toLowerCase().includes("figma"));

  if (!figmaLine) {
    push("WARN", "mcp:figma", "configured in .codex/config.toml but not reported by codex mcp list");
  } else if (/not logged in/i.test(figmaLine)) {
    push("WARN", "mcp:figma", "configured but not authenticated");
  } else if (/\benabled\b/i.test(figmaLine)) {
    push("PASS", "mcp:figma", "configured and reported by Codex");
  } else {
    push("WARN", "mcp:figma", figmaLine.trim());
  }
} catch {
  push("WARN", "mcp:figma", "Codex CLI unavailable; verify Figma login in the Codex app before Figma-driven work");
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
