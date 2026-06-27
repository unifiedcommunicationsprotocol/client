import { rm } from "node:fs/promises";
import path from "node:path";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

// Build the server as an executable
const result = await Bun.build({
  entrypoints: ["src/index.server.ts"],
  outdir,
  minify: true,
  target: "bun",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

if (!result.success) {
  console.error("Build failed");
  process.exit(1);
}

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}

console.log("\n✨ Relay Client built successfully!");
console.log("Run with: bun ./dist/index.server.js");
