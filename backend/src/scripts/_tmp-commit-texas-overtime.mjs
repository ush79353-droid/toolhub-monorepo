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
  if (s.includes(label)) {
    console.log('skip', file, label);
    return;
  }
  const nl = detectNl(s);
  const needle = needleFactory(nl);
  const insert = insertFactory(nl);
  if (!s.includes(needle)) throw new Error(`missing needle in ${file}: ${JSON.stringify(needle)}`);
  fs.writeFileSync(file, s.split(needle).join(needle + insert));
  console.log('patched', file);
}

// Keys (both lists) — after TenureCalculator
insertOnce(
  'frontend/src/tools/registry/keys.ts',
  (nl) => `  'TenureCalculator',${nl}`,
  (nl) => `  'TexasOvertimeCalculator',${nl}`,
  'TexasOvertimeCalculator'
);
insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  (nl) => `  'TenureCalculator',${nl}`,
  (nl) => `  'TexasOvertimeCalculator',${nl}`,
  "'TexasOvertimeCalculator'"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  (nl) => `  'TenureCalculator',${nl}`,
  (nl) => `  'TexasOvertimeCalculator',${nl}`,
  "'TexasOvertimeCalculator'"
);
insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  (nl) => `    !isApprovedComponentKey('TenureCalculator') ||${nl}`,
  (nl) => `    !isApprovedComponentKey('TexasOvertimeCalculator') ||${nl}`,
  "isApprovedComponentKey('TexasOvertimeCalculator')"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  (nl) => `    !isApprovedComponentKey('TenureCalculator') ||${nl}`,
  (nl) => `    !isApprovedComponentKey('TexasOvertimeCalculator') ||${nl}`,
  "isApprovedComponentKey('TexasOvertimeCalculator')"
);

insertOnce(
  'frontend/src/tools/registry/index.ts',
  (nl) =>
    `  TenureCalculator: lazyTool(() =>${nl}` +
    `    import('@/tools/calculators/tenure/TenureCalculator').then((mod) => ({${nl}` +
    `      default: mod.TenureCalculator,${nl}` +
    `    })),${nl}` +
    `  ),${nl}`,
  (nl) =>
    `  TexasOvertimeCalculator: lazyTool(() =>${nl}` +
    `    import('@/tools/calculators/texas-overtime/TexasOvertimeCalculator').then((mod) => ({${nl}` +
    `      default: mod.TexasOvertimeCalculator,${nl}` +
    `    })),${nl}` +
    `  ),${nl}`,
  'TexasOvertimeCalculator:'
);

insertOnce(
  'frontend/src/tools/registry/details.ts',
  (nl) => `  TenureCalculator: () => import('@/tools/calculators/tenure/detail'),${nl}`,
  (nl) =>
    `  TexasOvertimeCalculator: () =>${nl}` +
    `    import('@/tools/calculators/texas-overtime/detail'),${nl}`,
  'TexasOvertimeCalculator:'
);

for (const f of [
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  insertOnce(
    f,
    (nl) => `  'florida-overtime-calculator',${nl}`,
    (nl) => `  'texas-overtime-calculator',${nl}`,
    'texas-overtime-calculator'
  );
}

// Brain
let changelog = fs.readFileSync('brain/CHANGELOG.md', 'utf8');
if (!changelog.includes('Texas Overtime Calculator (Screenshot-First + FX)')) {
  const marker =
    '> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.';
  const idx = changelog.indexOf(marker);
  if (idx < 0) throw new Error('changelog marker missing');
  const nl = detectNl(changelog);
  const block = `### 2026-11-17 — Texas Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped Texas Overtime Calculator on existing catalog slug \`texas-overtime-calculator\` (\`TexasOvertimeCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffb9\`). Regular work time + overtime + in-total sections; unit selectors; Share/Reload/Clear/feedback. Activated.
- **Formulas:** Regular monthly = hourly × weekly hours × 52/12; OT hourly = hourly × multiplier; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Pay/time unit normalization via weekly schedule.
- **FX:** Independent currencies on regular pay and each pay result (Margin Interest / Florida OT pattern). Hours and multiplier never convert. \`CURRENCY_CONVERSION_SLUGS\` + stale/missing handling.
- **Example:** 20/hr · 40 hrs/week · 1.5× · 10 OT hrs/month → regular ≈ 3,466.67; OT 300; total ≈ 3,766.67.
- **Important Files:** \`frontend/src/tools/calculators/texas-overtime/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-texas-overtime-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/tests omitted per user. No push.`;
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
  'Last verified: **2026-11-17** (Texas Overtime Calculator live at `/tools/texas-overtime-calculator` with FX; Auto Loan remains master Tool Detail Page)'
);
if (!state.includes('Texas Overtime Calculator (`/tools/texas-overtime-calculator`)')) {
  const anchors = [
    'Florida Overtime Calculator (`/tools/florida-overtime-calculator`)',
    'California Overtime Calculator (`/tools/california-overtime-calculator`)',
    'Illinois Overtime Calculator (`/tools/illinois-overtime-calculator`)',
  ];
  let inserted = false;
  for (const anchor of anchors) {
    const i = state.indexOf(anchor);
    if (i >= 0) {
      const lineEnd = state.indexOf('\n', i);
      state =
        state.slice(0, lineEnd) +
        "\n- **Texas Overtime Calculator (`/tools/texas-overtime-calculator`):** Live OT estimator (`TexasOvertimeCalculator`, catalog `6af46f0fa27d8d1d4e98ffb9`). Regular + OT + total; unit selectors; Phase 2 FX. Example 20/hr · 40/wk · 1.5× · 10 OT hrs/mo → ≈ 3,766.67. Activated." +
        state.slice(lineEnd);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    console.log('warn: no CURRENT_STATE OT anchor; verified line only');
  }
}
fs.writeFileSync('brain/CURRENT_STATE.md', state);

let fe = fs.readFileSync('brain/FRONTEND.md', 'utf8');
if (!fe.includes('texas-overtime-calculator')) {
  const needles = ['florida-overtime-calculator', 'california-overtime-calculator'];
  for (const needle of needles) {
    const idx = fe.indexOf(needle);
    if (idx >= 0) {
      const lineEnd = fe.indexOf('\n', idx);
      fe =
        fe.slice(0, lineEnd + 1) +
        '- `src/tools/calculators/texas-overtime/`: Texas Overtime Calculator (`TexasOvertimeCalculator`, slug `texas-overtime-calculator`). Regular/OT/total with unit selectors and independent FX; guide.\n' +
        fe.slice(lineEnd + 1);
      fs.writeFileSync('brain/FRONTEND.md', fe);
      break;
    }
  }
}

let tasks = fs.readFileSync('brain/TASKS.md', 'utf8');
if (!tasks.includes('texas-overtime-calculator` with')) {
  const row =
    '| `TOOL-374` | Implement Texas Overtime Calculator on existing slug `texas-overtime-calculator` with regular/OT/total sections, unit selectors, independent FX, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/texas-overtime/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-texas-overtime-tool.ts`, `brain/*` | `TOOL-373` |';
  const needles = ['florida-overtime-calculator', 'illinois-overtime-calculator', 'california-overtime-calculator'];
  let done = false;
  for (const needle of needles) {
    const i = tasks.indexOf(needle);
    if (i >= 0) {
      const lineEnd = tasks.indexOf('\n', i);
      tasks = tasks.slice(0, lineEnd + 1) + row + '\n' + tasks.slice(lineEnd + 1);
      done = true;
      break;
    }
  }
  if (!done) tasks += '\n' + row + '\n';
  fs.writeFileSync('brain/TASKS.md', tasks);
}

for (const f of [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'backend/src/modules/tools/tool.key.ts',
]) {
  if (!fs.readFileSync(f, 'utf8').includes('TexasOvertimeCalculator')) {
    throw new Error('missing ' + f);
  }
}
if (!fs.existsSync('frontend/src/tools/calculators/texas-overtime/TexasOvertimeCalculator.tsx')) {
  throw new Error('module missing');
}

const files = [
  'frontend/src/tools/calculators/texas-overtime',
  'backend/src/scripts/assign-texas-overtime-tool.ts',
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

sh('git add ' + files.map((f) => JSON.stringify(f)).join(' '));

const staged = out('git diff --cached --name-only');
const forbidden = staged
  .split(/\r?\n/)
  .filter(Boolean)
  .filter(
    (p) =>
      p.includes('immediate-annuity') ||
      p.includes('florida-overtime/') ||
      p.includes('georgia-overtime/') ||
      p.includes('california-overtime/') ||
      p.includes('illinois-overtime/') ||
      p.includes('new-york-overtime/') ||
      p.includes('operating-margin') ||
      p.includes('margin-calculator-classic')
  );
if (forbidden.length) throw new Error('forbidden staged: ' + forbidden.join(', '));
if (!out('git show :frontend/src/tools/registry/keys.ts').includes('TexasOvertimeCalculator')) {
  throw new Error('staged keys missing Texas');
}
if (!staged.includes('texas-overtime')) throw new Error('module not staged');

sh('git commit -m "feat(calculator): implement texas overtime calculator with FX"');
console.log('COMMIT', out('git rev-parse HEAD'));
console.log(out('git show --name-only --pretty=format: HEAD'));
