import fs from 'node:fs';
import { execSync } from 'node:child_process';

function normalize(s) {
  return s.replace(/\r\n/g, '\n');
}
function write(path, original, nextLf) {
  fs.writeFileSync(path, original.includes('\r\n') ? nextLf.replace(/\n/g, '\r\n') : nextLf);
}

function insertOnce(path, needle, after, text) {
  const original = fs.readFileSync(path, 'utf8');
  let s = normalize(original);
  after = normalize(after);
  text = normalize(text);
  if (s.includes(needle)) {
    console.log('ok', path);
    return;
  }
  const idx = s.indexOf(after);
  if (idx < 0) throw new Error(`anchor missing ${path}: ${JSON.stringify(after)}`);
  s = s.slice(0, idx + after.length) + text + s.slice(idx + after.length);
  write(path, original, s);
  console.log('patched', path);
}

function insertAll(path, needle, after, text) {
  const original = fs.readFileSync(path, 'utf8');
  let s = normalize(original);
  after = normalize(after);
  text = normalize(text);
  const re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  if ((s.match(re) || []).length >= 2) {
    console.log('ok multi', path);
    return;
  }
  if (!s.includes(after)) throw new Error(`anchor missing ${path}`);
  s = s.split(after).join(after + text);
  write(path, original, s);
  console.log('patched multi', path);
}

insertAll(
  'frontend/src/tools/registry/keys.ts',
  "'FutureValueOfAnnuityCalculator'",
  "'FutureValueCalculator',\n",
  "  'FutureValueOfAnnuityCalculator',\n"
);

insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  "'FutureValueOfAnnuityCalculator'",
  "'FutureValueCalculator',\n",
  "  'FutureValueOfAnnuityCalculator',\n"
);
insertOnce(
  'backend/src/modules/tools/tool.key.ts',
  "isApprovedComponentKey('FutureValueOfAnnuityCalculator')",
  "isApprovedComponentKey('FutureValueCalculator') ||\n",
  "    !isApprovedComponentKey('FutureValueOfAnnuityCalculator') ||\n"
);

insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  "'FutureValueOfAnnuityCalculator'",
  "'FutureValueCalculator',\n",
  "  'FutureValueOfAnnuityCalculator',\n"
);
insertOnce(
  'frontend/src/tools/registry/tool.key.ts',
  "isApprovedComponentKey('FutureValueOfAnnuityCalculator')",
  "isApprovedComponentKey('FutureValueCalculator') ||\n",
  "    !isApprovedComponentKey('FutureValueOfAnnuityCalculator') ||\n"
);

insertOnce(
  'frontend/src/tools/registry/details.ts',
  'FutureValueOfAnnuityCalculator:',
  "FutureValueCalculator: () =>\n    import('@/tools/calculators/future-value/detail'),\n",
  "  FutureValueOfAnnuityCalculator: () =>\n    import('@/tools/calculators/future-value-of-annuity/detail'),\n"
);

const indexAnchor =
  "  FutureValueCalculator: lazyTool(() =>\n" +
  "    import(\n" +
  "      '@/tools/calculators/future-value/FutureValueCalculator'\n" +
  "    ).then((mod) => ({\n" +
  "      default: mod.FutureValueCalculator,\n" +
  "    })),\n" +
  "  ),\n";
const indexInsert =
  "  FutureValueOfAnnuityCalculator: lazyTool(() =>\n" +
  "    import(\n" +
  "      '@/tools/calculators/future-value-of-annuity/FutureValueOfAnnuityCalculator'\n" +
  "    ).then((mod) => ({\n" +
  "      default: mod.FutureValueOfAnnuityCalculator,\n" +
  "    })),\n" +
  "  ),\n";

// Try both formatting styles for FutureValueCalculator lazy import.
try {
  insertOnce(
    'frontend/src/tools/registry/index.ts',
    'FutureValueOfAnnuityCalculator:',
    indexAnchor,
    indexInsert
  );
} catch {
  const alt =
    "  FutureValueCalculator: lazyTool(() =>\n" +
    "    import('@/tools/calculators/future-value/FutureValueCalculator').then((mod) => ({\n" +
    "      default: mod.FutureValueCalculator,\n" +
    "    })),\n" +
    "  ),\n";
  const altInsert =
    "  FutureValueOfAnnuityCalculator: lazyTool(() =>\n" +
    "    import('@/tools/calculators/future-value-of-annuity/FutureValueOfAnnuityCalculator').then(\n" +
    "      (mod) => ({\n" +
    "        default: mod.FutureValueOfAnnuityCalculator,\n" +
    "      })\n" +
    "    )\n" +
    "  ),\n";
  insertOnce(
    'frontend/src/tools/registry/index.ts',
    'FutureValueOfAnnuityCalculator:',
    alt,
    altInsert
  );
}

insertOnce(
  'frontend/src/tools/registry/sitemap.ts',
  "'future-value-of-annuity-calculator'",
  "'future-value-calculator',\n",
  "  'future-value-of-annuity-calculator',\n"
);
insertOnce(
  'frontend/src/app/sitemap.ts',
  "'future-value-of-annuity-calculator'",
  "'future-value-calculator',\n",
  "  'future-value-of-annuity-calculator',\n"
);
insertOnce(
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  "'future-value-of-annuity-calculator'",
  "'future-value-calculator',\n",
  "  'future-value-of-annuity-calculator',\n"
);
insertOnce(
  'frontend/src/app/embed/[slug]/page.tsx',
  "'future-value-of-annuity-calculator'",
  "'future-value-calculator',\n",
  "  'future-value-of-annuity-calculator',\n"
);

// Brain
{
  const original = fs.readFileSync('brain/CURRENT_STATE.md', 'utf8');
  let s = normalize(original);
  s = s.replace(
    /> \*\*Primary Agent Starting Point\.\*\* Last verified: \*\*2026-11-17\*\* \([^)]+\)\./,
    '> **Primary Agent Starting Point.** Last verified: **2026-11-17** (Future Value of Annuity Calculator live at `/tools/future-value-of-annuity-calculator` with FX; Auto Loan remains master Tool Detail Page).'
  );
  if (!s.includes('Future Value of Annuity Calculator (`/tools/future-value-of-annuity-calculator`)')) {
    const anchor = '- **Future Value Calculator';
    const idx = s.indexOf(anchor);
    const entry =
      "- **Future Value of Annuity Calculator (`/tools/future-value-of-annuity-calculator`):** Live client-side FVA (`componentKey: 'FutureValueOfAnnuityCalculator'`, catalog `6af46f0fa27d8d1d4e98ffab`). Payment, rate, term yrs/mos, compounding/payment frequency, ordinary/due; advanced growth + period/equivalent rates. Independent FX on payment + result. Example 100 @ 5% / 3y yearly → ordinary 315.25; due 331.0125. Activated.\n";
    if (idx >= 0) {
      s = s.slice(0, idx) + entry + s.slice(idx);
    } else {
      // Append near Debt Snowball if Future Value section missing
      const snow = '- **Debt Snowball Calculator';
      const si = s.indexOf(snow);
      if (si < 0) throw new Error('no CURRENT_STATE insert point');
      s = s.slice(0, si) + entry + s.slice(si);
    }
  }
  write('brain/CURRENT_STATE.md', original, s);
}

{
  const original = fs.readFileSync('brain/FRONTEND.md', 'utf8');
  let s = normalize(original);
  if (!s.includes('future-value-of-annuity/')) {
    const line =
      "- `src/tools/calculators/future-value-of-annuity/`: Future Value of Annuity Calculator (`FutureValueOfAnnuityCalculator`, slug `future-value-of-annuity-calculator`). Payment/rate/term, compounding & payment frequencies, ordinary/due, advanced growth; independent FX on payment + result; guide.\n";
    const anchors = [
      "- `src/tools/calculators/future-value/`:",
      "- `src/tools/calculators/present-value/`:",
      "- `src/tools/calculators/annuity/`:",
      "- `src/tools/calculators/debt-snowball/`:",
    ];
    let inserted = false;
    for (const anchor of anchors) {
      const idx = s.indexOf(anchor);
      if (idx >= 0) {
        const end = s.indexOf('\n', idx);
        s = s.slice(0, end + 1) + line + s.slice(end + 1);
        inserted = true;
        break;
      }
    }
    if (!inserted) throw new Error('missing FRONTEND insert anchor');
  }
  write('brain/FRONTEND.md', original, s);
}

{
  const original = fs.readFileSync('brain/TASKS.md', 'utf8');
  let s = normalize(original);
  if (!s.includes('Implement Future Value of Annuity Calculator')) {
    const row =
      "| `TOOL-368` | Implement Future Value of Annuity Calculator on existing slug `future-value-of-annuity-calculator` with ordinary/due, compounding/payment frequencies, advanced growth, independent FX, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/future-value-of-annuity/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-future-value-of-annuity-tool.ts`, `brain/*` | `TOOL-353` |\n";
    const marker = '| `TOOL-353` | Implement Debt Snowball Calculator';
    const idx = s.indexOf(marker);
    if (idx < 0) {
      // fall back: prepend after first completed TOOL row block start
      const alt = '| `TOOL-348` |';
      const ai = s.indexOf(alt);
      if (ai < 0) throw new Error('missing TASKS insert point');
      s = s.slice(0, ai) + row + s.slice(ai);
    } else {
      s = s.slice(0, idx) + row + s.slice(idx);
    }
  }
  write('brain/TASKS.md', original, s);
}

{
  const original = fs.readFileSync('brain/CHANGELOG.md', 'utf8');
  let s = normalize(original);
  if (!s.includes('Future Value of Annuity Calculator (Screenshot-First + FX)')) {
    const entry = `### 2026-11-17 — Future Value of Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Future Value of Annuity Calculator on existing catalog slug \`future-value-of-annuity-calculator\` (\`FutureValueOfAnnuityCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffab\`). Payment, interest rate, term yrs/mos, compounding/payment frequency, ordinary/due radios, future-value result; Advanced parameters: growth rate, number of periods, equivalent rates. Share/Reload/Clear/feedback. Activated.
- **Formulas:** i = (1+r/m)^(m/q)−1 (discrete) or e^(r/q)−1 (continuous); n = round(years×q). Ordinary FV = PMT×((1+i)^n−1)/i; due ×(1+i); zero interest FV = PMT×n; growing-annuity variants when g ≠ 0.
- **FX:** Independent currencies on payment and result; compute in payment currency then convert once. Rates/term/frequencies never convert.
- **Example:** 100 @ 5% / 3y yearly/yearly ordinary → 315.25; due → 331.0125.
- **Important Files:** \`frontend/src/tools/calculators/future-value-of-annuity/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-future-value-of-annuity-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;
    const idx = s.indexOf('\n### ');
    if (idx < 0) throw new Error('missing changelog marker');
    s = s.slice(0, idx + 1) + entry + s.slice(idx + 1);
  }
  write('brain/CHANGELOG.md', original, s);
}

console.log('registry + brain patch complete');
