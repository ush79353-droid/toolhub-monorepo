import assert from 'node:assert/strict';
import {
  allFromSquareMeters,
  convertArea,
  formatArea,
  shareResultText,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assertClose(convertArea(1, 'm2', 'ft2'), 10.7639104167, 8);
assertClose(convertArea(100, 'ft2', 'm2'), 9.290304, 9);
assert.equal(convertArea(1, 'm2', 'cm2'), 10_000);
assert.equal(convertArea(1, 'm2', 'mm2'), 1_000_000);
assert.equal(convertArea(1, 'hectare', 'm2'), 10_000);
assert.equal(convertArea(1, 'km2', 'm2'), 1_000_000);
assertClose(convertArea(1, 'acre', 'm2'), 4046.8564224, 7);
assert.equal(convertArea(0, 'm2', 'ft2'), 0);

{
  const original = 123.456;
  const feet = convertArea(original, 'm2', 'ft2');
  assertClose(convertArea(feet, 'ft2', 'm2'), original, 9);
}

assertClose(convertArea(1, 'm2', 'in2'), 1550.0031000062, 6);
assertClose(convertArea(1, 'm2', 'yd2'), 1.1959900463, 8);
assert.equal(convertArea(1, 'm2', 'hectare'), 0.0001);

{
  const values = allFromSquareMeters(1);
  assertClose(values.ft2, 10.7639104167, 8);
  assert.equal(values.cm2, 10_000);
  assert.equal(values.mm2, 1_000_000);
}

{
  const text = shareResultText(1);
  assert.match(text, /Square Meter Converter/);
  assert.match(text, /m²/);
  assert.match(text, /ft²/);
  assert.match(text, /square-meter-converter/);
}

assert.equal(formatArea(0), '0');
console.log('square-meter-converter calculation.test.ts: ok');
