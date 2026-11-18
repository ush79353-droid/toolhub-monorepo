import assert from 'node:assert/strict';
import {
  calculateSquareMetersToSquareFeet,
  formatArea,
  shareResultText,
  squareFeetToSquareMeters,
  squareMetersToSquareFeet,
  SQUARE_FEET_PER_SQUARE_METER,
  SQUARE_METERS_PER_SQUARE_FOOT,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assert.equal(SQUARE_METERS_PER_SQUARE_FOOT, 0.09290304);
assertClose(SQUARE_FEET_PER_SQUARE_METER, 10.7639104167, 8);
assertClose(squareMetersToSquareFeet(1), 10.7639104167, 8);
assertClose(squareMetersToSquareFeet(10), 107.639104167, 7);
assertClose(squareFeetToSquareMeters(100), 9.290304, 9);
assertClose(squareFeetToSquareMeters(250), 23.22576, 9);
assert.equal(squareMetersToSquareFeet(0), 0);
assert.equal(squareFeetToSquareMeters(0), 0);

{
  const original = 123.456;
  const feet = squareMetersToSquareFeet(original);
  assertClose(squareFeetToSquareMeters(feet), original, 9);
}

assert.throws(() => squareMetersToSquareFeet(-1), /negative/i);
assert.throws(() => squareFeetToSquareMeters(Number.NaN), /finite/i);

{
  const result = calculateSquareMetersToSquareFeet({
    source: 'squareMeters',
    value: 1,
    otherUnit: 'cm2',
  });
  assertClose(result.squareFeet, 10.7639104167, 8);
  assert.equal(result.otherValue, 10_000);
}

{
  const text = shareResultText({
    squareMeters: 10,
    squareFeet: 107.639104167,
    otherValue: 100_000,
    otherUnit: 'cm2',
    explanation: '10 m² = 107.639104167 ft²',
  });
  assert.match(text, /Square Meters to Square Feet Converter/);
  assert.match(text, /10 m²/);
  assert.match(text, /square-meters-to-square-feet-converter/);
}

assert.equal(formatArea(0), '0');
console.log('square-meters-to-square-feet calculation.test.ts: ok');
