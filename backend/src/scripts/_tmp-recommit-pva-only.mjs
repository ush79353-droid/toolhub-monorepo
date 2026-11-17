import { execSync } from 'child_process';
import fs from 'fs';

function sh(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: true });
}
function out(cmd) {
  return execSync(cmd, { encoding: 'utf8', shell: true }).trim();
}
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
  console.log('patched', file);
}

sh('git restore --staged .');

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

// Brain essentials
let changelog = fs.readFileSync('brain/CHANGELOG.md', 'utf8');
if (!changelog.includes('Present Value of Annuity Calculator (Screenshot-First + FX)')) {
  const marker =
    '> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.';
  const idx = changelog.indexOf(marker);
  if (idx < 0) throw new Error('changelog marker missing');
  const nl = detectNl(changelog);
  const block = `### 2026-11-17 — Present Value of Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Present Value of Annuity Calculator on existing catalog slug \`present-value-of-annuity-calculator\` (\`PresentValueOfAnnuityCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffaf\`). Ordinary/due, frequencies, growth section, independent FX. Activated.
- **Formulas:** i = (1+r/m)^(m/q)−1; n = round(years×q); ordinary PV = PMT×(1−(1+i)^(−n))/i; due ×(1+i); growing closed forms when g ≠ 0.
- **FX:** Independent currencies on payment + present value via shared Mongo rates. Rates/term/frequencies/growth never convert.
- **Example:** 100 @ 5% / 3y yearly ordinary → ≈ 272.32; due ≈ 285.94.
- **Important Files:** \`frontend/src/tools/calculators/present-value-of-annuity/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-present-value-of-annuity-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog undeveloped before coding. MongoDB activated. Lint/builds/tests omitted per user. No push.`;
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
    state =
      state.slice(0, lineEnd) +
      "\n- **Present Value of Annuity Calculator (`/tools/present-value-of-annuity-calculator`):** Live PVA (`PresentValueOfAnnuityCalculator`, catalog `6af46f0fa27d8d1d4e98ffaf`). Ordinary/due, frequencies, growth section, Phase 2 FX. Example 100 @ 5%/3y → ≈ 272.32. Activated." +
      state.slice(lineEnd);
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
      '- `src/tools/calculators/present-value-of-annuity/`: Present Value of Annuity Calculator (`PresentValueOfAnnuityCalculator`, slug `present-value-of-annuity-calculator`). Ordinary/due, frequencies, growth; independent FX; guide.\n' +
      fe.slice(lineEnd + 1);
    fs.writeFileSync('brain/FRONTEND.md', fe);
  }
}

let tasks = fs.readFileSync('brain/TASKS.md', 'utf8');
if (!tasks.includes('present-value-of-annuity-calculator` with ordinary/due')) {
  const row =
    '| `TOOL-373` | Implement Present Value of Annuity Calculator on existing slug `present-value-of-annuity-calculator` with ordinary/due, compound/payment frequencies, growth section, independent FX, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/present-value-of-annuity/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-present-value-of-annuity-tool.ts`, `brain/*` | `TOOL-368` |';
  const i = tasks.indexOf('future-value-of-annuity-calculator');
  if (i >= 0) {
    const lineEnd = tasks.indexOf('\n', i);
    tasks = tasks.slice(0, lineEnd + 1) + row + '\n' + tasks.slice(lineEnd + 1);
  } else {
    tasks += '\n' + row + '\n';
  }
  fs.writeFileSync('brain/TASKS.md', tasks);
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

for (const f of [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'backend/src/modules/tools/tool.key.ts',
]) {
  if (!fs.readFileSync(f, 'utf8').includes('PresentValueOfAnnuityCalculator')) {
    throw new Error('still missing ' + f);
  }
}
if (!fs.existsSync('frontend/src/tools/calculators/present-value-of-annuity/calculation.ts')) {
  throw new Error('module missing');
}

sh('git add ' + files.map((f) => JSON.stringify(f)).join(' '));

const staged = out('git diff --cached --name-only');
if (staged.includes('immediate-annuity') || staged.includes('assign-immediate')) {
  throw new Error('immediate-annuity leaked into stage:\n' + staged);
}
if (!out('git show :frontend/src/tools/registry/keys.ts').includes('PresentValueOfAnnuityCalculator')) {
  throw new Error('staged keys missing PVA');
}

sh('git commit -m "feat(calculator): implement present value of annuity with FX"');
console.log('COMMIT', out('git rev-parse HEAD'));
console.log(out('git show --name-only --pretty=format: HEAD'));
