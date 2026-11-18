import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('..');
const keys = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/keys.ts'), 'utf8');
const a = (keys.match(/APPROVED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) || [])[1] || '';
const r = (keys.match(/REGISTERED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) || [])[1] || '';
const idx = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/index.ts'), 'utf8');
const det = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/details.ts'), 'utf8');
const be = fs.readFileSync(path.join(root, 'backend/src/modules/tools/tool.key.ts'), 'utf8');
const fe = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/tool.key.ts'), 'utf8');
const page = fs.readFileSync(
  path.join(root, 'frontend/src/app/(website)/tools/[slug]/page.tsx'),
  'utf8',
);
const app = fs.readFileSync(path.join(root, 'frontend/src/app/sitemap.ts'), 'utf8');
const reg = fs.readFileSync(path.join(root, 'frontend/src/tools/registry/sitemap.ts'), 'utf8');

const tools = [
  ['22', 'AnnuityPayoutCalculator', 'annuity-payout-calculator', true],
  ['23', 'DeferredAnnuityCalculator', 'deferred-annuity-calculator', true],
  ['24', 'FutureValueOfAnnuityCalculator', 'future-value-of-annuity-calculator', true],
  ['25', 'GrowingAnnuityCalculator', 'growing-annuity-calculator', true],
  ['26', 'ImmediateAnnuityCalculator', 'immediate-annuity-calculator', true],
  ['27', 'LotteryAnnuityCalculator', 'lottery-annuity-calculator', true],
  ['28', 'PresentValueOfAnnuityCalculator', 'present-value-of-annuity-calculator', true],
  ['29', 'VariableAnnuityCalculator', 'variable-annuity-calculator', true],
  ['30', 'OvertimeCalculator', 'overtime-calculator', true],
  ['31', 'CaliforniaOvertimeCalculator', 'california-overtime-calculator', true],
  ['32', 'FloridaOvertimeCalculator', 'florida-overtime-calculator', true],
  ['33', 'GeorgiaOvertimeCalculator', 'georgia-overtime-calculator', true],
  ['34', 'IllinoisOvertimeCalculator', 'illinois-overtime-calculator', true],
  ['35', 'NewYorkOvertimeCalculator', 'new-york-overtime-calculator', true],
  ['36', 'OvertimePaycheckCalculator', 'overtime-paycheck-calculator', true],
  ['37', 'SalaryWithOvertimeCalculator', 'salary-calculator-with-overtime', true],
  ['38', 'TexasOvertimeCalculator', 'texas-overtime-calculator', true],
  ['39', 'GrossRentMultiplierCalculator', 'gross-rent-multiplier-calculator', true],
  ['40', 'NetEffectiveRentCalculator', 'net-effective-rent-calculator', true],
  ['41', 'RentIncreaseCalculator', 'rent-increase-calculator', true],
  ['42', 'RentOrBuyCalculator', 'rent-or-buy-calculator', true],
  ['43', 'CarInterestCalculator', 'car-interest-calculator', true],
  ['44', 'TdsInterestCalculator', 'tds-interest-calculator', false],
  ['45', 'HealsActStimulusCalculator', 'second-stimulus-check-calculator-heals-act', false],
  ['46', 'SecondStimulus900BillionCalculator', 'second-stimulus-check-calculator-900-billion-bill', false],
];

for (const [n, k, s, fx] of tools) {
  const okA = a.includes(`'${k}'`);
  const okR = r.includes(`'${k}'`);
  const okL = new RegExp(`${k}\\s*:`).test(idx);
  const okD = new RegExp(`${k}\\s*:`).test(det);
  const okB = be.includes(`'${k}'`);
  const okF = fe.includes(`'${k}'`);
  const okFx = !fx || page.includes(`'${s}'`);
  const okSm = app.includes(`'${s}'`) && reg.includes(`'${s}'`);
  const ok = okA && okR && okL && okD && okB && okFx && okSm;
  if (!ok) {
    console.log(
      `NEED ${n} ${k} A=${okA} R=${okR} L=${okL} D=${okD} BE=${okB} FE=${okF} FX=${okFx} SM=${okSm}`,
    );
  } else {
    console.log(`OK ${n} ${k} FE=${okF}`);
  }
}
