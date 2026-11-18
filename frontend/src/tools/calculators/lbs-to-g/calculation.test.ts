import assert from 'node:assert/strict';
import {
  GRAMS_PER_POUND,
  calculateLbsToG,
  formatMass,
  gramsToPounds,
  poundsToGrams,
  shareResultText,
} from './calculation';
import { validateLbsToG } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(GRAMS_PER_POUND, 453.59237);
assert.equal(poundsToGrams(1), 453.59237);
assert.equal(poundsToGrams(5), 2267.96185);
assert.equal(poundsToGrams(0.5), 226.796185);
assertClose(gramsToPounds(500), 1.10231131, 8);
assertClose(gramsToPounds(1000), 2.20462262, 8);
assert.equal(poundsToGrams(0), 0);
assert.equal(gramsToPounds(0), 0);
assert.throws(() => poundsToGrams(-1));
assert.throws(() => gramsToPounds(-1));
assertClose(gramsToPounds(poundsToGrams(25.75)), 25.75, 10);

{
  const result = calculateLbsToG({ source: 'pounds', pounds: 5, grams: null });
  assert.equal(result.grams, 2267.96185);
  assert.match(shareResultText(result), /lbs to g Converter/);
}

{
  const result = calculateLbsToG({ source: 'grams', pounds: null, grams: 500 });
  assertClose(result.pounds, 1.10231131, 8);
}

assert.ok(validateLbsToG({ source: 'pounds', pounds: 0, grams: null }).isValid);
assert.ok(!validateLbsToG({ source: 'pounds', pounds: -1, grams: null }).isValid);
assert.ok(!validateLbsToG({ source: 'grams', pounds: null, grams: Number.NaN }).isValid);

assert.equal(formatMass(poundsToGrams(1)), '453.59237');

console.log('lbs-to-g calculation.test.ts: ok');
