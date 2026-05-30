// Spatial QC: ASCII map of where green vs chrome sits across the frame.
// Confirms brackets flank the chrome letters (logo) vs a churning blob (melt).
// Usage: node scripts/qc-spatial.mjs <url>
import { chromium } from "playwright";
const [, , url] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(5500);
const out = await page.evaluate(async () => {
  const c = document.querySelector("canvas");
  const img = new Image();
  await new Promise((r) => { img.onload = r; img.src = c.toDataURL("image/png"); });
  const W = 64, H = 26;
  const o = document.createElement("canvas");
  o.width = W; o.height = H;
  const ctx = o.getContext("2d");
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  const rows = [];
  for (let y = 0; y < H; y += 2) {
    let line = "";
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (g > 70 && g > r * 1.25 && g > b * 1.25) line += "G";
      else if (lum > 90) line += "C";
      else line += ".";
    }
    rows.push(line);
  }
  return rows;
});
console.log("ASCII (C=chrome, G=green, .=dark):");
out.forEach((r) => console.log(r));
await browser.close();
