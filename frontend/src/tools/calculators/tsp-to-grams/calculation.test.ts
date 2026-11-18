import assert from 'node:assert/strict';
import {
  US_TEASPOON_ML,
  calculateTspToGrams,
  gramsToTeaspoons,
  kgM3ToGmL,
  shareResultText,
  teaspoonsToGrams,
} from './calculation';
import { GRANULATED_SUGAR_KG_PER_M3, requireType } from './ingredients';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(US_TEASPOON_ML, 4.92892159375);

const sugarDensity = kgM3ToGmL(GRANULATED_SUGAR_KG_PER_M3);
assert.equal(sugarDensity, 0.845);
assert.equal(requireType('sugar', 'granulated-sugar').densityGPerMl, 0.845);

assertClose(teaspoonsToGrams(1, sugarDensity), 4.16493874627, 8);
assertClose(teaspoonsToGrams(2, sugarDensity), 8.32987749254, 8);

const grams = teaspoonsToGrams(3.5, sugarDensity);
assertClose(gramsToTeaspoons(grams, sugarDensity), 3.5, 10);

assertClose(teaspoonsToGrams(1, sugarDensity, 5), 4.225, 10);
assert.equal(teaspoonsToGrams(0, sugarDensity), 0);
assertClose(teaspoonsToGrams(0.5, sugarDensity), 2.08246937313, 8);

assert.throws(() => gramsToTeaspoons(10, 0));
assert.throws(() => teaspoonsToGrams(1, 0));
assert.throws(() => gramsToTeaspoons(-1, sugarDensity));

const result = calculateTspToGrams({
  source: 'volume',
  categoryId: 'sugar',
  typeId: 'granulated-sugar',
  densityValue: GRANULATED_SUGAR_KG_PER_M3,
  densityUnit: 'kgPerM3',
  teaspoons: 2,
  volumeUnit: 'usTsp',
  grams: null,
});
assertClose(result.grams, 8.32987749254, 8);
assert.equal(result.ingredientName, 'Granulated sugar');
assert.match(shareResultText(result), /tsp to grams Converter/);
assert.match(shareResultText(result), /845/);
assert.match(shareResultText(result), /Granulated sugar/);

console.log('tsp-to-grams calculation.test.ts: ok');
