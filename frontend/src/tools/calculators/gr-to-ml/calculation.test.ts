import assert from 'node:assert/strict';
import {
  calculateGrToMl,
  densityToGPerMl,
  fromGrams,
  fromMl,
  gPerMlToDensity,
  gramsToMilliliters,
  millilitersToGrams,
  shareResultText,
  toGrams,
  toMl,
} from './calculation';
import { findSubstance } from './substances';
import { WATER_DENSITY_G_PER_ML } from './types';
import { parseOptionalNumber, validateGrToMl } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(WATER_DENSITY_G_PER_ML, 1);
assert.equal(gramsToMilliliters(100, 1), 100);
assert.equal(gramsToMilliliters(250, 1), 250);
assert.equal(gramsToMilliliters(500, 1), 500);
assert.equal(gramsToMilliliters(1000, 1), 1000);
assertClose(gramsToMilliliters(100, 1.03), 97.0873786407767, 8);
assertClose(gramsToMilliliters(100, 1.42), 70.4225352112676, 8);
assertClose(gramsToMilliliters(200, 0.92), 217.391304347826, 8);
assertClose(gramsToMilliliters(100, 0.789), 126.742712294043, 8);
assertClose(gramsToMilliliters(150, 1.42), 105.6338028169014, 8);
assert.equal(millilitersToGrams(250, 1), 250);
assert.equal(millilitersToGrams(500, 1), 500);
assert.equal(millilitersToGrams(100, 1.03), 103);
assert.equal(millilitersToGrams(100, 1.42), 142);
assert.equal(gramsToMilliliters(0, 1), 0);

assert.throws(() => gramsToMilliliters(100, 0));
assert.throws(() => gramsToMilliliters(-1, 1));
assert.throws(() => millilitersToGrams(1, 0));
assert.throws(() => millilitersToGrams(-1, 1));

{
  const ml = gramsToMilliliters(87.5, 0.85);
  assertClose(millilitersToGrams(ml, 0.85), 87.5, 10);
}

assertClose(densityToGPerMl(1000, 'kgPerM3'), 1, 10);
assertClose(gPerMlToDensity(1, 'kgPerM3'), 1000, 10);
assertClose(densityToGPerMl(1000, 'gPerL'), 1, 10);
assertClose(toGrams(1, 'metricTon'), 1_000_000, 10);
assertClose(fromGrams(1000, 'kg'), 1, 10);
assertClose(toMl(1, 'L'), 1000, 10);
assertClose(fromMl(1000, 'L'), 1, 10);

{
  const milk = findSubstance('whole-milk');
  assert.ok(milk);
  assertClose(milk!.densityGPerMl, 1.03, 10);
}

{
  const result = calculateGrToMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'mL',
  });
  assert.equal(result.volume, 100);
  assert.match(shareResultText(result), /gr to ml Converter/);
}

{
  const result = calculateGrToMl({
    source: 'volume',
    substanceId: 'honey',
    densityValue: 1.42,
    densityUnit: 'gPerMl',
    mass: null,
    massUnit: 'g',
    volume: 100,
    volumeUnit: 'mL',
  });
  assert.equal(result.mass, 142);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateGrToMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    mass: 0,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'mL',
  }).isValid,
);
assert.ok(
  !validateGrToMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 0,
    densityUnit: 'gPerMl',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'mL',
  }).isValid,
);

console.log('gr-to-ml calculation.test.ts: ok');
