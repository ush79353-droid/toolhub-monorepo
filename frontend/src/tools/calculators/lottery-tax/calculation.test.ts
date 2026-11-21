/**
 * Run: npx --yes tsx src/tools/calculators/lottery-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  US_FEDERAL_WITHHOLDING_RATE,
  applyIndependentTaxes,
  calculateLotteryTax,
  firstNominalAnnuityPayment,
  lumpSumFromAnnuity,
} from './calculation';

assert.equal(lumpSumFromAnnuity(1_200_000_000, 52), 624_000_000);
assert.equal(US_FEDERAL_WITHHOLDING_RATE, 24);

const equal = firstNominalAnnuityPayment(1_000_000, 10, 0);
assert.ok(equal);
assert.equal(equal, 100_000);

const growing = firstNominalAnnuityPayment(100_000_000, 30, 0.05);
assert.ok(growing);
let sum = 0;
for (let y = 0; y < 30; y++) sum += growing * Math.pow(1.05, y);
assert.ok(Math.abs(sum - 100_000_000) < 1e-4);

const taxes = applyIndependentTaxes(1000, 10, 5);
assert.ok(taxes);
assert.equal(taxes.taxI, 100);
assert.equal(taxes.taxII, 50);
assert.equal(taxes.net, 850);

const custom = calculateLotteryTax({
  annuityAmount: 1_200_000_000,
  lumpSumPercent: 52,
  taxMode: 'custom',
  taxRateI: 0,
  taxRateII: 0,
  years: 30,
  growthPercent: 5,
  calcCurrency: 'PKR',
  lumpSumCurrency: 'PKR',
  annuityCurrency: 'PKR',
});
assert.ok(custom);
assert.equal(custom.lumpSum.payout, 624_000_000);
assert.equal(custom.lumpSum.net, 624_000_000);
assert.equal(custom.annuity.payout, 1_200_000_000);
assert.equal(custom.schedule.length, 30);
assert.ok(Math.abs(custom.schedule.reduce((s, r) => s + r.gross, 0) - 1_200_000_000) < 0.5);

const us = calculateLotteryTax({
  annuityAmount: 1_000_000,
  lumpSumPercent: 50,
  taxMode: 'us',
  taxRateI: 0,
  taxRateII: 0,
  years: 30,
  growthPercent: 5,
  calcCurrency: 'USD',
  lumpSumCurrency: 'USD',
  annuityCurrency: 'USD',
});
assert.ok(us);
assert.equal(us.effectiveTaxRateI, 24);
assert.equal(us.lumpSum.taxI, 120_000);
assert.ok(us.usTaxNote);

console.log('lottery-tax calculation.test.ts: all assertions passed');
