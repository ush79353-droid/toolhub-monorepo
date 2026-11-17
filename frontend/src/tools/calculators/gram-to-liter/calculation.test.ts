import assert from 'node:assert/strict';
import {
  calculateGramToLiter,
  densityToKgPerM3,
  fromGrams,
  fromLiters,
  gramsToLiters,
  kgPerM3ToDensity,
  litersToGrams,
  shareResultText,
  toGrams,
  toLiters,
} from './calculation';
import { findSubstance } from './substances';
import { WATER_DENSITY_KG_PER_M3 } from './types';
import { parseOptionalNumber, validateGramToLiter } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(WATER_DENSITY_KG_PER_M3, 1000);
assertClose(gramsToLiters(100, 1000), 0.1, 8);
assertClose(gramsToLiters(500, 1000), 0.5, 8);
assertClose(gramsToLiters(1000, 1000), 1, 8);
assertClose(gramsToLiters(200, 1030), 0.1941747572815534, 8);
assertClose(gramsToLiters(500, 920), 0.5434782608695652, 8);
assertClose(gramsToLiters(250, 1420), 0.176056338028169, 8);
assert.equal(litersToGrams(2, 1030), 2060);
assert.equal(litersToGrams(1, 1030), 1030);
assert.equal(gramsToLiters(0, 1000), 0);
assert.equal(litersToGrams(0, 1000), 0);

assert.throws(() => gramsToLiters(100, 0));
assert.throws(() => gramsToLiters(100, -1));
assert.throws(() => gramsToLiters(-1, 1000));
assert.throws(() => litersToGrams(-1, 1000));
assert.throws(() => litersToGrams(1, 0));

{
  const liters = gramsToLiters(87.5, 850);
  assertClose(litersToGrams(liters, 850), 87.5, 10);
}

assertClose(densityToKgPerM3(1, 'gPerMl'), 1000, 10);
assertClose(densityToKgPerM3(1000, 'gPerL'), 1000, 10);
assertClose(kgPerM3ToDensity(1000, 'gPerMl'), 1, 10);
assertClose(toGrams(1, 'metricTon'), 1_000_000, 10);
assertClose(fromGrams(1_000_000, 'metricTon'), 1, 10);
assertClose(toLiters(1, 'mL'), 0.001, 10);
assertClose(fromLiters(1, 'mL'), 1000, 10);

{
  const milk = findSubstance('whole-milk');
  assert.ok(milk);
  assert.equal(milk!.densityKgPerM3, 1030);
}

{
  const result = calculateGramToLiter({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'L',
  });
  assertClose(result.volume, 0.1, 8);
  assertClose(result.densityKgPerM3, 1000, 10);
  assert.match(shareResultText(result), /Gram to Liter Conversion/);
}

{
  const result = calculateGramToLiter({
    source: 'volume',
    substanceId: 'whole-milk',
    densityValue: 1030,
    densityUnit: 'kgPerM3',
    mass: null,
    massUnit: 'g',
    volume: 2,
    volumeUnit: 'L',
  });
  assert.equal(result.mass, 2060);
}

{
  const result = calculateGramToLiter({
    source: 'mass',
    substanceId: 'vegetable-oil',
    densityValue: 0.92,
    densityUnit: 'gPerMl',
    mass: 500,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'L',
  });
  assertClose(result.volume, 0.5434782608695652, 8);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateGramToLiter({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    mass: 0,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'L',
  }).isValid,
);
assert.ok(
  !validateGramToLiter({
    source: 'mass',
    substanceId: 'water',
    densityValue: 0,
    densityUnit: 'kgPerM3',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'L',
  }).isValid,
);

console.log('gram-to-liter calculation.test.ts: ok');
