import { execSync } from 'node:child_process';
import fs from 'node:fs';

function head(path) {
  return execSync(`git show HEAD:${path}`, { encoding: 'utf8' });
}

function patchKeys(t) {
  const old = "  'MvaCalculator',\n  'NopatCalculator',";
  const neu = "  'MvaCalculator',\n  'NetDebtCalculator',\n  'NopatCalculator',";
  if (t.includes("'NetDebtCalculator'")) return t;
  const c = t.split(old).length - 1;
  if (c !== 2) throw new Error(`keys needles=${c}`);
  return t.split(old).join(neu);
}

function patchToolKey(t) {
  if (t.includes("'NetDebtCalculator'")) return t;
  let out = t.replace(
    "  'MvaCalculator',\n  'NopatCalculator',",
    "  'MvaCalculator',\n  'NetDebtCalculator',\n  'NopatCalculator',"
  );
  out = out.replace(
    "    !isApprovedComponentKey('MvaCalculator') ||\n    !isApprovedComponentKey('NopatCalculator') ||",
    "    !isApprovedComponentKey('MvaCalculator') ||\n    !isApprovedComponentKey('NetDebtCalculator') ||\n    !isApprovedComponentKey('NopatCalculator') ||"
  );
  if (!out.includes("'NetDebtCalculator'")) {
    throw new Error('tool.key patch failed');
  }
  return out;
}

function patchIndex(t) {
  if (t.includes('NetDebtCalculator:')) return t;
  const needle = `  MvaCalculator: lazyTool(() =>
    import('@/tools/calculators/mva/MvaCalculator').then((mod) => ({
      default: mod.MvaCalculator,
    })),
  ),
  NopatCalculator:`;
  const insert = `  MvaCalculator: lazyTool(() =>
    import('@/tools/calculators/mva/MvaCalculator').then((mod) => ({
      default: mod.MvaCalculator,
    })),
  ),
  NetDebtCalculator: lazyTool(() =>
    import('@/tools/calculators/net-debt/NetDebtCalculator').then((mod) => ({
      default: mod.NetDebtCalculator,
    })),
  ),
  NopatCalculator:`;
  if (!t.includes(needle)) throw new Error('index needle missing');
  return t.replace(needle, insert);
}

function patchDetails(t) {
  if (t.includes('NetDebtCalculator:')) return t;
  const needle = `  MvaCalculator: () =>
    import('@/tools/calculators/mva/detail'),
  NopatCalculator:`;
  const insert = `  MvaCalculator: () =>
    import('@/tools/calculators/mva/detail'),
  NetDebtCalculator: () =>
    import('@/tools/calculators/net-debt/detail'),
  NopatCalculator:`;
  if (!t.includes(needle)) throw new Error('details needle missing');
  return t.replace(needle, insert);
}

function patchSitemap(t) {
  const old = "  'mva-calculator',\n  'nopat-calculator',";
  const neu = "  'mva-calculator',\n  'net-debt-calculator',\n  'nopat-calculator',";
  if (t.includes('net-debt-calculator')) return t;
  if (!t.includes(old)) throw new Error('sitemap needle missing');
  return t.replace(old, neu);
}

function patchFxSlugs(t) {
  const old = "  'mutual-fund-calculator',\n  'nopat-calculator',";
  const neu =
    "  'mutual-fund-calculator',\n  'net-debt-calculator',\n  'nopat-calculator',";
  if (t.includes("'net-debt-calculator'")) return t;
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

for (const [path, fn] of jobs) {
  const wt = fs.readFileSync(path, 'utf8');
  const patchedHead = fn(head(path));
  fs.writeFileSync(path, patchedHead);
  execSync(`git add -- "${path}"`, { stdio: 'inherit' });

  let finalWt;
  try {
    finalWt = fn(wt);
  } catch (err) {
    if (
      wt.includes('NetDebtCalculator') ||
      wt.includes("'net-debt-calculator'")
    ) {
      finalWt = wt;
    } else {
      throw new Error(`Cannot restore WT with NetDebt for ${path}: ${err.message}`);
    }
  }
  fs.writeFileSync(path, finalWt);
  console.log('staged clean + restored WT', path);
}
