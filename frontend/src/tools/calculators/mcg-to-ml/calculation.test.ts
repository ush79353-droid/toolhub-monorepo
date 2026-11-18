import assert from 'node:assert/strict';
import {
  calculateMcgToMl,
  concentrationToMcgPerMl,
  mcgToMl,
  mcgToMlByDensity,
  mlToMcg,
  mlToMcgByDensity,
  shareResultText,
} from './calculation';
import { VITAMIN_B12_EXAMPLE_MCG_PER_ML } from './types';
import { parseOptionalNumber, validateMcgToMl } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(mcgToMl(500, 1000), 0.5);
assert.equal(mlToMcg(2, 1000), 2000);
assert.equal(mcgToMl(750, 1500), 0.5);
assert.equal(mcgToMlByDensity(1_000_000, 1), 1);
assert.equal(mlToMcgByDensity(1, 1), 1_000_000);
assert.equal(concentrationToMcgPerMl(2, 'mgPerMl'), 2000);
assert.equal(mcgToMl(500, 2000), 0.25);

assert.throws(() => mcgToMl(500, 0));
assert.throws(() => mcgToMl(500, -100));
assert.throws(() => mcgToMlByDensity(500, 0));

{
  const result = calculateMcgToMl({
    mode: 'medication',
    source: 'mass',
    massMcg: 500,
    volumeMl: null,
    massUnit: 'mcg',
    volumeUnit: 'mL',
    medicationPreset: 'vitaminB12Example',
    concentrationValue: VITAMIN_B12_EXAMPLE_MCG_PER_ML,
    concentrationUnit: 'mcgPerMl',
    densityValue: 1,
    densityUnit: 'gPerMl',
  });
  assert.equal(result.volumeMl, 0.5);
  assert.match(shareResultText(result), /mcg to mL/);
}

{
  const result = calculateMcgToMl({
    mode: 'medication',
    source: 'volume',
    massMcg: null,
    volumeMl: 1.5,
    massUnit: 'mcg',
    volumeUnit: 'mL',
    medicationPreset: 'custom',
    concentrationValue: 1000,
    concentrationUnit: 'mcgPerMl',
    densityValue: 1,
    densityUnit: 'gPerMl',
  });
  assert.equal(result.massMcg, 1500);
}

{
  const result = calculateMcgToMl({
    mode: 'density',
    source: 'mass',
    massMcg: 1_000_000,
    volumeMl: null,
    massUnit: 'mcg',
    volumeUnit: 'mL',
    medicationPreset: 'custom',
    concentrationValue: null,
    concentrationUnit: 'mcgPerMl',
    densityValue: 1,
    densityUnit: 'gPerMl',
  });
  assert.equal(result.volumeMl, 1);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateMcgToMl({
    mode: 'medication',
    source: 'mass',
    massMcg: 500,
    volumeMl: null,
    massUnit: 'mcg',
    volumeUnit: 'mL',
    medicationPreset: 'custom',
    concentrationValue: 0,
    concentrationUnit: 'mcgPerMl',
    densityValue: 1,
    densityUnit: 'gPerMl',
  }).isValid,
);
assert.ok(
  !validateMcgToMl({
    mode: 'medication',
    source: 'mass',
    massMcg: -1,
    volumeMl: null,
    massUnit: 'mcg',
    volumeUnit: 'mL',
    medicationPreset: 'vitaminB12Example',
    concentrationValue: 1000,
    concentrationUnit: 'mcgPerMl',
    densityValue: 1,
    densityUnit: 'gPerMl',
  }).isValid,
);

console.log('mcg-to-ml calculation.test.ts: ok');
