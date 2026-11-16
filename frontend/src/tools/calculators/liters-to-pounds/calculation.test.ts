import assert from 'node:assert/strict';
import {
  calculateLitersToPounds,
  densityToKgPerL,
  kgPerLToDensity,
  litersToPounds,
  poundsToLiters,
  shareResultText,
} from './calculation';
import { KG_PER_POUND, WATER_DENSITY_KG_PER_L } from './types';
import { parseOptionalNumber, validateLitersToPounds } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KG_PER_POUND, 0.45359237);
close(litersToPounds(1, 1), 2.20462262185, 9);
close(litersToPounds(5, 1), 11.0231131092, 8);
close(litersToPounds(10, 1), 22.0462262185, 8);
close(poundsToLiters(10, 1), 4.5359237, 8);
assert.equal(litersToPounds(0, 1), 0);

close(litersToPounds(5, 1.03), 5.15 / KG_PER_POUND, 8);
close(litersToPounds(5, 0.92), 4.6 / KG_PER_POUND, 8);

assert.equal(densityToKgPerL(1000, 'kgPerM3'), 1);
assert.equal(densityToKgPerL(1, 'kgPerL'), 1);
assert.equal(kgPerLToDensity(1, 'kgPerM3'), 1000);
close(densityToKgPerL(1, 'lbPerL'), KG_PER_POUND);

{
  const result = calculateLitersToPounds({
    source: 'liters',
    category: 'food',
    substanceId: 'water',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    liters: 5,
    pounds: null,
  });
  close(result.pounds, 11.0231131092, 8);
  assert.equal(result.densityKgPerL, WATER_DENSITY_KG_PER_L);
  assert.match(shareResultText(result), /Water/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateLitersToPounds({
    source: 'liters',
    category: 'food',
    substanceId: 'water',
    densityValue: 0,
    densityUnit: 'kgPerL',
    liters: 1,
    pounds: null,
  }).isValid,
);

console.log('liters-to-pounds calculation.test.ts: ok');
