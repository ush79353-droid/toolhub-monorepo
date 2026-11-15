import assert from 'node:assert/strict';
import {
  calculateQuartsToPounds,
  densityToGPerMl,
  gramsToMass,
  massToGrams,
  mlToVolume,
  volumeToMl,
} from './calculation';
import {
  DEFAULT_QUARTS_TO_POUNDS_INPUT,
  GRAMS_PER_OUNCE,
  GRAMS_PER_POUND,
  ML_PER_IMPERIAL_QUART,
  ML_PER_US_CUP,
  ML_PER_US_DRY_QUART,
  ML_PER_US_LIQUID_QUART,
  ML_PER_US_PINT,
} from './types';
import { validateQuartsToPounds } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

{
  assertClose(ML_PER_US_LIQUID_QUART, 0.946352946 * 1000);
  assertClose(ML_PER_IMPERIAL_QUART, 1.1365225 * 1000);
  assertClose(ML_PER_US_DRY_QUART, 1.101220942715 * 1000);
  assertClose(volumeToMl(1, 'usLiquidQt'), ML_PER_US_LIQUID_QUART);
  assertClose(volumeToMl(1, 'usLiquidQt'), volumeToMl(2, 'usPint'));
  assertClose(volumeToMl(1, 'usLiquidQt'), volumeToMl(4, 'usCup'));
  assertClose(ML_PER_US_LIQUID_QUART / ML_PER_US_PINT, 2);
  assertClose(ML_PER_US_LIQUID_QUART / ML_PER_US_CUP, 4);
  assertClose(GRAMS_PER_POUND, 453.59237);
  assertClose(GRAMS_PER_OUNCE * 16, GRAMS_PER_POUND);
}

{
  assertClose(densityToGPerMl(1, 'kgPerL'), 1);
  assertClose(densityToGPerMl(1, 'gPerMl'), 1);
  assertClose(densityToGPerMl(1, 'gPerCm3'), 1);
  assertClose(densityToGPerMl(1000, 'kgPerM3'), 1);
}

{
  const one = calculateQuartsToPounds(DEFAULT_QUARTS_TO_POUNDS_INPUT);
  assertClose(one.volumeMl, ML_PER_US_LIQUID_QUART);
  assertClose(one.massG, ML_PER_US_LIQUID_QUART);
  assertClose(one.mass, ML_PER_US_LIQUID_QUART / GRAMS_PER_POUND, 1e-10);

  const two = calculateQuartsToPounds({
    ...DEFAULT_QUARTS_TO_POUNDS_INPUT,
    volume: 2,
  });
  assertClose(two.mass, (2 * ML_PER_US_LIQUID_QUART) / GRAMS_PER_POUND, 1e-10);

  const four = calculateQuartsToPounds({
    ...DEFAULT_QUARTS_TO_POUNDS_INPUT,
    volume: 4,
  });
  assertClose(four.mass, (4 * ML_PER_US_LIQUID_QUART) / GRAMS_PER_POUND, 1e-10);
  assertClose(four.mass, 8.34540445201933, 1e-10);

  const zero = calculateQuartsToPounds({
    ...DEFAULT_QUARTS_TO_POUNDS_INPUT,
    volume: 0,
  });
  assertClose(zero.mass, 0);
}

{
  const custom = calculateQuartsToPounds({
    ...DEFAULT_QUARTS_TO_POUNDS_INPUT,
    volume: 3,
    densityValue: 0.8,
    densityUnit: 'kgPerL',
    ingredientId: 'custom',
  });
  assertClose(custom.massG, 3 * ML_PER_US_LIQUID_QUART * 0.8);
  assertClose(custom.massG / 1000, 2.2712470704, 1e-12);
  assertClose(custom.mass, (3 * ML_PER_US_LIQUID_QUART * 0.8) / GRAMS_PER_POUND, 1e-10);
}

{
  const reverse = calculateQuartsToPounds({
    source: 'mass',
    ingredientId: 'water',
    quartStandard: 'usLiquid',
    densityValue: 1,
    densityUnit: 'kgPerL',
    volume: null,
    volumeUnit: 'usLiquidQt',
    mass: 5,
    massUnit: 'lb',
  });
  assertClose(reverse.massG, 5 * GRAMS_PER_POUND);
  assertClose(reverse.volumeMl, 5 * GRAMS_PER_POUND);
  assertClose(reverse.volume, (5 * GRAMS_PER_POUND) / ML_PER_US_LIQUID_QUART, 1e-10);
  assertClose(reverse.volume, 2.396528546337933, 1e-9);
}

{
  assertClose(mlToVolume(ML_PER_US_LIQUID_QUART, 'usLiquidQt'), 1);
  assertClose(massToGrams(1, 'lb'), GRAMS_PER_POUND);
  assertClose(gramsToMass(GRAMS_PER_POUND, 'lb'), 1);
}

{
  const bad = validateQuartsToPounds({
    ...DEFAULT_QUARTS_TO_POUNDS_INPUT,
    densityValue: 0,
  });
  assert.equal(bad.isValid, false);
  const ok = validateQuartsToPounds(DEFAULT_QUARTS_TO_POUNDS_INPUT);
  assert.equal(ok.isValid, true);
}

console.log('quarts-to-pounds calculation.test.ts: ok');
