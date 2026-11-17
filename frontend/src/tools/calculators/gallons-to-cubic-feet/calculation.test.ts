import assert from 'node:assert/strict';
import { calculateGalToCuFt, convertVolume, shareResultText } from './calculation';
import {
  LITERS_PER_CUBIC_FOOT,
  LITERS_PER_UK_GALLON,
  LITERS_PER_US_GALLON,
} from './types';
import { parseOptionalNumber, validateGalToCuFt } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(LITERS_PER_US_GALLON, 3.785411784);
assert.equal(LITERS_PER_UK_GALLON, 4.54609);
assert.equal(LITERS_PER_CUBIC_FOOT, 28.316846592);

assertClose(convertVolume(1, 'us_gal', 'ft3'), 0.1336805556, 9);
assertClose(convertVolume(1, 'uk_gal', 'ft3'), 0.1605436532, 9);
assertClose(convertVolume(1, 'ft3', 'us_gal'), 7.4805194805, 9);
assertClose(convertVolume(1, 'ft3', 'uk_gal'), 6.228835459, 8);
assert.equal(convertVolume(0, 'us_gal', 'ft3'), 0);

assert.throws(() => convertVolume(-1, 'us_gal', 'ft3'));

{
  const cubicFeet = convertVolume(125, 'us_gal', 'ft3');
  const gallons = convertVolume(cubicFeet, 'ft3', 'us_gal');
  assertClose(gallons, 125, 10);
}

{
  const result = calculateGalToCuFt({ source: 'usGal', value: 10 });
  assertClose(result.ft3, 1.336805556, 8);
  assertClose(result.ukGal, convertVolume(10, 'us_gal', 'uk_gal'), 8);
  assert.match(shareResultText(result), /Gallons to Cubic Feet/);
}

{
  const result = calculateGalToCuFt({ source: 'ukGal', value: 10 });
  assertClose(result.ft3, 1.605436532, 8);
  assertClose(result.usGal, convertVolume(10, 'uk_gal', 'us_gal'), 8);
}

{
  const result = calculateGalToCuFt({ source: 'ft3', value: 5 });
  assertClose(result.usGal, 37.4025974026, 8);
  assertClose(result.ukGal, 31.144177295, 7);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateGalToCuFt({ source: 'usGal', value: 0 }).isValid);
assert.ok(!validateGalToCuFt({ source: 'usGal', value: -1 }).isValid);
assert.ok(!validateGalToCuFt({ source: 'ft3', value: null }).isValid);

console.log('gallons-to-cubic-feet calculation.test.ts: ok');
