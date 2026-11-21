/**
 * Run: npx --yes tsx src/tools/calculators/auto-lease/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  aprPercentToMoneyFactor,
  calculateAutoLease,
  calculateLeaseFromAutoPrice,
  moneyFactorToAprPercent,
  solveAutoPriceFromMonthlyPayment,
} from './calculation';
import { validateAutoLeaseInput } from './validation';
import { createDefaultInput } from './types';

const screenshot = calculateLeaseFromAutoPrice({
  autoPrice: 50_000,
  leaseTermMonths: 36,
  moneyFactor: 0.00208,
  downPayment: 10_000,
  tradeInValue: 0,
  salesTaxPercent: 7,
  residualValue: 24_000,
});

assert.ok(screenshot);
assert.equal(screenshot.capitalizedCost, 40_000);
assert.ok(Math.abs(screenshot.monthlyDepreciation - 16000 / 36) < 1e-9);
assert.ok(Math.abs(screenshot.monthlyFinanceCharge - 133.12) < 1e-9);
assert.ok(Math.abs(screenshot.baseMonthlyPayment - (16000 / 36 + 133.12)) < 1e-9);
assert.ok(Math.abs(screenshot.monthlyPayment - (16000 / 36 + 133.12) * 1.07) < 1e-9);
assert.ok(Math.abs(screenshot.upfrontCost - 10_000) < 1e-9);
assert.ok(
  Math.abs(
    screenshot.totalLeaseCost - (screenshot.totalLeasePayments + screenshot.upfrontCost)
  ) < 1e-9
);

const defaults = validateAutoLeaseInput(createDefaultInput());
assert.equal(defaults.isValid, true);
assert.ok(defaults.result);
assert.ok(Math.abs(defaults.result.monthlyPayment - screenshot.monthlyPayment) < 1e-9);

const mf = aprPercentToMoneyFactor(4.992);
assert.ok(mf);
assert.ok(Math.abs(mf - 0.00208) < 1e-12);
const apr = moneyFactorToAprPercent(0.00208);
assert.ok(apr);
assert.ok(Math.abs(apr - 4.992) < 1e-12);

const zeroTax = calculateLeaseFromAutoPrice({
  autoPrice: 30_000,
  leaseTermMonths: 24,
  moneyFactor: 0,
  downPayment: 0,
  tradeInValue: 0,
  salesTaxPercent: 0,
  residualValue: 18_000,
});
assert.ok(zeroTax);
assert.equal(zeroTax.monthlyFinanceCharge, 0);
assert.equal(zeroTax.monthlySalesTax, 0);
assert.ok(Math.abs(zeroTax.monthlyPayment - 12_000 / 24) < 1e-9);

const solvedPrice = solveAutoPriceFromMonthlyPayment({
  monthlyPayment: screenshot.monthlyPayment,
  leaseTermMonths: 36,
  moneyFactor: 0.00208,
  downPayment: 10_000,
  tradeInValue: 0,
  salesTaxPercent: 7,
  residualValue: 24_000,
});
assert.ok(solvedPrice);
assert.ok(Math.abs(solvedPrice - 50_000) < 0.02);

const monthlyMode = calculateAutoLease({
  mode: 'monthly-payment',
  autoPrice: null,
  monthlyPayment: screenshot.monthlyPayment,
  leaseTermMonths: 36,
  rateType: 'money-factor',
  rateValue: 0.00208,
  downPayment: 10_000,
  tradeInValue: 0,
  salesTaxPercent: 7,
  residualValue: 24_000,
});
assert.ok(monthlyMode);
assert.ok(Math.abs(monthlyMode.autoPrice - 50_000) < 0.02);

const overAllowance = validateAutoLeaseInput({
  ...createDefaultInput(),
  autoPrice: '10000',
  downPayment: '8000',
  tradeInValue: '3000',
});
assert.equal(overAllowance.isValid, false);

console.log('auto-lease calculation.test.ts: all assertions passed');
