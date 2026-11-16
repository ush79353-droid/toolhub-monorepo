import assert from 'node:assert/strict';
import {
  calculateCuFtToGal,
  cubicFeetToGallons,
  gallonsToCubicFeet,
  shareResultText,
} from './calculation';
import {
  CUBIC_FOOT_IN_CUBIC_METERS,
  UK_GALLON_IN_CUBIC_METERS,
  US_GALLON_IN_CUBIC_METERS,
} from './types';
import { validateCuFtToGal } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CUBIC_FOOT_IN_CUBIC_METERS, 0.028316846592);
assert.equal(US_GALLON_IN_CUBIC_METERS, 0.003785411784);
assert.equal(UK_GALLON_IN_CUBIC_METERS, 0.00454609);

assert.equal(cubicFeetToGallons(0, 'us'), 0);
assertClose(cubicFeetToGallons(1, 'us'), 7.4805194805, 9);
assertClose(cubicFeetToGallons(10, 'us'), 74.805194805, 8);
assertClose(cubicFeetToGallons(100, 'us'), 748.05194805, 7);
assertClose(cubicFeetToGallons(1, 'uk'), 6.228835459, 8);
assertClose(cubicFeetToGallons(10, 'uk'), 62.28835459, 7);
assertClose(gallonsToCubicFeet(100, 'us'), 13.3680555556, 8);

{
  const gal = cubicFeetToGallons(15, 'us');
  assertClose(gallonsToCubicFeet(gal, 'us'), 15, 10);
}

{
  const result = calculateCuFtToGal({
    source: 'cubicFeet',
    value: 1,
    gallonUnit: 'us',
  });
  assertClose(result.gallons, 7.4805194805, 9);
  assert.match(shareResultText(result), /Cubic Feet to Gallons/);
}

{
  const result = calculateCuFtToGal({
    source: 'gallons',
    value: 100,
    gallonUnit: 'uk',
  });
  assertClose(result.cubicFeet, gallonsToCubicFeet(100, 'uk'), 10);
}

assert.ok(
  validateCuFtToGal({ source: 'cubicFeet', value: 0, gallonUnit: 'us' }).isValid,
);
assert.ok(
  !validateCuFtToGal({ source: 'cubicFeet', value: -1, gallonUnit: 'us' }).isValid,
);
assert.ok(
  !validateCuFtToGal({ source: 'cubicFeet', value: null, gallonUnit: 'us' }).isValid,
);

console.log('cubic-feet-to-gallons calculation.test.ts: ok');
