import assert from 'node:assert/strict';
import {
  GRAMS_PER_POUND,
  calculatePoundsToGrams,
  formatMass,
  gramsToPounds,
  poundsToGrams,
  shareResultText,
} from './calculation';
import { validatePoundsToGrams } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(GRAMS_PER_POUND, 453.59237);
assert.equal(poundsToGrams(1), 453.59237);
assert.equal(poundsToGrams(2), 907.18474);
assert.equal(poundsToGrams(3), 1360.77711);
assert.equal(poundsToGrams(5), 2267.96185);
assert.equal(poundsToGrams(10), 4535.9237);
assert.equal(poundsToGrams(0.5), 226.796185);
assert.equal(poundsToGrams(0), 0);
assert.equal(gramsToPounds(0), 0);
assert.equal(gramsToPounds(453.59237), 1);
assert.equal(gramsToPounds(907.18474), 2);
assertClose(gramsToPounds(1000), 2.20462262, 8);
assertClose(gramsToPounds(500), 1.10231131, 8);
assert.throws(() => poundsToGrams(-1));
assert.throws(() => gramsToPounds(-1));
assertClose(gramsToPounds(poundsToGrams(25.75)), 25.75, 10);

{
  const result = calculatePoundsToGrams({ source: 'pounds', pounds: 1, grams: null });
  assert.equal(result.grams, 453.59237);
  assert.match(shareResultText(result), /Pounds to Grams Converter/);
}

{
  const result = calculatePoundsToGrams({ source: 'grams', pounds: null, grams: 1000 });
  assertClose(result.pounds, 2.20462262, 8);
}

assert.ok(validatePoundsToGrams({ source: 'pounds', pounds: 0, grams: null }).isValid);
assert.ok(!validatePoundsToGrams({ source: 'pounds', pounds: -1, grams: null }).isValid);
assert.ok(!validatePoundsToGrams({ source: 'grams', pounds: null, grams: Number.NaN }).isValid);

assert.equal(formatMass(poundsToGrams(1)), '453.59237');

console.log('pounds-to-grams calculation.test.ts: ok');
