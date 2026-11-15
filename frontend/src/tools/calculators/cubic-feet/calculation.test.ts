import assert from 'node:assert/strict';
import {
  calculateCubicFeet,
  calculateMissingDimension,
  cubicFeetToCubicMeters,
  cubicMetersToCubicFeet,
  formatMeasure,
  lengthToMeters,
} from './calculation';
import {
  CUBIC_FEET_PER_CUBIC_YARD,
  CUBIC_INCHES_PER_CUBIC_FOOT,
  CUBIC_METERS_PER_CUBIC_FOOT,
  DEFAULT_CUBIC_FEET_INPUT,
} from './types';
import { validateCubicFeet, validateMissingDimension } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assertClose(CUBIC_METERS_PER_CUBIC_FOOT, 0.3048 ** 3);
assert.equal(CUBIC_INCHES_PER_CUBIC_FOOT, 1728);
assert.equal(CUBIC_FEET_PER_CUBIC_YARD, 27);

{
  const cases: readonly [number, number, number, number][] = [
    [1, 1, 1, 1],
    [2, 2, 2, 8],
    [4, 3, 2, 24],
    [5, 5, 5, 125],
    [10, 5, 3, 150],
    [2.5, 1.5, 4, 15],
    [0, 5, 3, 0],
  ];
  for (const [l, w, h, vol] of cases) {
    const result = calculateCubicFeet({
      length: l,
      width: w,
      height: h,
      lengthUnit: 'ft',
      widthUnit: 'ft',
      heightUnit: 'ft',
    });
    assertClose(result.cubicFeet, vol);
  }
}

{
  const inchCases: readonly [number, number, number, number][] = [
    [12, 12, 12, 1],
    [24, 12, 12, 2],
    [36, 18, 24, 9],
    [24, 24, 24, 8],
  ];
  for (const [l, w, h, vol] of inchCases) {
    const result = calculateCubicFeet({
      length: l,
      width: w,
      height: h,
      lengthUnit: 'in',
      widthUnit: 'in',
      heightUnit: 'in',
    });
    assertClose(result.cubicFeet, vol);
  }
}

{
  // Mixed units: 2 m × 3 ft × 24 in
  const result = calculateCubicFeet({
    length: 2,
    width: 3,
    height: 24,
    lengthUnit: 'm',
    widthUnit: 'ft',
    heightUnit: 'in',
  });
  const expectedM3 =
    lengthToMeters(2, 'm') * lengthToMeters(3, 'ft') * lengthToMeters(24, 'in');
  assertClose(result.cubicMeters, expectedM3);
  assertClose(result.cubicFeet, cubicMetersToCubicFeet(expectedM3));
}

{
  assertClose(cubicFeetToCubicMeters(1), CUBIC_METERS_PER_CUBIC_FOOT);
  assertClose(cubicMetersToCubicFeet(CUBIC_METERS_PER_CUBIC_FOOT), 1);
  assertClose(cubicMetersToCubicFeet(1), 1 / CUBIC_METERS_PER_CUBIC_FOOT);

  const one = calculateCubicFeet({
    length: 1,
    width: 1,
    height: 1,
    lengthUnit: 'ft',
    widthUnit: 'ft',
    heightUnit: 'ft',
  });
  assertClose(one.cubicFeet, 1);
  const in3 = one.otherUnits.find((row) => row.unit === 'in³');
  assertClose(in3?.value ?? NaN, 1728);
  const yd3 = one.otherUnits.find((row) => row.unit === 'yd³');
  assertClose(yd3?.value ?? NaN, 1 / 27);
  const liters = one.otherUnits.find((row) => row.unit === 'L');
  assertClose(liters?.value ?? NaN, 28.316846592);

  assertClose(27 / CUBIC_FEET_PER_CUBIC_YARD, 1);
  assert.equal(54 / CUBIC_FEET_PER_CUBIC_YARD, 2);
}

{
  const result = calculateCubicFeet(DEFAULT_CUBIC_FEET_INPUT);
  assert.equal(result.cubicFeet, 150);
}

{
  const length = calculateMissingDimension({
    unknown: 'length',
    volumeCubicFeet: 120,
    length: null,
    width: 5,
    height: 4,
    lengthUnit: 'ft',
    widthUnit: 'ft',
    heightUnit: 'ft',
    resultUnit: 'ft',
  });
  assertClose(length.value, 6);

  const width = calculateMissingDimension({
    unknown: 'width',
    volumeCubicFeet: 60,
    length: 5,
    width: null,
    height: 3,
    lengthUnit: 'ft',
    widthUnit: 'ft',
    heightUnit: 'ft',
    resultUnit: 'ft',
  });
  assertClose(width.value, 4);
}

{
  assert.equal(formatMeasure(0), '0');
  assert.equal(formatMeasure(150), '150');
}

{
  const ok = validateCubicFeet(DEFAULT_CUBIC_FEET_INPUT);
  assert.equal(ok.isValid, true);

  const blank = validateCubicFeet({
    length: null,
    width: 5,
    height: 3,
    lengthUnit: 'ft',
    widthUnit: 'ft',
    heightUnit: 'ft',
  });
  assert.equal(blank.isValid, false);

  const neg = validateCubicFeet({
    length: -1,
    width: 5,
    height: 3,
    lengthUnit: 'ft',
    widthUnit: 'ft',
    heightUnit: 'ft',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.length);

  const zeroDiv = validateMissingDimension({
    unknown: 'length',
    volumeCubicFeet: 10,
    length: null,
    width: 0,
    height: 4,
    lengthUnit: 'ft',
    widthUnit: 'ft',
    heightUnit: 'ft',
    resultUnit: 'ft',
  });
  assert.equal(zeroDiv.isValid, false);
}

console.log('cubic-feet calculation.test.ts: ok');
