/**
 * Run: npx --yes tsx src/tools/calculators/gross-to-net/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateGrossToNet,
  calculateNetToGross,
} from './calculation';
import { validateGrossToNetInput } from './validation';
import { createDefaultInput } from './types';

const gtn = calculateGrossToNet(100, 10);
assert.ok(gtn);
assert.equal(gtn.taxAmount, 10);
assert.equal(gtn.netAmount, 90);

const ntg = calculateNetToGross(90, 10);
assert.ok(ntg);
assert.ok(Math.abs(ntg.grossAmount - 100) < 1e-9);
assert.ok(Math.abs(ntg.taxAmount - 10) < 1e-9);

assert.equal(calculateGrossToNet(0, 0)?.netAmount, 0);
assert.equal(calculateGrossToNet(100, 100)?.netAmount, 0);
assert.equal(calculateNetToGross(90, 100), null);
assert.equal(calculateNetToGross(0, 100), null);

const validated = validateGrossToNetInput({
  ...createDefaultInput(),
  taxRatePercent: '10',
  grossAmount: '100',
});
assert.equal(validated.isValid, true);
assert.equal(validated.result?.netCanonical, 90);

const reverse = validateGrossToNetInput({
  ...createDefaultInput(),
  mode: 'net-to-gross',
  taxRatePercent: '10',
  netAmount: '90',
});
assert.equal(reverse.isValid, true);
assert.ok(Math.abs(reverse.result!.grossCanonical - 100) < 1e-9);

const blank = validateGrossToNetInput(createDefaultInput());
assert.equal(blank.isValid, false);

console.log('gross-to-net calculation.test.ts: all assertions passed');
