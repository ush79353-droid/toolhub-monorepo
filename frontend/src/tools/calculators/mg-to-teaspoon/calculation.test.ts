import assert from 'node:assert/strict';
import {
  calculateMgToTeaspoon,
  densityToGPerMl,
  formatMeasure,
  gPerMlToDensity,
  milligramsToTeaspoons,
  shareResultText,
  teaspoonsToMilligrams,
} from './calculation';
import { DEFAULT_SUBSTANCE_ID, findSubstance } from './substances';
import {
  METRIC_TEASPOON_ML,
  SALT_DENSITY_G_PER_ML,
  US_TEASPOON_ML,
  WATER_DENSITY_G_PER_ML,
} from './types';
import { parseOptionalNumber, validateMgToTeaspoon } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(US_TEASPOON_ML, 4.92892159375);
assert.equal(METRIC_TEASPOON_ML, 5);
assert.equal(SALT_DENSITY_G_PER_ML, 1.217);
assert.equal(DEFAULT_SUBSTANCE_ID, 'salt');

assertClose(
  teaspoonsToMilligrams(1, WATER_DENSITY_G_PER_ML, US_TEASPOON_ML),
  4_928.92159375,
  8,
);
assertClose(
  teaspoonsToMilligrams(1, SALT_DENSITY_G_PER_ML, US_TEASPOON_ML),
  5_998.49757959375,
  4,
);
assertClose(
  milligramsToTeaspoons(6000, SALT_DENSITY_G_PER_ML, US_TEASPOON_ML),
  1.00025,
  4,
);
assert.equal(milligramsToTeaspoons(0, 1, US_TEASPOON_ML), 0);
assert.equal(teaspoonsToMilligrams(0, 1, US_TEASPOON_ML), 0);

{
  const tsp = milligramsToTeaspoons(3333, 0.85, US_TEASPOON_ML);
  assertClose(teaspoonsToMilligrams(tsp, 0.85, US_TEASPOON_ML), 3333, 8);
}

assertClose(milligramsToTeaspoons(5000, 1, METRIC_TEASPOON_ML), 1, 10);
assertClose(teaspoonsToMilligrams(1, 1, METRIC_TEASPOON_ML), 5000, 10);

assert.throws(() => milligramsToTeaspoons(1, 0, US_TEASPOON_ML));
assert.throws(() => milligramsToTeaspoons(1, -1, US_TEASPOON_ML));
assert.throws(() => milligramsToTeaspoons(-1, 1, US_TEASPOON_ML));
assert.throws(() => teaspoonsToMilligrams(-1, 1, US_TEASPOON_ML));
assert.throws(() => teaspoonsToMilligrams(1, 0, US_TEASPOON_ML));

assertClose(densityToGPerMl(1217, 'kgPerM3'), 1.217, 10);
assertClose(gPerMlToDensity(1.217, 'kgPerM3'), 1217, 10);
assertClose(densityToGPerMl(1217, 'mgPerMl'), 1.217, 10);

{
  const salt = findSubstance('salt');
  assert.ok(salt);
  assert.equal(salt!.densityGPerMl, SALT_DENSITY_G_PER_ML);
}

{
  const result = calculateMgToTeaspoon({
    source: 'milligrams',
    substanceId: 'salt',
    densityValue: 1217,
    densityUnit: 'kgPerM3',
    teaspoonStandard: 'us',
    milligrams: 6000,
    teaspoons: null,
  });
  assertClose(result.teaspoons, 1.00025, 4);
  assertClose(result.densityGPerMl, 1.217, 10);
  assert.match(shareResultText(result), /mg to Teaspoon Converter/);
  assert.match(shareResultText(result), /Salt/);
}

{
  const result = calculateMgToTeaspoon({
    source: 'teaspoons',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    teaspoonStandard: 'us',
    milligrams: null,
    teaspoons: 1,
  });
  assertClose(result.milligrams, 4_928.92159375, 8);
}

assert.ok(
  validateMgToTeaspoon({
    source: 'milligrams',
    substanceId: 'salt',
    densityValue: 1.217,
    densityUnit: 'gPerMl',
    teaspoonStandard: 'us',
    milligrams: 0,
    teaspoons: null,
  }).isValid,
);
assert.ok(
  !validateMgToTeaspoon({
    source: 'milligrams',
    substanceId: 'custom',
    densityValue: 0,
    densityUnit: 'gPerMl',
    teaspoonStandard: 'us',
    milligrams: 100,
    teaspoons: null,
  }).isValid,
);
assert.ok(
  !validateMgToTeaspoon({
    source: 'milligrams',
    substanceId: 'salt',
    densityValue: 1.217,
    densityUnit: 'gPerMl',
    teaspoonStandard: 'us',
    milligrams: -1,
    teaspoons: null,
  }).isValid,
);

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('0.'), null);
assert.equal(parseOptionalNumber('1.5'), 1.5);
assert.notEqual(formatMeasure(milligramsToTeaspoons(1, 1.217, US_TEASPOON_ML)), '0');

console.log('mg-to-teaspoon calculation.test.ts: ok');
