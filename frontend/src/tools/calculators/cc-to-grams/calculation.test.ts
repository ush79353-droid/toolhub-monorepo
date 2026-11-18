import assert from 'node:assert/strict';
import {
  calculateCcToGrams,
  densityToGPerCm3,
  fromCc,
  massToVolume,
  shareResultText,
  toCc,
  volumeToMass,
} from './calculation';
import { WATER_DENSITY_G_PER_CM3 } from './types';
import { parseOptionalNumber, validateCcToGrams } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(volumeToMass(100, 1), 100);
assert.equal(volumeToMass(250, 1), 250);
assert.equal(massToVolume(500, 1), 500);
assert.equal(volumeToMass(100, 1.42), 142);
assert.equal(massToVolume(142, 1.42), 100);
assert.equal(volumeToMass(200, 1.03), 206);
assert.equal(volumeToMass(100, 0.91), 91);

assert.equal(toCc(1, 'mL'), 1);
assert.equal(toCc(1, 'L'), 1000);
assert.equal(fromCc(1000, 'L'), 1);
assert.equal(densityToGPerCm3(1000, 'kgPerM3'), 1);
assert.equal(densityToGPerCm3(1, 'gPerMl'), 1);

assert.throws(() => volumeToMass(100, 0));
assert.throws(() => massToVolume(100, -1));

{
  const result = calculateCcToGrams({
    source: 'volume',
    substanceId: 'water',
    densityValue: WATER_DENSITY_G_PER_CM3,
    densityUnit: 'gPerCm3',
    volumeCc: 100,
    massG: null,
    volumeUnit: 'cc',
    massUnit: 'g',
  });
  assert.equal(result.massG, 100);
  assert.match(shareResultText(result), /CC to Grams/);
}

{
  const result = calculateCcToGrams({
    source: 'mass',
    substanceId: 'honey',
    densityValue: 1.42,
    densityUnit: 'gPerCm3',
    volumeCc: null,
    massG: 142,
    volumeUnit: 'cc',
    massUnit: 'g',
  });
  assertClose(result.volumeCc, 100, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateCcToGrams({
    source: 'volume',
    substanceId: 'custom',
    densityValue: 0,
    densityUnit: 'gPerCm3',
    volumeCc: 100,
    massG: null,
    volumeUnit: 'cc',
    massUnit: 'g',
  }).isValid,
);

console.log('cc-to-grams calculation.test.ts: ok');
