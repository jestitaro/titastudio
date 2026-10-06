// Renderiza frames sueltos de Pedidos-Flow a PNG (verificación visual / renderFrame).
// Uso: [COMP=<Composición>] node scripts/stills.mjs 0 214 600 1200 ...  [--out out/frames]
import { bundle } from "@remotion/bundler";
import { enableTailwind } from "@remotion/tailwind-v4";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outDir = outIdx >= 0 ? args[outIdx + 1] : "out/pedidos-frames";
const frames = args.filter((a, i) => outIdx < 0 || (i !== outIdx && i !== outIdx + 1)).map(Number);
const browserExecutable = process.env.REMOTION_BROWSER ?? "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: enableTailwind, rspack: true });
const composition = await selectComposition({ serveUrl, id: process.env.COMP ?? "Pedidos-Flow", browserExecutable });
for (const frame of frames) {
  const output = path.join(outDir, `frame-${String(frame).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable, overwrite: true });
  console.log(output);
}
