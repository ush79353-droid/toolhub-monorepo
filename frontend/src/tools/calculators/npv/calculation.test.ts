import assert from 'node:assert/strict';
import { calculateNpv } from './calculation';

// Example: 10%, 10,000 initial, 4,000 × 3 years → NPV ≈ −52.59
const example = calculateNpv({
  discountRatePercent: 10,
  initialCosts: 10_000,
  cashFlows: [4000, 4000, 4000, 0, 0],
  currency: 'PKR',
});
assert.ok(example);
assert.ok(Math.abs(example.npv - -52.59) < 0.02);
// Expected cash flows = PV of future CFs (Omni), not undiscounted sum
assert.ok(Math.abs(example.expectedCashFlows - (10_000 + example.npv)) < 1e-9);

// Zero discount rate: NPV = −initial + sum(CF)
const zeroRate = calculateNpv({
  discountRatePercent: 0,
  initialCosts: 1000,
  cashFlows: [500, 500],
  currency: 'PKR',
});
assert.ok(zeroRate);
assert.equal(zeroRate.npv, 0);
assert.equal(zeroRate.expectedCashFlows, 1000);

// Negative cash flow + negative NPV allowed
const neg = calculateNpv({
  discountRatePercent: 10,
  initialCosts: 1000,
  cashFlows: [-100],
  currency: 'PKR',
});
assert.ok(neg);
assert.ok(neg.npv < 0);

// Reject rate ≤ −100%
assert.equal(
  calculateNpv({
    discountRatePercent: -100,
    initialCosts: 1000,
    cashFlows: [100],
    currency: 'PKR',
  }),
  null
);

console.log('npv/calculation.test.ts: ok');
