import assert from 'node:assert/strict';
import { convertArea, formatArea, shareResultText, calculateSquareFeetConverter } from './calculation';
import { DEFAULT_TARGET_UNIT } from './types';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assertClose(convertArea(1, 'ft2', 'm2'), 0.09290304, 10);
assertClose(convertArea(100, 'ft2', 'm2'), 9.290304, 8);
assertClose(convertArea(1, 'ft2', 'in2'), 144, 10);
assertClose(convertArea(9, 'ft2', 'yd2'), 1, 10);
assertClose(convertArea(43560, 'ft2', 'acre'), 1, 8);
assertClose(convertArea(1, 'm2', 'ft2'), 10.7639104167, 8);
assert.equal(convertArea(0, 'ft2', 'm2'), 0);
assertClose(convertArea(0.5, 'ft2', 'm2'), 0.04645152, 10);

{
  const original = 123.456;
  const converted = convertArea(original, 'ft2', 'm2');
  assertClose(convertArea(converted, 'm2', 'ft2'), original, 8);
}

assertClose(convertArea(100, 'ft2', 'in2'), 14400, 8);
assertClose(convertArea(100, 'ft2', 'yd2'), 100 / 9, 10);
assertClose(convertArea(100, 'ft2', 'cm2'), 92903.04, 6);
assertClose(convertArea(500, 'ft2', 'm2'), 46.45152, 8);

assert.throws(() => convertArea(-1, 'ft2', 'm2'), /negative/i);
assert.throws(() => convertArea(Number.NaN, 'ft2', 'm2'), /finite/i);

{
  const result = calculateSquareFeetConverter({
    source: 'squareFeet',
    value: 100,
    targetUnit: 'm2',
  });
  assertClose(result.squareFeet, 100, 12);
  assertClose(result.converted, 9.290304, 8);
  assert.equal(result.targetUnit, 'm2');
}

{
  const result = calculateSquareFeetConverter({
    source: 'conversion',
    value: 10,
    targetUnit: 'm2',
  });
  assertClose(result.converted, 10, 12);
  assertClose(result.squareFeet, 107.639104167, 8);
}

assert.equal(DEFAULT_TARGET_UNIT, 'm2');
assert.equal(formatArea(0), '0');
assert.match(formatArea(9.290304), /9\.290304/);

{
  const text = shareResultText({
    squareFeet: 100,
    converted: 9.290304,
    targetUnit: 'm2',
    explanation: '100 ft² = 9.290304 m²',
  });
  assert.match(text, /Square Feet Converter/);
  assert.match(text, /100 ft² = 9\.290304 m²/);
  assert.match(text, /square-feet-converter/);
}

console.log('square-feet-converter calculation.test.ts: ok');
