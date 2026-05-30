# v4 Next-Session Kickoff Prompt

Paste this at the start of the next session:

---

Continuing the alqode v4 hero build on branch `v4-cinema`. First read your memory `MEMORY.md` (the "CURRENT STATE + HANDOFF" section) and `.planning/V4_HERO_PLAN.md`, then confirm you're oriented in 3 short lines: (1) what's built, (2) the active task, (3) the next step.

The short version: we're building a real-time WebGL hero where a liquid-chrome blob melts/solidifies into the `{alqode}` logo (Venom-style, ONE substance, liquid→solid, green brackets/glow at the end). The real brand wordmark is ready at `public/brand/alqode-wordmark.svg` (Space Grotesk Medium). Reference bar: itsoffbrand.com + funtech.inc. Our gap is choreography, not chrome (~42/100).

Then do this, in order, showing me a Playwright screenshot at each step before moving on:
1. Start the dev server. Scan my installed skills/MCPs/CLIs and decide which to APPLY this phase (impeccable, taste-skill, emil-design-eng, ui-ux-pro-max, gsap-*, react-bits, humanizer) — apply them proactively, do not ask me which to use.
2. Wire the real `{alqode}` SVG into the 3D chrome scene: `SVGLoader` + `ExtrudeGeometry`, replace the helvetiker placeholder everywhere, make the brackets `{ }` green (#10b981). Screenshot `/v4-lab` and show me.
3. Build the MELT: the logo starts as a churning molten chrome blob and solidifies into the crisp `{alqode}` as you scroll (noise-displacement vertex shader on the chrome MeshStandardMaterial via onBeforeCompile; dense/tessellated mesh so it melts smoothly). Screenshot the key states (`?p=0`, `0.5`, `1`) and show me.

Rules: never touch `main` (it's the live v3.1 site); commit freely on `v4-cinema`; no em dashes or AI tells in any copy; prove quality with screenshots before moving on; take the time it needs.

---
