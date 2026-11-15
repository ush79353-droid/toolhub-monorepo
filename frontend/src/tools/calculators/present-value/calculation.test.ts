import assert from 'node:assert/strict';
import { calculatePresentValue } from './calculation';

// Example: FV 12,100, n=2, r=10% → PV 10,000, interest 2,100
const example = calculatePresentValue({
  futureValue: 12_100,
  periods: 2,
  interestRatePercent: 10,
  currency: 'PKR',
});
assert.ok(example);
assert.equal(example.presentValue, 10_000);
assert.equal(example.totalInterest, 2_100);

// Zero periods: PV = FV, interest = 0
const zeroPeriods = calculatePresentValue({
  futureValue: 5_000,
  periods: 0,
  interestRatePercent: 10,
  currency: 'PKR',
});
assert.ok(zeroPeriods);
assert.equal(zeroPeriods.presentValue, 5_000);
assert.equal(zeroPeriods.totalInterest, 0);

// Zero rate: PV = FV
const zeroRate = calculatePresentValue({
  futureValue: 5_000,
  periods: 3,
  interestRatePercent: 0,
  currency: 'PKR',
});
assert.ok(zeroRate);
assert.equal(zeroRate.presentValue, 5_000);

// Reject rate ≤ −100%
assert.equal(
  calculatePresentValue({
    futureValue: 1000,
    periods: 1,
    interestRatePercent: -100,
    currency: 'PKR',
  }),
  null
);

// Reject negative FV
assert.equal(
  calculatePresentValue({
    futureValue: -1,
    periods: 1,
    interestRatePercent: 5,
    currency: 'PKR',
  }),
  null
);

console.log('present-value/calculation.test.ts: ok');
