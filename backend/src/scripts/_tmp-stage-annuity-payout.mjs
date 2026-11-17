import fs from 'node:fs';
import { execSync } from 'node:child_process';

const files = [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/tool.key.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'backend/src/modules/tools/tool.key.ts',
  'brain/CHANGELOG.md',
  'brain/TASKS.md',
  'brain/CURRENT_STATE.md',
];

/** Keep colleague WIP if backup already exists from prior run. */
if (!fs.existsSync('.tmp-annuity-payout-backups.json')) {
  const backups = Object.fromEntries(
    files.map((f) => [f, fs.readFileSync(f, 'utf8')])
  );
  fs.writeFileSync('.tmp-annuity-payout-backups.json', JSON.stringify(backups));
} else {
  // Restore colleague WIP first so we re-backup? No — backups already capture WIP.
}

function fromHead(f) {
  return execSync(`git show HEAD:${f}`, {
    encoding: 'utf8',
  }).replace(/\r\n/g, '\n');
}

function insertOnce(src, needle, insertion) {
  if (src.includes(insertion.trim())) return src;
  const idx = src.indexOf(needle);
  if (idx < 0) throw new Error(`needle missing: ${needle.slice(0, 90)}`);
  return src.slice(0, idx + needle.length) + insertion + src.slice(idx + needle.length);
}

function insertLineAfter(src, lineContent, newLine) {
  if (src.includes(newLine.trim())) return src;
  const needle = `${lineContent}\n`;
  const idx = src.indexOf(needle);
  if (idx < 0) throw new Error(`line missing: ${lineContent}`);
  return src.slice(0, idx + needle.length) + `${newLine}\n` + src.slice(idx + needle.length);
}

// keys.ts — both lists
let keys = fromHead('frontend/src/tools/registry/keys.ts');
keys = insertLineAfter(
  keys,
  "  'AnnuityCalculator',",
  "  'AnnuityPayoutCalculator',"
);
// second list — insertLineAfter only hits first; do replaceAll style for remaining
keys = keys.replace(
  "  'AnnuityCalculator',\n  'AnnualizedReturnCalculator',",
  "  'AnnuityCalculator',\n  'AnnuityPayoutCalculator',\n  'AnnualizedReturnCalculator',"
);
// Ensure both occurrences
{
  const parts = keys.split("  'AnnuityCalculator',\n");
  if (parts.length === 3) {
    keys = [
      parts[0],
      "  'AnnuityCalculator',\n  'AnnuityPayoutCalculator',\n",
      parts[1].startsWith("  'AnnuityPayoutCalculator',\n")
        ? parts[1]
        : "  'AnnuityPayoutCalculator',\n" + parts[1],
      // wait this is messy
    ];
  }
}
// Cleaner: count and rebuild
{
  let count = 0;
  keys = fromHead('frontend/src/tools/registry/keys.ts').replace(
    /  'AnnuityCalculator',\n/g,
    () => {
      count += 1;
      return "  'AnnuityCalculator',\n  'AnnuityPayoutCalculator',\n";
    }
  );
  if (count !== 2) throw new Error(`expected 2 AnnuityCalculator keys, got ${count}`);
}
fs.writeFileSync('frontend/src/tools/registry/keys.ts', keys);

let index = fromHead('frontend/src/tools/registry/index.ts');
index = insertOnce(
  index,
  `  AnnuityCalculator: lazyTool(() =>
    import('@/tools/calculators/annuity/AnnuityCalculator').then((mod) => ({
      default: mod.AnnuityCalculator,
    })),
  ),
`,
  `  AnnuityPayoutCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/annuity-payout/AnnuityPayoutCalculator'
    ).then((mod) => ({
      default: mod.AnnuityPayoutCalculator,
    })),
  ),
`
);
fs.writeFileSync('frontend/src/tools/registry/index.ts', index);

let details = fromHead('frontend/src/tools/registry/details.ts');
details = insertOnce(
  details,
  "  AnnuityCalculator: () => import('@/tools/calculators/annuity/detail'),\n",
  `  AnnuityPayoutCalculator: () =>
    import('@/tools/calculators/annuity-payout/detail'),
`
);
fs.writeFileSync('frontend/src/tools/registry/details.ts', details);

for (const f of [
  'frontend/src/tools/registry/tool.key.ts',
  'backend/src/modules/tools/tool.key.ts',
]) {
  let text = fromHead(f);
  if (!text.includes("'AnnuityPayoutCalculator'")) {
    // Frontend/backend lists may lack AnnuityCalculator — insert after AnnualizedReturn
    text = text.replace(
      /  'AnnualizedReturnCalculator',\n/g,
      "  'AnnualizedReturnCalculator',\n  'AnnuityPayoutCalculator',\n"
    );
    // Only first occurrence in APPROVED list is desired; assertion list uses isApprovedComponentKey
    text = text.replace(
      /    !isApprovedComponentKey\('AnnualizedReturnCalculator'\) \|\|\n/g,
      "    !isApprovedComponentKey('AnnualizedReturnCalculator') ||\n    !isApprovedComponentKey('AnnuityPayoutCalculator') ||\n"
    );
  }
  if (!text.includes("'AnnuityPayoutCalculator'")) {
    throw new Error(`failed to insert AnnuityPayout into ${f}`);
  }
  fs.writeFileSync(f, text);
}

for (const f of ['frontend/src/app/sitemap.ts', 'frontend/src/tools/registry/sitemap.ts']) {
  let s = fromHead(f);
  if (!s.includes("'annuity-payout-calculator'")) {
    s = insertOnce(s, "  'annuity-calculator',\n", "  'annuity-payout-calculator',\n");
  }
  fs.writeFileSync(f, s);
}

for (const f of [
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  let s = fromHead(f);
  if (!s.includes("'annuity-payout-calculator'")) {
    if (s.includes("'annuity-calculator',")) {
      s = insertOnce(s, "  'annuity-calculator',\n", "  'annuity-payout-calculator',\n");
    } else if (s.includes("'annualized-return-calculator',")) {
      s = insertOnce(
        s,
        "  'annualized-return-calculator',\n",
        "  'annuity-payout-calculator',\n"
      );
    } else {
      s = insertOnce(
        s,
        "  'deferred-annuity-calculator',\n",
        "  'annuity-payout-calculator',\n"
      );
    }
  }
  fs.writeFileSync(f, s);
}

let cl = fromHead('brain/CHANGELOG.md');
const ourCl = `### 2026-11-17 — Annuity Payout Calculator (Screenshot-First + FX)
- **Summary:** Shipped Annuity Payout Calculator on existing catalog slug \`annuity-payout-calculator\` (\`AnnuityPayoutCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffa9\`). Modes: fixed length (default) and fixed payment. Main specs: initial balance, payout frequency, ordinary/due, length or payment, annuity rate; checkbox unlocks compounding, final balance, and annual growth. Narrative results for withdrawal, duration, total interest, and applicable final balance. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Default period rate \`r = (1+i)^(1/k)−1\`; with compounding \`r = (1+i/m)^(m/k)−1\`. Ordinary level payout \`PMT = PV × r / (1 − (1+r)^(-n))\`; due divides by \`(1+r)\`; \`r = 0\` → \`PV/n\`. Growing annuity closed form when growth ≠ 0. Total interest from the withdrawal schedule. Fixed-payment mode solves period count to the target final balance.
- **FX:** Independent currencies on initial balance, fixed-payment amount, and final balance (Margin Interest / Phase 2). Normalize payment and final into the initial-balance currency before solving. Rates, lengths, and frequencies never convert. Stale/missing rate handling reused via \`CURRENCY_CONVERSION_SLUGS\`.
- **Example:** 100,000 PKR / 6% / 10 years / monthly / ordinary → payment ≈ 1,102.24; total interest ≈ 32,268.83.
- **Important Files:** \`frontend/src/tools/calculators/annuity-payout/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-annuity-payout-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Math self-check matched screenshot. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
if (!cl.includes('Annuity Payout Calculator (Screenshot-First + FX)')) {
  cl = cl.replace(
    '> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.\n\n',
    '> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.\n\n' +
      ourCl
  );
}
fs.writeFileSync('brain/CHANGELOG.md', cl);

let tasks = fromHead('brain/TASKS.md');
const ourTask =
  '| `TOOL-370` | Implement Annuity Payout Calculator on existing slug `annuity-payout-calculator` with fixed-length/fixed-payment modes, ordinary/due, optional final balance/growth/compounding, schedule interest, independent FX, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/annuity-payout/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-annuity-payout-tool.ts`, `brain/*` | `TOOL-369` |\n';
if (!tasks.includes('Annuity Payout Calculator on existing slug')) {
  const marker = '| `TOOL-369` | Implement Margin and VAT Calculator';
  const lineStart = tasks.indexOf(marker);
  if (lineStart < 0) throw new Error('TOOL-369 insert point missing');
  const lineEnd = tasks.indexOf('\n', lineStart) + 1;
  tasks = tasks.slice(0, lineEnd) + ourTask + tasks.slice(lineEnd);
}
fs.writeFileSync('brain/TASKS.md', tasks);

let cs = fromHead('brain/CURRENT_STATE.md');
const ourCs =
  "- **Annuity Payout Calculator (`/tools/annuity-payout-calculator`):** Live client-side payout tool (`componentKey: 'AnnuityPayoutCalculator'`, catalog `6af46f0fa27d8d1d4e98ffa9`). Modes: fixed length (default) and fixed payment. Inputs: initial balance FX, payout frequency, ordinary/due, length yrs/mos or payment FX, annuity rate %; checkbox unlocks compounding, final balance FX, annual growth (fixed length). Default period rate `(1+i)^(1/k)−1`; advanced uses `(1+i/m)^(m/k)−1`. Ordinary PMT = PV×r/(1−(1+r)^(-n)); due ÷(1+r); r=0 → PV/n. Interest from cash-flow schedule. Defaults 100,000 PKR / 6% / 10y monthly ordinary → ≈ 1,102.24 payment and ≈ 32,268.83 interest. Share/Reload/Clear/feedback. Activated. Lint/builds/browser/automated tests omitted per user.\n";
if (!cs.includes('Annuity Payout Calculator')) {
  const m = cs.indexOf('Debt-to-Capital Ratio Calculator');
  if (m < 0) throw new Error('CURRENT_STATE insert point missing');
  const lineEnd = cs.indexOf('\n', m) + 1;
  cs = cs.slice(0, lineEnd) + ourCs + cs.slice(lineEnd);
}
fs.writeFileSync('brain/CURRENT_STATE.md', cs);

// verify no colleague keys slipped in
const forbidden = ['LotteryAnnuity', 'GrowingAnnuity', 'PresentValueOfAnnuity'];
for (const f of [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'backend/src/modules/tools/tool.key.ts',
]) {
  const text = fs.readFileSync(f, 'utf8');
  const head = fromHead(f);
  for (const bad of forbidden) {
    if (text.includes(bad) && !head.includes(bad)) {
      throw new Error(`${bad} leaked into clean ${f}`);
    }
  }
  if (!text.includes('AnnuityPayout')) {
    throw new Error(`AnnuityPayout missing from ${f}`);
  }
}

console.log('Clean AnnuityPayout-only working tree prepared');
