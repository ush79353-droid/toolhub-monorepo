import assert from 'node:assert/strict';
import {
  calculateFootToCm,
  centimetersToFeet,
  feetToCentimeters,
  feetToCentimetersViaRegistry,
  shareResultText,
} from './calculation';
import { CENTIMETERS_PER_FOOT } from './types';
import { parseOptionalNumber, validateFootToCm } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CENTIMETERS_PER_FOOT, 30.48);
assert.equal(feetToCentimeters(0), 0);
assert.equal(feetToCentimeters(0.5), 15.24);
assert.equal(feetToCentimeters(1), 30.48);
assert.equal(feetToCentimeters(2), 60.96);
assert.equal(feetToCentimeters(3), 91.44);
assert.equal(feetToCentimeters(5), 152.4);
assert.equal(feetToCentimeters(6), 182.88);
assert.equal(feetToCentimeters(10), 304.8);
assert.equal(feetToCentimeters(100), 3048);
assert.equal(feetToCentimeters(-2), -60.96);

assert.equal(centimetersToFeet(0), 0);
assertClose(centimetersToFeet(30.48), 1, 10);
assertClose(centimetersToFeet(60.96), 2, 10);
assertClose(centimetersToFeet(91.44), 3, 10);
assertClose(centimetersToFeet(152.4), 5, 10);
assertClose(centimetersToFeet(182.88), 6, 10);
assertClose(centimetersToFeet(304.8), 10, 10);

assertClose(feetToCentimetersViaRegistry(1), 30.48, 12);
assertClose(feetToCentimetersViaRegistry(6), feetToCentimeters(6), 12);

{
  const roundTrip = centimetersToFeet(feetToCentimeters(7.25));
  assertClose(roundTrip, 7.25, 10);
}

{
  const result = calculateFootToCm({ source: 'feet', value: 6 });
  assert.equal(result.centimeters, 182.88);
  assertClose(result.extras.in, 72, 10);
  assertClose(result.extras.m, 1.8288, 10);
  assert.match(shareResultText(result), /Foot to Centimeter/);
}

{
  const result = calculateFootToCm({ source: 'centimeters', value: 152.4 });
  assertClose(result.feet, 5, 10);
}

{
  const result = calculateFootToCm({ source: 'mm', value: 3048 });
  assertClose(result.feet, 10, 10);
  assert.equal(result.centimeters, 304.8);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateFootToCm({ source: 'feet', value: -9 }).isValid);
assert.ok(!validateFootToCm({ source: 'feet', value: null }).isValid);
assert.ok(!validateFootToCm({ source: 'feet', value: Number.NaN }).isValid);

console.log('foot-to-centimeter calculation.test.ts: ok');
