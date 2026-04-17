import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const rootDir = resolve(import.meta.dirname, "..");
const isWindows = process.platform === "win32";

function run(command, args) {
  const resolvedCommand =
    isWindows && command.toLowerCase().endsWith(".cmd") ? "cmd.exe" : command;
  const resolvedArgs =
    isWindows && command.toLowerCase().endsWith(".cmd")
      ? ["/d", "/s", "/c", command, ...args]
      : args;

  execFileSync(resolvedCommand, resolvedArgs, {
    cwd: rootDir,
    stdio: "inherit",
    shell: false,
  });
}

function readPackageManager() {
  const packageJsonPath = resolve(rootDir, "package.json");

  if (!existsSync(packageJsonPath)) {
    return "";
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  return packageJson.packageManager ?? "";
}

function pnpmCommand() {
  return isWindows ? "pnpm.cmd" : "pnpm";
}

function npxCommand() {
  return isWindows ? "npx.cmd" : "npx";
}

console.log("==> Enabling Corepack");
run("corepack", ["enable"]);

const packageManager = readPackageManager();
const hasLockfile = existsSync(resolve(rootDir, "pnpm-lock.yaml"));
const installArgs =
  hasLockfile || packageManager.startsWith("pnpm@")
    ? ["install", "--frozen-lockfile"]
    : ["install", "--no-frozen-lockfile"];

console.log(`==> Installing dependencies with ${pnpmCommand()} ${installArgs.join(" ")}`);
run(pnpmCommand(), installArgs);

const playwrightArgs = isWindows
  ? ["playwright", "install", "chromium"]
  : ["playwright", "install", "--with-deps", "chromium"];

console.log(`==> Installing Playwright browser with ${npxCommand()} ${playwrightArgs.join(" ")}`);
run(npxCommand(), playwrightArgs);

console.log("==> Running workflow doctor");
run("node", ["./scripts/workflow-doctor.mjs"]);
