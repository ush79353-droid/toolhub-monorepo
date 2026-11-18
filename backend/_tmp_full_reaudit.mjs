import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('..');
const keys = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/keys.ts'), 'utf8');
const a = (keys.match(/APPROVED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) || [])[1] || '';
const r = (keys.match(/REGISTERED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) || [])[1] || '';
const idx = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/index.ts'), 'utf8');
const det = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/details.ts'), 'utf8');
const be = fs.readFileSync(path.join(root, 'backend/src/modules/tools/tool.key.ts'), 'utf8');
const page = fs.readFileSync(
  path.join(root, 'frontend/src/app/(website)/tools/[slug]/page.tsx'),
  'utf8',
);
const app = fs.readFileSync(path.join(root, 'frontend/src/app/sitemap.ts'), 'utf8');
const reg = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/sitemap.ts'), 'utf8');

// Original 65 from audit (key, slug, dir, fxRequired)
const tools = [
  // 19 originally DEVELOPED — verify still intact
  ['AutoLoanCalculator', 'auto-loan-calculator', 'auto-loan', true],
  ['MortgageCalculator', 'mortgage-calculator', 'mortgage', true],
  ['LoanCalculator', 'loan-calculator', 'loan', true],
  ['AmortizationCalculator', 'amortization-calculator', 'amortization', true],
  ['InterestCalculator', 'interest-calculator', 'interest', true],
  ['CompoundInterestCalculator', 'compound-interest-calculator', 'compound-interest', true],
  ['SimpleInterestCalculator', 'simple-interest-calculator', 'simple-interest', true],
  ['AprCalculator', 'apr-calculator', 'apr', true],
  ['ApyCalculator', 'apy-calculator', 'apy', true],
  ['PaymentCalculator', 'payment-calculator', 'payment', true],
  ['RefinanceCalculator', 'refinance-calculator', 'refinance', true],
  ['LeaseCalculator', 'lease-calculator', 'lease', true],
  ['VatCalculator', 'vat-calculator', 'vat', true],
  ['SalesTaxCalculator', 'sales-tax-calculator', 'sales-tax', true],
  ['DiscountCalculator', 'discount-calculator', 'discount', true],
  ['TipCalculator', 'tip-calculator', 'tip', true],
  ['PercentageCalculator', 'percentage-calculator', 'percentage', false],
  ['BmiCalculator', 'bmi-calculator', 'bmi', false],
  ['AgeCalculator', 'age-calculator', 'age', false],
];

// The exact 46 PARTIAL from this task
const partial46 = [
  ['LoanInterestCalculator', 'loan-interest-calculator', 'loan-interest', true],
  ['TimesInterestEarnedCalculator', 'times-interest-earned-calculator', 'times-interest-earned', true],
  ['InterestRateParityCalculator', 'interest-rate-parity-calculator', 'interest-rate-parity', true],
  ['DebtCalculator', 'debt-calculator', 'debt', true],
  ['AfterTaxCostOfDebtCalculator', 'after-tax-cost-of-debt-calculator', 'after-tax-cost-of-debt', true],
  ['DebtAvalancheCalculator', 'debt-avalanche-calculator', 'debt-avalanche', true],
  ['DebtServiceCoverageRatioCalculator', 'debt-service-coverage-ratio-calculator', 'debt-service-coverage-ratio', true],
  ['DebtSnowballCalculator', 'debt-snowball-calculator', 'debt-snowball', true],
  ['DebtToAssetRatioCalculator', 'debt-to-asset-ratio-calculator', 'debt-to-asset-ratio', true],
  ['DebtToEquityCalculator', 'debt-to-equity-calculator', 'debt-to-equity', true],
  ['DebtToCapitalRatioCalculator', 'debt-to-capital-ratio-calculator', 'debt-to-capital-ratio', true],
  ['NetDebtCalculator', 'net-debt-calculator', 'net-debt', true],
  ['EbitdaMarginCalculator', 'ebitda-margin-calculator', 'ebitda-margin', true],
  ['GrossMarginCalculator', 'gross-margin-calculator', 'gross-margin', true],
  ['MarginAndMarkupCalculator', 'margin-and-markup-calculator', 'margin-and-markup', true],
  ['MarginAndVatCalculator', 'margin-and-vat-calculator', 'margin-and-vat', true],
  ['MarginCalculatorClassic', 'margin-calculator-classic', 'margin-calculator-classic', true],
  ['MarginCallCalculator', 'margin-call-calculator', 'margin-call', true],
  ['MarginOfSafetyCalculator', 'margin-of-safety-calculator', 'margin-of-safety', true],
  ['OperatingMarginCalculator', 'operating-margin-calculator', 'operating-margin', true],
  ['AnnuityCalculator', 'annuity-calculator', 'annuity', true],
  ['AnnuityPayoutCalculator', 'annuity-payout-calculator', 'annuity-payout', true],
  ['DeferredAnnuityCalculator', 'deferred-annuity-calculator', 'deferred-annuity', true],
  ['FutureValueOfAnnuityCalculator', 'future-value-of-annuity-calculator', 'future-value-of-annuity', true],
  ['GrowingAnnuityCalculator', 'growing-annuity-calculator', 'growing-annuity', true],
  ['ImmediateAnnuityCalculator', 'immediate-annuity-calculator', 'immediate-annuity', true],
  ['LotteryAnnuityCalculator', 'lottery-annuity-calculator', 'lottery-annuity', true],
  ['PresentValueOfAnnuityCalculator', 'present-value-of-annuity-calculator', 'present-value-of-annuity', true],
  ['VariableAnnuityCalculator', 'variable-annuity-calculator', 'variable-annuity', true],
  ['OvertimeCalculator', 'overtime-calculator', 'overtime', true],
  ['CaliforniaOvertimeCalculator', 'california-overtime-calculator', 'california-overtime', true],
  ['FloridaOvertimeCalculator', 'florida-overtime-calculator', 'florida-overtime', true],
  ['GeorgiaOvertimeCalculator', 'georgia-overtime-calculator', 'georgia-overtime', true],
  ['IllinoisOvertimeCalculator', 'illinois-overtime-calculator', 'illinois-overtime', true],
  ['NewYorkOvertimeCalculator', 'new-york-overtime-calculator', 'new-york-overtime', true],
  ['OvertimePaycheckCalculator', 'overtime-paycheck-calculator', 'overtime-paycheck', true],
  ['SalaryWithOvertimeCalculator', 'salary-calculator-with-overtime', 'salary-with-overtime', true],
  ['TexasOvertimeCalculator', 'texas-overtime-calculator', 'texas-overtime', true],
  ['GrossRentMultiplierCalculator', 'gross-rent-multiplier-calculator', 'gross-rent-multiplier', true],
  ['NetEffectiveRentCalculator', 'net-effective-rent-calculator', 'net-effective-rent', true],
  ['RentIncreaseCalculator', 'rent-increase-calculator', 'rent-increase', true],
  ['RentOrBuyCalculator', 'rent-or-buy-calculator', 'rent-or-buy', true],
  ['CarInterestCalculator', 'car-interest-calculator', 'car-interest', true],
  ['TdsInterestCalculator', 'tds-interest-calculator', 'tds-interest', false],
  ['HealsActStimulusCalculator', 'second-stimulus-check-calculator-heals-act', 'heals-act-stimulus', false],
  ['SecondStimulus900BillionCalculator', 'second-stimulus-check-calculator-900-billion-bill', 'second-stimulus-900-billion', false],
];

function check(k, s, dir, fx) {
  const modulePath = path.join(
    root,
    `frontend/src/tools/calculators/${dir}`,
  );
  const hasModule = fs.existsSync(modulePath);
  const okA = a.includes(`'${k}'`);
  const okR = r.includes(`'${k}'`);
  const okL = new RegExp(`${k}\\s*:`).test(idx);
  const okD = new RegExp(`${k}\\s*:`).test(det);
  const okB = be.includes(`'${k}'`);
  const okFx = !fx || page.includes(`'${s}'`);
  const okSm = app.includes(`'${s}'`) && reg.includes(`'${s}'`);
  const developed =
    hasModule && okA && okR && okL && okD && okB && okFx && okSm;
  return {
    k,
    s,
    developed,
    hasModule,
    okA,
    okR,
    okL,
    okD,
    okB,
    okFx,
    okSm,
  };
}

console.log('=== 46 PARTIAL REPAIR TARGETS ===');
let developed = 0;
let partial = 0;
const gaps = [];
for (const t of partial46) {
  const c = check(...t);
  if (c.developed) {
    developed++;
    console.log(`DEVELOPED ${c.k}`);
  } else {
    partial++;
    gaps.push(c);
    console.log(
      `PARTIAL ${c.k} mod=${c.hasModule} A=${c.okA} R=${c.okR} L=${c.okL} D=${c.okD} BE=${c.okB} FX=${c.okFx} SM=${c.okSm}`,
    );
  }
}
console.log(`46-set: DEVELOPED=${developed} PARTIAL=${partial}`);

// Duplicate key check
const approved = [...a.matchAll(/\n  '([^']+)'/g)].map((m) => m[1]);
const registered = [...r.matchAll(/\n  '([^']+)'/g)].map((m) => m[1]);
const dupA = approved.filter((x, i) => approved.indexOf(x) !== i);
const dupR = registered.filter((x, i) => registered.indexOf(x) !== i);
console.log('dup APPROVED', [...new Set(dupA)]);
console.log('dup REGISTERED', [...new Set(dupR)]);

// FX slug dups
const fxBody =
  (page.match(/CURRENCY_CONVERSION_SLUGS = new Set\(\[([\s\S]*?)\]\)/) ||
    [])[1] || '';
const fxSlugs = [...fxBody.matchAll(/\n  '([^']+)'/g)].map((m) => m[1]);
const dupFx = fxSlugs.filter((x, i) => fxSlugs.indexOf(x) !== i);
console.log('dup FX', [...new Set(dupFx)]);
