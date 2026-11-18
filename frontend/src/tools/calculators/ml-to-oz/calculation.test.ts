import assert from 'node:assert/strict';
import {
  ML_PER_UK_FL_OZ,
  ML_PER_US_FL_OZ,
  buildResult,
  mlToCubicMeters,
  mlToUkFluidOunces,
  mlToUsFluidOunces,
  shareResultText,
  ukFluidOuncesToMl,
  usFluidOuncesToMl,
  valueFromMilliliters,
} from './calculation';
import { DEFAULT_UNITS } from './types';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(ML_PER_US_FL_OZ, 29.5735295625);
assert.equal(ML_PER_UK_FL_OZ, 28.4130625);

assertClose(mlToUsFluidOunces(1), 0.0338140227);
assertClose(mlToUsFluidOunces(100), 3.38140227018);
assertClose(mlToUsFluidOunces(250), 8.45350567545);
assertClose(usFluidOuncesToMl(8), 236.5882365);

assert.equal(ukFluidOuncesToMl(1), 28.4130625);
assertClose(mlToUkFluidOunces(100), 100 / ML_PER_UK_FL_OZ);
assertClose(mlToUkFluidOunces(100), 3.519508, 5);

assert.equal(valueFromMilliliters(1000, 'L'), 1);
assert.equal(mlToCubicMeters(1000), 0.001);
assert.equal(valueFromMilliliters(1, 'cm3'), 1);

const result = buildResult(100, DEFAULT_UNITS);
assertClose(result.values.ounces, mlToUsFluidOunces(100));
assertClose(result.values.other, 0.0001);
assert.match(shareResultText(result), /mL to oz Converter/);
assert.match(shareResultText(result), /US fl oz/);
assert.match(shareResultText(result), /UK fl oz/);

console.log('ml-to-oz calculation.test.ts: ok');
