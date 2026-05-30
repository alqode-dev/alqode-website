import { readFileSync } from "node:fs";

const before = JSON.parse(readFileSync(".lighthouse/mobile.json", "utf8"));
const after = JSON.parse(readFileSync(".lighthouse/mobile-after.json", "utf8"));

const fmt = (n) => (n == null ? "—" : Math.round(n * 100).toString().padStart(3));

console.log(`CATEGORY                BEFORE   AFTER   Δ`);
for (const k of ["performance", "accessibility", "best-practices", "seo"]) {
  const b = before.categories[k]?.score;
  const a = after.categories[k]?.score;
  const delta = b != null && a != null ? Math.round((a - b) * 100) : "?";
  const arrow = delta === 0 ? "—" : delta > 0 ? `+${delta}` : `${delta}`;
  console.log(`  ${before.categories[k].title.padEnd(20)} ${fmt(b)}     ${fmt(a)}    ${arrow}`);
}

console.log(`\nNote: BEFORE = production (alqode.com over real network)`);
console.log(`      AFTER  = local production build (localhost — no network/CDN)`);
console.log(`      Performance numbers are NOT directly comparable.`);
console.log(`      Accessibility / Best-Practices / SEO ARE comparable (code-driven).\n`);

function failuresFor(report, category) {
  const ids = report.categories[category]?.auditRefs?.map((x) => x.id) || [];
  return ids
    .map((id) => report.audits[id])
    .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual")
    .map((a) => a.title);
}

console.log(`ACCESSIBILITY FAILURES`);
console.log(`  BEFORE:`);
for (const t of failuresFor(before, "accessibility")) console.log(`    • ${t}`);
console.log(`  AFTER:`);
const afterA11y = failuresFor(after, "accessibility");
if (afterA11y.length === 0) console.log(`    (none — 100)`);
for (const t of afterA11y) console.log(`    • ${t}`);
