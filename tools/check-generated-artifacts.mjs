import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..");
const generatedFiles = [
  "packages/protocol/schemas/pcp-v0.1.schema.json",
  "packages/protocol/schemas/pcp-v0.1.contract.json",
  "sdk/rust/pcp-sdk/src/generated_contract.rs"
];

const before = snapshotGeneratedFiles();
const result = spawnSync("pnpm", ["generate:schema"], {
  cwd: repoRoot,
  stdio: "inherit"
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const after = snapshotGeneratedFiles();
const changed = generatedFiles.filter((file) => before.get(file) !== after.get(file));

if (changed.length > 0) {
  console.error("Generated artifacts are not up to date:");
  for (const file of changed) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Generated artifacts are up to date");

function snapshotGeneratedFiles() {
  return new Map(
    generatedFiles.map((file) => [file, readFileSync(resolve(repoRoot, file), "utf8")])
  );
}
