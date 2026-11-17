import assert from 'node:assert/strict';
import {
  calculateMgToTablespoon,
  densityToGPerMl,
  formatMeasure,
  gPerMlToDensity,
  milligramsToTablespoons,
  shareResultText,
  tablespoonsToMilligrams,
} from './calculation';
import { DEFAULT_SUBSTANCE_ID, findSubstance } from './substances';
import {
  AUSTRALIAN_TABLESPOON_ML,
  METRIC_TABLESPOON_ML,
  SALT_DENSITY_G_PER_ML,
  US_TABLESPOON_ML,
  WATER_DENSITY_G_PER_ML,
} from './types';
import { parseOptionalNumber, validateMgToTablespoon } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(US_TABLESPOON_ML, 14.78676478125);
assert.equal(METRIC_TABLESPOON_ML, 15);
assert.equal(AUSTRALIAN_TABLESPOON_ML, 20);
assert.equal(SALT_DENSITY_G_PER_ML, 1.217);
assert.equal(DEFAULT_SUBSTANCE_ID, 'salt');

assertClose(
  tablespoonsToMilligrams(1, WATER_DENSITY_G_PER_ML, US_TABLESPOON_ML),
  14_786.76478125,
  8,
);
assertClose(
  tablespoonsToMilligrams(1, SALT_DENSITY_G_PER_ML, US_TABLESPOON_ML),
  17_994.49248878125,
  4,
);
assertClose(
  milligramsToTablespoons(10_000, SALT_DENSITY_G_PER_ML, US_TABLESPOON_ML),
  0.55573,
  4,
);
assert.equal(milligramsToTablespoons(0, 1, US_TABLESPOON_ML), 0);
assert.equal(tablespoonsToMilligrams(0, 1, US_TABLESPOON_ML), 0);

{
  const tbsp = milligramsToTablespoons(7777, 0.85, US_TABLESPOON_ML);
  assertClose(tablespoonsToMilligrams(tbsp, 0.85, US_TABLESPOON_ML), 7777, 8);
}

assertClose(
  milligramsToTablespoons(15_000, 1, METRIC_TABLESPOON_ML),
  1,
  10,
);
assertClose(
  tablespoonsToMilligrams(1, 1, AUSTRALIAN_TABLESPOON_ML),
  20_000,
  10,
);

assert.throws(() => milligramsToTablespoons(1, 0, US_TABLESPOON_ML));
assert.throws(() => milligramsToTablespoons(1, -1, US_TABLESPOON_ML));
assert.throws(() => milligramsToTablespoons(-1, 1, US_TABLESPOON_ML));
assert.throws(() => tablespoonsToMilligrams(-1, 1, US_TABLESPOON_ML));
assert.throws(() => tablespoonsToMilligrams(1, 0, US_TABLESPOON_ML));

assertClose(densityToGPerMl(1217, 'kgPerM3'), 1.217, 10);
assertClose(gPerMlToDensity(1.217, 'kgPerM3'), 1217, 10);
assertClose(densityToGPerMl(1.217, 'gPerMl'), 1.217, 10);
assertClose(densityToGPerMl(1217, 'mgPerMl'), 1.217, 10);
assertClose(densityToGPerMl(1, 'gPerCm3'), 1, 10);

{
  const salt = findSubstance('salt');
  assert.ok(salt);
  assert.equal(salt!.densityGPerMl, SALT_DENSITY_G_PER_ML);
}

{
  const result = calculateMgToTablespoon({
    source: 'milligrams',
    substanceId: 'salt',
    densityValue: 1217,
    densityUnit: 'kgPerM3',
    tablespoonStandard: 'us',
    milligrams: 10_000,
    tablespoons: null,
  });
  assertClose(result.tablespoons, 0.55573, 4);
  assertClose(result.densityGPerMl, 1.217, 10);
  assert.match(shareResultText(result), /mg to tablespoon Converter/);
  assert.match(shareResultText(result), /Salt/);
}

{
  const result = calculateMgToTablespoon({
    source: 'tablespoons',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    tablespoonStandard: 'us',
    milligrams: null,
    tablespoons: 1,
  });
  assertClose(result.milligrams, 14_786.76478125, 8);
}

assert.ok(
  validateMgToTablespoon({
    source: 'milligrams',
    substanceId: 'salt',
    densityValue: 1.217,
    densityUnit: 'gPerMl',
    tablespoonStandard: 'us',
    milligrams: 0,
    tablespoons: null,
  }).isValid,
);
assert.ok(
  !validateMgToTablespoon({
    source: 'milligrams',
    substanceId: 'custom',
    densityValue: 0,
    densityUnit: 'gPerMl',
    tablespoonStandard: 'us',
    milligrams: 100,
    tablespoons: null,
  }).isValid,
);
assert.ok(
  !validateMgToTablespoon({
    source: 'milligrams',
    substanceId: 'salt',
    densityValue: 1.217,
    densityUnit: 'gPerMl',
    tablespoonStandard: 'us',
    milligrams: -1,
    tablespoons: null,
  }).isValid,
);
assert.ok(
  !validateMgToTablespoon({
    source: 'tablespoons',
    substanceId: 'salt',
    densityValue: 1.217,
    densityUnit: 'gPerMl',
    tablespoonStandard: 'us',
    milligrams: null,
    tablespoons: Number.NaN,
  }).isValid,
);

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('0.'), null);
assert.equal(parseOptionalNumber('1.5'), 1.5);
assert.notEqual(formatMeasure(milligramsToTablespoons(1, 1.217, US_TABLESPOON_ML)), '0');

console.log('mg-to-tablespoon calculation.test.ts: ok');
