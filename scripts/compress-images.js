/* eslint-disable @typescript-eslint/no-var-requires */
// Run once: node scripts/compress-images.js
// Converts heavy screenshot PNGs to WebP for huge size wins.
const sharp = require("sharp");
const fs = require("fs");

const screenshots = [
  "public/images/bochi-cafe.png",
  "public/images/masjid-notify.png",
  "public/images/faida-automation.png",
];

(async () => {
  for (const src of screenshots) {
    if (!fs.existsSync(src)) {
      console.log(`SKIP (missing): ${src}`);
      continue;
    }
    const out = src.replace(/\.png$/, ".webp");
    const before = fs.statSync(src).size;

    await sharp(src)
      .resize({ width: 1400, height: 900, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(out);

    const after = fs.statSync(out).size;
    console.log(
      `${src} → ${out}: ${(before / 1024).toFixed(0)}KB → ${(
        after / 1024
      ).toFixed(0)}KB  (${Math.round((1 - after / before) * 100)}% smaller)`
    );
    // Remove the heavy PNG; constants.ts will be updated to point to the .webp
    fs.unlinkSync(src);
  }
})();
