import assert from 'node:assert/strict';
import {
  UL_PER_ML,
  buildResult,
  microlitersToMl,
  mlToMicroliters,
  shareResultText,
  valueFromMilliliters,
} from './calculation';
import { DEFAULT_UNITS } from './types';

function assertClose(actual: number, expected: number, digits = 12): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(UL_PER_ML, 1000);

assert.equal(mlToMicroliters(1), 1000);
assert.equal(mlToMicroliters(0.001), 1);
assert.equal(mlToMicroliters(0.024), 24);
assert.equal(mlToMicroliters(0.1), 100);
assert.equal(mlToMicroliters(0.5), 500);
assert.equal(mlToMicroliters(2.5), 2500);
assert.equal(mlToMicroliters(10), 10000);

assert.equal(microlitersToMl(1), 0.001);
assert.equal(microlitersToMl(24), 0.024);
assert.equal(microlitersToMl(500), 0.5);
assert.equal(microlitersToMl(1000), 1);

assert.equal(valueFromMilliliters(1, 'uL'), 1000);
assert.equal(valueFromMilliliters(1000, 'L'), 1);

const result = buildResult(2.5, DEFAULT_UNITS);
assert.equal(result.values.microliters, 2500);
assert.match(shareResultText(result), /mL to µL Conversion/);
assert.match(shareResultText(result), /2500/);

assertClose(mlToMicroliters(0.005), 5);
assertClose(mlToMicroliters(100), 100000);

console.log('ml-to-ul calculation.test.ts: ok');
