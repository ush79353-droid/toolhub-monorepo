import assert from 'node:assert/strict';
import {
  calculateCmToM,
  centimetersToInches,
  centimetersToMeters,
  metersToCentimeters,
  shareResultText,
} from './calculation';
import { CM_PER_METER, DEFAULT_OTHER_UNIT } from './types';
import { validateCmToM } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CM_PER_METER, 100);
assert.equal(DEFAULT_OTHER_UNIT, 'in');
assert.equal(centimetersToMeters(100), 1);
assert.equal(centimetersToMeters(50), 0.5);
assert.equal(centimetersToMeters(175), 1.75);
assert.equal(centimetersToMeters(350), 3.5);
assert.equal(centimetersToMeters(1), 0.01);
assert.equal(centimetersToMeters(0), 0);
assert.equal(metersToCentimeters(1), 100);
assert.equal(metersToCentimeters(2.5), 250);
assert.equal(metersToCentimeters(0.5), 50);
assertClose(centimetersToInches(2.54), 1, 10);
assertClose(centimetersToInches(100), 39.3700787402, 8);

{
  const result = calculateCmToM({
    source: 'cm',
    value: 250,
    otherUnit: 'in',
  });
  assert.equal(result.meters, 2.5);
  assertClose(result.other, 250 / 2.54, 8);
  assert.match(shareResultText(result), /CM to M/);
}

{
  const result = calculateCmToM({
    source: 'm',
    value: 3.75,
    otherUnit: 'in',
  });
  assert.equal(result.centimeters, 375);
}

{
  const result = calculateCmToM({
    source: 'other',
    value: 1,
    otherUnit: 'in',
  });
  assertClose(result.centimeters, 2.54, 10);
  assertClose(result.meters, 0.0254, 10);
}

{
  const result = calculateCmToM({
    source: 'cm',
    value: 100,
    otherUnit: 'ft',
  });
  assertClose(result.other, 100 / 30.48, 8);
}

assert.ok(validateCmToM({ source: 'cm', value: 0, otherUnit: 'in' }).isValid);
assert.ok(!validateCmToM({ source: 'cm', value: -1, otherUnit: 'in' }).isValid);
assert.ok(!validateCmToM({ source: 'cm', value: null, otherUnit: 'in' }).isValid);
assert.ok(!validateCmToM({ source: 'm', value: Number.NaN, otherUnit: 'in' }).isValid);

console.log('cm-to-m calculation.test.ts: ok');
