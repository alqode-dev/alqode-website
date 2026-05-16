/* eslint-disable @typescript-eslint/no-var-requires */
// Run once: node scripts/trace-bochi.js
// Vectorizes public/images/clients/bochi-source.png into a real SVG.
const fs = require("fs");
const path = require("path");
const ImageTracer = require("imagetracerjs");
const { PNG } = require("pngjs");

const SRC = path.join(__dirname, "..", "public", "images", "clients", "bochi-source.png");
const OUT = path.join(__dirname, "..", "public", "images", "clients", "bochi.svg");

const buffer = fs.readFileSync(SRC);
const png = PNG.sync.read(buffer);
const imgd = {
  data: new Uint8ClampedArray(png.data),
  width: png.width,
  height: png.height,
};

// Aggressive options for clean monochrome trace:
// - numberofcolors=2 → background + foreground only
// - pathomit=12 → drops tiny noise paths
// - blurradius=1 → smooths jagged edges before tracing
// - ltres/qtres higher → fewer, simpler paths
const options = {
  numberofcolors: 2,
  colorquantcycles: 3,
  pathomit: 12,
  ltres: 1.5,
  qtres: 1.5,
  rightangleenhance: false,
  blurradius: 1,
  blurdelta: 20,
  strokewidth: 0,
  scale: 1,
  viewbox: true,
};

const svg = ImageTracer.imagedataToSVG(imgd, options);
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT}`);
console.log(`Output size: ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
console.log(`Paths in SVG: ${(svg.match(/<path/g) || []).length}`);
