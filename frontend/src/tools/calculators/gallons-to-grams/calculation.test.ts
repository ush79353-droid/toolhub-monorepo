import assert from 'node:assert/strict';
import {
  calculateGalToGrams,
  densityToKgPerM3,
  gallonsToGrams,
  gramsToGallons,
  kgPerM3ToDensity,
  shareResultText,
} from './calculation';
import { CUBIC_METERS_PER_US_GALLON, LITERS_PER_US_GALLON } from './types';
import { parseOptionalNumber, validateGalToGrams } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(LITERS_PER_US_GALLON, 3.785411784);
assert.equal(CUBIC_METERS_PER_US_GALLON, 0.003785411784);

assertClose(gallonsToGrams(1, 1000), 3785.411784, 6);
assertClose(gallonsToGrams(2, 1000), 7570.823568, 6);
assertClose(gallonsToGrams(0.5, 1000), 1892.705892, 6);
assertClose(gallonsToGrams(1, 1030), 3898.97313752, 6);
assertClose(gallonsToGrams(2, 800), 6056.6588544, 6);
assertClose(gramsToGallons(3785.411784, 1000), 1, 10);
assert.equal(gallonsToGrams(0, 1000), 0);

assert.throws(() => gallonsToGrams(1, 0));
assert.throws(() => gallonsToGrams(1, -100));
assert.throws(() => gallonsToGrams(-1, 1000));
assert.throws(() => gramsToGallons(-1, 1000));

{
  const grams = gallonsToGrams(3.75, 920);
  assertClose(gramsToGallons(grams, 920), 3.75, 10);
}

assertClose(densityToKgPerM3(1, 'gPerMl'), 1000, 10);
assertClose(densityToKgPerM3(1, 'kgPerL'), 1000, 10);
assertClose(densityToKgPerM3(1000, 'gPerL'), 1000, 10);
assertClose(kgPerM3ToDensity(1000, 'gPerMl'), 1, 10);

{
  const result = calculateGalToGrams({
    source: 'volume',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    gallons: 1,
    grams: null,
  });
  assertClose(result.grams, 3785.411784, 6);
  assert.match(shareResultText(result), /Gallons to Grams/);
}

{
  const result = calculateGalToGrams({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    gallons: null,
    grams: 3785.411784,
  });
  assertClose(result.gallons, 1, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateGalToGrams({
    source: 'volume',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    gallons: 0,
    grams: null,
  }).isValid,
);
assert.ok(
  !validateGalToGrams({
    source: 'volume',
    substanceId: 'water',
    densityValue: 0,
    densityUnit: 'kgPerM3',
    gallons: 1,
    grams: null,
  }).isValid,
);

console.log('gallons-to-grams calculation.test.ts: ok');
