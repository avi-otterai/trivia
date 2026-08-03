/* eslint-disable */
// Validates the card decks against the same filters the game applies at load.
// Run: npm run validate:data
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

// Compile lib/dimensions.ts so we use the real displayFormat, not a copy of it.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dims-"));
execSync(
  `npx tsc lib/dimensions.ts types/dimension.ts --outDir ${tmp} --module commonjs --target es2019 --skipLibCheck`,
  { stdio: "pipe" }
);
const { dimensions } = require(path.join(tmp, "lib/dimensions.js"));

const cfg = JSON.parse(fs.readFileSync("public/dimensions.json", "utf8"));
// Dimensions where duplicate values are real-world ties, not data errors.
// Thousands of events share a year; that deck is huge, so it stays well above
// the floor anyway.
const TIES_EXPECTED = new Set(["year"]);

// A dimension needs enough distinct values to be worth playing. The `oscars`
// deck was dropped for this reason: only ten distinct win counts exist, so a
// run ended after ~7 placements no matter how many films were listed.
const MIN_PLAYABLE = 20;
let problems = 0;
const thin = [];
const rows = [];

for (const meta of cfg.dimensions) {
  const dim = dimensions[meta.name];
  const raw = fs
    .readFileSync(path.join("public", meta.dataFile), "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));

  // Mirror the load-time filters in components/game.tsx
  const kept = raw
    .filter((i) => {
      const v = i.value ?? i.year;
      return !String(i.label).includes(String(v)) && !String(i.description).includes(String(v));
    })
    .filter((i) => !/(?:th|st|nd)[ -]century/i.test(i.description));

  const seen = new Map();
  const dropped = [];
  for (const i of kept) {
    const shown = dim.displayFormat(i.value ?? i.year ?? 0);
    if (seen.has(shown)) dropped.push(`${i.label} (${shown}, same as ${seen.get(shown)})`);
    else seen.set(shown, i.label);
  }

  const leaked = raw.length - kept.length;
  const playable = seen.size;
  rows.push({ dim: meta.name, raw: raw.length, playable, leaked, dropped });
  if ((dropped.length || leaked) && !TIES_EXPECTED.has(meta.name)) problems++;
  if (playable < MIN_PLAYABLE) {
    thin.push(`${meta.name} has only ${playable} playable cards (min ${MIN_PLAYABLE})`);
  }
}

rows.sort((a, b) => a.playable - b.playable);
console.log("dimension".padEnd(13), "raw".padStart(5), "playable".padStart(9), "lost".padStart(5));
for (const r of rows) {
  const lost = r.raw - r.playable;
  console.log(
    r.dim.padEnd(13),
    String(r.raw).padStart(5),
    String(r.playable).padStart(9),
    String(lost).padStart(5),
    lost ? "  <-- " + [...r.dropped, ...(r.leaked ? [`${r.leaked} filtered by text rules`] : [])].join("; ") : ""
  );
}
fs.rmSync(tmp, { recursive: true, force: true });
if (thin.length) {
  console.log("\nBelow the playable-card floor:");
  for (const t of thin) console.log("  - " + t);
}
if (problems || thin.length) {
  console.log(
    `\n${problems} dimension(s) lose cards to duplicate displayed values, which the` +
      ` loader drops silently. Fix the data or the dimension's displayFormat.`
  );
  process.exit(1);
}
console.log("\nAll decks clean (ignoring inherent ties in: " + [...TIES_EXPECTED].join(", ") + ").");
