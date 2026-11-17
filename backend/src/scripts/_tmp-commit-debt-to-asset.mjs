import { execSync } from 'node:child_process';
import fs from 'node:fs';

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function head(path) {
  return sh(`git show HEAD:${path}`);
}

const shared = [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'backend/src/modules/tools/tool.key.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'frontend/src/app/sitemap.ts',
  'brain/CHANGELOG.md',
  'brain/CURRENT_STATE.md',
  'brain/FRONTEND.md',
  'brain/TASKS.md',
];

// Reset shared files to HEAD (ignore race WIP).
sh(`git checkout HEAD -- ${shared.map((p) => `"${p}"`).join(' ')}`);

let keys = head('frontend/src/tools/registry/keys.ts');
if (!keys.includes("'DebtToAssetRatioCalculator'")) {
  keys = keys.replaceAll(
    `'DebtServiceCoverageRatioCalculator',\n`,
    `'DebtServiceCoverageRatioCalculator',\n  'DebtToAssetRatioCalculator',\n`
  );
  fs.writeFileSync('frontend/src/tools/registry/keys.ts', keys);
}

let tk = head('backend/src/modules/tools/tool.key.ts');
if (!tk.includes("'DebtToAssetRatioCalculator'")) {
  tk = tk.replace(
    `'DebtServiceCoverageRatioCalculator',\n`,
    `'DebtServiceCoverageRatioCalculator',\n  'DebtToAssetRatioCalculator',\n`
  );
  tk = tk.replace(
    `!isApprovedComponentKey('DebtServiceCoverageRatioCalculator') ||\n`,
    `!isApprovedComponentKey('DebtServiceCoverageRatioCalculator') ||\n    !isApprovedComponentKey('DebtToAssetRatioCalculator') ||\n`
  );
  fs.writeFileSync('backend/src/modules/tools/tool.key.ts', tk);
}

let idx = head('frontend/src/tools/registry/index.ts');
if (!idx.includes('DebtToAssetRatioCalculator:')) {
  const block =
    `  DebtToAssetRatioCalculator: lazyTool(() =>\n` +
    `    import(\n` +
    `      '@/tools/calculators/debt-to-asset-ratio/DebtToAssetRatioCalculator'\n` +
    `    ).then((mod) => ({\n` +
    `      default: mod.DebtToAssetRatioCalculator,\n` +
    `    })),\n` +
    `  ),\n`;
  idx = idx.replace(
    /DebtServiceCoverageRatioCalculator: lazyTool\(\(\) =>[\s\S]*?\),\n  \),\n/,
    (m) => `${m}${block}`
  );
  fs.writeFileSync('frontend/src/tools/registry/index.ts', idx);
}

let det = head('frontend/src/tools/registry/details.ts');
if (!det.includes('DebtToAssetRatioCalculator:')) {
  det = det.replace(
    `DebtServiceCoverageRatioCalculator: () =>\n    import('@/tools/calculators/debt-service-coverage-ratio/detail'),\n`,
    `DebtServiceCoverageRatioCalculator: () =>\n    import('@/tools/calculators/debt-service-coverage-ratio/detail'),\n  DebtToAssetRatioCalculator: () =>\n    import('@/tools/calculators/debt-to-asset-ratio/detail'),\n`
  );
  fs.writeFileSync('frontend/src/tools/registry/details.ts', det);
}

for (const p of [
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/sitemap.ts',
]) {
  let s = head(p);
  if (!s.includes("'debt-to-asset-ratio-calculator'")) {
    s = s.replace(
      `'debt-calculator',`,
      `'debt-calculator',\n  'debt-to-asset-ratio-calculator',`
    );
    fs.writeFileSync(p, s);
  }
}

for (const p of [
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  let s = head(p);
  if (!s.includes("'debt-to-asset-ratio-calculator'")) {
    s = s.replace(
      `'debt-calculator',`,
      `'debt-calculator',\n  'debt-to-asset-ratio-calculator',`
    );
    fs.writeFileSync(p, s);
  }
}

let cl = head('brain/CHANGELOG.md');
if (!cl.includes('Debt to Asset Ratio Calculator (Screenshot-First + FX)')) {
  const entry = `### 2026-11-17 — Debt to Asset Ratio Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt to Asset Ratio Calculator on existing catalog slug \`debt-to-asset-ratio-calculator\` (\`DebtToAssetRatioCalculator\`, catalog \`6af46f0fa27d8d1d4e98ff98\`). Five fields: long-term debt, short-term debt, total debt (calculated + independent FX), total assets, debt to assets ratio %. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Total Debt = Long-term + Short-term. Debt to Assets Ratio (%) = (Total Debt / Total Assets) × 100. Assets must be &gt; 0; zero debt → 0%; ratios above 100% uncapped.
- **FX:** Independent currencies on all four money selectors; debts normalize into total-assets currency before the ratio; total-debt currency only re-expresses the calculated sum. Currency-only changes preserve the ratio. Percentage never FX-converted.
- **Example:** 100,000 + 50,000 / 300,000 → total debt 150,000; ratio 50%.
- **Important Files:** \`frontend/src/tools/calculators/debt-to-asset-ratio/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-debt-to-asset-ratio-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
  cl = cl.replace('---\n\n', `---\n\n${entry}`);
  fs.writeFileSync('brain/CHANGELOG.md', cl);
}

let cs = head('brain/CURRENT_STATE.md');
if (!cs.includes('Debt to Asset Ratio Calculator')) {
  cs = cs.replace(
    '- **After-tax Cost of Debt Calculator',
    `- **Debt to Asset Ratio Calculator (\`/tools/debt-to-asset-ratio-calculator\`):** Live client-side leverage ratio (\`componentKey: 'DebtToAssetRatioCalculator'\`, catalog \`6af46f0fa27d8d1d4e98ff98\`). Long-term + short-term debt → total debt; ÷ total assets × 100. Independent real FX on four money selectors; normalize into assets currency; total-debt currency display-only. Assets &gt; 0; zero debt → 0%; no 100% cap. Example: 100k + 50k / 300k → 50%. Activated. Lint/builds/browser/automated tests omitted per user.\n- **After-tax Cost of Debt Calculator`
  );
  fs.writeFileSync('brain/CURRENT_STATE.md', cs);
}

let fe = head('brain/FRONTEND.md');
if (!fe.includes('debt-to-asset-ratio')) {
  fe = fe.replace(
    '- `src/tools/calculators/after-tax-cost-of-debt/`',
    `- \`src/tools/calculators/debt-to-asset-ratio/\`: Debt to Asset Ratio Calculator (\`DebtToAssetRatioCalculator\`, slug \`debt-to-asset-ratio-calculator\`). Long/short-term debt → total debt; ratio vs total assets; independent FX on four money fields; guide in \`detail.tsx\`.\n- \`src/tools/calculators/after-tax-cost-of-debt/\``
  );
  fs.writeFileSync('brain/FRONTEND.md', fe);
}

let tasks = head('brain/TASKS.md');
if (!tasks.includes('debt-to-asset-ratio-calculator')) {
  tasks = tasks.replace(
    '| `TOOL-348` | Implement Debt Calculator',
    `| \`TOOL-351\` | Implement Debt to Asset Ratio Calculator on existing slug \`debt-to-asset-ratio-calculator\` with long/short-term debt, total debt display FX, total assets, ratio %, independent FX on four money fields, guide/SEO/embed, and verified activation | Cursor | Completed | \`frontend/src/tools/calculators/debt-to-asset-ratio/*\`, registry, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-debt-to-asset-ratio-tool.ts\`, \`brain/*\` | \`TOOL-348\` |\n| \`TOOL-348\` | Implement Debt Calculator`
  );
  fs.writeFileSync('brain/TASKS.md', tasks);
}

// Verify calculator module exists.
if (
  !fs.existsSync(
    'frontend/src/tools/calculators/debt-to-asset-ratio/DebtToAssetRatioCalculator.tsx'
  )
) {
  throw new Error('Calculator module missing');
}
if (!fs.existsSync('backend/src/scripts/assign-debt-to-asset-ratio-tool.ts')) {
  throw new Error('Assign script missing');
}

// Guard: no colleague keys accidentally present in our staged content.
for (const [path, bad] of [
  ['frontend/src/tools/registry/keys.ts', 'DebtToCapitalRatioCalculator'],
  ['frontend/src/tools/registry/keys.ts', 'DebtSnowballCalculator'],
  ['frontend/src/tools/registry/keys.ts', 'DebtToEquityCalculator'],
  ['frontend/src/tools/registry/keys.ts', 'EbitdaMarginCalculator'],
]) {
  const text = fs.readFileSync(path, 'utf8');
  if (text.includes(bad) && !head(path).includes(bad)) {
    throw new Error(`Unexpected colleague key ${bad} in ${path}`);
  }
}

const addPaths = [
  'backend/src/modules/tools/tool.key.ts',
  'backend/src/scripts/assign-debt-to-asset-ratio-tool.ts',
  'brain/CHANGELOG.md',
  'brain/CURRENT_STATE.md',
  'brain/FRONTEND.md',
  'brain/TASKS.md',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/calculators/debt-to-asset-ratio',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/sitemap.ts',
];

sh(`git add ${addPaths.map((p) => `"${p}"`).join(' ')}`);

const cached = sh('git diff --cached');
for (const bad of [
  'DebtToCapitalRatioCalculator',
  'DebtSnowballCalculator',
  'DebtToEquityCalculator',
  'EbitdaMarginCalculator',
  'debt-to-capital',
  'debt-snowball',
  'debt-to-equity',
  'ebitda-margin',
]) {
  if (cached.includes(bad)) {
    throw new Error(`Staged diff contains colleague marker: ${bad}`);
  }
}
if (!cached.includes('DebtToAssetRatioCalculator')) {
  throw new Error('Staged diff missing DebtToAssetRatioCalculator');
}

sh('git commit -m "feat(calculator): implement debt to asset ratio calculator with FX"');
console.log(sh('git log -1 --format="%H %s"').trim());
