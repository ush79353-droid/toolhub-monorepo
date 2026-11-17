import { execSync } from 'node:child_process';
import fs from 'node:fs';

function head(path) {
  return execSync(`git show HEAD:${path}`, { encoding: 'utf8' });
}

let cl = head('brain/CHANGELOG.md');
const entry = `### 2026-11-17 — Debt to Asset Ratio Calculator (Screenshot-First + FX)
- **Summary:** Shipped Debt to Asset Ratio Calculator on existing catalog slug \`debt-to-asset-ratio-calculator\` (\`DebtToAssetRatioCalculator\`, catalog \`6af46f0fa27d8d1d4e98ff98\`). Five fields: long-term debt, short-term debt, total debt (calculated + independent FX), total assets, debt to assets ratio %. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Total Debt = Long-term + Short-term. Debt to Assets Ratio (%) = (Total Debt / Total Assets) × 100. Assets must be &gt; 0; zero debt → 0%; ratios above 100% uncapped.
- **FX:** Independent currencies on all four money selectors; debts normalize into total-assets currency before the ratio; total-debt currency only re-expresses the calculated sum. Currency-only changes preserve the ratio. Percentage never FX-converted.
- **Example:** 100,000 + 50,000 / 300,000 → total debt 150,000; ratio 50%.
- **Important Files:** \`frontend/src/tools/calculators/debt-to-asset-ratio/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-debt-to-asset-ratio-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
if (!cl.includes('Debt to Asset Ratio Calculator (Screenshot-First + FX)')) {
  cl = cl.replace('---\n\n', `---\n\n${entry}`);
  fs.writeFileSync('brain/CHANGELOG.md', cl);
}

let cs = head('brain/CURRENT_STATE.md');
const cLine = `- **Debt to Asset Ratio Calculator (\`/tools/debt-to-asset-ratio-calculator\`):** Live client-side leverage ratio (\`componentKey: 'DebtToAssetRatioCalculator'\`, catalog \`6af46f0fa27d8d1d4e98ff98\`). Long-term + short-term debt → total debt; ÷ total assets × 100. Independent real FX on four money selectors; normalize into assets currency; total-debt currency display-only. Assets &gt; 0; zero debt → 0%; no 100% cap. Example: 100k + 50k / 300k → 50%. Activated. Lint/builds/browser/automated tests omitted per user.
`;
if (!cs.includes('Debt to Asset Ratio Calculator')) {
  cs = cs.replace(
    '- **After-tax Cost of Debt Calculator',
    `${cLine}- **After-tax Cost of Debt Calculator`
  );
  fs.writeFileSync('brain/CURRENT_STATE.md', cs);
}

let fe = head('brain/FRONTEND.md');
const fLine = `- \`src/tools/calculators/debt-to-asset-ratio/\`: Debt to Asset Ratio Calculator (\`DebtToAssetRatioCalculator\`, slug \`debt-to-asset-ratio-calculator\`). Long/short-term debt → total debt; ratio vs total assets; independent FX on four money fields; guide in \`detail.tsx\`.
`;
if (!fe.includes('debt-to-asset-ratio')) {
  fe = fe.replace(
    '- `src/tools/calculators/after-tax-cost-of-debt/`',
    `${fLine}- \`src/tools/calculators/after-tax-cost-of-debt/\``
  );
  fs.writeFileSync('brain/FRONTEND.md', fe);
}

let tasks = head('brain/TASKS.md');
const tLine = `| \`TOOL-351\` | Implement Debt to Asset Ratio Calculator on existing slug \`debt-to-asset-ratio-calculator\` with long/short-term debt, total debt display FX, total assets, ratio %, independent FX on four money fields, guide/SEO/embed, and verified activation | Cursor | Completed | \`frontend/src/tools/calculators/debt-to-asset-ratio/*\`, registry, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-debt-to-asset-ratio-tool.ts\`, \`brain/*\` | \`TOOL-348\` |
`;
if (!tasks.includes('debt-to-asset-ratio-calculator')) {
  tasks = tasks.replace(
    '| `TOOL-348` | Implement Debt Calculator',
    `${tLine}| \`TOOL-348\` | Implement Debt Calculator`
  );
  fs.writeFileSync('brain/TASKS.md', tasks);
}

console.log('OK: brain patched from HEAD with DebtToAssetRatio only');
