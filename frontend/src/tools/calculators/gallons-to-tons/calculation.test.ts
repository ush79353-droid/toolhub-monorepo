import assert from 'node:assert/strict';
import {
  calculateGalToTons,
  densityToKgPerM3,
  kgPerM3ToDensity,
  massToVolume,
  shareResultText,
  volumeToMass,
} from './calculation';
import {
  CUBIC_METERS_PER_UK_GALLON,
  CUBIC_METERS_PER_US_GALLON,
  KG_PER_UK_LONG_TON,
  KG_PER_US_SHORT_TON,
} from './types';
import { parseOptionalNumber, validateGalToTons } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(volumeToMass(1, 'usGal', 1000, 'usTon'), CUBIC_METERS_PER_US_GALLON * 1000 / KG_PER_US_SHORT_TON, 10);
assertClose(volumeToMass(1000, 'usGal', 1000, 'usTon'), 1000 * CUBIC_METERS_PER_US_GALLON * 1000 / KG_PER_US_SHORT_TON, 10);
assertClose(volumeToMass(1, 'ukGal', 1000, 'ukTon'), CUBIC_METERS_PER_UK_GALLON * 1000 / KG_PER_UK_LONG_TON, 10);
assertClose(volumeToMass(1, 'usGal', 1000, 'metricTon'), CUBIC_METERS_PER_US_GALLON, 10);
assert.equal(volumeToMass(0, 'usGal', 1000, 'usTon'), 0);

{
  const mass = volumeToMass(250, 'usGal', 1000, 'usTon');
  assertClose(massToVolume(mass, 'usTon', 1000, 'usGal'), 250, 10);
}

assert.throws(() => volumeToMass(10, 'usGal', 0, 'usTon'));
assert.throws(() => volumeToMass(-10, 'usGal', 1000, 'usTon'));
assert.throws(() => massToVolume(-1, 'usTon', 1000, 'usGal'));

assertClose(densityToKgPerM3(1, 'gPerMl'), 1000, 10);
assertClose(kgPerM3ToDensity(1000, 'kgPerL'), 1, 10);

{
  const result = calculateGalToTons({
    source: 'volume',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: 1000,
    densityUnit: 'kgPerM3',
    volume: 1,
    volumeUnit: 'usGal',
    mass: null,
    massUnit: 'usTon',
  });
  assertClose(result.mass, CUBIC_METERS_PER_US_GALLON * 1000 / KG_PER_US_SHORT_TON, 10);
  assert.match(shareResultText(result), /Gallons to Tons/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateGalToTons({
    source: 'volume',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: 0,
    densityUnit: 'kgPerM3',
    volume: 1,
    volumeUnit: 'usGal',
    mass: null,
    massUnit: 'usTon',
  }).isValid,
);

console.log('gallons-to-tons calculation.test.ts: ok');
