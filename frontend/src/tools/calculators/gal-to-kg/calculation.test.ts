import assert from 'node:assert/strict';
import {
  calculateGalToKg,
  densityToKgPerL,
  fromKg,
  gallonsToKilograms,
  kilogramsToGallons,
  shareResultText,
  toKg,
} from './calculation';
import { LITERS_PER_UK_GALLON, LITERS_PER_US_GALLON } from './types';
import { parseOptionalNumber, validateGalToKg } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(gallonsToKilograms(1, 1, 'usGal'), LITERS_PER_US_GALLON, 10);
assertClose(gallonsToKilograms(5, 1, 'usGal'), 5 * LITERS_PER_US_GALLON, 10);
assertClose(gallonsToKilograms(1, 1, 'ukGal'), LITERS_PER_UK_GALLON, 10);
assertClose(gallonsToKilograms(1, 1.03, 'usGal'), LITERS_PER_US_GALLON * 1.03, 10);
assertClose(kilogramsToGallons(10, 1, 'usGal'), 10 / LITERS_PER_US_GALLON, 10);

{
  const kg = gallonsToKilograms(10, 1, 'usGal');
  assertClose(kilogramsToGallons(kg, 1, 'usGal'), 10, 10);
}

assert.throws(() => gallonsToKilograms(5, 0, 'usGal'));
assert.throws(() => gallonsToKilograms(-1, 1, 'usGal'));
assert.throws(() => kilogramsToGallons(-1, 1, 'usGal'));

assertClose(densityToKgPerL(1000, 'kgPerM3'), 1, 10);
assertClose(toKg(1000, 'g'), 1, 10);
assertClose(fromKg(1, 'metricTon'), 0.001, 10);

{
  const result = calculateGalToKg({
    source: 'gallons',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: 1,
    densityUnit: 'kgPerL',
    gallons: 1,
    gallonUnit: 'usGal',
    kg: null,
    otherMass: null,
    otherMassUnit: 'metricTon',
  });
  assertClose(result.kg, LITERS_PER_US_GALLON, 10);
  assert.match(shareResultText(result), /Gal to kg/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateGalToKg({
    source: 'gallons',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: 0,
    densityUnit: 'kgPerL',
    gallons: 1,
    gallonUnit: 'usGal',
    kg: null,
    otherMass: null,
    otherMassUnit: 'metricTon',
  }).isValid,
);

console.log('gal-to-kg calculation.test.ts: ok');
