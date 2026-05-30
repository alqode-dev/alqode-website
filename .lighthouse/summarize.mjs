import { readFileSync } from "node:fs";

function summarize(path, label) {
  const r = JSON.parse(readFileSync(path, "utf8"));
  const cats = r.categories;
  const audits = r.audits;
  const fmt = (n) => (n == null ? "—" : Math.round(n * 100));

  console.log(`\n=== ${label} === (${r.configSettings?.formFactor || "?"})`);
  console.log(`URL: ${r.finalDisplayedUrl}`);
  console.log(`Fetched: ${r.fetchTime}`);
  console.log(`\nCATEGORY SCORES`);
  for (const k of ["performance", "accessibility", "best-practices", "seo"]) {
    const c = cats[k];
    if (c) console.log(`  ${c.title.padEnd(18)} ${fmt(c.score)}`);
  }

  console.log(`\nCORE WEB VITALS / PERFORMANCE METRICS`);
  const metrics = [
    ["first-contentful-paint", "FCP"],
    ["largest-contentful-paint", "LCP"],
    ["total-blocking-time", "TBT"],
    ["cumulative-layout-shift", "CLS"],
    ["speed-index", "Speed Index"],
    ["interactive", "TTI"],
    ["server-response-time", "TTFB"],
  ];
  for (const [id, name] of metrics) {
    const a = audits[id];
    if (a) {
      const score = a.score == null ? "—" : Math.round(a.score * 100);
      console.log(`  ${name.padEnd(14)} ${a.displayValue || ""}   (score ${score})`);
    }
  }

  console.log(`\nTOP PERFORMANCE OPPORTUNITIES (potential savings)`);
  const opps = Object.values(audits)
    .filter((a) => a.details?.type === "opportunity" && a.details.overallSavingsMs > 0)
    .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs);
  if (opps.length === 0) console.log("  (none flagged)");
  for (const a of opps.slice(0, 8)) {
    const ms = Math.round(a.details.overallSavingsMs);
    const bytes = a.details.overallSavingsBytes
      ? ` · ${Math.round(a.details.overallSavingsBytes / 1024)}KB`
      : "";
    console.log(`  [-${ms}ms${bytes}] ${a.title}`);
  }

  console.log(`\nFAILING DIAGNOSTICS (score < 0.9)`);
  const fails = Object.values(audits)
    .filter(
      (a) =>
        a.score !== null &&
        a.score !== undefined &&
        a.score < 0.9 &&
        a.scoreDisplayMode !== "notApplicable" &&
        a.scoreDisplayMode !== "manual" &&
        a.details?.type !== "opportunity"
    )
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
  if (fails.length === 0) console.log("  (none)");
  for (const a of fails.slice(0, 14)) {
    console.log(`  [${Math.round((a.score ?? 0) * 100).toString().padStart(3)}] ${a.title}`);
    if (a.displayValue) console.log(`        → ${a.displayValue}`);
  }

  console.log(`\nACCESSIBILITY FAILURES`);
  const a11yIds = cats.accessibility?.auditRefs?.map((x) => x.id) || [];
  const a11yFails = a11yIds
    .map((id) => audits[id])
    .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual");
  if (a11yFails.length === 0) console.log("  (none)");
  for (const a of a11yFails) console.log(`  • ${a.title}`);

  console.log(`\nSEO FAILURES`);
  const seoIds = cats.seo?.auditRefs?.map((x) => x.id) || [];
  const seoFails = seoIds
    .map((id) => audits[id])
    .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual");
  if (seoFails.length === 0) console.log("  (none)");
  for (const a of seoFails) console.log(`  • ${a.title}`);

  console.log(`\nBEST-PRACTICES FAILURES`);
  const bpIds = cats["best-practices"]?.auditRefs?.map((x) => x.id) || [];
  const bpFails = bpIds
    .map((id) => audits[id])
    .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual");
  if (bpFails.length === 0) console.log("  (none)");
  for (const a of bpFails) console.log(`  • ${a.title}`);
}

summarize(".lighthouse/mobile.json", "MOBILE");
summarize(".lighthouse/desktop.json", "DESKTOP");
