import { execSync } from 'node:child_process';
import fs from 'node:fs';

const root = process.cwd();

function run(cmd) {
  console.log('>', cmd);
  execSync(cmd, { stdio: 'inherit', cwd: root, shell: true });
}

// Ensure Net Debt CHANGELOG entry is at top (after header)
{
  const path = 'brain/CHANGELOG.md';
  let t = fs.readFileSync(path, 'utf8');
  if (!t.includes('### 2026-11-17 — Net Debt Calculator')) {
    const marker = '---\n\n';
    const idx = t.indexOf(marker);
    if (idx < 0) throw new Error('CHANGELOG marker missing');
    const entry = `### 2026-11-17 — Net Debt Calculator (Screenshot-First + FX)
- **Summary:** Shipped Net Debt Calculator on existing catalog slug \`net-debt-calculator\` (\`NetDebtCalculator\`, catalog \`6af46f0fa27d8d1d4e98ff9c\`). Accordion sections for cash, short-term debt, long-term debt, plus Net debt summary. Share/Reload/Clear/feedback. Activated.
- **Formulas:** Cash total = Cash + Cash equivalents. Short-term debt = Σ ST items. Long-term debt = Σ LT items. Net debt = ST + LT − cash total (negative allowed when cash exceeds debt). Blank lines = 0; never NaN/Infinity.
- **FX:** Independent currencies on all money selectors (Margin Interest / Phase 2). Normalize into cash currency before addition/subtraction; section totals and net debt re-express in their display currencies. Full precision; display rounding only. Stale/missing rate handling reused.
- **Example:** Cash 50,000 + eq 10,000; ST 40,000; LT 100,000 → net debt 80,000.
- **Important Files:** \`frontend/src/tools/calculators/net-debt/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-net-debt-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
    const at = idx + marker.length;
    t = t.slice(0, at) + entry + t.slice(at);
    fs.writeFileSync(path, t);
    console.log('CHANGELOG patched');
  } else {
    console.log('CHANGELOG already has Net Debt');
  }
}

// Ensure TOOL-354 row
{
  const path = 'brain/TASKS.md';
  let t = fs.readFileSync(path, 'utf8');
  if (!t.includes('`TOOL-354`') || !t.includes('net-debt-calculator')) {
    const row =
      "| `TOOL-354` | Implement Net Debt Calculator on existing slug `net-debt-calculator` with cash/ST/LT accordion sections, synchronized net debt summary, independent FX on all money fields, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/net-debt/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-net-debt-tool.ts`, `brain/*` | `TOOL-353` |\n";
    const needle =
      '| `TOOL-353` | Implement Debt Snowball Calculator on existing slug `debt-snowball-calculator`';
    const i = t.indexOf(needle);
    if (i < 0) throw new Error('TASKS TOOL-353 needle missing');
    // insert after the TOOL-353 line
    const lineEnd = t.indexOf('\n', i);
    t = t.slice(0, lineEnd + 1) + row + t.slice(lineEnd + 1);
    fs.writeFileSync(path, t);
    console.log('TASKS patched');
  } else {
    console.log('TASKS already has TOOL-354');
  }
}

// Drop unrelated staged/index noise; stage only Net Debt delivery
run('git reset HEAD');
run('git add -- frontend/src/tools/calculators/net-debt backend/src/scripts/assign-net-debt-tool.ts brain/CHANGELOG.md brain/TASKS.md');

// Confirm staged content
const staged = execSync('git diff --cached --name-only', {
  encoding: 'utf8',
  cwd: root,
});
console.log('STAGED:\n' + staged);
if (!staged.includes('net-debt')) throw new Error('net-debt module not staged');
if (!staged.includes('assign-net-debt-tool.ts')) throw new Error('assign script not staged');

run('git commit -m "feat(calculator): implement net debt calculator with FX"');
run('git rev-parse HEAD');
run('git status -sb');
