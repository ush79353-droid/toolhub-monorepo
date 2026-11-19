import assert from 'node:assert/strict';
import {
  calculateGramsToFlOz,
  densityToGPerMl,
  fluidOuncesToGrams,
  fromGrams,
  fromMl,
  gPerMlToDensity,
  gramsToFluidOunces,
  shareResultText,
  toGrams,
  toMl,
} from './calculation';
import { findSubstance } from './substances';
import {
  UK_FL_OZ_IN_ML,
  US_FL_OZ_IN_ML,
  WATER_DENSITY_G_PER_ML,
} from './types';
import { parseOptionalNumber, validateGramsToFlOz } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(WATER_DENSITY_G_PER_ML, 1);
assert.equal(US_FL_OZ_IN_ML, 29.5735295625);
assert.equal(UK_FL_OZ_IN_ML, 28.4130625);
assert.ok(Number(US_FL_OZ_IN_ML) !== Number(UK_FL_OZ_IN_ML));

assertClose(gramsToFluidOunces(100, 1, 'US'), 3.38140227, 4);
assertClose(gramsToFluidOunces(250, 1, 'US'), 8.453505675, 4);
assertClose(gramsToFluidOunces(100, 1.42, 'US'), 2.3812692, 4);
assertClose(gramsToFluidOunces(100, 1, 'UK'), 3.51950798, 4);
assertClose(fluidOuncesToGrams(4, 1.03, 'US'), 121.8429418, 2);
assertClose(fluidOuncesToGrams(12, 1.07, 'US'), 379.7241096, 2);

assert.equal(gramsToFluidOunces(0, 1, 'US'), 0);
assert.equal(fluidOuncesToGrams(0, 1, 'US'), 0);

assert.throws(() => gramsToFluidOunces(100, 0, 'US'));
assert.throws(() => gramsToFluidOunces(100, -1, 'US'));
assert.throws(() => gramsToFluidOunces(-1, 1, 'US'));
assert.throws(() => fluidOuncesToGrams(-1, 1, 'US'));
assert.throws(() => fluidOuncesToGrams(1, 0, 'UK'));

{
  const flOz = gramsToFluidOunces(87.5, 0.85, 'US');
  assertClose(fluidOuncesToGrams(flOz, 0.85, 'US'), 87.5, 10);
}

assertClose(densityToGPerMl(1000, 'kgPerM3'), 1, 10);
assertClose(gPerMlToDensity(1, 'kgPerM3'), 1000, 10);
assertClose(densityToGPerMl(1, 'gPerCm3'), 1, 10);
assertClose(toGrams(1, 'kg'), 1000, 10);
assertClose(fromGrams(1000, 'kg'), 1, 10);
assertClose(toMl(1, 'usFlOz'), US_FL_OZ_IN_ML, 10);
assertClose(toMl(1, 'ukFlOz'), UK_FL_OZ_IN_ML, 10);
assertClose(fromMl(US_FL_OZ_IN_ML, 'usFlOz'), 1, 10);

{
  const water = findSubstance('water');
  assert.ok(water);
  assert.equal(water!.densityGPerMl, 1);
  const evaporated = findSubstance('evaporated-milk');
  assert.ok(evaporated);
  assertClose(evaporated!.densityGPerMl, 1.07, 10);
}

{
  const result = calculateGramsToFlOz({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'usFlOz',
  });
  assertClose(result.volume, 3.38140227, 4);
  assertClose(result.densityGPerMl, 1, 10);
  assert.match(shareResultText(result), /Grams to fl oz Converter/);
}

{
  const result = calculateGramsToFlOz({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'ukFlOz',
  });
  assertClose(result.volume, 3.51950798, 4);
}

{
  const result = calculateGramsToFlOz({
    source: 'volume',
    substanceId: 'milk',
    densityValue: 1.03,
    densityUnit: 'gPerMl',
    mass: null,
    massUnit: 'g',
    volume: 4,
    volumeUnit: 'usFlOz',
  });
  assertClose(result.mass, 121.8429418, 2);
}

{
  const result = calculateGramsToFlOz({
    source: 'mass',
    substanceId: 'honey',
    densityValue: 1.42,
    densityUnit: 'gPerMl',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'usFlOz',
  });
  assertClose(result.volume, 2.3812692, 4);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateGramsToFlOz({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    mass: 0,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'usFlOz',
  }).isValid,
);
assert.ok(
  !validateGramsToFlOz({
    source: 'mass',
    substanceId: 'water',
    densityValue: 0,
    densityUnit: 'gPerMl',
    mass: 100,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'usFlOz',
  }).isValid,
);
assert.ok(
  !validateGramsToFlOz({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1,
    densityUnit: 'gPerMl',
    mass: -1,
    massUnit: 'g',
    volume: null,
    volumeUnit: 'usFlOz',
  }).isValid,
);

console.log('grams-to-fl-oz calculation.test.ts: ok');
