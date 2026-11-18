import assert from 'node:assert/strict';
import {
  calculateGramsInMl,
  densityToGPerMl,
  fromGrams,
  fromMl,
  gPerMlToDensity,
  gramsToMilliliters,
  kgPerM3ToGramsPerMl,
  millilitersToGrams,
  shareResultText,
  toGrams,
  toMl,
} from './calculation';
import { findSubstance } from './substances';
import { WATER_DENSITY_G_PER_ML, WATER_DENSITY_KG_PER_M3 } from './types';
import { parseOptionalNumber, validateGramsInMl } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(WATER_DENSITY_G_PER_ML, 1);
assert.equal(WATER_DENSITY_KG_PER_M3, 1000);
assert.equal(kgPerM3ToGramsPerMl(1000), 1);
assertClose(densityToGPerMl(1000, 'kgPerM3'), 1, 10);
assertClose(gPerMlToDensity(1, 'kgPerM3'), 1000, 10);
assertClose(densityToGPerMl(1, 'gPerMl'), 1, 10);
assertClose(densityToGPerMl(1, 'gPerCm3'), 1, 10);
assertClose(densityToGPerMl(1, 'kgPerL'), 1, 10);

assertClose(gramsToMilliliters(100, 1), 100, 10);
assertClose(gramsToMilliliters(250, 1), 250, 10);
assertClose(gramsToMilliliters(100, 1.42), 70.4225352112676, 6);
assertClose(gramsToMilliliters(200, 1.03), 194.1747572815534, 6);
assertClose(millilitersToGrams(150, 0.92), 138, 10);
assert.equal(gramsToMilliliters(0, 1), 0);
assert.equal(millilitersToGrams(0, 1), 0);

assert.throws(() => gramsToMilliliters(100, 0));
assert.throws(() => gramsToMilliliters(100, -1));
assert.throws(() => gramsToMilliliters(-1, 1));
assert.throws(() => millilitersToGrams(-1, 1));
assert.throws(() => millilitersToGrams(1, 0));

{
  const ml = gramsToMilliliters(87.5, 0.85);
  assertClose(millilitersToGrams(ml, 0.85), 87.5, 10);
}

assertClose(toGrams(1, 'kg'), 1000, 10);
assertClose(fromGrams(1000, 'kg'), 1, 10);
assertClose(toMl(1, 'L'), 1000, 10);
assertClose(fromMl(1000, 'L'), 1, 10);
assertClose(toMl(1, 'usGal'), 3785.411784, 6);
assertClose(toMl(1, 'ukGal'), 4546.09, 6);

{
  const water = findSubstance('water');
  assert.ok(water);
  assert.equal(water!.densityGPerMl, 1);
  const honey = findSubstance('honey');
  assert.ok(honey);
  assertClose(honey!.densityGPerMl, 1.42, 10);
}

{
  const result = calculateGramsInMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'mL',
  });
  assertClose(result.volume, 100, 10);
  assertClose(result.volumeMl, 100, 10);
  assertClose(result.densityGPerMl, 1, 10);
  assert.match(shareResultText(result), /Grams in mL Converter/);
}

{
  const result = calculateGramsInMl({
    source: 'mass',
    substanceId: 'honey',
    densityValue: 1.42,
    densityUnit: 'gPerMl',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'mL',
  });
  assertClose(result.volume, 70.4225352112676, 6);
}

{
  const result = calculateGramsInMl({
    source: 'volume',
    substanceId: 'vegetable-oil',
    densityValue: 0.92,
    densityUnit: 'gPerMl',
    mass: null,
    massUnit: 'g',
    volume: 150,
    volumeUnit: 'mL',
  });
  assertClose(result.mass, 138, 10);
}

{
  const result = calculateGramsInMl({
    source: 'mass',
    substanceId: 'custom',
    densityValue: 0.53,
    densityUnit: 'gPerMl',
    mass: 1,
    massUnit: 'kg',
    volume: null,
    volumeUnit: 'L',
  });
  assertClose(result.massG, 1000, 10);
  assertClose(result.volumeMl, 1000 / 0.53, 6);
  assertClose(result.volume, result.volumeMl / 1000, 6);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateGramsInMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    mass: 0,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'mL',
  }).isValid,
);
assert.ok(
  !validateGramsInMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 0,
    densityUnit: 'kgPerM3',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'mL',
  }).isValid,
);
assert.ok(
  !validateGramsInMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    mass: -1,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'mL',
  }).isValid,
);

console.log('grams-in-ml calculation.test.ts: ok');
