import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text, 'utf8');
}

function insertAfter(haystack, needle, insertion) {
  if (haystack.includes(insertion.trim())) return haystack;
  const idx = haystack.indexOf(needle);
  if (idx === -1) throw new Error(`Needle not found: ${needle.slice(0, 120)}`);
  return haystack.slice(0, idx + needle.length) + insertion + haystack.slice(idx + needle.length);
}

function ensureKeyLists(text) {
  let next = text;
  if (!next.includes("'CarLoanEmiCalculator'")) {
    if (next.includes("  'CarInterestCalculator',\n  'CarriedInterestCalculator',")) {
      next = next.replaceAll(
        "  'CarInterestCalculator',\n  'CarriedInterestCalculator',",
        "  'CarInterestCalculator',\n  'CarLoanEmiCalculator',\n  'CarriedInterestCalculator',"
      );
    } else {
      next = next.replaceAll(
        "  'CapitalGainsYieldCalculator',\n  'CarriedInterestCalculator',",
        "  'CapitalGainsYieldCalculator',\n  'CarLoanEmiCalculator',\n  'CarriedInterestCalculator',"
      );
    }
  }
  if (
    !next.includes("!isApprovedComponentKey('CarLoanEmiCalculator')") &&
    next.includes("!isApprovedComponentKey('CapitalGainsYieldCalculator')")
  ) {
    if (
      next.includes(
        "!isApprovedComponentKey('CarInterestCalculator') ||\n    !isApprovedComponentKey('CarriedInterestCalculator')"
      )
    ) {
      next = next.replaceAll(
        "    !isApprovedComponentKey('CarInterestCalculator') ||\n    !isApprovedComponentKey('CarriedInterestCalculator') ||",
        "    !isApprovedComponentKey('CarInterestCalculator') ||\n    !isApprovedComponentKey('CarLoanEmiCalculator') ||\n    !isApprovedComponentKey('CarriedInterestCalculator') ||"
      );
    } else {
      next = next.replaceAll(
        "    !isApprovedComponentKey('CapitalGainsYieldCalculator') ||\n    !isApprovedComponentKey('CarriedInterestCalculator') ||",
        "    !isApprovedComponentKey('CapitalGainsYieldCalculator') ||\n    !isApprovedComponentKey('CarLoanEmiCalculator') ||\n    !isApprovedComponentKey('CarriedInterestCalculator') ||"
      );
    }
  }
  if (!next.includes("'CarLoanEmiCalculator'")) {
    throw new Error('Failed to insert CarLoanEmiCalculator key');
  }
  return next;
}

write('frontend/src/tools/registry/keys.ts', ensureKeyLists(read('frontend/src/tools/registry/keys.ts')));
write('backend/src/modules/tools/tool.key.ts', ensureKeyLists(read('backend/src/modules/tools/tool.key.ts')));
write('frontend/src/tools/registry/tool.key.ts', ensureKeyLists(read('frontend/src/tools/registry/tool.key.ts')));

{
  const rel = 'frontend/src/tools/registry/details.ts';
  let text = read(rel);
  if (!text.includes('CarLoanEmiCalculator:')) {
    if (text.includes("CarInterestCalculator:")) {
      text = insertAfter(
        text,
        "  CarInterestCalculator: () =>\n    import('@/tools/calculators/car-interest/detail'),\n",
        "  CarLoanEmiCalculator: () =>\n    import('@/tools/calculators/car-loan-emi/detail'),\n"
      );
    } else {
      text = insertAfter(
        text,
        "  MortgageCalculatorUk: () =>\n    import('@/tools/calculators/mortgage-uk/detail'),\n",
        "  CarLoanEmiCalculator: () =>\n    import('@/tools/calculators/car-loan-emi/detail'),\n"
      );
    }
  }
  write(rel, text);
}

{
  const rel = 'frontend/src/tools/registry/index.ts';
  let text = read(rel);
  if (!text.includes('CarLoanEmiCalculator:')) {
    if (text.includes('CarInterestCalculator: lazyTool')) {
      text = insertAfter(
        text,
        "  CarInterestCalculator: lazyTool(() =>\n    import('@/tools/calculators/car-interest/CarInterestCalculator').then((mod) => ({\n      default: mod.CarInterestCalculator,\n    })),\n  ),\n",
        "  CarLoanEmiCalculator: lazyTool(() =>\n    import('@/tools/calculators/car-loan-emi/CarLoanEmiCalculator').then((mod) => ({\n      default: mod.CarLoanEmiCalculator,\n    })),\n  ),\n"
      );
    } else {
      text = insertAfter(
        text,
        "  MortgageCalculatorUk: lazyTool(() =>\n    import('@/tools/calculators/mortgage-uk/MortgageCalculatorUk').then((mod) => ({\n      default: mod.MortgageCalculatorUk,\n    })),\n  ),\n",
        "  CarLoanEmiCalculator: lazyTool(() =>\n    import('@/tools/calculators/car-loan-emi/CarLoanEmiCalculator').then((mod) => ({\n      default: mod.CarLoanEmiCalculator,\n    })),\n  ),\n"
      );
    }
  }
  write(rel, text);
}

const slugFiles = [
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/registry/sitemap.ts',
];
for (const rel of slugFiles) {
  let text = read(rel);
  if (!text.includes("'car-loan-emi-calculator'")) {
    if (text.includes("'car-interest-calculator',")) {
      text = text.replace(
        "  'car-interest-calculator',\n",
        "  'car-interest-calculator',\n  'car-loan-emi-calculator',\n"
      );
    } else {
      text = text.replace(
        "  'capital-gains-yield-calculator',\n",
        "  'capital-gains-yield-calculator',\n  'car-loan-emi-calculator',\n"
      );
    }
  }
  if (!text.includes("'car-loan-emi-calculator'")) {
    throw new Error(`Failed to insert slug into ${rel}`);
  }
  write(rel, text);
}

console.log('OK CarLoanEmi registry patch applied at', root);
