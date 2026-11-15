import assert from 'node:assert/strict';
import {
  buildVolumeResult,
  calculateWaterWeight,
  fromLiters,
  toLiters,
} from './calculation';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_WATER_INPUT,
  KILOGRAMS_PER_POUND,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_DRY_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from './types';
import { validateWaterWeight } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

{
  assertClose(LITERS_PER_US_LIQUID_GALLON, 3.785411784);
  assertClose(LITERS_PER_IMPERIAL_GALLON, 4.54609);
  assertClose(LITERS_PER_US_DRY_GALLON, 4.40488377086);
  assertClose(toLiters(1, 'usLiquidGal'), 3.785411784);
  assertClose(toLiters(1, 'mL'), 0.001);
  assertClose(toLiters(1, 'usFlOz') * 128, LITERS_PER_US_LIQUID_GALLON);
  assertClose(toLiters(1, 'usQt') * 4, LITERS_PER_US_LIQUID_GALLON);
  assertClose(toLiters(1, 'usPt') * 8, LITERS_PER_US_LIQUID_GALLON);
  assertClose(toLiters(1, 'usCup') * 16, LITERS_PER_US_LIQUID_GALLON, 1e-9);
  assertClose(toLiters(1, 'in3') * 231, LITERS_PER_US_LIQUID_GALLON, 1e-12);
  assertClose(toLiters(1, 'ft3'), 28.316846592);
  assertClose(toLiters(1, 'yd3'), 764.554857984);
  assertClose(toLiters(1, 'impFlOz') * 160, LITERS_PER_IMPERIAL_GALLON, 1e-12);
}

{
  const r = buildVolumeResult(LITERS_PER_US_LIQUID_GALLON, [...DEFAULT_FIELD_UNITS]);
  assertClose(r.values[0], 1);
  assertClose(r.values[1], LITERS_PER_US_LIQUID_GALLON);
  assertClose(r.values[4], 4);
  assertClose(r.values[5], 8);
  assertClose(r.values[6], 128);
  assertClose(r.values[7], 16, 1e-9);
}

{
  assertClose(fromLiters(10, 'usLiquidGal'), 10 / LITERS_PER_US_LIQUID_GALLON);
  assertClose(toLiters(2, 'usLiquidGal'), 7.570823568);
  // ft³ to US gal
  assertClose(
    fromLiters(toLiters(1, 'ft3'), 'usLiquidGal'),
    28.316846592 / LITERS_PER_US_LIQUID_GALLON,
    1e-12
  );
}

{
  const w = calculateWaterWeight(DEFAULT_WATER_INPUT);
  assertClose(w.volumeLiters, LITERS_PER_US_LIQUID_GALLON);
  assertClose(w.massKg, LITERS_PER_US_LIQUID_GALLON);
  assertClose(w.massLb, LITERS_PER_US_LIQUID_GALLON / KILOGRAMS_PER_POUND, 1e-10);
  assert.equal(w.densityApproximate, true);

  const two = calculateWaterWeight({
    ...DEFAULT_WATER_INPUT,
    volume: 2,
  });
  assertClose(two.massKg, 2 * LITERS_PER_US_LIQUID_GALLON);

  const fromKg = calculateWaterWeight({
    source: 'massKg',
    volume: null,
    volumeUnit: 'usLiquidGal',
    densityKgPerL: 1,
    massKg: LITERS_PER_US_LIQUID_GALLON,
    massLb: null,
  });
  assertClose(fromKg.volume, 1);

  const fromLb = calculateWaterWeight({
    source: 'massLb',
    volume: null,
    volumeUnit: 'L',
    densityKgPerL: 1,
    massKg: null,
    massLb: 1,
  });
  assertClose(fromLb.massKg, KILOGRAMS_PER_POUND);
  assertClose(fromLb.volumeLiters, KILOGRAMS_PER_POUND);
}

{
  const bad = validateWaterWeight({ ...DEFAULT_WATER_INPUT, densityKgPerL: 0 });
  assert.equal(bad.isValid, false);
  const ok = validateWaterWeight(DEFAULT_WATER_INPUT);
  assert.equal(ok.isValid, true);
}

{
  // Unit switch preserves liters: 1 US gal → Imperial gal number
  const liters = toLiters(1, 'usLiquidGal');
  const impGal = fromLiters(liters, 'imperialGal');
  assertClose(impGal, LITERS_PER_US_LIQUID_GALLON / LITERS_PER_IMPERIAL_GALLON);
  assertClose(toLiters(impGal, 'imperialGal'), liters);
}

console.log('gallon calculation.test.ts: ok');
