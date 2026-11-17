import { execSync } from 'node:child_process';
import fs from 'node:fs';

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function head(path) {
  return sh(`git show HEAD:${path}`);
}

const KEY = 'MarginCalculatorClassic';
const SLUG = 'margin-calculator-classic';

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

// Clear any previously staged colleague WIP, then restore shared files from HEAD.
sh('git reset');
sh(`git checkout HEAD -- ${shared.map((p) => `"${p}"`).join(' ')}`);

function insertAfterLine(text, needle, insert) {
  if (text.includes(insert.trim())) return text;
  if (!text.includes(needle)) {
    throw new Error(`Needle not found: ${needle.slice(0, 80)}`);
  }
  return text.replace(needle, `${needle}${insert}`);
}

// keys.ts — both lists
let keys = head('frontend/src/tools/registry/keys.ts');
if (!keys.includes(`'${KEY}'`)) {
  // Prefer after MarginAndMarkup if present, else before MarginInterest
  if (keys.includes("'MarginAndMarkupCalculator'")) {
    keys = keys.replaceAll(
      `'MarginAndMarkupCalculator',\n`,
      `'MarginAndMarkupCalculator',\n  '${KEY}',\n`
    );
  } else {
    keys = keys.replaceAll(
      `'MarginInterestCalculator',\n`,
      `'${KEY}',\n  'MarginInterestCalculator',\n`
    );
  }
  fs.writeFileSync('frontend/src/tools/registry/keys.ts', keys);
}

let tk = head('backend/src/modules/tools/tool.key.ts');
if (!tk.includes(`'${KEY}'`)) {
  if (tk.includes("'MarginAndMarkupCalculator'")) {
    tk = tk.replace(
      `'MarginAndMarkupCalculator',\n`,
      `'MarginAndMarkupCalculator',\n  '${KEY}',\n`
    );
    tk = tk.replace(
      `!isApprovedComponentKey('MarginAndMarkupCalculator') ||\n`,
      `!isApprovedComponentKey('MarginAndMarkupCalculator') ||\n    !isApprovedComponentKey('${KEY}') ||\n`
    );
  } else {
    tk = tk.replace(
      `'MarginInterestCalculator',\n`,
      `'${KEY}',\n  'MarginInterestCalculator',\n`
    );
    tk = tk.replace(
      `!isApprovedComponentKey('MarginInterestCalculator') ||\n`,
      `!isApprovedComponentKey('${KEY}') ||\n    !isApprovedComponentKey('MarginInterestCalculator') ||\n`
    );
  }
  fs.writeFileSync('backend/src/modules/tools/tool.key.ts', tk);
}

let idx = head('frontend/src/tools/registry/index.ts');
if (!idx.includes(`${KEY}:`)) {
  const blockFixed =
    `  ${KEY}: lazyTool(() =>\n` +
    `    import(\n` +
    `      '@/tools/calculators/margin-calculator-classic/MarginCalculatorClassicCalculator'\n` +
    `    ).then((mod) => ({\n` +
    `      default: mod.MarginCalculatorClassicCalculator,\n` +
    `    })),\n` +
    `  ),\n`;
  const interestNeedle =
    `  MarginInterestCalculator: lazyTool(() =>\n` +
    `    import('@/tools/calculators/margin-interest/MarginInterestCalculator').then((mod) => ({\n` +
    `      default: mod.MarginInterestCalculator,\n` +
    `    })),\n` +
    `  ),\n`;
  if (!idx.includes(interestNeedle)) {
    throw new Error('MarginInterestCalculator index needle not found');
  }
  idx = idx.replace(interestNeedle, `${blockFixed}${interestNeedle}`);
  fs.writeFileSync('frontend/src/tools/registry/index.ts', idx);
}

let det = head('frontend/src/tools/registry/details.ts');
if (!det.includes(`${KEY}:`)) {
  const line = `  ${KEY}: () =>\n    import('@/tools/calculators/margin-calculator-classic/detail'),\n`;
  if (det.includes('MarginAndMarkupCalculator:')) {
    det = det.replace(
      /MarginAndMarkupCalculator: \(\) =>\n    import\('@\/tools\/calculators\/margin-and-markup\/detail'\),\n/,
      (m) => `${m}${line}`
    );
  } else {
    det = det.replace(
      `MarginInterestCalculator: () =>\n    import('@/tools/calculators/margin-interest/detail'),\n`,
      `${line}  MarginInterestCalculator: () =>\n    import('@/tools/calculators/margin-interest/detail'),\n`
    );
  }
  fs.writeFileSync('frontend/src/tools/registry/details.ts', det);
}

for (const p of [
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/sitemap.ts',
]) {
  let s = head(p);
  if (!s.includes(`'${SLUG}'`)) {
    s = s.replace(
      `'margin-interest-calculator',`,
      `'${SLUG}',\n  'margin-interest-calculator',`
    );
    fs.writeFileSync(p, s);
  }
}

for (const p of [
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  let s = head(p);
  if (!s.includes(`'${SLUG}'`)) {
    // Prefer after margin-and-markup or margin-interest at top of set
    if (s.includes("'margin-and-markup-calculator'")) {
      s = s.replace(
        `'margin-and-markup-calculator',`,
        `'margin-and-markup-calculator',\n  '${SLUG}',`
      );
    } else {
      s = s.replace(
        `'margin-interest-calculator',`,
        `'${SLUG}',\n  'margin-interest-calculator',`
      );
    }
    fs.writeFileSync(p, s);
  }
}

let cl = head('brain/CHANGELOG.md');
if (!cl.includes('Margin Calculator Classic (Screenshot-First + FX)')) {
  const entry = `### 2026-11-17 — Margin Calculator Classic (Screenshot-First + FX)
- **Summary:** Shipped Margin Calculator Classic on existing catalog slug \`${SLUG}\` (\`${KEY}\`, catalog \`6af46f0fa27d8d1d4e98ffa3\`). Four fields: cost, margin % (pin), revenue, profit. Bidirectional solve with last-edited driver; margin pin holds %. Share/Reload/Clear/feedback. Separate from \`margin-calculator\`. Activated.
- **Formulas:** Profit = Revenue − Cost; Margin (%) = (Profit / Revenue) × 100; Revenue = Cost / (1 − Margin/100); Revenue = Cost + Profit. Margin 100% and zero revenue blocked safely.
- **FX:** Independent currencies on cost/revenue/profit; normalize into cost currency; currency-only changes preserve margin %. Percentage never FX-converted.
- **Example:** Cost 100 / Margin 20% pinned → Revenue 125, Profit 25.
- **Important Files:** \`frontend/src/tools/calculators/margin-calculator-classic/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-margin-calculator-classic-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
  cl = cl.replace('---\n\n', `---\n\n${entry}`);
  fs.writeFileSync('brain/CHANGELOG.md', cl);
}

let cs = head('brain/CURRENT_STATE.md');
if (!cs.includes('Margin Calculator Classic')) {
  const line = `- **Margin Calculator Classic (\`/tools/${SLUG}\`):** Live client-side bidirectional margin tool (\`componentKey: '${KEY}'\`, catalog \`6af46f0fa27d8d1d4e98ffa3\`). Cost, margin % with pin, revenue, profit; independent FX on three money fields; normalize into cost currency. Example: 100 / 20% → revenue 125, profit 25. Distinct from undeveloped \`margin-calculator\`. Activated. Lint/builds/browser/automated tests omitted per user.\n`;
  if (cs.includes('Margin Interest Calculator')) {
    cs = cs.replace(
      '- **Margin Interest Calculator',
      `${line}- **Margin Interest Calculator`
    );
  } else if (cs.includes('After-tax Cost of Debt Calculator')) {
    cs = cs.replace(
      '- **After-tax Cost of Debt Calculator',
      `${line}- **After-tax Cost of Debt Calculator`
    );
  } else {
    throw new Error('CURRENT_STATE insert point not found');
  }
  fs.writeFileSync('brain/CURRENT_STATE.md', cs);
}

let fe = head('brain/FRONTEND.md');
if (!fe.includes('margin-calculator-classic')) {
  const line = `- \`src/tools/calculators/margin-calculator-classic/\`: Margin Calculator Classic (\`${KEY}\`, slug \`${SLUG}\`). Bidirectional cost/margin/revenue/profit with margin pin; independent FX on three money fields; guide in \`detail.tsx\`.\n`;
  if (fe.includes('margin-interest')) {
    fe = fe.replace(
      /- `src\/tools\/calculators\/margin-interest\/`.*/,
      (m) => `${line}${m}`
    );
  } else if (fe.includes('after-tax-cost-of-debt')) {
    fe = fe.replace(
      /- `src\/tools\/calculators\/after-tax-cost-of-debt\/`.*/,
      (m) => `${m}\n${line.trimEnd()}`
    );
  } else {
    throw new Error('FRONTEND insert point not found');
  }
  fs.writeFileSync('brain/FRONTEND.md', fe);
}

let tasks = head('brain/TASKS.md');
if (!tasks.includes(SLUG)) {
  const tLine = `| \`TOOL-360\` | Implement Margin Calculator Classic on existing slug \`${SLUG}\` with bidirectional cost/margin/revenue/profit, margin pin, independent FX on three money fields, guide/SEO/embed, and verified activation (distinct from margin-calculator) | Cursor | Completed | \`frontend/src/tools/calculators/margin-calculator-classic/*\`, registry, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-margin-calculator-classic-tool.ts\`, \`brain/*\` | \`TOOL-353\` |\n`;
  if (tasks.includes('| `TOOL-353` |')) {
    tasks = tasks.replace('| `TOOL-353` |', `${tLine}| \`TOOL-353\` |`);
  } else if (tasks.includes('| `TOOL-352` |')) {
    tasks = tasks.replace('| `TOOL-352` |', `${tLine}| \`TOOL-352\` |`);
  } else {
    tasks = tasks.replace('| `TOOL-351` |', `${tLine}| \`TOOL-351\` |`);
  }
  fs.writeFileSync('brain/TASKS.md', tasks);
}

if (
  !fs.existsSync(
    'frontend/src/tools/calculators/margin-calculator-classic/MarginCalculatorClassicCalculator.tsx'
  )
) {
  throw new Error('Calculator module missing');
}
if (!fs.existsSync('backend/src/scripts/assign-margin-calculator-classic-tool.ts')) {
  throw new Error('Assign script missing');
}

const addPaths = [
  'backend/src/modules/tools/tool.key.ts',
  'backend/src/scripts/assign-margin-calculator-classic-tool.ts',
  'brain/CHANGELOG.md',
  'brain/CURRENT_STATE.md',
  'brain/FRONTEND.md',
  'brain/TASKS.md',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/calculators/margin-calculator-classic',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/sitemap.ts',
];

sh(`git add ${addPaths.map((p) => `"${p}"`).join(' ')}`);

const cached = sh('git diff --cached');
const stagedNames = sh('git diff --cached --name-only')
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);

if (!cached.includes(KEY)) {
  throw new Error(`Staged diff missing ${KEY}`);
}
if (!cached.includes(SLUG)) {
  throw new Error(`Staged diff missing ${SLUG}`);
}

const allowedPrefix = 'frontend/src/tools/calculators/margin-calculator-classic/';
for (const name of stagedNames) {
  if (
    name.startsWith('frontend/src/tools/calculators/') &&
    !name.startsWith(allowedPrefix)
  ) {
    throw new Error(`Staged unrelated calculator file: ${name}`);
  }
}

sh(
  'git commit -m "feat(calculator): implement margin calculator classic with FX"'
);
console.log(sh('git log -1 --format="%H %s"').trim());
