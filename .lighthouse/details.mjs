import { readFileSync } from "node:fs";

const r = JSON.parse(readFileSync(".lighthouse/mobile.json", "utf8"));

function dump(id) {
  const a = r.audits[id];
  if (!a) return console.log(`(no audit ${id})`);
  console.log(`\n── ${a.title} (${id})`);
  if (a.description) console.log(`   ${a.description.split("\n")[0].slice(0, 200)}`);
  const items = a.details?.items || [];
  console.log(`   ${items.length} item(s)`);
  for (const it of items.slice(0, 12)) {
    const node = it.node;
    if (node) {
      console.log(`   • selector: ${node.selector || ""}`);
      console.log(`     snippet:  ${(node.snippet || "").slice(0, 180)}`);
      if (node.explanation) console.log(`     why:      ${node.explanation.slice(0, 200)}`);
      if (it.subItems?.items) {
        for (const sub of it.subItems.items.slice(0, 3)) {
          console.log(`       ↳ ${(sub.relatedNode?.snippet || JSON.stringify(sub)).slice(0, 160)}`);
        }
      }
    } else {
      console.log(`   • ${JSON.stringify(it).slice(0, 220)}`);
    }
  }
}

console.log("=== A11Y DETAILS (mobile run) ===");
dump("color-contrast");
dump("label-content-name-mismatch");
dump("target-size");
dump("button-name");
dump("link-name");

console.log("\n=== TOP UNUSED JS ===");
dump("unused-javascript");

console.log("\n=== LEGACY JS ===");
dump("legacy-javascript");

console.log("\n=== REDIRECTS ===");
dump("redirects");
