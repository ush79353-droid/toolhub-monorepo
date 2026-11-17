import { execSync } from 'node:child_process';
import fs from 'node:fs';

function sh(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  });
}

// 1) Backup current shared WIP if needed
const shared = [
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

const backups = Object.fromEntries(
  shared.map((f) => [f, fs.readFileSync(f, 'utf8')])
);
fs.writeFileSync('.tmp-annuity-payout-backups.json', JSON.stringify(backups));

function fromHead(f) {
  return sh(`git show HEAD:${f}`).replace(/\r\n/g, '\n');
}

function insertOnce(src, needle, insertion) {
  if (src.includes(insertion.trim())) return src;
  const idx = src.indexOf(needle);
  if (idx < 0) throw new Error(`needle missing: ${needle.slice(0, 90)}`);
  return src.slice(0, idx + needle.length) + insertion + src.slice(idx + needle.length);
}

// 2) Build clean AnnuityPayout-only shared files from HEAD
{
  let count = 0;
  let keys = fromHead('frontend/src/tools/registry/keys.ts').replace(
    /  'AnnuityCalculator',\n/g,
    () => {
      count += 1;
      return "  'AnnuityCalculator',\n  'AnnuityPayoutCalculator',\n";
    }
  );
  if (count !== 2) throw new Error(`expected 2 AnnuityCalculator keys, got ${count}`);
  fs.writeFileSync('frontend/src/tools/registry/keys.ts', keys);
}

{
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
}

{
  let details = fromHead('frontend/src/tools/registry/details.ts');
  details = insertOnce(
    details,
    "  AnnuityCalculator: () => import('@/tools/calculators/annuity/detail'),\n",
    `  AnnuityPayoutCalculator: () =>
    import('@/tools/calculators/annuity-payout/detail'),
`
  );
  fs.writeFileSync('frontend/src/tools/registry/details.ts', details);
}

for (const f of [
  'frontend/src/tools/registry/tool.key.ts',
  'backend/src/modules/tools/tool.key.ts',
]) {
  let text = fromHead(f);
  if (!text.includes("'AnnuityPayoutCalculator'")) {
    text = text.replace(
      /  'AnnualizedReturnCalculator',\n/g,
      "  'AnnualizedReturnCalculator',\n  'AnnuityPayoutCalculator',\n"
    );
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

{
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
}

{
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
}

{
  let cs = fromHead('brain/CURRENT_STATE.md');
  const ourCs =
    "- **Annuity Payout Calculator (`/tools/annuity-payout-calculator`):** Live client-side payout tool (`componentKey: 'AnnuityPayoutCalculator'`, catalog `6af46f0fa27d8d1d4e98ffa9`). Modes: fixed length (default) and fixed payment. Inputs: initial balance FX, payout frequency, ordinary/due, length yrs/mos or payment FX, annuity rate %; checkbox unlocks compounding, final balance FX, annual growth (fixed length). Default period rate `(1+i)^(1/k)−1`; advanced uses `(1+i/m)^(m/k)−1`. Ordinary PMT = PV×r/(1−(1+r)^(-n)); due ÷(1+r); r=0 → PV/n. Interest from cash-flow schedule. Defaults 100,000 PKR / 6% / 10y monthly ordinary → ≈ 1,102.24 payment and ≈ 32,268.83 interest. Share/Reload/Clear/feedback. Activated. Lint/builds/browser/automated tests omitted per user.\n";
  if (!cs.includes('Annuity Payout Calculator')) {
    const m = cs.indexOf('Debt-to-Capital Ratio Calculator');
    if (m < 0) throw new Error('CURRENT_STATE insert point missing');
    const lineEnd = cs.indexOf('\n', m) + 1;
    cs = cs.slice(0, lineEnd) + ourCs + cs.slice(lineEnd);
    fs.writeFileSync('brain/CURRENT_STATE.md', cs);
  }
}

// 3) Reset index noise then stage only our paths
sh('git reset HEAD -- .', { stdio: ['ignore', 'pipe', 'pipe'] });

const toAdd = [
  'frontend/src/tools/calculators/annuity-payout',
  'backend/src/scripts/assign-annuity-payout-tool.ts',
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
];
if (fs.readFileSync('brain/CURRENT_STATE.md', 'utf8').includes('Annuity Payout Calculator')) {
  const headHas = fromHead('brain/CURRENT_STATE.md').includes('Annuity Payout Calculator');
  if (!headHas) toAdd.push('brain/CURRENT_STATE.md');
}

for (const p of toAdd) {
  sh(`git add -- "${p}"`);
}

const staged = sh('git diff --cached --name-only')
  .split(/\r?\n/)
  .filter(Boolean);
if (staged.length < 10) {
  console.error('Too few staged files:', staged);
  process.exit(1);
}
for (const bad of staged) {
  if (/gross-margin|Lottery|GrowingAnnuity|lottery-annuity|growing-annuity/i.test(bad)) {
    console.error('Bad staged file:', bad);
    process.exit(1);
  }
}
if (!staged.some((f) => f.includes('annuity-payout'))) {
  console.error('annuity-payout module missing from staged set');
  process.exit(1);
}

sh('git commit -m "feat(calculator): implement annuity payout calculator with FX"');
const hash = sh('git rev-parse HEAD').trim();
const subject = sh('git log -1 --format=%s').trim();
if (!/annuity payout/i.test(subject)) {
  console.error('Wrong commit subject:', subject, hash);
  process.exit(1);
}

for (const [file, contents] of Object.entries(backups)) {
  fs.writeFileSync(file, contents);
}
fs.unlinkSync('.tmp-annuity-payout-backups.json');

console.log(
  JSON.stringify(
    {
      ok: true,
      hash,
      subject,
      stagedCount: staged.length,
      staged,
      restored: Object.keys(backups).length,
    },
    null,
    2
  )
);
