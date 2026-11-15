import assert from 'node:assert/strict';
import { calculateContinuousCompoundInterest } from './calculation';

// Reference: 1,000 @ 4% for 20 years, no deposits → 2,225.54 / 1,225.54
{
  const r = calculateContinuousCompoundInterest({
    initialBalance: 1000,
    interestRatePercent: 4,
    termYears: 20,
    termMonths: 0,
    depositFrequency: 'never',
    depositAmount: 0,
    depositTiming: 'end',
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r.finalBalance, 2225.54);
  assert.equal(r.compoundInterest, 1225.54);
}

// Zero rate
{
  const r = calculateContinuousCompoundInterest({
    initialBalance: 1000,
    interestRatePercent: 0,
    termYears: 5,
    termMonths: 0,
    depositFrequency: 'never',
    depositAmount: 0,
    depositTiming: 'end',
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r.finalBalance, 1000);
  assert.equal(r.compoundInterest, 0);
}

// Invalid duration
assert.equal(
  calculateContinuousCompoundInterest({
    initialBalance: 1000,
    interestRatePercent: 4,
    termYears: 0,
    termMonths: 0,
    depositFrequency: 'never',
    depositAmount: 0,
    depositTiming: 'end',
    currency: 'PKR',
  }),
  null,
);

console.log('continuous-compound-interest/calculation.test.ts: ok');
