import assert from 'node:assert/strict';
import {
  MM_PER_INCH,
  calculateMmToInches,
  inchesToMillimeters,
  millimetersToInches,
  shareResultText,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MM_PER_INCH, 25.4);

assert.equal(millimetersToInches(25.4), 1);
assert.equal(millimetersToInches(50.8), 2);
assertClose(millimetersToInches(76.2), 3);
assert.equal(millimetersToInches(127), 5);
assert.equal(millimetersToInches(254), 10);
assertClose(millimetersToInches(304.8), 12);

assert.equal(inchesToMillimeters(1), 25.4);
assert.equal(inchesToMillimeters(2), 50.8);
assert.equal(inchesToMillimeters(5), 127);
assert.equal(inchesToMillimeters(10), 254);
assertClose(inchesToMillimeters(12), 304.8);

assertClose(millimetersToInches(20), 20 / 25.4);
assertClose(millimetersToInches(100), 100 / 25.4);
assertClose(millimetersToInches(150), 150 / 25.4);

{
  const forward = calculateMmToInches({ source: 'mm', mm: 100, inches: null });
  assertClose(forward.inches, 100 / 25.4);
  const reverse = calculateMmToInches({ source: 'in', mm: null, inches: 1.5 });
  assertClose(reverse.mm, 38.1);
}

assert.match(
  shareResultText(calculateMmToInches({ source: 'mm', mm: 100, inches: null })),
  /mm to Inches Conversion/,
);
assert.match(
  shareResultText(calculateMmToInches({ source: 'mm', mm: 100, inches: null })),
  /\/tools\/mm-to-inches-conversion/,
);

console.log('mm-to-inches calculation.test.ts: ok');
