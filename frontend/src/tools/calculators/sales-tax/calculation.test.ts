/**
 * Run: npx --yes tsx src/tools/calculators/sales-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateFromGross, calculateFromNet } from './calculation';

const fromNet = calculateFromNet(100, 10);
assert.ok(fromNet);
assert.equal(fromNet.taxAmount, 10);
assert.equal(fromNet.grossPrice, 110);

const fromGross = calculateFromGross(110, 10);
assert.ok(fromGross);
assert.ok(Math.abs(fromGross.netPrice - 100) < 1e-12);
assert.ok(Math.abs(fromGross.taxAmount - 10) < 1e-12);

const zero = calculateFromNet(100, 0);
assert.ok(zero);
assert.equal(zero.taxAmount, 0);
assert.equal(zero.grossPrice, 100);

assert.equal(calculateFromNet(-1, 10), null);
assert.equal(calculateFromGross(100, -100), null);

console.log('sales-tax calculation.test.ts: all assertions passed');
