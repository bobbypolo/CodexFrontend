import { applyFrontendWorkflow, parseCliArgs } from "./frontend-workflow-lib.mjs";

try {
  const options = parseCliArgs(process.argv.slice(2), "update-frontend-workflow.mjs");
  const summary = applyFrontendWorkflow(options.target, "update", options);

  console.log(`Frontend workflow updated in ${options.target}`);

  for (const entry of summary) {
    console.log(`${entry.status.toUpperCase().padEnd(8)} ${entry.detail}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
