import assert from 'node:assert/strict';
import {
  calculatePreciseNopat,
  calculateSimpleNopat,
} from './calculation';

// Simple: PKR 500,000 × (1 − 0.30) = 350,000
assert.equal(calculateSimpleNopat(500_000, 30), 350_000);

// Zero and negative operating profit
assert.equal(calculateSimpleNopat(0, 30), 0);
assert.equal(calculateSimpleNopat(-100_000, 20), -80_000);

// Tax bounds
assert.equal(calculateSimpleNopat(100, -1), null);
assert.equal(calculateSimpleNopat(100, 101), null);
assert.equal(calculateSimpleNopat(Number.NaN, 30), null);

// Precise: reconstruct operating income then apply tax shield
// (1000 + 50 − 20 + 100 + 200) × (1 − 0.25) = 1330 × 0.75 = 997.5
assert.equal(calculatePreciseNopat(1000, 50, 20, 100, 200, 25), 997.5);

assert.equal(
  calculatePreciseNopat(Number.NaN, 0, 0, 0, 0, 30),
  null
);

console.log('nopat/calculation.test.ts: ok');
