import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

function run(cmd, args, opts = {}) {
  const { shell: shellOpt, ...rest } = opts;
  const useShell = shellOpt ?? cmd === 'git';
  const res = spawnSync(cmd, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: useShell,
    ...rest,
  });
  if (res.status !== 0) {
    if (res.stdout) process.stdout.write(res.stdout);
    if (res.stderr) process.stderr.write(res.stderr);
    throw new Error(`${cmd} ${args.join(' ')} failed with ${res.status}`);
  }
  return res;
}

// wire
run(process.execPath, ['backend/src/scripts/_tmp-wire-salary-overtime.mjs'], {
  stdio: 'inherit',
});

// brain ensure
{
  let s = fs.readFileSync('brain/CURRENT_STATE.md', 'utf8');
  s = s.replace(
    /> \*\*Primary Agent Starting Point\.\*\* Last verified: \*\*2026-11-17\*\* \([^)]+\)\./,
    '> **Primary Agent Starting Point.** Last verified: **2026-11-17** (Salary Calculator With Overtime live at `/tools/salary-calculator-with-overtime` with FX; Auto Loan remains master Tool Detail Page).'
  );
  if (!s.includes('salary-calculator-with-overtime')) {
    const anchor = '- **Overtime Calculator (`/tools/overtime-calculator`):';
    const bullet =
      "- **Salary Calculator With Overtime (`/tools/salary-calculator-with-overtime`):** Live client-side overtime salary estimate (`componentKey: 'SalaryWithOvertimeCalculator'`, catalog `6af46f0fa27d8d1d4e98ffb8`). Regular worktime + Overtime + In total; hours/month defaults; Phase 2 FX. Example: 500/hr × 160 hr/mo × 1.5 × 20 OT → 95,000. Activated.\n";
    if (s.includes(anchor)) s = s.replace(anchor, bullet + anchor);
  }
  fs.writeFileSync('brain/CURRENT_STATE.md', s);
}
{
  let s = fs.readFileSync('brain/TASKS.md', 'utf8');
  if (!s.includes('salary-calculator-with-overtime')) {
    const row =
      "| `TOOL-380` | Implement Salary Calculator With Overtime on existing slug `salary-calculator-with-overtime` with regular/OT/total sections, unit normalization, independent FX, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/salary-with-overtime/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-salary-with-overtime-tool.ts`, `brain/*` | `TOOL-379` |\n";
    const marker = '| `TOOL-379` |';
    s = s.includes(marker) ? s.replace(marker, row + marker) : s + '\n' + row;
    fs.writeFileSync('brain/TASKS.md', s);
  }
}
{
  let s = fs.readFileSync('brain/CHANGELOG.md', 'utf8');
  if (!s.includes('Salary Calculator With Overtime (Screenshot-First + FX)')) {
    s =
      `### 2026-11-17 — Salary Calculator With Overtime (Screenshot-First + FX)
- **Summary:** Shipped Salary Calculator With Overtime on existing catalog slug \`salary-calculator-with-overtime\` (\`SalaryWithOvertimeCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffb8\`). Activated. Defaults hours/month.
- **Formulas:** regular monthly = hourly × weekly hours × 52/12; OT hourly = hourly × multiplier; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Blank OT → 0.
- **FX:** Independent money FX via \`CURRENCY_CONVERSION_SLUGS\`; hours/multiplier never convert.
- **Example:** 500/hr × 160 hr/mo × 1.5 × 20 OT → 95,000 total.
- **Verification:** Mongo activated. Lint/tests/build omitted per user. No push/pull/sync.

` + s;
    fs.writeFileSync('brain/CHANGELOG.md', s);
  }
}
{
  let s = fs.readFileSync('brain/FRONTEND.md', 'utf8');
  if (!s.includes('salary-with-overtime/')) {
    const line =
      "- `src/tools/calculators/salary-with-overtime/`: Salary Calculator With Overtime (`SalaryWithOvertimeCalculator`, slug `salary-calculator-with-overtime`). Regular worktime/OT/total; unit normalization; Phase 2 FX; guide.\n";
    const anchor = '- `src/tools/calculators/overtime/`:';
    s = s.includes(anchor) ? s.replace(anchor, line + anchor) : s + '\n' + line;
    fs.writeFileSync('brain/FRONTEND.md', s);
  }
}

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

// reset any accidental staged unrelated paths first? keep other staged work untouched:
// only add our paths
const quoted = files.map((f) => (/[ ()[\]]/.test(f) ? `"${f}"` : f));
run('git', ['add', '--', ...quoted], { stdio: 'inherit' });

const keysStaged = run('git', ['show', ':frontend/src/tools/registry/keys.ts']).stdout;
if (!keysStaged.includes('SalaryWithOvertimeCalculator')) {
  throw new Error('staged keys missing SalaryWithOvertimeCalculator');
}
const indexStaged = run('git', ['show', ':frontend/src/tools/registry/index.ts']).stdout;
if (!indexStaged.includes('SalaryWithOvertimeCalculator')) {
  throw new Error('staged index missing SalaryWithOvertimeCalculator');
}
const detailsStaged = run('git', ['show', ':frontend/src/tools/registry/details.ts']).stdout;
if (!detailsStaged.includes('SalaryWithOvertimeCalculator')) {
  throw new Error('staged details missing SalaryWithOvertimeCalculator');
}
const backendStaged = run('git', ['show', ':backend/src/modules/tools/tool.key.ts']).stdout;
if (!backendStaged.includes('SalaryWithOvertimeCalculator')) {
  throw new Error('staged backend tool.key missing SalaryWithOvertimeCalculator');
}
const moduleStaged = run('git', [
  'diff',
  '--cached',
  '--name-only',
  '--',
  'frontend/src/tools/calculators/salary-with-overtime',
]).stdout;
if (!moduleStaged.includes('SalaryWithOvertimeCalculator.tsx')) {
  throw new Error('salary module not staged');
}

const msgPath = '.git/COMMIT_MSG_SALARY_OT';
fs.writeFileSync(
  msgPath,
  'feat(calculator): implement salary calculator with overtime and FX\n'
);
try {
  // Pathspec commit: only our files, leave other agents' staged paths alone.
  run('git', ['commit', '-F', msgPath, '--', ...quoted], { stdio: 'inherit' });
} finally {
  try {
    fs.unlinkSync(msgPath);
  } catch {
    /* ignore */
  }
}

const hash = run('git', ['rev-parse', 'HEAD']).stdout.trim();
const short = run('git', ['rev-parse', '--short', 'HEAD']).stdout.trim();
const subject = run('git', ['log', '-1', '--format=%s']).stdout.trim();
const names = run('git', ['show', '--name-only', '--pretty=format:', 'HEAD']).stdout;
console.log(JSON.stringify({ hash, short, subject }, null, 2));
console.log(names);

if (!names.includes('salary-with-overtime/SalaryWithOvertimeCalculator.tsx')) {
  throw new Error('HEAD commit missing salary module files');
}
if (names.includes('gross-rent-multiplier') || names.includes('assign-overtime-tool')) {
  throw new Error('HEAD commit unexpectedly includes unrelated tools');
}
const keysHead = run('git', ['show', 'HEAD:frontend/src/tools/registry/keys.ts']).stdout;
if (!keysHead.includes('SalaryWithOvertimeCalculator')) {
  throw new Error('HEAD keys lost SalaryWithOvertimeCalculator');
}
console.log('COMMIT OK');
