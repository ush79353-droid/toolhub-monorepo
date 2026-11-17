import fs from 'fs';
import { execSync } from 'child_process';

// Ensure registry still has PVA; re-patch if wiped
function detectNl(s) {
  return s.includes('\r\n') ? '\r\n' : '\n';
}
function insertOnce(file, needleFactory, insertFactory, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(label)) return;
  const nl = detectNl(s);
  const needle = needleFactory(nl);
  const insert = insertFactory(nl);
  if (!s.includes(needle)) throw new Error(`missing needle in ${file}`);
  fs.writeFileSync(file, s.split(needle).join(needle + insert));
  console.log('re-patched', file);
}

insertOnce(
  'frontend/src/tools/registry/keys.ts',
  (nl) => `  'PresentValueCalculator',${nl}`,
  (nl) => `  'PresentValueOfAnnuityCalculator',${nl}`,
  'PresentValueOfAnnuityCalculator'
);
insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  (nl) => `  'PresentValueCalculator',${nl}`,
  (nl) => `  'PresentValueOfAnnuityCalculator',${nl}`,
  "'PresentValueOfAnnuityCalculator'"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  (nl) => `  'PresentValueCalculator',${nl}`,
  (nl) => `  'PresentValueOfAnnuityCalculator',${nl}`,
  "'PresentValueOfAnnuityCalculator'"
);
insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  (nl) => `    !isApprovedComponentKey('PresentValueCalculator') ||${nl}`,
  (nl) => `    !isApprovedComponentKey('PresentValueOfAnnuityCalculator') ||${nl}`,
  "isApprovedComponentKey('PresentValueOfAnnuityCalculator')"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  (nl) => `    !isApprovedComponentKey('PresentValueCalculator') ||${nl}`,
  (nl) => `    !isApprovedComponentKey('PresentValueOfAnnuityCalculator') ||${nl}`,
  "isApprovedComponentKey('PresentValueOfAnnuityCalculator')"
);
insertOnce(
  'frontend/src/tools/registry/index.ts',
  (nl) =>
    `  PresentValueCalculator: lazyTool(() =>${nl}` +
    `    import('@/tools/calculators/present-value/PresentValueCalculator').then((mod) => ({${nl}` +
    `      default: mod.PresentValueCalculator,${nl}` +
    `    })),${nl}` +
    `  ),${nl}`,
  (nl) =>
    `  PresentValueOfAnnuityCalculator: lazyTool(() =>${nl}` +
    `    import(${nl}` +
    `      '@/tools/calculators/present-value-of-annuity/PresentValueOfAnnuityCalculator'${nl}` +
    `    ).then((mod) => ({${nl}` +
    `      default: mod.PresentValueOfAnnuityCalculator,${nl}` +
    `    })),${nl}` +
    `  ),${nl}`,
  'PresentValueOfAnnuityCalculator:'
);
insertOnce(
  'frontend/src/tools/registry/details.ts',
  (nl) =>
    `  PresentValueCalculator: () =>${nl}` +
    `    import('@/tools/calculators/present-value/detail'),${nl}`,
  (nl) =>
    `  PresentValueOfAnnuityCalculator: () =>${nl}` +
    `    import('@/tools/calculators/present-value-of-annuity/detail'),${nl}`,
  'PresentValueOfAnnuityCalculator:'
);
for (const f of [
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  insertOnce(
    f,
    (nl) => `  'present-value-calculator',${nl}`,
    (nl) => `  'present-value-of-annuity-calculator',${nl}`,
    'present-value-of-annuity-calculator'
  );
}

// Brain
let changelog = fs.readFileSync('brain/CHANGELOG.md', 'utf8');
if (!changelog.includes('Present Value of Annuity Calculator (Screenshot-First + FX)')) {
  const marker =
    '> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.';
  const idx = changelog.indexOf(marker);
  if (idx < 0) throw new Error('changelog marker missing');
  const nl = detectNl(changelog);
  const block = `### 2026-11-17 — Present Value of Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Present Value of Annuity Calculator on existing catalog slug \`present-value-of-annuity-calculator\` (\`PresentValueOfAnnuityCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffaf\`). Payment, interest rate, term yrs/mos, compound/payment frequency, ordinary/due radios, present-value result; Growth rate and additional information section. Share/Reload/Clear/feedback. Activated.
- **Formulas:** i = (1+r/m)^(m/q)−1 (discrete) or e^(r/q)−1 (continuous); n = round(years×q). Ordinary PV = PMT×(1−(1+i)^(−n))/i; due ×(1+i); growing (g≠i) PMT/(i−g)×(1−((1+g)/(1+i))^n); g=i → PMT×n/(1+i); zero interest PV = PMT×n.
- **FX:** Independent currencies on payment + present value. Rates/term/frequencies/growth never convert. \`CURRENCY_CONVERSION_SLUGS\` + stale/missing handling.
- **Example:** Payment 100 · 5% · 3 years · yearly · ordinary → PV ≈ 272.32; due ≈ 285.94.
- **Important Files:** \`frontend/src/tools/calculators/present-value-of-annuity/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-present-value-of-annuity-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/tests omitted per user. No push.`;
  changelog =
    changelog.slice(0, idx + marker.length) +
    nl +
    nl +
    block +
    nl +
    changelog.slice(idx + marker.length);
  fs.writeFileSync('brain/CHANGELOG.md', changelog);
}

let state = fs.readFileSync('brain/CURRENT_STATE.md', 'utf8');
state = state.replace(
  /Last verified: \*\*2026-11-17\*\* \([^)]+\)/,
  'Last verified: **2026-11-17** (Present Value of Annuity Calculator live at `/tools/present-value-of-annuity-calculator` with FX; Auto Loan remains master Tool Detail Page)'
);
if (!state.includes('Present Value of Annuity Calculator (`/tools/present-value-of-annuity-calculator`)')) {
  const anchor = 'Future Value of Annuity Calculator (`/tools/future-value-of-annuity-calculator`)';
  const i = state.indexOf(anchor);
  if (i >= 0) {
    const lineEnd = state.indexOf('\n', i);
    const insert =
      "\n- **Present Value of Annuity Calculator (`/tools/present-value-of-annuity-calculator`):** Live client-side PVA (`componentKey: 'PresentValueOfAnnuityCalculator'`, catalog `6af46f0fa27d8d1d4e98ffaf`). Payment, rate, term yrs/mos, compound/payment frequency, ordinary/due; growth section. Independent Phase 2 FX on payment + present value. Example 100 @ 5% / 3y yearly → ordinary ≈ 272.32; due ≈ 285.94. Activated.";
    state = state.slice(0, lineEnd) + insert + state.slice(lineEnd);
  }
}
fs.writeFileSync('brain/CURRENT_STATE.md', state);

let fe = fs.readFileSync('brain/FRONTEND.md', 'utf8');
if (!fe.includes('present-value-of-annuity-calculator')) {
  const needle = 'future-value-of-annuity-calculator';
  const idx = fe.indexOf(needle);
  if (idx >= 0) {
    const lineEnd = fe.indexOf('\n', idx);
    fe =
      fe.slice(0, lineEnd + 1) +
      '- `src/tools/calculators/present-value-of-annuity/`: Present Value of Annuity Calculator (`PresentValueOfAnnuityCalculator`, slug `present-value-of-annuity-calculator`). Payment/rate/term, compound & payment frequencies, ordinary/due, growth section; independent FX on payment + result; guide.\n' +
      fe.slice(lineEnd + 1);
    fs.writeFileSync('brain/FRONTEND.md', fe);
  }
}

let tasks = fs.readFileSync('brain/TASKS.md', 'utf8');
if (!tasks.includes('present-value-of-annuity-calculator` with ordinary/due')) {
  const row =
    '| `TOOL-373` | Implement Present Value of Annuity Calculator on existing slug `present-value-of-annuity-calculator` with ordinary/due, compound/payment frequencies, growth section, independent FX, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/present-value-of-annuity/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-present-value-of-annuity-tool.ts`, `brain/*` | `TOOL-368` |';
  const needle = 'future-value-of-annuity-calculator';
  const i = tasks.indexOf(needle);
  if (i >= 0) {
    const lineEnd = tasks.indexOf('\n', i);
    tasks = tasks.slice(0, lineEnd + 1) + row + '\n' + tasks.slice(lineEnd + 1);
  } else {
    tasks += '\n' + row + '\n';
  }
  fs.writeFileSync('brain/TASKS.md', tasks);
}

for (const f of [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'backend/src/modules/tools/tool.key.ts',
]) {
  if (!fs.readFileSync(f, 'utf8').includes('PresentValueOfAnnuityCalculator')) {
    throw new Error('missing ' + f);
  }
}

const files = [
  'frontend/src/tools/calculators/present-value-of-annuity',
  'backend/src/scripts/assign-present-value-of-annuity-tool.ts',
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
  'brain/CURRENT_STATE.md',
  'brain/FRONTEND.md',
  'brain/TASKS.md',
];

execSync('git add ' + files.map((f) => JSON.stringify(f)).join(' '), {
  stdio: 'inherit',
  shell: true,
});

const staged = execSync('git show :frontend/src/tools/registry/keys.ts', {
  encoding: 'utf8',
});
if (!staged.includes('PresentValueOfAnnuityCalculator')) {
  throw new Error('staged keys missing PVA');
}
const stagedIndex = execSync('git show :frontend/src/tools/registry/index.ts', {
  encoding: 'utf8',
});
if (!stagedIndex.includes('PresentValueOfAnnuityCalculator')) {
  throw new Error('staged index missing PVA');
}
if (!fs.existsSync('frontend/src/tools/calculators/present-value-of-annuity/calculation.ts')) {
  throw new Error('module missing');
}

execSync(
  'git commit -m "feat(calculator): implement present value of annuity with FX"',
  { stdio: 'inherit', shell: true }
);

console.log('COMMIT', execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim());
console.log(
  'worktree PVA',
  fs.readFileSync('frontend/src/tools/registry/keys.ts', 'utf8').includes(
    'PresentValueOfAnnuityCalculator'
  )
);
