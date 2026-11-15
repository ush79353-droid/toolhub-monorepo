import assert from 'node:assert/strict';
import { calculateCd } from './calculation';

// Example: PKR 100,000 at 5% for 2 years, yearly → 110,250 / 10,250
{
  const r = calculateCd(100_000, 5, 2, 0, 'yearly', 'PKR');
  assert.ok(r);
  assert.equal(r.finalBalance, 110_250);
  assert.equal(r.interestEarned, 10_250);
}

// Zero interest
{
  const r = calculateCd(50_000, 0, 1, 0, 'yearly', 'PKR');
  assert.ok(r);
  assert.equal(r.finalBalance, 50_000);
  assert.equal(r.interestEarned, 0);
}

// Months-only term: 24 months = 2 years at 5% yearly
{
  const r = calculateCd(100_000, 5, 0, 24, 'yearly', 'PKR');
  assert.ok(r);
  assert.equal(r.finalBalance, 110_250);
}

// Reject non-finite / negative duration
assert.equal(calculateCd(1000, 5, 0, 0, 'yearly', 'PKR'), null);
assert.equal(calculateCd(Number.NaN, 5, 1, 0, 'yearly', 'PKR'), null);

console.log('cd/calculation.test.ts: ok');
