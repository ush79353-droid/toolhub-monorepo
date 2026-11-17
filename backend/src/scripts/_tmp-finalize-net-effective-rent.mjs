import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pathJoin = path.join;

function run(cmd) {
  console.log('>', cmd);
  execSync(cmd, { stdio: 'inherit', cwd: root, shell: true });
}

function head(path) {
  return execSync(`git show HEAD:${path}`, { encoding: 'utf8', cwd: root });
}

function patchKeys(t) {
  if (t.includes("'NetEffectiveRentCalculator'")) return t;
  const old = "  'NetDebtCalculator',\n  'NewYorkOvertimeCalculator',";
  const neu =
    "  'NetDebtCalculator',\n  'NetEffectiveRentCalculator',\n  'NewYorkOvertimeCalculator',";
  const c = t.split(old).length - 1;
  if (c !== 2) throw new Error(`keys needles=${c}`);
  return t.split(old).join(neu);
}

function patchToolKey(t) {
  if (t.includes("'NetEffectiveRentCalculator'")) return t;
  let out = t.replaceAll(
    "  'NetDebtCalculator',\n  'NewYorkOvertimeCalculator',",
    "  'NetDebtCalculator',\n  'NetEffectiveRentCalculator',\n  'NewYorkOvertimeCalculator',"
  );
  out = out.replace(
    "    !isApprovedComponentKey('NetDebtCalculator') ||\n    !isApprovedComponentKey('NewYorkOvertimeCalculator') ||",
    "    !isApprovedComponentKey('NetDebtCalculator') ||\n    !isApprovedComponentKey('NetEffectiveRentCalculator') ||\n    !isApprovedComponentKey('NewYorkOvertimeCalculator') ||"
  );
  if (!out.includes("'NetEffectiveRentCalculator'")) {
    throw new Error('tool.key patch failed');
  }
  return out;
}

function patchIndex(t) {
  if (t.includes('NetEffectiveRentCalculator:')) return t;
  const needle = `  NetDebtCalculator: lazyTool(() =>
    import('@/tools/calculators/net-debt/NetDebtCalculator').then((mod) => ({
      default: mod.NetDebtCalculator,
    })),
  ),
  NewYorkOvertimeCalculator:`;
  const insert = `  NetDebtCalculator: lazyTool(() =>
    import('@/tools/calculators/net-debt/NetDebtCalculator').then((mod) => ({
      default: mod.NetDebtCalculator,
    })),
  ),
  NetEffectiveRentCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/net-effective-rent/NetEffectiveRentCalculator'
    ).then((mod) => ({
      default: mod.NetEffectiveRentCalculator,
    })),
  ),
  NewYorkOvertimeCalculator:`;
  if (!t.includes(needle)) throw new Error('index needle missing');
  return t.replace(needle, insert);
}

function patchDetails(t) {
  if (t.includes('NetEffectiveRentCalculator:')) return t;
  const needle = `  NetDebtCalculator: () =>
    import('@/tools/calculators/net-debt/detail'),
  NewYorkOvertimeCalculator:`;
  const insert = `  NetDebtCalculator: () =>
    import('@/tools/calculators/net-debt/detail'),
  NetEffectiveRentCalculator: () =>
    import('@/tools/calculators/net-effective-rent/detail'),
  NewYorkOvertimeCalculator:`;
  if (!t.includes(needle)) throw new Error('details needle missing');
  return t.replace(needle, insert);
}

function patchSitemap(t) {
  if (t.includes('net-effective-rent-calculator')) return t;
  const old = "  'net-debt-calculator',\n  'new-york-overtime-calculator',";
  const neu =
    "  'net-debt-calculator',\n  'net-effective-rent-calculator',\n  'new-york-overtime-calculator',";
  if (!t.includes(old)) throw new Error('sitemap needle missing');
  return t.replace(old, neu);
}

function patchFxSlugs(t) {
  if (t.includes("'net-effective-rent-calculator'")) return t;
  const old = "  'net-debt-calculator',\n  'new-york-overtime-calculator',";
  const neu =
    "  'net-debt-calculator',\n  'net-effective-rent-calculator',\n  'new-york-overtime-calculator',";
  if (!t.includes(old)) throw new Error('FX slug needle missing');
  return t.replace(old, neu);
}

function ensureInText(t, fn, label) {
  try {
    return fn(t);
  } catch (err) {
    if (
      t.includes('NetEffectiveRentCalculator') ||
      t.includes("'net-effective-rent-calculator'")
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

run(
  'git reset HEAD -- frontend/src/tools/registry frontend/src/app/sitemap.ts "frontend/src/app/(website)/tools/[slug]/page.tsx" "frontend/src/app/embed/[slug]/page.tsx" backend/src/modules/tools/tool.key.ts brain frontend/src/tools/calculators/net-effective-rent backend/src/scripts/assign-net-effective-rent-tool.ts'
);

for (const [path, fn] of registryJobs) {
  const wt = fs.readFileSync(path, 'utf8');
  const patchedHead = fn(head(path));
  if (
    !patchedHead.includes('NetEffectiveRentCalculator') &&
    !patchedHead.includes('net-effective-rent-calculator')
  ) {
    throw new Error(`patched HEAD missing NER marker: ${path}`);
  }
  fs.writeFileSync(path, patchedHead);
  execSync(`git add -- "${path}"`, { stdio: 'inherit', cwd: root, shell: true });
  fs.writeFileSync(path, ensureInText(wt, fn, path));
  console.log('ok', path);
}

{
  const path = 'brain/CHANGELOG.md';
  const wt = fs.readFileSync(path, 'utf8');
  const h = head(path);
  const entry = `### 2026-11-17 — Net Effective Rent Calculator (Screenshot-First + FX)
- **Summary:** Shipped Net Effective Rent Calculator on existing catalog slug \`net-effective-rent-calculator\` (\`NetEffectiveRentCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffbd\`). Term/rent, tenant discounts, landlord expenses, monthly + annual NER results; Share/Reload/Clear/feedback. Area-based checkbox shown disabled (no area formula in reference). Activated.
- **Formulas:** Lease months = yrs×12+mos. Gross = rent×months. Net lease = gross − rent-free − allowance − (fixed op-ex + rent×% /100)×months. Monthly NER = net/months; annual = monthly×12.
- **FX:** Independent currencies on rent, allowance, op-ex, and both results; normalize into rent currency. Period mo/yr on rent/op-ex. % and month counts never convert.
- **Example:** 1y / 10,000 rent / 1 free / 5,000 allowance / 500 op-ex → monthly NER 8,250; annual 99,000.
- **Important Files:** \`frontend/src/tools/calculators/net-effective-rent/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-net-effective-rent-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
  function withEntry(src) {
    if (src.includes('### 2026-11-17 — Net Effective Rent Calculator')) return src;
    const marker = '---\n\n';
    const idx = src.indexOf(marker);
    if (idx < 0) return entry + src;
    return src.slice(0, idx + marker.length) + entry + src.slice(idx + marker.length);
  }
  fs.writeFileSync(path, withEntry(h));
  execSync(`git add -- "${path}"`, { stdio: 'inherit', cwd: root, shell: true });
  fs.writeFileSync(path, withEntry(wt));
}

{
  const path = 'brain/TASKS.md';
  const wt = fs.readFileSync(path, 'utf8');
  const h = head(path);
  const row =
    "| `TOOL-379` | Implement Net Effective Rent Calculator on existing slug `net-effective-rent-calculator` with term/discounts/expenses, monthly+annual NER, independent FX, disabled area toggle, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/net-effective-rent/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-net-effective-rent-tool.ts`, `brain/*` | `TOOL-378` |\n";
  function withRow(src) {
    if (src.includes('net-effective-rent-calculator') && src.includes('`TOOL-379`')) {
      return src;
    }
    const needles = [
      '| `TOOL-378` | Implement New York Overtime',
      '| `TOOL-376` | Implement Georgia Overtime',
      '| `TOOL-375` | Implement California Overtime',
      '| `TOOL-354` | Implement Net Debt',
    ];
    for (const needle of needles) {
      const i = src.indexOf(needle);
      if (i >= 0) {
        const lineEnd = src.indexOf('\n', i);
        return src.slice(0, lineEnd + 1) + row + src.slice(lineEnd + 1);
      }
    }
    throw new Error('TASKS needle missing');
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
    `- **Net Effective Rent Calculator (\`/tools/net-effective-rent-calculator\`):** Live client-side NER (\`componentKey: 'NetEffectiveRentCalculator'\`, catalog \`6af46f0fa27d8d1d4e98ffbd\`). Term + discounts + op-ex; monthly/annual results; independent FX; area toggle disabled (no area formula). Example: 10k/mo × 12 − 1 free − 5k − 500×12 → 8,250/mo. Activated.\n`;
  function withBullet(src) {
    if (src.includes('Net Effective Rent Calculator')) return src;
    const anchors = [
      '- **Net Debt Calculator',
      '- **New York Overtime Calculator',
      '- **Georgia Overtime Calculator',
    ];
    for (const anchor of anchors) {
      const i = src.indexOf(anchor);
      if (i >= 0) return src.slice(0, i) + bullet + src.slice(i);
    }
    throw new Error('CURRENT_STATE anchor missing');
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
    `- \`src/tools/calculators/net-effective-rent/\`: Net Effective Rent Calculator (\`NetEffectiveRentCalculator\`, slug \`net-effective-rent-calculator\`). Term/discounts/expenses; monthly+annual NER; independent Phase 2 FX; area toggle disabled; guide in \`detail.tsx\`.\n`;
  function withBullet(src) {
    if (src.includes('net-effective-rent')) return src;
    const anchor = '- `src/tools/calculators/net-debt/`';
    const i = src.indexOf(anchor);
    if (i < 0) throw new Error('FRONTEND anchor missing');
    const lineEnd = src.indexOf('\n', i);
    return src.slice(0, lineEnd + 1) + bullet + src.slice(lineEnd + 1);
  }
  fs.writeFileSync(path, withBullet(h));
  execSync(`git add -- "${path}"`, { stdio: 'inherit', cwd: root, shell: true });
  fs.writeFileSync(path, withBullet(wt));
}

run(
  'git add -- frontend/src/tools/calculators/net-effective-rent backend/src/scripts/assign-net-effective-rent-tool.ts'
);

const staged = execSync('git diff --cached --name-only', {
  encoding: 'utf8',
  cwd: root,
});
console.log('STAGED:\n' + staged);
if (!staged.includes('net-effective-rent')) throw new Error('module not staged');
if (!staged.includes('assign-net-effective-rent-tool.ts')) {
  throw new Error('assign script not staged');
}
const keysDiff = execSync('git diff --cached -- frontend/src/tools/registry/keys.ts', {
  encoding: 'utf8',
  cwd: root,
});
if (!keysDiff.includes('NetEffectiveRentCalculator')) {
  throw new Error('keys staged diff missing NetEffectiveRentCalculator');
}

// Ensure WT backend key has NER for assign isApprovedComponentKey
{
  const path = 'backend/src/modules/tools/tool.key.ts';
  const be = fs.readFileSync(path, 'utf8');
  if (!be.includes("'NetEffectiveRentCalculator'")) {
    fs.writeFileSync(path, patchToolKey(be));
  }
}

execSync('npx tsx src/scripts/assign-net-effective-rent-tool.ts', {
  stdio: 'inherit',
  cwd: pathJoin(root, 'backend'),
  shell: true,
});
run(
  'git commit -m "feat(calculator): implement net effective rent calculator with FX support"'
);
run('git rev-parse HEAD');
run('git show --stat --oneline -1');
