/**
 * Assert self-check. Run:
 * npx tsx src/tools/calculators/take-home-pay-uk/calculation.test.ts
 */
import { calculateTakeHomePayUk, taxOnTaxableIncome } from './calculation';
import { personalAllowanceForIncome } from './tax-parameters';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(personalAllowanceForIncome(40_000) === 12_570, 'full PA');
assert(personalAllowanceForIncome(110_000) === 7_570, 'taper 110k');
assert(personalAllowanceForIncome(125_140) === 0, 'PA zero');

// £40k England: taxable 27430 @ 20% = 5486; Class1 on 40000: (40000-12570)*0.08
const emp = calculateTakeHomePayUk({
  location: 'england',
  taxYear: '2026-27',
  employmentIncome: 40_000,
  selfEmploymentIncome: 0,
  rentalIncome: 0,
});
assert(emp != null, 'emp');
assert(Math.abs(emp!.incomeTax - 5_486) < 0.01, `tax ${emp!.incomeTax}`);
assert(Math.abs(emp!.class1Ni - 2_194.4) < 0.01, `ni ${emp!.class1Ni}`);
assert(
  Math.abs(emp!.takeHomePay - (40_000 - 5_486 - 2_194.4)) < 0.02,
  `net ${emp!.takeHomePay}`
);

const scotTax = taxOnTaxableIncome(20_000, 'scotland', '2026-27');
assert(scotTax > 0 && scotTax < 20_000 * 0.21, `scot ${scotTax}`);

console.log('take-home-pay-uk calculation.test.ts: ok');
