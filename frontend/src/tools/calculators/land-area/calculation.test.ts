import assert from 'node:assert/strict';
import {
  calculateLandArea,
  calculateLandAreaResult,
  formatMeasure,
  shareResultText,
  squareMetersToArea,
} from './calculation';
import { validateLandArea } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(calculateLandArea(10, 'm', 20, 'm', 'm2'), 200);
assertClose(calculateLandArea(40, 'ft', 60, 'ft', 'ft2'), 2400, 8);
assertClose(calculateLandArea(10, 'ft', 20, 'm', 'm2'), 60.96, 8);
assert.equal(calculateLandArea(100, 'm', 200, 'm', 'hectare'), 2);
assert.equal(calculateLandArea(0, 'm', 20, 'm', 'm2'), 0);

assert.throws(() => calculateLandArea(-10, 'm', 20, 'm', 'm2'));
assert.throws(() => calculateLandArea(10, 'm', Number.NaN, 'm', 'm2'));

assertClose(squareMetersToArea(10_000, 'acre'), 2.4710538147, 8);
assert.equal(squareMetersToArea(10_000, 'hectare'), 1);

{
  const result = calculateLandAreaResult({
    width: 10,
    length: 20,
    widthUnit: 'm',
    lengthUnit: 'm',
    areaUnit: 'm2',
    pricePerUnit: 150,
    priceAreaUnit: 'm2',
    currency: 'USD',
  });
  assert.equal(result.area, 200);
  assert.equal(result.totalPrice, 30_000);
  assert.match(shareResultText(result), /Land Area Calculator/);
}

{
  const twoAcres = calculateLandAreaResult({
    width: 2 * 4046.8564224,
    length: 1,
    widthUnit: 'm',
    lengthUnit: 'm',
    areaUnit: 'acre',
    pricePerUnit: 25_000,
    priceAreaUnit: 'acre',
    currency: 'USD',
  });
  assertClose(twoAcres.area, 2, 10);
  assert.equal(twoAcres.totalPrice, 50_000);
}

assert.ok(
  validateLandArea({
    width: 10,
    length: 20,
    widthUnit: 'm',
    lengthUnit: 'm',
    areaUnit: 'm2',
    pricePerUnit: null,
    priceAreaUnit: 'm2',
    currency: 'USD',
  }).isValid,
);
assert.ok(
  !validateLandArea({
    width: -1,
    length: 20,
    widthUnit: 'm',
    lengthUnit: 'm',
    areaUnit: 'm2',
    pricePerUnit: null,
    priceAreaUnit: 'm2',
    currency: 'USD',
  }).isValid,
);
assert.ok(
  !validateLandArea({
    width: 10,
    length: 20,
    widthUnit: 'm',
    lengthUnit: 'm',
    areaUnit: 'm2',
    pricePerUnit: -5,
    priceAreaUnit: 'm2',
    currency: 'USD',
  }).isValid,
);

assert.equal(formatMeasure(200), '200');

console.log('land-area calculation.test.ts: ok');
