import assert from 'node:assert/strict';
import {
  buildResult,
  convertVolume,
  fromLiters,
  toLiters,
} from './calculation';
import {
  DEFAULT_FIELD_UNITS,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_BUSHEL,
  LITERS_PER_US_DRY_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from './types';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

{
  assertClose(toLiters(1000, 'mL'), 1);
  assertClose(toLiters(100, 'cL'), 1);
  assertClose(toLiters(10, 'dL'), 1);
  assertClose(toLiters(1, 'm3'), 1000);
  assertClose(toLiters(1, 'cm3'), 0.001);
  assertClose(toLiters(0, 'L'), 0);
  assertClose(toLiters(1, 'kL'), 1000);
  assertClose(toLiters(1, 'mm3'), 1e-6);
  assertClose(toLiters(1, 'dm3'), 1);
}

{
  assertClose(toLiters(1, 'usLiquidGal'), LITERS_PER_US_LIQUID_GALLON);
  assertClose(toLiters(1, 'usQt') * 4, LITERS_PER_US_LIQUID_GALLON);
  assertClose(toLiters(1, 'usPt') * 8, LITERS_PER_US_LIQUID_GALLON);
  assertClose(toLiters(1, 'usCup') * 16, LITERS_PER_US_LIQUID_GALLON, 1e-9);
  assertClose(toLiters(1, 'usFlOz') * 128, LITERS_PER_US_LIQUID_GALLON);
  assertClose(toLiters(1, 'usTbsp') * 2, toLiters(1, 'usFlOz'), 1e-12);
  assertClose(toLiters(1, 'usTsp') * 3, toLiters(1, 'usTbsp'), 1e-12);
  assertClose(toLiters(1, 'usCup'), toLiters(8, 'usFlOz'), 1e-12);
}

{
  assertClose(toLiters(1, 'imperialGal'), LITERS_PER_IMPERIAL_GALLON);
  assertClose(toLiters(1, 'impQt') * 4, LITERS_PER_IMPERIAL_GALLON);
  assertClose(toLiters(1, 'impPt') * 8, LITERS_PER_IMPERIAL_GALLON);
  assertClose(toLiters(1, 'impFlOz') * 160, LITERS_PER_IMPERIAL_GALLON, 1e-12);
}

{
  assertClose(toLiters(1, 'usCup'), 0.2365882365);
  assertClose(toLiters(1, 'usLegalCup'), 0.24);
  assertClose(toLiters(1, 'metricCup'), 0.25);
  assertClose(toLiters(1, 'imperialCup'), 0.284130625);
  assertClose(toLiters(1, 'metricTsp'), 0.005);
  assertClose(toLiters(1, 'metricTbsp'), 0.015);
  assertClose(toLiters(1, 'auTbsp'), 0.02);
}

{
  assertClose(toLiters(1, 'in3'), 0.016387064);
  assertClose(toLiters(1, 'ft3'), 28.316846592);
  assertClose(toLiters(1, 'yd3'), 764.554857984);
  assertClose(toLiters(1, 'ft3'), toLiters(1728, 'in3'), 1e-12);
  assertClose(toLiters(1, 'yd3'), toLiters(27, 'ft3'), 1e-12);
  assertClose(LITERS_PER_US_DRY_GALLON, 4.40488377086);
  assertClose(toLiters(1, 'usDryGal'), LITERS_PER_US_DRY_GALLON);
  assertClose(toLiters(1, 'usBushel'), LITERS_PER_US_BUSHEL);
}

{
  const r = buildResult(LITERS_PER_US_LIQUID_GALLON, [...DEFAULT_FIELD_UNITS]);
  assertClose(r.values[0], 3785.411784); // mL
  assertClose(r.values[1], LITERS_PER_US_LIQUID_GALLON); // L
  assertClose(r.values[2], 1); // US gal
  assertClose(r.values[3], 4); // qt
  assertClose(r.values[4], 8); // pt
  assertClose(r.values[5], 16, 1e-9); // cups
  assertClose(r.values[6], 128); // fl oz
  assertClose(r.values[7], 256); // tbsp
  assertClose(r.values[8], 768); // tsp
}

{
  assertClose(fromLiters(10, 'usLiquidGal'), 10 / LITERS_PER_US_LIQUID_GALLON);
  assertClose(convertVolume(5, 'usLiquidGal', 'L'), 5 * LITERS_PER_US_LIQUID_GALLON);
  assertClose(convertVolume(2, 'usCup', 'usFlOz'), 16, 1e-9);
  assertClose(convertVolume(2, 'ft3', 'L'), 56.633693184);
  // Unit switch preserves liters
  const liters = toLiters(1, 'usLiquidGal');
  const imp = fromLiters(liters, 'imperialGal');
  assertClose(toLiters(imp, 'imperialGal'), liters);
}

console.log('volume-conversion calculation.test.ts: ok');
