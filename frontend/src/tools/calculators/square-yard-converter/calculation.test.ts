import assert from 'node:assert/strict';
import {
  allFromSquareYards,
  convertArea,
  formatArea,
  shareResultText,
  SQUARE_METERS_PER_SQUARE_YARD,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assert.equal(SQUARE_METERS_PER_SQUARE_YARD, 0.83612736);
assertClose(convertArea(1, 'yd2', 'ft2'), 9, 10);
assertClose(convertArea(1, 'yd2', 'm2'), 0.83612736, 10);
assertClose(convertArea(10, 'yd2', 'm2'), 8.3612736, 9);
assertClose(convertArea(1, 'acre', 'yd2'), 4840, 9);
assertClose(convertArea(100, 'yd2', 'acre'), 100 / 4840, 10);
assert.equal(convertArea(0, 'yd2', 'm2'), 0);
assert.equal(convertArea(1, 'yd2', 'in2'), 1296);

{
  const original = 123.456;
  const meters = convertArea(original, 'yd2', 'm2');
  assertClose(convertArea(meters, 'm2', 'yd2'), original, 9);
}

assertClose(convertArea(50, 'm2', 'yd2'), 50 / 0.83612736, 8);

{
  const values = allFromSquareYards(1);
  assert.equal(values.ft2, 9);
  assertClose(values.m2, 0.83612736, 10);
  assertClose(values.acre, 1 / 4840, 12);
}

{
  const text = shareResultText(10);
  assert.match(text, /Square Yard Converter/);
  assert.match(text, /yd²/);
  assert.match(text, /ft²/);
  assert.match(text, /square-yard-converter/);
}

assert.equal(formatArea(0), '0');
console.log('square-yard-converter calculation.test.ts: ok');
