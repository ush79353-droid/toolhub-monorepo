import assert from 'node:assert/strict';
import {
  calculateMlToLbs,
  lbsToMl,
  mlToLbs,
  shareResultText,
} from './calculation';
import { findSubstance } from './substances';
import { KG_PER_POUND, WATER_DENSITY_KG_PER_M3 } from './types';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(findSubstance('water')?.densityKgPerM3, 1000);
assert.equal(KG_PER_POUND, 0.45359237);

assertClose(mlToLbs(1000, WATER_DENSITY_KG_PER_M3), 2.20462262185);
assertClose(mlToLbs(500, WATER_DENSITY_KG_PER_M3), 1.102311310925);
assertClose(mlToLbs(250, WATER_DENSITY_KG_PER_M3), 0.551155655463);

assertClose(lbsToMl(1, WATER_DENSITY_KG_PER_M3), 453.59237);
assertClose(lbsToMl(2, WATER_DENSITY_KG_PER_M3), 907.18474);

assertClose(mlToLbs(2000, 850), 3.747859, 5);
assertClose(mlToLbs(1000, 910), 2.006206, 5);

const water = calculateMlToLbs({
  source: 'volume',
  substanceId: 'water',
  densityValue: 1000,
  densityUnit: 'kgPerM3',
  volumeValue: 1000,
  volumeUnit: 'ml',
  massValue: null,
  massUnit: 'lb',
});
assertClose(water.massKg, 1);
assertClose(water.massValue, 2.20462262185);

const reverse = calculateMlToLbs({
  source: 'mass',
  substanceId: 'water',
  densityValue: 1000,
  densityUnit: 'kgPerM3',
  volumeValue: null,
  volumeUnit: 'ml',
  massValue: 1,
  massUnit: 'lb',
});
assertClose(reverse.volumeMl, 453.59237);

assert.match(shareResultText(water), /mL to lbs Conversion/);
assert.match(shareResultText(water), /Water/);

assert.throws(() => lbsToMl(1, 0));
assert.throws(() => lbsToMl(1, -1));

console.log('ml-to-lbs calculation.test.ts: ok');
