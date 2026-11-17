import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// 1) re-wire
const wire = spawnSync(process.execPath, ['backend/src/scripts/_tmp-wire-salary-overtime.mjs'], {
  stdio: 'inherit',
  cwd: process.cwd(),
});
if (wire.status !== 0) process.exit(wire.status || 1);

// 2) brain patches (idempotent)
function ensureContains(file, needle, insertAfterNeedle, insertText) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(insertText.trim().slice(0, 80))) {
    console.log('brain skip existing snippet', file);
    return;
  }
  if (!s.includes(needle)) {
    console.log('brain warn needle missing', file);
    return;
  }
  s = s.replace(needle, insertAfterNeedle ? needle + insertText : insertText + needle);
  fs.writeFileSync(file, s);
  console.log('brain patched', file);
}

{
  const file = 'brain/CURRENT_STATE.md';
  let s = fs.readFileSync(file, 'utf8');
  s = s.replace(
    /> \*\*Primary Agent Starting Point\.\*\* Last verified: \*\*2026-11-17\*\* \([^)]+\)\./,
    '> **Primary Agent Starting Point.** Last verified: **2026-11-17** (Salary Calculator With Overtime live at `/tools/salary-calculator-with-overtime` with FX; Auto Loan remains master Tool Detail Page).'
  );
  if (!s.includes('Salary Calculator With Overtime (`/tools/salary-calculator-with-overtime`)')) {
    const anchor = '- **Overtime Calculator (`/tools/overtime-calculator`):';
    const bullet =
      "- **Salary Calculator With Overtime (`/tools/salary-calculator-with-overtime`):** Live client-side overtime salary estimate (`componentKey: 'SalaryWithOvertimeCalculator'`, catalog `6af46f0fa27d8d1d4e98ffb8`). Screenshot-First (ADR-023): Regular worktime + Overtime + In total. Defaults PKR/hour, hours/month, multiplier 1.5. Independent Phase 2 FX; hours/multiplier never convert. Example: 500/hr × 160 hr/mo × 1.5 × 20 OT hr/mo → 95,000 total. Activated.\n";
    if (s.includes(anchor)) s = s.replace(anchor, bullet + anchor);
  }
  fs.writeFileSync(file, s);
  console.log('brain CURRENT_STATE updated');
}

{
  const file = 'brain/TASKS.md';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes('salary-calculator-with-overtime')) {
    const row =
      "| `TOOL-380` | Implement Salary Calculator With Overtime on existing slug `salary-calculator-with-overtime` with regular/OT/total sections, unit normalization, independent FX on money fields, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/salary-with-overtime/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-salary-with-overtime-tool.ts`, `brain/*` | `TOOL-379` |\n";
    // insert after table header row block — prepend near other TOOL-379
    const marker = '| `TOOL-379` |';
    if (s.includes(marker)) s = s.replace(marker, row + marker);
    else s = s + '\n' + row;
    fs.writeFileSync(file, s);
    console.log('brain TASKS updated');
  } else console.log('brain TASKS already has salary');
}

{
  const file = 'brain/CHANGELOG.md';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes('Salary Calculator With Overtime (Screenshot-First + FX)')) {
    const entry = `### 2026-11-17 — Salary Calculator With Overtime (Screenshot-First + FX)
- **Summary:** Shipped Salary Calculator With Overtime on existing catalog slug \`salary-calculator-with-overtime\` (\`SalaryWithOvertimeCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffb8\`). Collapsible Regular worktime + Overtime; In total; Share/Reload/Clear/feedback. Defaults hours/month. Activated.
- **Formulas:** OT hourly = regular hourly × multiplier; regular monthly = hourly × weekly hours × 52/12; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Blank OT hours → 0.
- **FX:** Independent currencies on monetary selectors; compute in regular-pay currency; display rounding only. Hours/units/multiplier never convert. \`CURRENCY_CONVERSION_SLUGS\` wired.
- **Example:** 500/hr × 160 hr/month × 1.5 × 20 OT hr/month → OT rate 750; regular 80,000; OT 15,000; total 95,000.
- **Important Files:** \`frontend/src/tools/calculators/salary-with-overtime/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-salary-with-overtime-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
    s = entry + s;
    fs.writeFileSync(file, s);
    console.log('brain CHANGELOG updated');
  } else console.log('brain CHANGELOG already has salary');
}

{
  const file = 'brain/FRONTEND.md';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes('salary-with-overtime/')) {
    const line =
      "- `src/tools/calculators/salary-with-overtime/`: Salary Calculator With Overtime (`SalaryWithOvertimeCalculator`, slug `salary-calculator-with-overtime`). Regular worktime/OT/total sections; unit normalization; independent Phase 2 FX on money fields; guide.\n";
    const anchor = '- `src/tools/calculators/overtime/`:';
    if (s.includes(anchor)) s = s.replace(anchor, line + anchor);
    else s += '\n' + line;
    fs.writeFileSync(file, s);
    console.log('brain FRONTEND updated');
  } else console.log('brain FRONTEND already has salary');
}

// 3) final verify before stage
const checks = [
  ['frontend/src/tools/registry/keys.ts', 'SalaryWithOvertimeCalculator'],
  ['frontend/src/tools/registry/index.ts', 'SalaryWithOvertimeCalculator'],
  ['frontend/src/tools/registry/details.ts', 'SalaryWithOvertimeCalculator'],
  ['backend/src/modules/tools/tool.key.ts', 'SalaryWithOvertimeCalculator'],
  ['frontend/src/app/sitemap.ts', 'salary-calculator-with-overtime'],
  [
    'frontend/src/app/(website)/tools/[slug]/page.tsx',
    'salary-calculator-with-overtime',
  ],
  ['frontend/src/app/embed/[slug]/page.tsx', 'salary-calculator-with-overtime'],
  [
    'frontend/src/tools/calculators/salary-with-overtime/SalaryWithOvertimeCalculator.tsx',
    'SalaryWithOvertimeCalculator',
  ],
];
for (const [file, token] of checks) {
  const n = fs.readFileSync(file, 'utf8').split(token).length - 1;
  console.log(`VERIFY ${file}: x${n}`);
  if (n < 1) throw new Error(`missing ${token} in ${file}`);
}

// 4) stage only this delivery
const files = [
  'frontend/src/tools/calculators/salary-with-overtime',
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/tool.key.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'backend/src/modules/tools/tool.key.ts',
  'backend/src/scripts/assign-salary-with-overtime-tool.ts',
  'brain/CURRENT_STATE.md',
  'brain/TASKS.md',
  'brain/CHANGELOG.md',
  'brain/FRONTEND.md',
];

const add = spawnSync('git', ['add', '--', ...files], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: true,
});
if (add.status !== 0) process.exit(add.status || 1);

// re-verify staged content still has key (race window)
const stagedKeys = spawnSync('git', ['show', ':frontend/src/tools/registry/keys.ts'], {
  encoding: 'utf8',
  cwd: process.cwd(),
  shell: true,
});
if (!stagedKeys.stdout.includes('SalaryWithOvertimeCalculator')) {
  throw new Error('staged keys.ts lost SalaryWithOvertimeCalculator — abort commit');
}
const stagedIndex = spawnSync('git', ['show', ':frontend/src/tools/registry/index.ts'], {
  encoding: 'utf8',
  cwd: process.cwd(),
  shell: true,
});
if (!stagedIndex.stdout.includes('SalaryWithOvertimeCalculator')) {
  throw new Error('staged index.ts lost SalaryWithOvertimeCalculator — abort commit');
}

const msg = 'feat(calculator): implement salary calculator with overtime and FX\n';
const commit = spawnSync('git', ['commit', '-m', msg], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: true,
});
if (commit.status !== 0) process.exit(commit.status || 1);

const hash = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
  encoding: 'utf8',
  cwd: process.cwd(),
  shell: true,
});
console.log('COMMIT', hash.stdout.trim());
