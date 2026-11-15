import assert from 'node:assert/strict';
import {
  calculateGallonsToPounds,
  densityToGPerMl,
  gramsToMass,
  massToGrams,
  mlToVolume,
  volumeToMl,
} from './calculation';
import {
  DEFAULT_GALLONS_TO_POUNDS_INPUT,
  GRAMS_PER_OUNCE,
  GRAMS_PER_POUND,
  ML_PER_IMPERIAL_GALLON,
  ML_PER_US_DRY_GALLON,
  ML_PER_US_LIQUID_GALLON,
  ML_PER_US_QUART,
} from './types';
import { validateGallonsToPounds } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

{
  assertClose(ML_PER_US_LIQUID_GALLON, 3.785411784 * 1000);
  assertClose(ML_PER_IMPERIAL_GALLON, 4.54609 * 1000);
  assertClose(ML_PER_US_DRY_GALLON, 4.40488377086 * 1000);
  assertClose(volumeToMl(1, 'usLiquidGal'), ML_PER_US_LIQUID_GALLON);
  assertClose(volumeToMl(1, 'usLiquidGal'), volumeToMl(4, 'usQuart'));
  assertClose(ML_PER_US_LIQUID_GALLON / ML_PER_US_QUART, 4);
  assertClose(GRAMS_PER_POUND, 453.59237);
  assertClose(GRAMS_PER_OUNCE * 16, GRAMS_PER_POUND);
}

{
  assertClose(densityToGPerMl(1, 'kgPerL'), 1);
  assertClose(densityToGPerMl(1, 'gPerMl'), 1);
  assertClose(densityToGPerMl(1, 'gPerCm3'), 1);
  assertClose(densityToGPerMl(1000, 'kgPerM3'), 1);
  assertClose(
    densityToGPerMl(1, 'lbPerUsLiquidGal'),
    GRAMS_PER_POUND / ML_PER_US_LIQUID_GALLON
  );
  assertClose(
    densityToGPerMl(1, 'lbPerImperialGal'),
    GRAMS_PER_POUND / ML_PER_IMPERIAL_GALLON
  );
}

{
  const one = calculateGallonsToPounds(DEFAULT_GALLONS_TO_POUNDS_INPUT);
  assertClose(one.volumeMl, ML_PER_US_LIQUID_GALLON);
  assertClose(one.massG, ML_PER_US_LIQUID_GALLON);
  assertClose(one.mass, ML_PER_US_LIQUID_GALLON / GRAMS_PER_POUND, 1e-10);
  assertClose(one.mass, 8.34540445201933, 1e-10);

  const two = calculateGallonsToPounds({
    ...DEFAULT_GALLONS_TO_POUNDS_INPUT,
    volume: 2,
  });
  assertClose(two.mass, (2 * ML_PER_US_LIQUID_GALLON) / GRAMS_PER_POUND, 1e-10);

  const five = calculateGallonsToPounds({
    ...DEFAULT_GALLONS_TO_POUNDS_INPUT,
    volume: 5,
  });
  assertClose(five.mass, (5 * ML_PER_US_LIQUID_GALLON) / GRAMS_PER_POUND, 1e-10);

  const ten = calculateGallonsToPounds({
    ...DEFAULT_GALLONS_TO_POUNDS_INPUT,
    volume: 10,
  });
  assertClose(ten.mass, (10 * ML_PER_US_LIQUID_GALLON) / GRAMS_PER_POUND, 1e-10);

  const zero = calculateGallonsToPounds({
    ...DEFAULT_GALLONS_TO_POUNDS_INPUT,
    volume: 0,
  });
  assertClose(zero.mass, 0);
}

{
  const custom = calculateGallonsToPounds({
    ...DEFAULT_GALLONS_TO_POUNDS_INPUT,
    volume: 5,
    densityValue: 0.8,
    densityUnit: 'kgPerL',
    liquidId: 'custom',
  });
  assertClose(custom.massG, 5 * ML_PER_US_LIQUID_GALLON * 0.8);
  assertClose(custom.massG / 1000, 15.141647136, 1e-12);
  assertClose(
    custom.mass,
    (5 * ML_PER_US_LIQUID_GALLON * 0.8) / GRAMS_PER_POUND,
    1e-10
  );
}

{
  const reverse = calculateGallonsToPounds({
    source: 'mass',
    liquidId: 'water',
    gallonStandard: 'usLiquid',
    densityValue: 1,
    densityUnit: 'kgPerL',
    volume: null,
    volumeUnit: 'usLiquidGal',
    mass: 10,
    massUnit: 'lb',
  });
  assertClose(reverse.massG, 10 * GRAMS_PER_POUND);
  assertClose(reverse.volumeMl, 10 * GRAMS_PER_POUND);
  assertClose(reverse.volume, (10 * GRAMS_PER_POUND) / ML_PER_US_LIQUID_GALLON, 1e-10);
  assertClose(reverse.volume, 1.1982642731689666, 1e-9);
}

{
  assertClose(mlToVolume(ML_PER_US_LIQUID_GALLON, 'usLiquidGal'), 1);
  assertClose(massToGrams(1, 'lb'), GRAMS_PER_POUND);
  assertClose(gramsToMass(GRAMS_PER_POUND, 'lb'), 1);
}

{
  const bad = validateGallonsToPounds({
    ...DEFAULT_GALLONS_TO_POUNDS_INPUT,
    densityValue: 0,
  });
  assert.equal(bad.isValid, false);
  const ok = validateGallonsToPounds(DEFAULT_GALLONS_TO_POUNDS_INPUT);
  assert.equal(ok.isValid, true);
}

console.log('gallons-to-pounds calculation.test.ts: ok');
