import { execSync } from 'node:child_process';
import fs from 'node:fs';

function head(path) {
  return execSync(`git show HEAD:${path}`, { encoding: 'utf8' });
}

function patchKeys(t) {
  const old = "  'NetDebtCalculator',\n  'NopatCalculator',";
  const neu =
    "  'NetDebtCalculator',\n  'NewYorkOvertimeCalculator',\n  'NopatCalculator',";
  if (t.includes("'NewYorkOvertimeCalculator'")) return t;
  const c = t.split(old).length - 1;
  if (c !== 2) throw new Error(`keys needles=${c}`);
  return t.split(old).join(neu);
}

function patchToolKey(t) {
  if (t.includes("'NewYorkOvertimeCalculator'")) return t;
  let out = t.replace(
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
  const old = "  'net-debt-calculator',\n  'nopat-calculator',";
  const neu =
    "  'net-debt-calculator',\n  'new-york-overtime-calculator',\n  'nopat-calculator',";
  if (t.includes('new-york-overtime-calculator')) return t;
  if (!t.includes(old)) throw new Error('sitemap needle missing');
  return t.replace(old, neu);
}

function patchFxSlugs(t) {
  const old = "  'net-debt-calculator',\n  'nopat-calculator',";
  const neu =
    "  'net-debt-calculator',\n  'new-york-overtime-calculator',\n  'nopat-calculator',";
  if (t.includes("'new-york-overtime-calculator'")) return t;
  if (!t.includes(old)) throw new Error('FX slug needle missing');
  return t.replace(old, neu);
}

const jobs = [
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

const staged = [];
for (const [path, fn] of jobs) {
  const wt = fs.readFileSync(path, 'utf8');
  const patchedHead = fn(head(path));
  fs.writeFileSync(path, patchedHead);
  execSync(`git add -- "${path}"`, { stdio: 'inherit' });
  staged.push(path);

  let finalWt;
  try {
    finalWt = fn(wt);
  } catch {
    if (
      wt.includes('NewYorkOvertimeCalculator') ||
      wt.includes("'new-york-overtime-calculator'")
    ) {
      finalWt = wt;
    } else {
      // Keep colleague WIP; staged index already has clean HEAD+NY patch.
      finalWt = wt;
      console.warn('WT restore skipped (needle drift); leaving original WT', path);
    }
  }
  fs.writeFileSync(path, finalWt);
  console.log('staged clean + restored WT', path);
}

console.log('STAGED_REGISTRY', staged.join('\n'));
