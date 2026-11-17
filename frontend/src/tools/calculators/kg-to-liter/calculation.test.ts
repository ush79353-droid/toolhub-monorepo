import assert from 'node:assert/strict';
import {
  calculateKgToLiter,
  densityToKgPerL,
  formatMeasure,
  kgPerLToDensity,
  kgToLiters,
  litersToKg,
  shareResultText,
} from './calculation';
import { findSubstance } from './substances';
import { validateKgToLiter } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(kgToLiters(1, 1), 1);
assertClose(kgToLiters(5, 1), 5);
assertClose(litersToKg(10, 1), 10);
assertClose(litersToKg(25, 1), 25);

assertClose(kgToLiters(5, 0.918), 5.446623093681917, 6);
assertClose(litersToKg(5, 0.918), 4.59, 8);
assertClose(litersToKg(2, 1.42), 2.84, 8);
assertClose(kgToLiters(2, 1.42), 1.408450704225352, 6);
assertClose(kgToLiters(10, 1.03), 9.70873786407767, 6);

assert.equal(densityToKgPerL(1000, 'kgPerM3'), 1);
assert.equal(densityToKgPerL(1, 'gPerMl'), 1);
assert.equal(densityToKgPerL(1, 'gPerCm3'), 1);
assertClose(kgPerLToDensity(1, 'kgPerM3'), 1000);

assert.equal(findSubstance('fresh-water')?.densityKgPerL, 1);
assertClose(findSubstance('olive-oil')!.densityKgPerL, 0.918);
assertClose(findSubstance('honey')!.densityKgPerL, 1.42);

{
  const result = calculateKgToLiter({
    source: 'mass',
    substanceId: 'olive-oil',
    densityValue: 0.918,
    densityUnit: 'kgPerL',
    massKg: 5,
    volumeL: null,
  });
  assertClose(result.volumeL, 5.446623, 5);
  assert.match(shareResultText(result), /Olive oil/);
  assert.match(shareResultText(result), /kg to Liter/);
}

{
  const result = calculateKgToLiter({
    source: 'volume',
    substanceId: 'honey',
    densityValue: 1.42,
    densityUnit: 'kgPerL',
    massKg: null,
    volumeL: 2,
  });
  assertClose(result.massKg, 2.84);
}

assert.ok(
  validateKgToLiter({
    source: 'mass',
    substanceId: 'fresh-water',
    densityValue: 1,
    densityUnit: 'kgPerL',
    massKg: 0,
    volumeL: null,
  }).isValid,
);
assert.ok(
  !validateKgToLiter({
    source: 'mass',
    substanceId: 'custom',
    densityValue: 0,
    densityUnit: 'kgPerL',
    massKg: 1,
    volumeL: null,
  }).isValid,
);
assert.ok(
  !validateKgToLiter({
    source: 'mass',
    substanceId: 'fresh-water',
    densityValue: 1,
    densityUnit: 'kgPerL',
    massKg: -1,
    volumeL: null,
  }).isValid,
);
assert.ok(
  !validateKgToLiter({
    source: 'volume',
    substanceId: 'fresh-water',
    densityValue: 1,
    densityUnit: 'kgPerL',
    massKg: null,
    volumeL: -2,
  }).isValid,
);

assert.throws(() => kgToLiters(1, 0));
assert.throws(() => litersToKg(-1, 1));
assert.ok(formatMeasure(kgToLiters(5, 0.918)).startsWith('5.44'));

console.log('kg-to-liter calculation.test.ts: ok');
