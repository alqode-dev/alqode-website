// QC screenshot + programmatic pixel analysis for WebGL hero routes.
// Usage: node scripts/qc-shot.mjs <url> <outPng> [label]
// Saves a PNG (for human review) AND prints a colour histogram + console errors
// so a render can be verified even without a visible image channel.
// Requires the route's <Canvas gl={{ preserveDrawingBuffer: true }} />.
import { chromium } from "playwright";

const [, , url, outPng, label = ""] = process.argv;
if (!url || !outPng) {
  console.error("usage: node scripts/qc-shot.mjs <url> <outPng> [label]");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(5500);
await page.screenshot({ path: outPng });

const stats = await page.evaluate(async () => {
  const c = document.querySelector("canvas");
  if (!c) return { error: "no canvas" };
  let dataUrl;
  try {
    dataUrl = c.toDataURL("image/png");
  } catch (e) {
    return { error: "toDataURL failed: " + e.message };
  }
  const img = new Image();
  await new Promise((r, j) => {
    img.onload = r;
    img.onerror = () => j(new Error("img load"));
    img.src = dataUrl;
  });
  const W = 240, H = 150;
  const o = document.createElement("canvas");
  o.width = W; o.height = H;
  const ctx = o.getContext("2d");
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  let green = 0, bright = 0, mid = 0, dark = 0, total = 0, sumLum = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    total++;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    sumLum += lum;
    if (g > 70 && g > r * 1.25 && g > b * 1.25) green++;
    else if (lum > 150) bright++;
    else if (lum < 22) dark++;
    else mid++;
  }
  return {
    total, green, bright, mid, dark,
    avgLum: +(sumLum / total).toFixed(1),
    pct: {
      green: +((100 * green) / total).toFixed(1),
      bright: +((100 * bright) / total).toFixed(1),
      mid: +((100 * mid) / total).toFixed(1),
      dark: +((100 * dark) / total).toFixed(1),
    },
  };
});

console.log("=== QC", label, "===");
console.log("png:", outPng);
console.log("stats:", JSON.stringify(stats));
console.log("consoleErrors:", errors.length ? errors.slice(0, 8) : "none");
await browser.close();
