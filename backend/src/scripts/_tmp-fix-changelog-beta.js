const fs = require('fs');
const p = 'd:/Project/ToolHub/brain/CHANGELOG.md';
let text = fs.readFileSync(p, 'utf8');

const startRe = /<<<<<<< HEAD\r?\n/;
const midRe = /=======\r?\n/;
const endRe = />>>>>>> 11e6cb8230776a235f310d263091a11f450a3815\r?\n/;

const startMatch = startRe.exec(text);
if (!startMatch) throw new Error('start marker missing');
const start = startMatch.index;
const afterStart = start + startMatch[0].length;

const midMatch = midRe.exec(text.slice(afterStart));
if (!midMatch) throw new Error('mid marker missing');
const mid = afterStart + midMatch.index;
const afterMid = mid + midMatch[0].length;

const endMatch = endRe.exec(text.slice(afterMid));
if (!endMatch) throw new Error('end marker missing');
const end = afterMid + endMatch.index;
const afterEnd = end + endMatch[0].length;

const head = text.slice(afterStart, mid).replace(/\s+$/, '');
const incoming = text.slice(afterMid, end).replace(/^\s+/, '');
const resolved = `${head}\n\n${incoming}`;
text = text.slice(0, start) + resolved + text.slice(afterEnd);

if (/<<<<<<<|=======|>>>>>>>/.test(text)) {
  throw new Error('conflict markers remain');
}

const entry = `### 2026-11-16 — Add Beta Stock Calculator (Screenshot-First)
- **Summary:** Shipped Beta Stock Calculator on existing catalog slug \`beta-stock-calculator\` (\`BetaStockCalculator\`, catalog \`6af46f0fa27d8d1d4e99002e\`). Four+ chronological asset/benchmark price pairs → daily returns → β = Cov/Var. Optional price line chart. Denomination currency (PKR). Omega UI. Activated.
- **Example:** Asset 50/55/50/60, Benchmark 100/110/100/120 → β = 1.00.
- **Important Files:** \`frontend/src/tools/calculators/beta-stock/*\`, registry, \`sitemap.ts\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-beta-stock-tool.ts\`, \`brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md\`.
- **Verification:** MongoDB activated (\`isDeveloped\`/\`isActive\`/\`indexable\` true, \`embedEnabled\` true). Lint/builds/browser/automated tests omitted per user.

`;

const headerRe = /---\r?\n\r?\n/;
const headerMatch = headerRe.exec(text);
if (!headerMatch) throw new Error('changelog header marker missing');
const insertAt = headerMatch.index + headerMatch[0].length;
if (!text.slice(insertAt).startsWith('### 2026-11-16 — Add Beta Stock Calculator')) {
  text = text.slice(0, insertAt) + entry + text.slice(insertAt);
}

fs.writeFileSync(p, text);
console.log('CHANGELOG resolved');
