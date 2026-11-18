import assert from 'node:assert/strict';
import {
  calculateKgToMl,
  densityToKgPerM3,
  formatMeasure,
  kgPerM3ToDensity,
  kgToMl,
  mlToKg,
  shareResultText,
} from './calculation';
import { findSubstance } from './substances';
import { validateKgToMl } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(kgToMl(1, 1000), 1000);
assertClose(kgToMl(5, 1000), 5000);
assertClose(mlToKg(2500, 1000), 2.5);

assertClose(kgToMl(1, 1030), 970.873786407767, 6);
assertClose(kgToMl(2, 918), 2178.649237472767, 5);
assertClose(mlToKg(1000, 1420), 1.42);
assertClose(kgToMl(1, 1420), 704.2253521126761, 6);

assert.equal(densityToKgPerM3(1, 'kgPerL'), 1000);
assert.equal(densityToKgPerM3(1, 'gPerMl'), 1000);
assert.equal(densityToKgPerM3(1, 'gPerCm3'), 1000);
assertClose(kgPerM3ToDensity(1000, 'kgPerL'), 1);

assert.equal(findSubstance('water')?.densityKgPerM3, 1000);
assert.equal(findSubstance('milk')?.densityKgPerM3, 1030);
assert.equal(findSubstance('olive-oil')?.densityKgPerM3, 918);

{
  const result = calculateKgToMl({
    source: 'mass',
    substanceId: 'milk',
    densityValue: 1030,
    densityUnit: 'kgPerM3',
    massKg: 1,
    volumeMl: null,
  });
  assertClose(result.volumeMl, 970.8738, 4);
  assert.match(shareResultText(result), /Milk/);
  assert.match(shareResultText(result), /kg to mL/);
}

{
  const result = calculateKgToMl({
    source: 'volume',
    substanceId: 'honey',
    densityValue: 1420,
    densityUnit: 'kgPerM3',
    massKg: null,
    volumeMl: 1000,
  });
  assertClose(result.massKg, 1.42);
}

assert.ok(
  validateKgToMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    massKg: 0,
    volumeMl: null,
  }).isValid,
);
assert.ok(
  !validateKgToMl({
    source: 'mass',
    substanceId: 'custom',
    densityValue: 0,
    densityUnit: 'kgPerM3',
    massKg: 1,
    volumeMl: null,
  }).isValid,
);
assert.ok(
  !validateKgToMl({
    source: 'mass',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    massKg: -1,
    volumeMl: null,
  }).isValid,
);

assert.throws(() => kgToMl(1, 0));
assert.throws(() => mlToKg(-1, 1000));
assert.ok(formatMeasure(kgToMl(1, 1030)).startsWith('970'));

console.log('kg-to-ml calculation.test.ts: ok');
