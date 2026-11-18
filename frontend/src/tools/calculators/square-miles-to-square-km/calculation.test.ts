import assert from 'node:assert/strict';
import {
  calculateSquareMilesToSquareKm,
  formatArea,
  shareResultText,
  squareKilometersToSquareMiles,
  squareMilesToSquareKilometers,
  SQUARE_KILOMETERS_PER_SQUARE_MILE,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assert.equal(SQUARE_KILOMETERS_PER_SQUARE_MILE, 2.589988110336);
assertClose(squareMilesToSquareKilometers(1), 2.589988110336, 10);
assertClose(squareMilesToSquareKilometers(10), 25.89988110336, 9);
assertClose(squareMilesToSquareKilometers(40), 103.59952441344, 8);
assertClose(squareKilometersToSquareMiles(100), 38.6102158542, 8);
assert.equal(squareMilesToSquareKilometers(0), 0);
assert.equal(squareKilometersToSquareMiles(0), 0);

{
  const original = 123.456;
  const km2 = squareMilesToSquareKilometers(original);
  assertClose(squareKilometersToSquareMiles(km2), original, 9);
}

assert.throws(() => squareMilesToSquareKilometers(-1), /negative/i);
assert.throws(() => squareKilometersToSquareMiles(Number.NaN), /finite/i);

{
  const result = calculateSquareMilesToSquareKm({
    source: 'squareMiles',
    value: 1,
    otherUnit: 'm2',
  });
  assertClose(result.squareKilometers, 2.589988110336, 10);
  assertClose(result.otherValue, 2_589_988.110336, 6);
}

{
  const text = shareResultText({
    squareMiles: 40,
    squareKilometers: 103.59952441344,
    otherValue: 103_599_524.41344,
    otherUnit: 'm2',
    explanation: '40 mi² = 103.59952441344 km²',
  });
  assert.match(text, /Square Miles to Square km Converter/);
  assert.match(text, /40 mi²/);
  assert.match(text, /square-miles-to-square-km-converter/);
}

assert.equal(formatArea(0), '0');
console.log('square-miles-to-square-km calculation.test.ts: ok');
