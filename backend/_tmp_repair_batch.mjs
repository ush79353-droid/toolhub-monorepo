/**
 * Repair + commit ONE calculator from the ordered list by index (1-based among remaining after Loan Interest).
 * Usage: node _tmp_repair_batch.mjs --n 2
 * Or: node _tmp_repair_batch.mjs --all-from 2
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('..');

const TOOLS = [
  // n matching user order 1..42; #1 already done
  {
    n: 1,
    key: 'LoanInterestCalculator',
    slug: 'loan-interest-calculator',
    dir: 'loan-interest',
    exp: 'LoanInterestCalculator',
    done: true,
  },
  {
    n: 2,
    key: 'TimesInterestEarnedCalculator',
    slug: 'times-interest-earned-ratio-calculator',
    dir: 'times-interest-earned',
    exp: 'TimesInterestEarnedCalculator',
  },
  {
    n: 3,
    key: 'InterestRateParityCalculator',
    slug: 'interest-rate-parity-calculator',
    dir: 'interest-rate-parity',
    exp: 'InterestRateParityCalculator',
  },
  { n: 4, key: 'DebtCalculator', slug: 'debt-calculator', dir: 'debt', exp: 'DebtCalculator' },
  {
    n: 5,
    key: 'AfterTaxCostOfDebtCalculator',
    slug: 'after-tax-cost-of-debt-calculator',
    dir: 'after-tax-cost-of-debt',
    exp: 'AfterTaxCostOfDebtCalculator',
  },
  {
    n: 6,
    key: 'DebtAvalancheCalculator',
    slug: 'debt-avalanche-calculator',
    dir: 'debt-avalanche',
    exp: 'DebtAvalancheCalculator',
  },
  {
    n: 7,
    key: 'DebtServiceCoverageRatioCalculator',
    slug: 'debt-service-coverage-ratio-calculator-dscr',
    dir: 'debt-service-coverage-ratio',
    exp: 'DebtServiceCoverageRatioCalculator',
  },
  {
    n: 8,
    key: 'DebtSnowballCalculator',
    slug: 'debt-snowball-calculator',
    dir: 'debt-snowball',
    exp: 'DebtSnowballCalculator',
  },
  {
    n: 9,
    key: 'DebtToAssetRatioCalculator',
    slug: 'debt-to-asset-ratio-calculator',
    dir: 'debt-to-asset-ratio',
    exp: 'DebtToAssetRatioCalculator',
  },
  {
    n: 10,
    key: 'DebtToEquityCalculator',
    slug: 'debt-to-equity-calculator',
    dir: 'debt-to-equity',
    exp: 'DebtToEquityCalculator',
  },
  {
    n: 11,
    key: 'DebtToCapitalRatioCalculator',
    slug: 'debt-to-capital-ratio-calculator',
    dir: 'debt-to-capital-ratio',
    exp: 'DebtToCapitalRatioCalculator',
  },
  {
    n: 12,
    key: 'NetDebtCalculator',
    slug: 'net-debt-calculator',
    dir: 'net-debt',
    exp: 'NetDebtCalculator',
  },
  {
    n: 13,
    key: 'EbitdaMarginCalculator',
    slug: 'ebitda-margin-calculator',
    dir: 'ebitda-margin',
    exp: 'EbitdaMarginCalculator',
  },
  {
    n: 14,
    key: 'GrossMarginCalculator',
    slug: 'gross-margin-calculator',
    dir: 'gross-margin',
    exp: 'GrossMarginCalculator',
  },
  {
    n: 15,
    key: 'MarginAndMarkupCalculator',
    slug: 'margin-and-markup-calculator',
    dir: 'margin-and-markup',
    exp: 'MarginAndMarkupCalculator',
  },
  {
    n: 16,
    key: 'MarginAndVatCalculator',
    slug: 'margin-and-vat-calculator',
    dir: 'margin-and-vat',
    exp: 'MarginAndVatCalculator',
  },
  {
    n: 17,
    key: 'MarginCalculatorClassic',
    slug: 'margin-calculator-classic',
    dir: 'margin-calculator-classic',
    exp: 'MarginCalculatorClassicCalculator',
  },
  {
    n: 18,
    key: 'MarginCallCalculator',
    slug: 'margin-call-calculator',
    dir: 'margin-call',
    exp: 'MarginCallCalculator',
  },
  {
    n: 19,
    key: 'MarginOfSafetyCalculator',
    slug: 'margin-of-safety-calculator',
    dir: 'margin-of-safety',
    exp: 'MarginOfSafetyCalculator',
  },
  {
    n: 20,
    key: 'OperatingMarginCalculator',
    slug: 'operating-margin-calculator',
    dir: 'operating-margin',
    exp: 'OperatingMarginCalculator',
  },
  {
    n: 21,
    key: 'AnnuityCalculator',
    slug: 'annuity-calculator',
    dir: 'annuity',
    exp: 'AnnuityCalculator',
  },
  {
    n: 22,
    key: 'AnnuityPayoutCalculator',
    slug: 'annuity-payout-calculator',
    dir: 'annuity-payout',
    exp: 'AnnuityPayoutCalculator',
  },
  {
    n: 23,
    key: 'DeferredAnnuityCalculator',
    slug: 'deferred-annuity-calculator',
    dir: 'deferred-annuity',
    exp: 'DeferredAnnuityCalculator',
  },
  {
    n: 24,
    key: 'FutureValueOfAnnuityCalculator',
    slug: 'future-value-of-annuity-calculator',
    dir: 'future-value-of-annuity',
    exp: 'FutureValueOfAnnuityCalculator',
  },
  {
    n: 25,
    key: 'GrowingAnnuityCalculator',
    slug: 'growing-annuity-calculator',
    dir: 'growing-annuity',
    exp: 'GrowingAnnuityCalculator',
  },
  {
    n: 26,
    key: 'ImmediateAnnuityCalculator',
    slug: 'immediate-annuity-calculator',
    dir: 'immediate-annuity',
    exp: 'ImmediateAnnuityCalculator',
  },
  {
    n: 27,
    key: 'LotteryAnnuityCalculator',
    slug: 'lottery-annuity-calculator',
    dir: 'lottery-annuity',
    exp: 'LotteryAnnuityCalculator',
  },
  {
    n: 28,
    key: 'PresentValueOfAnnuityCalculator',
    slug: 'present-value-of-annuity-calculator',
    dir: 'present-value-of-annuity',
    exp: 'PresentValueOfAnnuityCalculator',
  },
  {
    n: 29,
    key: 'VariableAnnuityCalculator',
    slug: 'variable-annuity-calculator',
    dir: 'variable-annuity',
    exp: 'VariableAnnuityCalculator',
  },
  {
    n: 30,
    key: 'OvertimeCalculator',
    slug: 'overtime-calculator',
    dir: 'overtime',
    exp: 'OvertimeCalculator',
  },
  {
    n: 31,
    key: 'CaliforniaOvertimeCalculator',
    slug: 'california-overtime-calculator',
    dir: 'california-overtime',
    exp: 'CaliforniaOvertimeCalculator',
  },
  {
    n: 32,
    key: 'FloridaOvertimeCalculator',
    slug: 'florida-overtime-calculator',
    dir: 'florida-overtime',
    exp: 'FloridaOvertimeCalculator',
  },
  {
    n: 33,
    key: 'GeorgiaOvertimeCalculator',
    slug: 'georgia-overtime-calculator',
    dir: 'georgia-overtime',
    exp: 'GeorgiaOvertimeCalculator',
  },
  {
    n: 34,
    key: 'IllinoisOvertimeCalculator',
    slug: 'illinois-overtime-calculator',
    dir: 'illinois-overtime',
    exp: 'IllinoisOvertimeCalculator',
  },
  {
    n: 35,
    key: 'NewYorkOvertimeCalculator',
    slug: 'new-york-overtime-calculator',
    dir: 'new-york-overtime',
    exp: 'NewYorkOvertimeCalculator',
  },
  {
    n: 36,
    key: 'OvertimePaycheckCalculator',
    slug: 'overtime-paycheck-calculator',
    dir: 'overtime-paycheck',
    exp: 'OvertimePaycheckCalculator',
  },
  {
    n: 37,
    key: 'SalaryWithOvertimeCalculator',
    slug: 'salary-calculator-with-overtime',
    dir: 'salary-with-overtime',
    exp: 'SalaryWithOvertimeCalculator',
  },
  {
    n: 38,
    key: 'TexasOvertimeCalculator',
    slug: 'texas-overtime-calculator',
    dir: 'texas-overtime',
    exp: 'TexasOvertimeCalculator',
  },
  {
    n: 39,
    key: 'GrossRentMultiplierCalculator',
    slug: 'gross-rent-multiplier-calculator',
    dir: 'gross-rent-multiplier',
    exp: 'GrossRentMultiplierCalculator',
  },
  {
    n: 40,
    key: 'NetEffectiveRentCalculator',
    slug: 'net-effective-rent-calculator',
    dir: 'net-effective-rent',
    exp: 'NetEffectiveRentCalculator',
  },
  {
    n: 41,
    key: 'RentIncreaseCalculator',
    slug: 'rent-increase-calculator',
    dir: 'rent-increase',
    exp: 'RentIncreaseCalculator',
  },
  {
    n: 42,
    key: 'RentOrBuyCalculator',
    slug: 'rent-or-buy-calculator',
    dir: 'rent-or-buy',
    exp: 'RentOrBuyCalculator',
  },
];

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function run(cmd, args, cwd = root) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: true });
  if (r.status !== 0) {
    console.error(r.stdout);
    console.error(r.stderr);
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
  }
  return r.stdout;
}

function verify(tool) {
  const keys = fs.readFileSync(
    path.join(root, 'frontend/src/tools/registry/keys.ts'),
    'utf8',
  );
  const a = (keys.match(/APPROVED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) ||
    [])[1];
  const r = (keys.match(/REGISTERED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) ||
    [])[1];
  if (!a?.includes(`'${tool.key}'`)) throw new Error('missing APPROVED ' + tool.key);
  if (!r?.includes(`'${tool.key}'`)) throw new Error('missing REGISTERED ' + tool.key);
  const index = fs.readFileSync(
    path.join(root, 'frontend/src/tools/registry/index.ts'),
    'utf8',
  );
  if (!new RegExp(`${tool.key}\\s*:`).test(index)) throw new Error('missing lazy');
  const details = fs.readFileSync(
    path.join(root, 'frontend/src/tools/registry/details.ts'),
    'utf8',
  );
  if (!new RegExp(`${tool.key}\\s*:`).test(details)) throw new Error('missing details');
  const page = fs.readFileSync(
    path.join(root, 'frontend/src/app/(website)/tools/[slug]/page.tsx'),
    'utf8',
  );
  if (!page.includes(`'${tool.slug}'`)) throw new Error('missing FX slug');
  const be = fs.readFileSync(
    path.join(root, 'backend/src/modules/tools/tool.key.ts'),
    'utf8',
  );
  if (!be.includes(`'${tool.key}'`)) throw new Error('missing backend key');
}

function repairOne(tool) {
  console.log(`\n=== Repair #${tool.n} ${tool.key} ===`);
  const out = run('node', [
    path.join(root, 'backend/_tmp_repair_one.mjs'),
    '--key',
    tool.key,
    '--slug',
    tool.slug,
    '--dir',
    tool.dir,
    '--export',
    tool.exp,
    '--fx',
    '--fe-tool-key',
  ], path.join(root, 'backend'));
  console.log(out.trim());
  verify(tool);
  const msg = `fix(registry): register ${tool.slug.replace(/-calculator$/, '').replace(/-/g, ' ')} calculator and FX slug`;
  run('git', [
    'add',
    '--',
    'backend/src/modules/tools/tool.key.ts',
    'frontend/src/app/(website)/tools/[slug]/page.tsx',
    'frontend/src/app/sitemap.ts',
    'frontend/src/tools/registry/details.ts',
    'frontend/src/tools/registry/index.ts',
    'frontend/src/tools/registry/keys.ts',
    'frontend/src/tools/registry/sitemap.ts',
    'frontend/src/tools/registry/tool.key.ts',
  ]);
  // PowerShell-friendly commit via -m
  const c = spawnSync(
    'git',
    ['commit', '-m', msg],
    { cwd: root, encoding: 'utf8', shell: true },
  );
  if (c.status !== 0) {
    console.error(c.stdout, c.stderr);
    throw new Error('commit failed for ' + tool.key);
  }
  const hash = run('git', ['log', '-1', '--format=%H']).trim();
  console.log('COMMIT', hash, msg);
  return { n: tool.n, key: tool.key, slug: tool.slug, hash, status: 'repaired' };
}

const nArg = arg('--n');
const allFrom = arg('--all-from');
const results = [];

if (nArg) {
  const tool = TOOLS.find((t) => t.n === Number(nArg));
  if (!tool || tool.done) throw new Error('bad --n');
  results.push(repairOne(tool));
} else if (allFrom) {
  const start = Number(allFrom);
  for (const tool of TOOLS) {
    if (tool.n < start || tool.done) continue;
    results.push(repairOne(tool));
  }
} else {
  throw new Error('Need --n or --all-from');
}

fs.writeFileSync(
  path.join(root, 'backend/_tmp_repair_results.json'),
  JSON.stringify(results, null, 2),
);
console.log('\nDONE', results.length);
