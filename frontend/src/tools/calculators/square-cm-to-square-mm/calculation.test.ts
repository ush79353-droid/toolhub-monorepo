import assert from 'node:assert/strict';
import {
  SQUARE_MM_PER_SQUARE_CM,
  calculateSquareCmToSquareMm,
  shareResultText,
  squareCmToSquareMm,
  squareMmToSquareCm,
} from './calculation';
import { parseOptionalNumber, validateSquareCmToSquareMm } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SQUARE_MM_PER_SQUARE_CM, 100);

assert.equal(squareCmToSquareMm(1), 100);
assert.equal(squareCmToSquareMm(5), 500);
assert.equal(squareCmToSquareMm(10), 1_000);
assert.equal(squareCmToSquareMm(500), 50_000);
assert.equal(squareCmToSquareMm(0), 0);
assert.equal(squareCmToSquareMm(0.5), 50);
assert.equal(squareCmToSquareMm(0.01), 1);
assert.equal(squareCmToSquareMm(8), 800);

assert.equal(squareMmToSquareCm(100), 1);
assert.equal(squareMmToSquareCm(250), 2.5);
assert.equal(squareMmToSquareCm(500), 5);
assert.equal(squareMmToSquareCm(0), 0);
assert.equal(squareMmToSquareCm(12.5), 0.125);
assert.equal(squareMmToSquareCm(750), 7.5);

{
  const value = 12.345;
  assertClose(squareMmToSquareCm(squareCmToSquareMm(value)), value, 12);
}

assert.throws(() => squareCmToSquareMm(-1));
assert.throws(() => squareMmToSquareCm(-100));
assert.throws(() => squareCmToSquareMm(Number.NaN));

{
  const result = calculateSquareCmToSquareMm({
    source: 'squareCentimeters',
    value: 5,
  });
  assert.equal(result.squareMillimeters, 500);
  assert.match(shareResultText(result), /Square Centimeters to Square Millimeters/);
  assert.match(shareResultText(result), /5 cm² = 500 mm²/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateSquareCmToSquareMm({ source: 'squareCentimeters', value: 0 }).isValid);
assert.ok(!validateSquareCmToSquareMm({ source: 'squareMillimeters', value: -1 }).isValid);
assert.ok(!validateSquareCmToSquareMm({ source: 'squareCentimeters', value: null }).isValid);

console.log('square-cm-to-square-mm calculation.test.ts: ok');
