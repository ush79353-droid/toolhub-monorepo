/**
 * Run: npx --yes tsx src/tools/calculators/lease/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateLease, termToMonthCount } from './calculation';

const months = termToMonthCount(3, 'yrs');
assert.equal(months, 36);

const zeroRate = calculateLease({
  productValue: 100_000,
  residualValue: 40_000,
  downPayment: 0,
  annualRatePercent: 0,
  paymentCount: 36,
});
assert.ok(zeroRate);
assert.ok(Math.abs(zeroRate.monthlyPayment - 60_000 / 36) < 1e-9);
assert.ok(Math.abs(zeroRate.totalPayments - 60_000) < 1e-9);
assert.ok(Math.abs(zeroRate.totalInterest - 0) < 1e-9);
assert.ok(Math.abs(zeroRate.totalCostToOwn - 100_000) < 1e-9);

const withRate = calculateLease({
  productValue: 100_000,
  residualValue: 40_000,
  downPayment: 0,
  annualRatePercent: 6,
  paymentCount: 36,
});
assert.ok(withRate);
assert.ok(withRate.monthlyPayment > 0);
assert.ok(withRate.totalPayments > 60_000);
assert.ok(withRate.totalInterest > 0);
assert.ok(
  Math.abs(
    withRate.totalCostToOwn - (withRate.totalPayments + 40_000)
  ) < 1e-9
);

const withDown = calculateLease({
  productValue: 100_000,
  residualValue: 40_000,
  downPayment: 10_000,
  annualRatePercent: 6,
  paymentCount: 36,
});
assert.ok(withDown);
assert.ok(withDown.monthlyPayment < withRate.monthlyPayment);
assert.ok(
  Math.abs(
    withDown.totalPayments - (10_000 + withDown.monthlyPayment * 36)
  ) < 1e-9
);

assert.equal(
  calculateLease({
    productValue: 100_000,
    residualValue: 120_000,
    downPayment: 0,
    annualRatePercent: 5,
    paymentCount: 12,
  }),
  null
);

assert.equal(
  calculateLease({
    productValue: 0,
    residualValue: 0,
    downPayment: 0,
    annualRatePercent: 5,
    paymentCount: 12,
  }),
  null
);

assert.equal(termToMonthCount(0, 'mos'), null);
assert.equal(termToMonthCount(-1, 'yrs'), null);

console.log('lease calculation.test.ts: all assertions passed');
