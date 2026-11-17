import { execSync } from 'child_process';
import fs from 'fs';

function detectNl(s) {
  return s.includes('\r\n') ? '\r\n' : '\n';
}

function insertOnce(file, needleFactory, insertFactory, label) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(label)) {
    console.log('skip exists', file, label);
    return;
  }
  const nl = detectNl(s);
  const needle = needleFactory(nl);
  const insert = insertFactory(nl);
  if (!s.includes(needle)) {
    throw new Error(`missing needle in ${file}: ${JSON.stringify(needle)}`);
  }
  s = s.split(needle).join(needle + insert);
  fs.writeFileSync(file, s);
  console.log('patched', file);
}

function prependChangelog(file, block) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('Present Value of Annuity Calculator (Screenshot-First + FX)')) {
    console.log('skip changelog');
    return;
  }
  const marker = '> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.';
  const idx = s.indexOf(marker);
  if (idx < 0) throw new Error('changelog marker missing');
  const insertAt = idx + marker.length;
  const nl = detectNl(s);
  s = s.slice(0, insertAt) + nl + nl + block.trim() + nl + s.slice(insertAt);
  fs.writeFileSync(file, s);
  console.log('changelog updated');
}

function ensureLineAfter(file, afterContains, line, unique) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(unique)) {
    console.log('skip line', unique);
    return;
  }
  const nl = detectNl(s);
  const lines = s.split(/\r?\n/);
  const i = lines.findIndex((l) => l.includes(afterContains));
  if (i < 0) throw new Error(`anchor missing in ${file}: ${afterContains}`);
  lines.splice(i + 1, 0, line);
  fs.writeFileSync(file, lines.join(nl) + (s.endsWith('\n') || s.endsWith('\r\n') ? '' : ''));
  // preserve trailing newline
  if (!fs.readFileSync(file, 'utf8').endsWith(nl) && (s.endsWith('\n') || s.endsWith('\r\n'))) {
    fs.appendFileSync(file, nl === '\r\n' ? '\r\n' : '\n');
  }
  console.log('inserted line in', file);
}

function replaceOnce(file, from, to) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(to) && !s.includes(from)) {
    console.log('skip replace', file);
    return;
  }
  if (!s.includes(from)) throw new Error(`replace from missing in ${file}`);
  s = s.replace(from, to);
  fs.writeFileSync(file, s);
  console.log('replaced in', file);
}

// 1) Registry patches
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

// 2) Brain
const changelog = `### 2026-11-17 — Present Value of Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Present Value of Annuity Calculator on existing catalog slug \`present-value-of-annuity-calculator\` (\`PresentValueOfAnnuityCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffaf\`). Payment, interest rate, term yrs/mos, compound/payment frequency, ordinary/due radios, present-value result; Growth rate and additional information: growth %, term years, periods, equivalent rates. Share/Reload/Clear/feedback. Activated.
- **Formulas:** i = (1+r/m)^(m/q)−1 (discrete) or e^(r/q)−1 (continuous); n = round(years×q). Ordinary PV = PMT×(1−(1+i)^(−n))/i; due ×(1+i); growing (g≠i) PMT/(i−g)×(1−((1+g)/(1+i))^n); g=i → PMT×n/(1+i); zero interest PV = PMT×n.
- **FX:** Independent currencies on payment + present value (FVA / Phase 2). Changing payment currency converts that amount; result currency re-expresses calculated PV. Rates/term/frequencies/growth never convert. \`CURRENCY_CONVERSION_SLUGS\` + stale/missing handling.
- **Example:** Payment 100 · 5% · 3 years · yearly · ordinary → PV ≈ 272.32; due ≈ 285.94.
- **Important Files:** \`frontend/src/tools/calculators/present-value-of-annuity/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-present-value-of-annuity-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.`;

prependChangelog('brain/CHANGELOG.md', changelog);

replaceOnce(
  'brain/CURRENT_STATE.md',
  '> **Primary Agent Starting Point.** Last verified: **2026-11-17** (Future Value of Annuity Calculator live at `/tools/future-value-of-annuity-calculator` with FX; Auto Loan remains master Tool Detail Page).',
  '> **Primary Agent Starting Point.** Last verified: **2026-11-17** (Present Value of Annuity Calculator live at `/tools/present-value-of-annuity-calculator` with FX; Auto Loan remains master Tool Detail Page).'
);

// If FVA line not present, try Growing Annuity verified line etc.
{
  let s = fs.readFileSync('brain/CURRENT_STATE.md', 'utf8');
  if (!s.includes('present-value-of-annuity-calculator` with FX')) {
    s = s.replace(
      /Last verified: \*\*2026-11-17\*\* \([^)]+\)/,
      'Last verified: **2026-11-17** (Present Value of Annuity Calculator live at `/tools/present-value-of-annuity-calculator` with FX; Auto Loan remains master Tool Detail Page)'
    );
    fs.writeFileSync('brain/CURRENT_STATE.md', s);
  }
}

if (!fs.readFileSync('brain/CURRENT_STATE.md', 'utf8').includes('Present Value of Annuity Calculator (`/tools/present-value-of-annuity-calculator`)')) {
  ensureLineAfter(
    'brain/CURRENT_STATE.md',
    'Future Value of Annuity Calculator (`/tools/future-value-of-annuity-calculator`)',
    `- **Present Value of Annuity Calculator (\`/tools/present-value-of-annuity-calculator\`):** Live client-side PVA (\`componentKey: 'PresentValueOfAnnuityCalculator'\`, catalog \`6af46f0fa27d8d1d4e98ffaf\`). Payment, rate, term yrs/mos, compound/payment frequency, ordinary/due; growth section with growth %, term years, periods, equivalent rates. Independent Phase 2 FX on payment + present value. Example 100 @ 5% / 3y yearly → ordinary ≈ 272.32; due ≈ 285.94. Activated.`,
    'Present Value of Annuity Calculator (`/tools/present-value-of-annuity-calculator`)'
  );
}

ensureLineAfter(
  'brain/FRONTEND.md',
  'future-value-of-annuity-calculator`). Payment/rate/term',
  `- \`src/tools/calculators/present-value-of-annuity/\`: Present Value of Annuity Calculator (\`PresentValueOfAnnuityCalculator\`, slug \`present-value-of-annuity-calculator\`). Payment/rate/term, compound & payment frequencies, ordinary/due, growth section; independent FX on payment + result; guide.`,
  'present-value-of-annuity-calculator`). Payment/rate/term'
);

ensureLineAfter(
  'brain/TASKS.md',
  'future-value-of-annuity-calculator` with ordinary/due',
  `| \`TOOL-373\` | Implement Present Value of Annuity Calculator on existing slug \`present-value-of-annuity-calculator\` with ordinary/due, compound/payment frequencies, growth section, independent FX, guide/SEO/embed, and verified activation | Cursor | Completed | \`frontend/src/tools/calculators/present-value-of-annuity/*\`, registry, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-present-value-of-annuity-tool.ts\`, \`brain/*\` | \`TOOL-368\` |`,
  'present-value-of-annuity-calculator` with ordinary/due'
);

// Verify keys present before commit
for (const f of [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'backend/src/modules/tools/tool.key.ts',
]) {
  const s = fs.readFileSync(f, 'utf8');
  if (!s.includes('PresentValueOfAnnuityCalculator')) {
    throw new Error(`PVA missing from ${f} before commit`);
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

execSync(`git add ${files.map((f) => `"${f}"`).join(' ')}`, {
  stdio: 'inherit',
  shell: true,
});

// Re-verify staged content includes PVA
const stagedKeys = execSync('git show :frontend/src/tools/registry/keys.ts', {
  encoding: 'utf8',
});
if (!stagedKeys.includes('PresentValueOfAnnuityCalculator')) {
  throw new Error('staged keys missing PVA');
}

execSync(
  'git commit -m "feat(calculator): implement present value of annuity with FX"',
  { stdio: 'inherit', shell: true }
);

const hash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
console.log('COMMIT', hash);

// Final verify worktree still has PVA (best-effort)
const keys = fs.readFileSync('frontend/src/tools/registry/keys.ts', 'utf8');
console.log('worktree has PVA', keys.includes('PresentValueOfAnnuityCalculator'));
