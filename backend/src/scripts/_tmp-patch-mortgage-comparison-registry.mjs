import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();

function show(rel) {
  return execSync(`git show HEAD:${rel}`, { cwd: root, encoding: 'utf8' });
}

function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text, 'utf8');
  console.log('wrote', rel);
}

function patchKeys(text) {
  return text
    .replaceAll(
      "  'MortgageTaxesInsuranceCalculator',\n  'HomeMortgageCalculator',",
      "  'MortgageTaxesInsuranceCalculator',\n  'MortgageComparisonCalculator',\n  'HomeMortgageCalculator',"
    )
    .replaceAll(
      "    !isApprovedComponentKey('MortgageTaxesInsuranceCalculator') ||\n    !isApprovedComponentKey('HomeMortgageCalculator') ||",
      "    !isApprovedComponentKey('MortgageTaxesInsuranceCalculator') ||\n    !isApprovedComponentKey('MortgageComparisonCalculator') ||\n    !isApprovedComponentKey('HomeMortgageCalculator') ||"
    );
}

function patchIndex(text) {
  const needle =
    "  MortgageTaxesInsuranceCalculator: lazyTool(() =>\n" +
    "    import('@/tools/calculators/mortgage-taxes-insurance/MortgageTaxesInsuranceCalculator').then((mod) => ({\n" +
    "      default: mod.MortgageTaxesInsuranceCalculator,\n" +
    "    })),\n" +
    "  ),\n" +
    "  HomeMortgageCalculator:";
  const repl =
    "  MortgageTaxesInsuranceCalculator: lazyTool(() =>\n" +
    "    import('@/tools/calculators/mortgage-taxes-insurance/MortgageTaxesInsuranceCalculator').then((mod) => ({\n" +
    "      default: mod.MortgageTaxesInsuranceCalculator,\n" +
    "    })),\n" +
    "  ),\n" +
    "  MortgageComparisonCalculator: lazyTool(() =>\n" +
    "    import('@/tools/calculators/mortgage-comparison/MortgageComparisonCalculator').then((mod) => ({\n" +
    "      default: mod.MortgageComparisonCalculator,\n" +
    "    })),\n" +
    "  ),\n" +
    "  HomeMortgageCalculator:";
  if (!text.includes(needle)) throw new Error('index needle missing');
  return text.replace(needle, repl);
}

function patchDetails(text) {
  const needle =
    "  MortgageTaxesInsuranceCalculator: () => import('@/tools/calculators/mortgage-taxes-insurance/detail'),\n" +
    "  HomeMortgageCalculator:";
  const repl =
    "  MortgageTaxesInsuranceCalculator: () => import('@/tools/calculators/mortgage-taxes-insurance/detail'),\n" +
    "  MortgageComparisonCalculator: () =>\n" +
    "    import('@/tools/calculators/mortgage-comparison/detail'),\n" +
    "  HomeMortgageCalculator:";
  if (!text.includes(needle)) throw new Error('details needle missing');
  return text.replace(needle, repl);
}

function patchSlug(text) {
  const needle =
    "  'mortgage-calculator-with-taxes-and-insurance',\n" +
    "  'home-mortgage-calculator',";
  const repl =
    "  'mortgage-calculator-with-taxes-and-insurance',\n" +
    "  'mortgage-comparison-calculator',\n" +
    "  'home-mortgage-calculator',";
  if (!text.includes(needle)) throw new Error('slug needle missing');
  return text.replace(needle, repl);
}

function patchChangelog(text) {
  const entry =
    "### 2026-11-17 — Mortgage Comparison Calculator (Screenshot-First + FX)\n" +
    "- **Summary:** Shipped Mortgage Comparison Calculator on existing catalog slug `mortgage-comparison-calculator` (`MortgageComparisonCalculator`, catalog `6af46f0fa27d8d1d4e98ff75`). Screenshot is a single mortgage scenario (no dual-form comparison UI verified). Specs + Further specifications (PMI / tax / insurance / other) + summary + doughnut. Independent real FX on money fields; normalize into home-value currency. Activated.\n" +
    "- **Comparison note:** Dual Scenario A/B UI not evidenced; comparison is by changing inputs on one form (Omni “compare constructions” wording).\n" +
    "- **Example:** 150,000 / 10% / 4.5% / 30y → payment ≈ 684.03; 360 payments ≈ 246,249.06; interest ≈ 111,249.06; PMI ≈ 4,106.25; total with costs ≈ 250,355.31.\n" +
    "- **Important Files:** `frontend/src/tools/calculators/mortgage-comparison/*`, registries, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-comparison-tool.ts`, `brain/*`.\n" +
    "- **Verification:** Catalog verified undeveloped before coding. Formula self-check. MongoDB activated (`isDeveloped`/`isActive`/`indexable` true, `embedEnabled` true). Lint/builds/browser/automated tests omitted per user.\n\n";
  const marker = "---\n\n";
  const idx = text.indexOf(marker);
  if (idx < 0) throw new Error('changelog marker missing');
  const at = idx + marker.length;
  return text.slice(0, at) + entry + text.slice(at);
}

function patchCurrentState(text) {
  const line =
    "- **Mortgage Comparison Calculator (`/tools/mortgage-comparison-calculator`):** Live client-side single-scenario mortgage (`componentKey: 'MortgageComparisonCalculator'`, catalog `6af46f0fa27d8d1d4e98ff75`). Screenshot shows one mortgage form (no dual Scenario A/B UI). Specs: home value, synced down payment, loan, rate, term, US/UK vs Canada method, payment frequency, first day, P&I payment; Further specifications PMI % / property tax % / homeowners insurance / other costs; summary + principal/interest/PMI/other doughnut. Independent real FX on money fields (Margin Interest pattern). Compare constructions by changing inputs. Example 150k / 10% / 4.5% / 30y → ≈ 684.03; PMI 4,106.25; total with costs ≈ 250,355.31. Activated.\n";
  const needle =
    "- **Mortgage Calculator with Taxes and Insurance (`/tools/mortgage-calculator-with-taxes-and-insurance`):";
  const idx = text.indexOf(needle);
  if (idx < 0) throw new Error('CURRENT_STATE needle missing');
  const end = text.indexOf("\n- **", idx + 1);
  return text.slice(0, end + 1) + line + text.slice(end + 1);
}

function patchFrontend(text) {
  const insert =
    "- `src/tools/calculators/mortgage-comparison/`: Mortgage Comparison Calculator (`MortgageComparisonCalculator`, slug `mortgage-comparison-calculator`). Single-scenario Omni mortgage form (no dual A/B UI); P&I + PMI/tax/insurance/other; doughnut; independent FX; compare by changing inputs.\n";
  const needle = "- `src/tools/calculators/mortgage-taxes-insurance/:";
  // actual needle uses backticks; fix:
  const real = "- `src/tools/calculators/mortgage-taxes-insurance/:";
  void real;
  const n = "- `src/tools/calculators/mortgage-taxes-insurance/`:";
  const idx = text.indexOf(n);
  if (idx < 0) throw new Error('FRONTEND needle missing');
  const end = text.indexOf("\n", idx);
  return text.slice(0, end + 1) + insert + text.slice(end + 1);
}

function patchTasks(text) {
  const row =
    "| `TOOL-335` | Implement Mortgage Comparison Calculator on existing slug `mortgage-comparison-calculator` with single-scenario Omni mortgage form, PMI/tax/insurance further specs, doughnut, independent FX, guide/SEO/embed, and verified activation (no dual Scenario A/B without evidence) | Cursor | Completed | `frontend/src/tools/calculators/mortgage-comparison/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-mortgage-comparison-tool.ts`, `brain/*` | `TOOL-334` |\n";
  const needle = "| `TOOL-334` |";
  const idx = text.indexOf(needle);
  if (idx < 0) throw new Error('TASKS needle missing');
  const end = text.indexOf("\n", idx);
  return text.slice(0, end + 1) + row + text.slice(end + 1);
}

const files = [
  ['frontend/src/tools/registry/keys.ts', patchKeys],
  ['frontend/src/tools/registry/tool.key.ts', patchKeys],
  ['backend/src/modules/tools/tool.key.ts', patchKeys],
  ['frontend/src/tools/registry/index.ts', patchIndex],
  ['frontend/src/tools/registry/details.ts', patchDetails],
  ['frontend/src/tools/registry/sitemap.ts', patchSlug],
  ['frontend/src/app/sitemap.ts', patchSlug],
  ['frontend/src/app/(website)/tools/[slug]/page.tsx', patchSlug],
  ['frontend/src/app/embed/[slug]/page.tsx', patchSlug],
  ['brain/CHANGELOG.md', patchChangelog],
  ['brain/CURRENT_STATE.md', patchCurrentState],
  ['brain/FRONTEND.md', patchFrontend],
  ['brain/TASKS.md', patchTasks],
];

for (const [rel, fn] of files) {
  write(rel, fn(show(rel)));
}

console.log('OK from HEAD + MortgageComparison only');
