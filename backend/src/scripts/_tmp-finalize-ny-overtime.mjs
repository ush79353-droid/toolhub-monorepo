import { execSync } from 'node:child_process';
import fs from 'node:fs';

const root = process.cwd();

function run(cmd) {
  console.log('>', cmd);
  execSync(cmd, { stdio: 'inherit', cwd: root, shell: true });
}

function head(path) {
  return execSync(`git show HEAD:${path}`, { encoding: 'utf8', cwd: root });
}

function patchKeys(t) {
  if (t.includes("'NewYorkOvertimeCalculator'")) return t;
  const old = "  'NetDebtCalculator',\n  'NopatCalculator',";
  const neu =
    "  'NetDebtCalculator',\n  'NewYorkOvertimeCalculator',\n  'NopatCalculator',";
  const c = t.split(old).length - 1;
  if (c !== 2) throw new Error(`keys needles=${c}`);
  return t.split(old).join(neu);
}

function patchToolKey(t) {
  if (t.includes("'NewYorkOvertimeCalculator'")) return t;
  let out = t.replaceAll(
    "  'NetDebtCalculator',\n  'NopatCalculator',",
    "  'NetDebtCalculator',\n  'NewYorkOvertimeCalculator',\n  'NopatCalculator',"
  );
  out = out.replace(
    "    !isApprovedComponentKey('NetDebtCalculator') ||\n    !isApprovedComponentKey('NopatCalculator') ||",
    "    !isApprovedComponentKey('NetDebtCalculator') ||\n    !isApprovedComponentKey('NewYorkOvertimeCalculator') ||\n    !isApprovedComponentKey('NopatCalculator') ||"
  );
  if (!out.includes("'NewYorkOvertimeCalculator'")) {
    throw new Error('tool.key patch failed');
  }
  return out;
}

function patchIndex(t) {
  if (t.includes('NewYorkOvertimeCalculator:')) return t;
  const needle = `  NetDebtCalculator: lazyTool(() =>
    import('@/tools/calculators/net-debt/NetDebtCalculator').then((mod) => ({
      default: mod.NetDebtCalculator,
    })),
  ),
  NopatCalculator:`;
  const insert = `  NetDebtCalculator: lazyTool(() =>
    import('@/tools/calculators/net-debt/NetDebtCalculator').then((mod) => ({
      default: mod.NetDebtCalculator,
    })),
  ),
  NewYorkOvertimeCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/new-york-overtime/NewYorkOvertimeCalculator'
    ).then((mod) => ({
      default: mod.NewYorkOvertimeCalculator,
    })),
  ),
  NopatCalculator:`;
  if (!t.includes(needle)) throw new Error('index needle missing');
  return t.replace(needle, insert);
}

function patchDetails(t) {
  if (t.includes('NewYorkOvertimeCalculator:')) return t;
  const needle = `  NetDebtCalculator: () =>
    import('@/tools/calculators/net-debt/detail'),
  NopatCalculator:`;
  const insert = `  NetDebtCalculator: () =>
    import('@/tools/calculators/net-debt/detail'),
  NewYorkOvertimeCalculator: () =>
    import('@/tools/calculators/new-york-overtime/detail'),
  NopatCalculator:`;
  if (!t.includes(needle)) throw new Error('details needle missing');
  return t.replace(needle, insert);
}

function patchSitemap(t) {
  if (t.includes('new-york-overtime-calculator')) return t;
  const old = "  'net-debt-calculator',\n  'nopat-calculator',";
  const neu =
    "  'net-debt-calculator',\n  'new-york-overtime-calculator',\n  'nopat-calculator',";
  if (!t.includes(old)) throw new Error('sitemap needle missing');
  return t.replace(old, neu);
}

function patchFxSlugs(t) {
  if (t.includes("'new-york-overtime-calculator'")) return t;
  const old = "  'net-debt-calculator',\n  'nopat-calculator',";
  const neu =
    "  'net-debt-calculator',\n  'new-york-overtime-calculator',\n  'nopat-calculator',";
  if (!t.includes(old)) throw new Error('FX slug needle missing');
  return t.replace(old, neu);
}

function ensureNyInText(t, fn, label) {
  try {
    return fn(t);
  } catch (err) {
    if (
      t.includes('NewYorkOvertimeCalculator') ||
      t.includes("'new-york-overtime-calculator'")
    ) {
      return t;
    }
    throw new Error(`${label}: ${err.message}`);
  }
}

const registryJobs = [
  ['frontend/src/tools/registry/keys.ts', patchKeys],
  ['frontend/src/tools/registry/tool.key.ts', patchToolKey],
  ['backend/src/modules/tools/tool.key.ts', patchToolKey],
  ['frontend/src/tools/registry/index.ts', patchIndex],
  ['frontend/src/tools/registry/details.ts', patchDetails],
  ['frontend/src/tools/registry/sitemap.ts', patchSitemap],
  ['frontend/src/app/sitemap.ts', patchSitemap],
  ['frontend/src/app/(website)/tools/[slug]/page.tsx', patchFxSlugs],
  ['frontend/src/app/embed/[slug]/page.tsx', patchFxSlugs],
];

// Clear any prior staging for these paths only
run(
  'git reset HEAD -- frontend/src/tools/registry frontend/src/app/sitemap.ts "frontend/src/app/(website)/tools/[slug]/page.tsx" "frontend/src/app/embed/[slug]/page.tsx" backend/src/modules/tools/tool.key.ts'
);

for (const [path, fn] of registryJobs) {
  const wt = fs.readFileSync(path, 'utf8');
  const patchedHead = fn(head(path));
  if (
    !patchedHead.includes('NewYorkOvertimeCalculator') &&
    !patchedHead.includes('new-york-overtime-calculator')
  ) {
    throw new Error(`patched HEAD missing NY marker: ${path}`);
  }
  fs.writeFileSync(path, patchedHead);
  execSync(`git add -- "${path}"`, { stdio: 'inherit', cwd: root, shell: true });

  const finalWt = ensureNyInText(wt, fn, path);
  fs.writeFileSync(path, finalWt);
  console.log('ok', path);
}

// Brain: prepend changelog + tasks row on working copies, then stage from HEAD+patch
{
  const path = 'brain/CHANGELOG.md';
  const wt = fs.readFileSync(path, 'utf8');
  const h = head(path);
  const entry = `### 2026-11-17 — New York Overtime Calculator (Screenshot-First + FX)
- **Summary:** Shipped New York Overtime Calculator on existing catalog slug \`new-york-overtime-calculator\` (\`NewYorkOvertimeCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffb6\`). Regular work time + overtime + in-total sections; Share/Reload/Clear/feedback. Activated.
- **Formulas:** Regular monthly = hourly × weekly hours × 52/12; OT hourly = hourly × multiplier; OT monthly = OT hourly × monthly OT hours; total = regular + OT. Unit normalization for rate/duration/frequency; blank OT hours → 0; negative pay/hours rejected.
- **FX:** Independent currencies on all money selectors; normalize into regular-pay currency at full precision; display rounding only. Hours, time units, and multiplier never convert. Stale/missing rate handling via \`CURRENCY_CONVERSION_SLUGS\`.
- **Legal:** Estimate only — does not claim New York/FLSA eligibility or workweek compliance.
- **Example:** 20/hr × 40 hr/week × 1.5 × 10 OT hr/month → regular ≈ 3,466.67; OT rate 30; OT pay 300; total ≈ 3,766.67.
- **Important Files:** \`frontend/src/tools/calculators/new-york-overtime/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-new-york-overtime-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
  function withEntry(src) {
    if (src.includes('### 2026-11-17 — New York Overtime Calculator')) return src;
    const marker = '---\n\n';
    const idx = src.indexOf(marker);
    if (idx < 0) {
      // Some changelog copies omit the convention header block.
      return entry + src;
    }
    return src.slice(0, idx + marker.length) + entry + src.slice(idx + marker.length);
  }
  const patchedHead = withEntry(h);
  fs.writeFileSync(path, patchedHead);
  execSync(`git add -- "${path}"`, { stdio: 'inherit', cwd: root, shell: true });
  fs.writeFileSync(path, withEntry(wt));
}

{
  const path = 'brain/TASKS.md';
  const wt = fs.readFileSync(path, 'utf8');
  const h = head(path);
  const row =
    "| `TOOL-378` | Implement New York Overtime Calculator on existing slug `new-york-overtime-calculator` with regular/OT/total sections, unit normalization, independent FX on money fields, legal disclaimer, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/new-york-overtime/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-new-york-overtime-tool.ts`, `brain/*` | `TOOL-376` |\n";
  function withRow(src) {
    if (src.includes('new-york-overtime-calculator') && src.includes('`TOOL-378`')) {
      return src;
    }
    const needle =
      '| `TOOL-376` | Implement Georgia Overtime Calculator on existing slug `georgia-overtime-calculator`';
    const i = src.indexOf(needle);
    if (i < 0) {
      // fallback: append near other overtime tasks
      const alt = '| `TOOL-375` | Implement California Overtime Calculator';
      const j = src.indexOf(alt);
      if (j < 0) throw new Error('TASKS overtime needle missing');
      const lineEnd = src.indexOf('\n', j);
      return src.slice(0, lineEnd + 1) + row + src.slice(lineEnd + 1);
    }
    const lineEnd = src.indexOf('\n', i);
    return src.slice(0, lineEnd + 1) + row + src.slice(lineEnd + 1);
  }
  fs.writeFileSync(path, withRow(h));
  execSync(`git add -- "${path}"`, { stdio: 'inherit', cwd: root, shell: true });
  fs.writeFileSync(path, withRow(wt));
}

{
  const path = 'brain/CURRENT_STATE.md';
  const wt = fs.readFileSync(path, 'utf8');
  const h = head(path);
  const bullet =
    `- **New York Overtime Calculator (\`/tools/new-york-overtime-calculator\`):** Live client-side overtime estimate (\`componentKey: 'NewYorkOvertimeCalculator'\`, catalog \`6af46f0fa27d8d1d4e98ffb6\`). Regular work time + overtime + in total; independent real FX on money selectors; hours/multiplier never convert. Example: 20/hr × 40/wk × 1.5 × 10 OT hr/mo → ≈ 3,766.67 total. Estimate only — not NY/FLSA compliance. Activated.\n`;
  function withBullet(src) {
    if (src.includes('New York Overtime Calculator')) return src;
    const anchor = '- **Georgia Overtime Calculator';
    const i = src.indexOf(anchor);
    if (i >= 0) {
      return src.slice(0, i) + bullet + src.slice(i);
    }
    const alt = '- **Net Debt Calculator';
    const j = src.indexOf(alt);
    if (j < 0) throw new Error('CURRENT_STATE anchor missing');
    return src.slice(0, j) + bullet + src.slice(j);
  }
  fs.writeFileSync(path, withBullet(h));
  execSync(`git add -- "${path}"`, { stdio: 'inherit', cwd: root, shell: true });
  fs.writeFileSync(path, withBullet(wt));
}

{
  const path = 'brain/FRONTEND.md';
  const wt = fs.readFileSync(path, 'utf8');
  const h = head(path);
  const bullet =
    `- \`src/tools/calculators/new-york-overtime/\`: New York Overtime Calculator (\`NewYorkOvertimeCalculator\`, slug \`new-york-overtime-calculator\`). Regular/OT/total sections; independent Phase 2 FX on money fields; unit normalization; estimate-only legal disclaimer; guide in \`detail.tsx\`.\n`;
  function withBullet(src) {
    if (src.includes('new-york-overtime')) return src;
    const anchor = '- `src/tools/calculators/net-debt/`';
    const i = src.indexOf(anchor);
    if (i < 0) throw new Error('FRONTEND anchor missing');
    // insert after net-debt line
    const lineEnd = src.indexOf('\n', i);
    return src.slice(0, lineEnd + 1) + bullet + src.slice(lineEnd + 1);
  }
  fs.writeFileSync(path, withBullet(h));
  execSync(`git add -- "${path}"`, { stdio: 'inherit', cwd: root, shell: true });
  fs.writeFileSync(path, withBullet(wt));
}

run(
  'git add -- frontend/src/tools/calculators/new-york-overtime backend/src/scripts/assign-new-york-overtime-tool.ts'
);

const staged = execSync('git diff --cached --name-only', {
  encoding: 'utf8',
  cwd: root,
});
console.log('STAGED:\n' + staged);

const forbidden = staged
  .split(/\r?\n/)
  .filter(Boolean)
  .filter(
    (p) =>
      !p.includes('new-york-overtime') &&
      !p.includes('assign-new-york-overtime') &&
      !p.startsWith('brain/') &&
      !p.includes('registry/') &&
      !p.includes('sitemap.ts') &&
      !p.includes('page.tsx') &&
      !p.includes('tool.key.ts')
  );
if (forbidden.length) {
  throw new Error('Unexpected staged files: ' + forbidden.join(', '));
}
if (!staged.includes('NewYorkOvertimeCalculator.tsx')) {
  throw new Error('module not staged');
}
if (!staged.includes('NewYorkOvertime')) {
  // registry may use path without that string in name; check diff content
  const keysDiff = execSync('git diff --cached -- frontend/src/tools/registry/keys.ts', {
    encoding: 'utf8',
    cwd: root,
  });
  if (!keysDiff.includes('NewYorkOvertimeCalculator')) {
    throw new Error('keys staged diff missing NewYorkOvertimeCalculator');
  }
}

// Activate after backend tool.key has NY on disk
const be = fs.readFileSync('backend/src/modules/tools/tool.key.ts', 'utf8');
if (!be.includes("'NewYorkOvertimeCalculator'")) {
  fs.writeFileSync('backend/src/modules/tools/tool.key.ts', patchToolKey(be));
}
run('npx tsx backend/src/scripts/assign-new-york-overtime-tool.ts');

run('git commit -m "feat(calculator): implement new york overtime calculator with FX"');
run('git rev-parse HEAD');
run('git show --stat --oneline -1');
