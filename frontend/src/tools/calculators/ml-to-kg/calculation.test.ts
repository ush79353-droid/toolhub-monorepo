import assert from 'node:assert/strict';
import {
  calculateMlToKg,
  kgToMl,
  mlToKg,
  shareResultText,
} from './calculation';
import { findSubstance } from './substances';
import { WATER_DENSITY_KG_PER_M3 } from './types';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(findSubstance('water')?.densityKgPerM3, 1000);

assert.equal(mlToKg(1000, WATER_DENSITY_KG_PER_M3), 1);
assert.equal(mlToKg(500, WATER_DENSITY_KG_PER_M3), 0.5);
assert.equal(mlToKg(250, WATER_DENSITY_KG_PER_M3), 0.25);
assert.equal(mlToKg(2000, WATER_DENSITY_KG_PER_M3), 2);

assert.equal(mlToKg(1000, 850), 0.85);
assert.equal(mlToKg(2000, 850), 1.7);
assertClose(kgToMl(2.5, 1250), 2000);
assert.equal(mlToKg(500, 800), 0.4);

const water = calculateMlToKg({
  source: 'volume',
  substanceId: 'water',
  densityValue: 1000,
  densityUnit: 'kgPerM3',
  volumeValue: 1000,
  volumeUnit: 'ml',
  massValue: null,
  massUnit: 'kg',
});
assert.equal(water.massKg, 1);
assert.equal(water.massValue, 1);

const liters = calculateMlToKg({
  source: 'volume',
  substanceId: 'water',
  densityValue: 1000,
  densityUnit: 'kgPerM3',
  volumeValue: 2,
  volumeUnit: 'l',
  massValue: null,
  massUnit: 'kg',
});
assert.equal(liters.volumeMl, 2000);
assert.equal(liters.massKg, 2);

const reverse = calculateMlToKg({
  source: 'mass',
  substanceId: 'custom',
  densityValue: 1250,
  densityUnit: 'kgPerM3',
  volumeValue: null,
  volumeUnit: 'ml',
  massValue: 2.5,
  massUnit: 'kg',
});
assertClose(reverse.volumeMl, 2000);

assert.match(shareResultText(water), /mL to kg Converter/);
assert.match(shareResultText(water), /Water/);

console.log('ml-to-kg calculation.test.ts: ok');
