import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

import {
  ENV_TEMPLATE_KEYS,
  MANAGED_FILES,
  PACKAGE_DEV_DEPENDENCY_NAMES,
  PACKAGE_SCRIPT_NAMES,
  SCAFFOLD_ONLY_FILES,
  WORKFLOW_METADATA_PATH,
  WORKFLOW_VERSION,
} from "./frontend-workflow-manifest.mjs";

const SOURCE_ROOT = resolve(import.meta.dirname, "..");
const SOURCE_REPOSITORY = "https://github.com/bobbypolo/CodexFrontend";

function usage(commandName) {
  return [
    `Usage: node ./scripts/${commandName} --target <project-path> [--dry-run] [--install] [--force-scaffolds]`,
    "",
    "Options:",
    "  --target <path>       Target project root that should receive the workflow.",
    "  --dry-run             Print planned changes without writing files.",
    "  --install             Run the target project's package-manager install after package.json changes.",
    "  --force-scaffolds     Overwrite scaffold-only files as well.",
  ].join("\n");
}

function normalizeRelativePath(relativePath) {
  return relativePath.replaceAll("/", "\\");
}

function formatRelativePath(relativePath) {
  return relativePath.replaceAll("\\", "/");
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function ensureParentDirectory(filePath, dryRun) {
  if (dryRun) {
    return;
  }

  mkdirSync(dirname(filePath), { recursive: true });
}

function copyRelativeFile(relativePath, targetRoot, options) {
  const relativeWindowsPath = normalizeRelativePath(relativePath);
  const sourcePath = resolve(SOURCE_ROOT, relativeWindowsPath);
  const targetPath = resolve(targetRoot, relativeWindowsPath);
  const existsAlready = existsSync(targetPath);

  if (!options.overwrite && existsAlready) {
    options.record("skipped", `${formatRelativePath(relativePath)} (existing scaffold preserved)`);
    return;
  }

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing source workflow file: ${sourcePath}`);
  }

  if (options.dryRun) {
    options.record(
      "planned",
      `${formatRelativePath(relativePath)} -> ${existsAlready ? "overwrite" : "create"}`,
    );
    return;
  }

  ensureParentDirectory(targetPath, false);
  copyFileSync(sourcePath, targetPath);
  options.record(
    existsAlready ? "updated" : "created",
    formatRelativePath(relativePath),
  );
}

function mergePackageJson(targetRoot, options) {
  const sourcePackage = readJson(resolve(SOURCE_ROOT, "package.json"));
  const targetPackagePath = resolve(targetRoot, "package.json");

  if (!existsSync(targetPackagePath)) {
    throw new Error(`Target project is missing package.json: ${targetPackagePath}`);
  }

  const targetPackage = readJson(targetPackagePath);
  let changed = false;

  targetPackage.scripts ??= {};
  targetPackage.devDependencies ??= {};

  for (const scriptName of PACKAGE_SCRIPT_NAMES) {
    const nextValue = sourcePackage.scripts?.[scriptName];

    if (!nextValue) {
      continue;
    }

    if (targetPackage.scripts[scriptName] !== nextValue) {
      targetPackage.scripts[scriptName] = nextValue;
      changed = true;
    }
  }

  for (const dependencyName of PACKAGE_DEV_DEPENDENCY_NAMES) {
    const nextValue = sourcePackage.devDependencies?.[dependencyName];

    if (!nextValue) {
      continue;
    }

    if (targetPackage.devDependencies[dependencyName] !== nextValue) {
      targetPackage.devDependencies[dependencyName] = nextValue;
      changed = true;
    }
  }

  if (!changed) {
    options.record("unchanged", "package.json");
    return false;
  }

  if (options.dryRun) {
    options.record("planned", "package.json (merge workflow scripts and devDependencies)");
    return true;
  }

  writeJson(targetPackagePath, targetPackage);
  options.record("updated", "package.json");
  return true;
}

function mergeEnvExample(targetRoot, options) {
  const targetEnvPath = resolve(targetRoot, ".env.example");

  if (!existsSync(targetEnvPath)) {
    copyRelativeFile(".env.example", targetRoot, {
      ...options,
      overwrite: true,
    });
    return;
  }

  const lines = readFileSync(targetEnvPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.length > 0);
  const existingKeys = new Set(
    lines
      .filter((line) => line.includes("="))
      .map((line) => line.slice(0, line.indexOf("=")).trim()),
  );
  const missingKeys = ENV_TEMPLATE_KEYS.filter((key) => !existingKeys.has(key));

  if (missingKeys.length === 0) {
    options.record("unchanged", ".env.example");
    return;
  }

  if (options.dryRun) {
    options.record("planned", `.env.example (append ${missingKeys.join(", ")})`);
    return;
  }

  const suffix = `${lines.length > 0 ? "\n" : ""}${missingKeys.map((key) => `${key}=`).join("\n")}\n`;
  writeFileSync(targetEnvPath, `${readFileSync(targetEnvPath, "utf8").replace(/\s*$/, "")}${suffix}`, "utf8");
  options.record("updated", `.env.example (+${missingKeys.join(", ")})`);
}

function writeWorkflowMetadata(targetRoot, mode, options) {
  const metadataPath = resolve(targetRoot, WORKFLOW_METADATA_PATH);
  const existed = existsSync(metadataPath);
  const metadata = {
    workflowVersion: WORKFLOW_VERSION,
    sourceRepository: SOURCE_REPOSITORY,
    mode,
    updatedAt: new Date().toISOString(),
    managedFiles: MANAGED_FILES.map(formatRelativePath),
    scaffoldOnlyFiles: SCAFFOLD_ONLY_FILES.map(formatRelativePath),
  };

  if (options.dryRun) {
    options.record("planned", formatRelativePath(WORKFLOW_METADATA_PATH));
    return;
  }

  ensureParentDirectory(metadataPath, false);
  writeJson(metadataPath, metadata);
  options.record(existed ? "updated" : "created", formatRelativePath(WORKFLOW_METADATA_PATH));
}

function detectInstallCommand(targetRoot) {
  const packageJsonPath = resolve(targetRoot, "package.json");

  if (!existsSync(packageJsonPath)) {
    return null;
  }

  const pkg = readJson(packageJsonPath);
  const declaredManager = pkg.packageManager ?? "";

  if (existsSync(resolve(targetRoot, "pnpm-lock.yaml")) || declaredManager.startsWith("pnpm@")) {
    return {
      command: process.platform === "win32" ? "cmd.exe" : "pnpm",
      args:
        process.platform === "win32"
          ? ["/d", "/s", "/c", "pnpm install --no-frozen-lockfile"]
          : ["install", "--no-frozen-lockfile"],
      description: "pnpm install --no-frozen-lockfile",
      requiresCorepack: true,
    };
  }

  if (existsSync(resolve(targetRoot, "yarn.lock")) || declaredManager.startsWith("yarn@")) {
    return {
      command: process.platform === "win32" ? "cmd.exe" : "yarn",
      args: process.platform === "win32" ? ["/d", "/s", "/c", "yarn install"] : ["install"],
      description: "yarn install",
      requiresCorepack: true,
    };
  }

  if (existsSync(resolve(targetRoot, "package-lock.json"))) {
    return {
      command: process.platform === "win32" ? "cmd.exe" : "npm",
      args: process.platform === "win32" ? ["/d", "/s", "/c", "npm install"] : ["install"],
      description: "npm install",
      requiresCorepack: false,
    };
  }

  return {
    command: process.platform === "win32" ? "cmd.exe" : "npm",
    args: process.platform === "win32" ? ["/d", "/s", "/c", "npm install"] : ["install"],
    description: "npm install",
    requiresCorepack: false,
  };
}

function runInstall(targetRoot, options) {
  const install = detectInstallCommand(targetRoot);

  if (!install) {
    options.record("skipped", "dependency install (no package.json in target)");
    return;
  }

  if (options.dryRun) {
    options.record("planned", `dependency install (${install.description})`);
    return;
  }

  if (install.requiresCorepack) {
    execFileSync(
      process.platform === "win32" ? "cmd.exe" : "corepack",
      process.platform === "win32" ? ["/d", "/s", "/c", "corepack enable"] : ["enable"],
      {
        cwd: targetRoot,
        stdio: "inherit",
      },
    );
  }

  execFileSync(install.command, install.args, {
    cwd: targetRoot,
    stdio: "inherit",
  });

  options.record("updated", `dependencies installed (${install.description})`);
}

export function parseCliArgs(argv, commandName) {
  const options = {
    dryRun: false,
    forceScaffolds: false,
    install: false,
    target: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    switch (argument) {
      case "--target":
        options.target = argv[index + 1] ?? "";
        index += 1;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--install":
        options.install = true;
        break;
      case "--force-scaffolds":
        options.forceScaffolds = true;
        break;
      case "--help":
      case "-h":
        console.log(usage(commandName));
        process.exit(0);
        return options;
      default:
        throw new Error(`Unknown argument: ${argument}\n\n${usage(commandName)}`);
    }
  }

  if (!options.target) {
    throw new Error(`Missing --target\n\n${usage(commandName)}`);
  }

  options.target = resolve(options.target);
  return options;
}

export function applyFrontendWorkflow(targetRoot, mode, rawOptions) {
  if (!existsSync(targetRoot)) {
    throw new Error(`Target path does not exist: ${targetRoot}`);
  }

  const targetPackagePath = resolve(targetRoot, "package.json");

  if (!existsSync(targetPackagePath)) {
    throw new Error(`Target project is missing package.json: ${targetPackagePath}`);
  }

  const summary = [];
  const options = {
    ...rawOptions,
    record(status, detail) {
      summary.push({ status, detail });
    },
  };

  for (const relativePath of MANAGED_FILES) {
    copyRelativeFile(relativePath, targetRoot, {
      ...options,
      overwrite: true,
    });
  }

  for (const relativePath of SCAFFOLD_ONLY_FILES) {
    if (relativePath === ".env.example") {
      mergeEnvExample(targetRoot, options);
      continue;
    }

    copyRelativeFile(relativePath, targetRoot, {
      ...options,
      overwrite: options.forceScaffolds,
    });
  }

  const packageJsonChanged = mergePackageJson(targetRoot, options);
  writeWorkflowMetadata(targetRoot, mode, options);

  if (options.install && packageJsonChanged) {
    runInstall(targetRoot, options);
  } else if (options.install) {
    options.record("skipped", "dependency install (package.json unchanged)");
  }

  return summary;
}
