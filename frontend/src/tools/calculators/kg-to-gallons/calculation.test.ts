import assert from 'node:assert/strict';
import {
  calculateKgToGallons,
  densityToKgPerL,
  kilogramsToMass,
  litersToVolume,
  massToKilograms,
  volumeToLiters,
} from './calculation';
import {
  DEFAULT_KG_TO_GALLONS_INPUT,
  KG_PER_OUNCE,
  KG_PER_POUND,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_DRY_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from './types';
import { validateKgToGallons } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

assertClose(LITERS_PER_US_LIQUID_GALLON, 3.785411784);
assertClose(LITERS_PER_IMPERIAL_GALLON, 4.54609);
assertClose(LITERS_PER_US_DRY_GALLON, 4.40488377086, 1e-11);
assertClose(volumeToLiters(1, 'usLiquidGal'), LITERS_PER_US_LIQUID_GALLON);
assertClose(KG_PER_POUND, 0.45359237);
assertClose(KG_PER_OUNCE * 16, KG_PER_POUND);
assert.equal(massToKilograms(1, 'kg'), 1);
assert.equal(massToKilograms(1000, 'g'), 1);
assert.equal(massToKilograms(1_000_000, 'mg'), 1);
assert.equal(massToKilograms(1, 'lb'), KG_PER_POUND);
assert.equal(massToKilograms(1, 'oz'), KG_PER_OUNCE);

assertClose(densityToKgPerL(1, 'kgPerL'), 1);
assertClose(densityToKgPerL(1, 'gPerMl'), 1);
assertClose(densityToKgPerL(1, 'gPerCm3'), 1);
assertClose(densityToKgPerL(1000, 'kgPerM3'), 1);

{
  const one = calculateKgToGallons(DEFAULT_KG_TO_GALLONS_INPUT);
  assertClose(one.massKg, 1);
  assertClose(one.volumeL, 1);
  assertClose(one.volume, 1 / LITERS_PER_US_LIQUID_GALLON);
  assertClose(one.volume, 0.2641720523581484, 1e-12);

  const five = calculateKgToGallons({ ...DEFAULT_KG_TO_GALLONS_INPUT, mass: 5 });
  assertClose(five.volumeL, 5);
  assertClose(five.volume, 5 / LITERS_PER_US_LIQUID_GALLON);

  const ten = calculateKgToGallons({ ...DEFAULT_KG_TO_GALLONS_INPUT, mass: 10 });
  assertClose(ten.volume, 10 / LITERS_PER_US_LIQUID_GALLON);

  const twenty = calculateKgToGallons({ ...DEFAULT_KG_TO_GALLONS_INPUT, mass: 20 });
  assertClose(twenty.volume, 20 / LITERS_PER_US_LIQUID_GALLON);

  const zero = calculateKgToGallons({ ...DEFAULT_KG_TO_GALLONS_INPUT, mass: 0 });
  assertClose(zero.volume, 0);
}

{
  const oneGal = calculateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    source: 'volume',
    volume: 1,
    mass: null,
  });
  assertClose(oneGal.massKg, LITERS_PER_US_LIQUID_GALLON);
  assertClose(oneGal.mass, LITERS_PER_US_LIQUID_GALLON);

  const two = calculateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    source: 'volume',
    volume: 2,
    mass: null,
  });
  assertClose(two.massKg, 2 * LITERS_PER_US_LIQUID_GALLON);

  const five = calculateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    source: 'volume',
    volume: 5,
    mass: null,
  });
  assertClose(five.massKg, 5 * LITERS_PER_US_LIQUID_GALLON);

  const ten = calculateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    source: 'volume',
    volume: 10,
    mass: null,
  });
  assertClose(ten.massKg, 10 * LITERS_PER_US_LIQUID_GALLON);
}

{
  const custom = calculateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    mass: 10,
    densityValue: 0.8,
    densityUnit: 'kgPerL',
    substanceId: 'custom',
    category: 'custom',
  });
  assertClose(custom.volumeL, 12.5);
  assertClose(custom.volume, 12.5 / LITERS_PER_US_LIQUID_GALLON);
}

{
  const reverse = calculateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    source: 'volume',
    volume: 2,
    mass: null,
    densityValue: 0.8,
    densityUnit: 'kgPerL',
    substanceId: 'custom',
    category: 'custom',
  });
  assertClose(reverse.massKg, 2 * LITERS_PER_US_LIQUID_GALLON * 0.8);
  assertClose(reverse.massKg, 6.0566588544, 1e-12);
}

{
  const kg = massToKilograms(1000, 'g');
  assertClose(litersToVolume(kg / 1, 'usLiquidGal'), 1 / LITERS_PER_US_LIQUID_GALLON);
  assertClose(kilogramsToMass(1, 'g'), 1000);
}

{
  const ok = validateKgToGallons(DEFAULT_KG_TO_GALLONS_INPUT);
  assert.equal(ok.isValid, true);
  const blank = validateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    mass: null,
  });
  assert.equal(blank.isValid, false);
  const noDensity = validateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    densityValue: null,
  });
  assert.equal(noDensity.isValid, false);
  const neg = validateKgToGallons({
    ...DEFAULT_KG_TO_GALLONS_INPUT,
    mass: -1,
  });
  assert.equal(neg.isValid, false);
}

console.log('kg-to-gallons calculation.test.ts: ok');
