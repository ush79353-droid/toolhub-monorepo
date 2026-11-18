import assert from 'node:assert/strict';
import {
  calculateSquareInchToSquareFoot,
  formatArea,
  shareResultText,
  squareFeetToSquareInches,
  squareInchesToSquareFeet,
  SQUARE_INCHES_PER_SQUARE_FOOT,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assert.equal(SQUARE_INCHES_PER_SQUARE_FOOT, 144);
assert.equal(squareInchesToSquareFeet(144), 1);
assert.equal(squareFeetToSquareInches(1), 144);
assert.equal(squareInchesToSquareFeet(36), 0.25);
assert.equal(squareInchesToSquareFeet(72), 0.5);
assertClose(squareInchesToSquareFeet(400), 2.7777777778, 9);
assert.equal(squareFeetToSquareInches(2.5), 360);
assert.equal(squareInchesToSquareFeet(0), 0);
assert.equal(squareFeetToSquareInches(0), 0);

{
  const original = 1234.5678;
  const converted = squareInchesToSquareFeet(original);
  assertClose(squareFeetToSquareInches(converted), original, 8);
}

assert.throws(() => squareInchesToSquareFeet(-1), /negative/i);
assert.throws(() => squareFeetToSquareInches(Number.NaN), /finite/i);

{
  const result = calculateSquareInchToSquareFoot({
    source: 'squareInches',
    value: 576,
  });
  assert.equal(result.squareFeet, 4);
}

{
  const text = shareResultText({
    source: 'squareInches',
    squareInches: 144,
    squareFeet: 1,
    explanation: '144 in² = 1 ft²',
  });
  assert.match(text, /Square Inch to Square Foot Converter/);
  assert.match(text, /144 in² = 1 ft²/);
  assert.match(text, /square-inch-to-square-foot-converter/);
}

assert.equal(formatArea(0), '0');
console.log('square-inch-to-square-foot calculation.test.ts: ok');
