import { rm } from "node:fs/promises";
import path from "node:path";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

// Build client first
console.log("Building client...");
const clientResult = await Bun.build({
  entrypoints: ["src/client/index.tsx"],
  outdir,
  minify: true,
  naming: {
    entry: "app.js",
    chunk: "chunk-[hash].js",
    asset: "asset-[hash].[ext]",
  },
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

if (!clientResult.success) {
  console.error("Client build failed");
  process.exit(1);
}

// Build server
console.log("Building server...");
const serverResult = await Bun.build({
  entrypoints: ["src/index.server.ts"],
  outdir,
  minify: true,
  target: "bun",
  sourcemap: "linked",
  external: ["./dist/*"],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

if (!serverResult.success) {
  console.error("Server build failed");
  process.exit(1);
}

for (const output of [...clientResult.outputs, ...serverResult.outputs]) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}

console.log("\n✨ Relay Client built successfully!");
console.log("Run with: bun ./dist/index.server.js");
