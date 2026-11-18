import assert from 'node:assert/strict';
import {
  calculateGToTsp,
  densityToGPerMl,
  gPerMlToDensity,
  gramsToTeaspoons,
  shareResultText,
  teaspoonsToGrams,
  toMl,
  US_TEASPOON_ML,
} from './calculation';
import { findSubstance } from './substances';
import { METRIC_TEASPOON_ML, SALT_DENSITY_G_PER_ML, SALT_DENSITY_KG_PER_M3 } from './types';
import { parseOptionalNumber, validateGToTsp } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(US_TEASPOON_ML, 4.92892159375);
assert.equal(METRIC_TEASPOON_ML, 5);
assert.ok(Number(US_TEASPOON_ML) !== Number(METRIC_TEASPOON_ML));
assert.equal(SALT_DENSITY_G_PER_ML, 1.217);
assert.equal(SALT_DENSITY_KG_PER_M3, 1217);

assertClose(gramsToTeaspoons(5, 1), 1.01442068, 6);
assertClose(gramsToTeaspoons(10, 1), 2.02884136, 7);
assertClose(gramsToTeaspoons(25, 1), 5.0721034, 6);
assertClose(gramsToTeaspoons(5, 1.217), 5 / (1.217 * US_TEASPOON_ML), 10);
assertClose(gramsToTeaspoons(10, 1.217), 10 / (1.217 * US_TEASPOON_ML), 10);
assertClose(gramsToTeaspoons(10, 0.85), 10 / (0.85 * US_TEASPOON_ML), 10);
assertClose(gramsToTeaspoons(20, 1.42), 20 / (1.42 * US_TEASPOON_ML), 10);

assertClose(teaspoonsToGrams(1, 1), US_TEASPOON_ML, 10);
assertClose(teaspoonsToGrams(1, 1.217), US_TEASPOON_ML * 1.217, 10);
assertClose(teaspoonsToGrams(2, 1), 9.8578431875, 8);
assertClose(teaspoonsToGrams(5, 1), 24.64460796875, 8);
assert.equal(gramsToTeaspoons(0, 1), 0);

assert.throws(() => gramsToTeaspoons(10, 0));
assert.throws(() => gramsToTeaspoons(-1, 1));
assert.throws(() => teaspoonsToGrams(1, 0));
assert.throws(() => teaspoonsToGrams(-1, 1));

{
  const tsp = gramsToTeaspoons(12.5, 0.85);
  assertClose(teaspoonsToGrams(tsp, 0.85), 12.5, 10);
}

assertClose(densityToGPerMl(1217, 'kgPerM3'), 1.217, 10);
assertClose(gPerMlToDensity(1.217, 'kgPerM3'), 1217, 10);
assertClose(toMl(1, 'usTsp'), US_TEASPOON_ML, 10);
assertClose(toMl(1, 'metricTsp'), 5, 10);

{
  const salt = findSubstance('salt');
  assert.ok(salt);
  assertClose(salt!.densityGPerMl, 1.217, 10);
}

{
  const result = calculateGToTsp({
    source: 'mass',
    substanceId: 'salt',
    densityValue: 1217,
    densityUnit: 'kgPerM3',
    mass: 10,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'usTsp',
  });
  assertClose(result.volume, 10 / (1.217 * US_TEASPOON_ML), 10);
  assertClose(result.densityGPerMl, 1.217, 10);
  assert.match(shareResultText(result), /g to tsp Converter/);
}

{
  const result = calculateGToTsp({
    source: 'volume',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    mass: null,
    massUnit: 'g',
    volume: 1,
    volumeUnit: 'usTsp',
  });
  assertClose(result.mass, US_TEASPOON_ML, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateGToTsp({
    source: 'mass',
    substanceId: 'salt',
    densityValue: 1217,
    densityUnit: 'kgPerM3',
    mass: 0,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'usTsp',
  }).isValid,
);
assert.ok(
  !validateGToTsp({
    source: 'mass',
    substanceId: 'salt',
    densityValue: 0,
    densityUnit: 'kgPerM3',
    mass: 10,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'usTsp',
  }).isValid,
);

console.log('g-to-tsp calculation.test.ts: ok');
