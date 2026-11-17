import { execSync } from 'node:child_process';
import fs from 'node:fs';

function head(path) {
  return execSync(`git show HEAD:${path}`, { encoding: 'utf8' });
}

function patchKeys(t) {
  const old = "  'PerpetuityCalculator',\n  'PreAndPostMoneyValuationCalculator',";
  const neu =
    "  'PerpetuityCalculator',\n  'PostJudgmentInterestCalculator',\n  'PreAndPostMoneyValuationCalculator',";
  if (t.includes("'PostJudgmentInterestCalculator'")) return t;
  const c = t.split(old).length - 1;
  if (c !== 2) throw new Error(`keys needles=${c}`);
  return t.split(old).join(neu);
}

function patchToolKey(t) {
  if (t.includes("'PostJudgmentInterestCalculator'")) return t;
  let out = t.replace(
    "  'PerpetuityCalculator',\n  'PreAndPostMoneyValuationCalculator',",
    "  'PerpetuityCalculator',\n  'PostJudgmentInterestCalculator',\n  'PreAndPostMoneyValuationCalculator',"
  );
  out = out.replace(
    "    !isApprovedComponentKey('PerpetuityCalculator') ||\n    !isApprovedComponentKey('PreAndPostMoneyValuationCalculator') ||",
    "    !isApprovedComponentKey('PerpetuityCalculator') ||\n    !isApprovedComponentKey('PostJudgmentInterestCalculator') ||\n    !isApprovedComponentKey('PreAndPostMoneyValuationCalculator') ||"
  );
  if (!out.includes("'PostJudgmentInterestCalculator'")) {
    throw new Error('tool.key patch failed');
  }
  return out;
}

function patchIndex(t) {
  if (t.includes('PostJudgmentInterestCalculator:')) return t;
  const needle = `  PerpetuityCalculator: lazyTool(() =>
    import('@/tools/calculators/perpetuity/PerpetuityCalculator').then((mod) => ({
      default: mod.PerpetuityCalculator,
    })),
  ),
  PreAndPostMoneyValuationCalculator:`;
  const insert = `  PerpetuityCalculator: lazyTool(() =>
    import('@/tools/calculators/perpetuity/PerpetuityCalculator').then((mod) => ({
      default: mod.PerpetuityCalculator,
    })),
  ),
  PostJudgmentInterestCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/post-judgment-interest/PostJudgmentInterestCalculator'
    ).then((mod) => ({
      default: mod.PostJudgmentInterestCalculator,
    })),
  ),
  PreAndPostMoneyValuationCalculator:`;
  if (!t.includes(needle)) throw new Error('index needle missing');
  return t.replace(needle, insert);
}

function patchDetails(t) {
  if (t.includes('PostJudgmentInterestCalculator:')) return t;
  const needle = `  PerpetuityCalculator: () =>
    import('@/tools/calculators/perpetuity/detail'),
  PreAndPostMoneyValuationCalculator:`;
  const insert = `  PerpetuityCalculator: () =>
    import('@/tools/calculators/perpetuity/detail'),
  PostJudgmentInterestCalculator: () =>
    import('@/tools/calculators/post-judgment-interest/detail'),
  PreAndPostMoneyValuationCalculator:`;
  if (!t.includes(needle)) throw new Error('details needle missing');
  return t.replace(needle, insert);
}

function patchSitemap(t) {
  const old =
    "  'perpetuity-calculator',\n  'pre-and-post-money-valuation-calculator',";
  const neu =
    "  'perpetuity-calculator',\n  'post-judgment-interest-calculator',\n  'pre-and-post-money-valuation-calculator',";
  if (t.includes('post-judgment-interest-calculator')) return t;
  if (!t.includes(old)) throw new Error('sitemap needle missing');
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
];

for (const [path, fn] of jobs) {
  const wt = fs.readFileSync(path, 'utf8');
  const patched = fn(head(path));
  fs.writeFileSync(path, patched);
  execSync(`git add -- ${path}`, { stdio: 'inherit' });
  fs.writeFileSync(path, wt);
  console.log('staged clean', path);
}
