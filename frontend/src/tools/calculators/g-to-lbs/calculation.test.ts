import assert from 'node:assert/strict';
import {
  calculateGToLbs,
  gramsToPounds,
  poundsToGrams,
  shareResultText,
  GRAMS_PER_POUND,
} from './calculation';
import { parseOptionalNumber, validateGToLbs } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(GRAMS_PER_POUND, 453.59237);
assert.equal(gramsToPounds(0), 0);
assert.equal(poundsToGrams(0), 0);
assertClose(gramsToPounds(1), 0.0022046226218487757, 12);
assertClose(gramsToPounds(100), 0.22046226218487757, 10);
assertClose(gramsToPounds(124), 0.273373204869248, 8);
assertClose(gramsToPounds(200), 0.44092452436975515, 8);
assertClose(gramsToPounds(500), 1.1023113109243878, 8);
assertClose(gramsToPounds(1000), 2.2046226218487757, 8);
assert.equal(poundsToGrams(1), GRAMS_PER_POUND);
assertClose(poundsToGrams(2), 907.18474, 8);

{
  const lb = gramsToPounds(750);
  assertClose(poundsToGrams(lb), 750, 10);
}

assert.throws(() => gramsToPounds(-10));
assert.throws(() => poundsToGrams(-1));
assert.throws(() => gramsToPounds(Number.NaN));

{
  const result = calculateGToLbs({
    source: 'grams',
    grams: 500,
    pounds: null,
  });
  assertClose(result.pounds, 1.1023113109243878, 8);
  assert.match(shareResultText(result), /g to lbs Converter/);
}

{
  const result = calculateGToLbs({
    source: 'pounds',
    grams: null,
    pounds: 2,
  });
  assertClose(result.grams, 907.18474, 8);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateGToLbs({ source: 'grams', grams: 0, pounds: null }).isValid,
);
assert.ok(
  !validateGToLbs({ source: 'grams', grams: -1, pounds: null }).isValid,
);

console.log('g-to-lbs calculation.test.ts: ok');
