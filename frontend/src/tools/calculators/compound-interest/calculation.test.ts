import assert from 'node:assert/strict';
import { calculateCompoundInterest } from './calculation';

const result = calculateCompoundInterest({
  initialBalance: 1000,
  interestRatePercent: 8,
  termYears: 20,
  termMonths: 0,
  compounding: 'monthly',
  depositFrequency: 'never',
  depositAmount: 0,
  depositTiming: 'end',
  currency: 'PKR',
});

assert.ok(result);
assert.ok(Math.abs(result.finalBalance - 4926.8) < 0.05);
assert.ok(Math.abs(result.totalCompoundInterest - 3926.8) < 0.05);
assert.equal(result.yearlyRows.length, 20);

assert.equal(
  calculateCompoundInterest({
    initialBalance: 1000,
    interestRatePercent: 8,
    termYears: 0,
    termMonths: 0,
    compounding: 'monthly',
    depositFrequency: 'never',
    depositAmount: 0,
    depositTiming: 'end',
    currency: 'PKR',
  }),
  null
);

console.log('compound-interest/calculation.test.ts: ok');
