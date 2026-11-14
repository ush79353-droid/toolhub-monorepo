import assert from 'node:assert/strict';
import { calculateFromTotalReturn, calculateFromValues } from './calculation';

const fromTotal = calculateFromTotalReturn(50, 3);
assert.ok(fromTotal);
assert.ok(Math.abs(fromTotal.annualizedReturnPercent - 14.470477) < 1e-4);

assert.equal(calculateFromTotalReturn(50, 0), null);
assert.equal(calculateFromTotalReturn(-101, 3), null);

const completeLoss = calculateFromTotalReturn(-100, 5);
assert.ok(completeLoss);
assert.equal(completeLoss.annualizedReturnPercent, -100);

const fromValues = calculateFromValues(100, 150, 3);
assert.ok(fromValues);
assert.ok(Math.abs(fromValues.annualizedReturnPercent - 14.470477) < 1e-4);

assert.equal(calculateFromValues(0, 150, 3), null);
assert.equal(calculateFromValues(100, -1, 3), null);

const zeroEnd = calculateFromValues(100, 0, 2);
assert.ok(zeroEnd);
assert.equal(zeroEnd.annualizedReturnPercent, -100);

console.log('annualized-return/calculation.test.ts: ok');
