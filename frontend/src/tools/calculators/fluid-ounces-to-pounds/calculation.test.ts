import assert from 'node:assert/strict';
import {
  calculateFlOzToLb,
  densityToKgPerM3,
  fluidOuncesToPounds,
  fromM3,
  poundsToFluidOunces,
  shareResultText,
  toM3,
  volumeToMass,
} from './calculation';
import {
  IMPERIAL_FL_OZ_TO_M3,
  US_FL_OZ_TO_M3,
  WATER_DENSITY_KG_PER_M3,
} from './types';
import { parseOptionalNumber, validateFlOzToLb } from './validation';

/** Absolute decimal-place closeness (brief table values are approximate). */
function assertClose(actual: number, expected: number, digits = 5): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected} ± ${eps}, got ${actual}`,
  );
}

const waterDensity = WATER_DENSITY_KG_PER_M3;

assert.equal(fluidOuncesToPounds(0, waterDensity), 0);
assertClose(fluidOuncesToPounds(1, waterDensity), 0.0651985, 6);
// Brief table values are approximate (exact ≈ 1.043176 lb for 16 US fl oz water).
assertClose(fluidOuncesToPounds(16, waterDensity), 1.04322, 3);
assertClose(fluidOuncesToPounds(32, waterDensity), 2.08644, 3);
assertClose(fluidOuncesToPounds(8, waterDensity), 0.52161, 3);
assertClose(fluidOuncesToPounds(64, waterDensity), 4.17288, 3);
assertClose(fluidOuncesToPounds(128, waterDensity), 8.34576, 3);
assertClose(poundsToFluidOunces(1, waterDensity), 15.3378, 4);

assertClose(fluidOuncesToPounds(16, 800), 0.83458, 3);

assert.throws(() => fluidOuncesToPounds(16, 0));
assert.throws(() => poundsToFluidOunces(1, -1));

assert.equal(toM3(1, 'usFlOz'), US_FL_OZ_TO_M3);
assert.equal(toM3(1, 'impFlOz'), IMPERIAL_FL_OZ_TO_M3);
assert.ok(toM3(1, 'usFlOz') !== toM3(1, 'impFlOz'));
assert.equal(fromM3(US_FL_OZ_TO_M3, 'usFlOz'), 1);
assert.equal(densityToKgPerM3(1, 'gPerCm3'), 1000);
assert.equal(densityToKgPerM3(1000, 'kgPerM3'), 1000);

{
  const us = fluidOuncesToPounds(16, waterDensity);
  const impMassKg = volumeToMass(toM3(16, 'impFlOz'), waterDensity);
  const impLb = impMassKg / 0.45359237;
  assert.ok(Math.abs(us - impLb) > 0.01);
}

{
  const result = calculateFlOzToLb({
    source: 'volume',
    substanceId: 'water',
    densityValue: waterDensity,
    densityUnit: 'kgPerM3',
    volume: 16,
    mass: null,
    volumeUnit: 'usFlOz',
    massUnit: 'lb',
  });
  assertClose(result.mass, 1.04322, 3);
  assert.match(shareResultText(result), /Fluid Ounces to Pounds/);
}

{
  const result = calculateFlOzToLb({
    source: 'mass',
    substanceId: 'water',
    densityValue: waterDensity,
    densityUnit: 'kgPerM3',
    volume: null,
    mass: 1,
    volumeUnit: 'usFlOz',
    massUnit: 'lb',
  });
  assertClose(result.volume, 15.3378, 4);
}

{
  const honey = calculateFlOzToLb({
    source: 'volume',
    substanceId: 'honey',
    densityValue: 1420,
    densityUnit: 'kgPerM3',
    volume: 16,
    mass: null,
    volumeUnit: 'usFlOz',
    massUnit: 'lb',
  });
  const water = calculateFlOzToLb({
    source: 'volume',
    substanceId: 'water',
    densityValue: waterDensity,
    densityUnit: 'kgPerM3',
    volume: 16,
    mass: null,
    volumeUnit: 'usFlOz',
    massUnit: 'lb',
  });
  assert.ok(honey.mass > water.mass);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateFlOzToLb({
    source: 'volume',
    substanceId: 'custom',
    densityValue: 0,
    densityUnit: 'kgPerM3',
    volume: 16,
    mass: null,
    volumeUnit: 'usFlOz',
    massUnit: 'lb',
  }).isValid,
);
assert.ok(
  !validateFlOzToLb({
    source: 'volume',
    substanceId: 'water',
    densityValue: -10,
    densityUnit: 'kgPerM3',
    volume: 16,
    mass: null,
    volumeUnit: 'usFlOz',
    massUnit: 'lb',
  }).isValid,
);

console.log('fluid-ounces-to-pounds calculation.test.ts: ok');
