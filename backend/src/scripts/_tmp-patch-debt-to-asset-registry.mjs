import { execSync } from 'node:child_process';
import fs from 'node:fs';

function head(path) {
  return execSync(`git show HEAD:${path}`, { encoding: 'utf8' });
}

function write(path, content) {
  fs.writeFileSync(path, content);
}

let keys = head('frontend/src/tools/registry/keys.ts');
keys = keys.replaceAll(
  `'DebtServiceCoverageRatioCalculator',\n  'AttritionRateCalculator'`,
  `'DebtServiceCoverageRatioCalculator',\n  'DebtToAssetRatioCalculator',\n  'AttritionRateCalculator'`
);
write('frontend/src/tools/registry/keys.ts', keys);

let tk = head('backend/src/modules/tools/tool.key.ts');
tk = tk.replace(
  `'DebtServiceCoverageRatioCalculator',\n  'AttritionRateCalculator'`,
  `'DebtServiceCoverageRatioCalculator',\n  'DebtToAssetRatioCalculator',\n  'AttritionRateCalculator'`
);
tk = tk.replace(
  `!isApprovedComponentKey('DebtServiceCoverageRatioCalculator') ||\n    !isApprovedComponentKey('AttritionRateCalculator')`,
  `!isApprovedComponentKey('DebtServiceCoverageRatioCalculator') ||\n    !isApprovedComponentKey('DebtToAssetRatioCalculator') ||\n    !isApprovedComponentKey('AttritionRateCalculator')`
);
write('backend/src/modules/tools/tool.key.ts', tk);

let idx = head('frontend/src/tools/registry/index.ts');
const idxNeedle =
  `DebtServiceCoverageRatioCalculator: lazyTool(() =>\n` +
  `    import(\n` +
  `      '@/tools/calculators/debt-service-coverage-ratio/DebtServiceCoverageRatioCalculator'\n` +
  `    ).then((mod) => ({\n` +
  `      default: mod.DebtServiceCoverageRatioCalculator,\n` +
  `    })),\n` +
  `  ),\n` +
  `  AttritionRateCalculator:`;
const idxInsert =
  `DebtServiceCoverageRatioCalculator: lazyTool(() =>\n` +
  `    import(\n` +
  `      '@/tools/calculators/debt-service-coverage-ratio/DebtServiceCoverageRatioCalculator'\n` +
  `    ).then((mod) => ({\n` +
  `      default: mod.DebtServiceCoverageRatioCalculator,\n` +
  `    })),\n` +
  `  ),\n` +
  `  DebtToAssetRatioCalculator: lazyTool(() =>\n` +
  `    import(\n` +
  `      '@/tools/calculators/debt-to-asset-ratio/DebtToAssetRatioCalculator'\n` +
  `    ).then((mod) => ({\n` +
  `      default: mod.DebtToAssetRatioCalculator,\n` +
  `    })),\n` +
  `  ),\n` +
  `  AttritionRateCalculator:`;
if (!idx.includes(idxNeedle)) {
  throw new Error('index.ts needle not found');
}
write('frontend/src/tools/registry/index.ts', idx.replace(idxNeedle, idxInsert));

let det = head('frontend/src/tools/registry/details.ts');
const detNeedle =
  `DebtServiceCoverageRatioCalculator: () =>\n` +
  `    import('@/tools/calculators/debt-service-coverage-ratio/detail'),\n` +
  `  AttritionRateCalculator:`;
const detInsert =
  `DebtServiceCoverageRatioCalculator: () =>\n` +
  `    import('@/tools/calculators/debt-service-coverage-ratio/detail'),\n` +
  `  DebtToAssetRatioCalculator: () =>\n` +
  `    import('@/tools/calculators/debt-to-asset-ratio/detail'),\n` +
  `  AttritionRateCalculator:`;
if (!det.includes(detNeedle)) {
  throw new Error('details.ts needle not found');
}
write('frontend/src/tools/registry/details.ts', det.replace(detNeedle, detInsert));

for (const p of [
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/sitemap.ts',
]) {
  let s = head(p);
  s = s.replace(
    `'debt-avalanche-calculator',\n  'debt-calculator',`,
    `'debt-avalanche-calculator',\n  'debt-calculator',\n  'debt-to-asset-ratio-calculator',`
  );
  write(p, s);
}

for (const p of [
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  let s = head(p);
  s = s.replace(
    `'after-tax-cost-of-debt-calculator',\n  'debt-calculator',\n  'annualized-return-calculator',`,
    `'after-tax-cost-of-debt-calculator',\n  'debt-calculator',\n  'debt-to-asset-ratio-calculator',\n  'annualized-return-calculator',`
  );
  write(p, s);
}

console.log('OK: registries patched from HEAD with DebtToAssetRatio only');
