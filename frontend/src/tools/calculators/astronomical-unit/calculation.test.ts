import assert from 'node:assert/strict';
import {
  buildResult,
  convertDistance,
  formatDistance,
  formatLightTravelTime,
  fromMeters,
  lightTravelSeconds,
  toMeters,
} from './calculation';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_METERS,
  JULIAN_YEAR_SECONDS,
  METERS_PER_AU,
  METERS_PER_LIGHT_DAY,
  METERS_PER_LIGHT_MINUTE,
  METERS_PER_LIGHT_SECOND,
  METERS_PER_LIGHT_YEAR,
  METERS_PER_PARSEC,
  SPEED_OF_LIGHT_MPS,
} from './types';
import { distanceValueState, parseOptionalNumber } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) / scale < eps || Math.abs(actual - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

assert.equal(SPEED_OF_LIGHT_MPS, 299_792_458);
assert.equal(JULIAN_YEAR_SECONDS, 31_557_600);
assert.equal(METERS_PER_AU, 149_597_870_700);
assert.equal(METERS_PER_LIGHT_YEAR, SPEED_OF_LIGHT_MPS * JULIAN_YEAR_SECONDS);
assert.equal(METERS_PER_LIGHT_SECOND, SPEED_OF_LIGHT_MPS);
assert.equal(METERS_PER_LIGHT_MINUTE, SPEED_OF_LIGHT_MPS * 60);
assert.equal(METERS_PER_LIGHT_DAY, SPEED_OF_LIGHT_MPS * 86_400);

assertClose(toMeters(1, 'au'), 149_597_870_700);
assertClose(fromMeters(METERS_PER_AU, 'km'), 149_597_870.7);
assertClose(convertDistance(2, 'au', 'km'), 299_195_741.4);
assertClose(convertDistance(5, 'au', 'km'), 747_989_353.5);
assertClose(convertDistance(10, 'au', 'km'), 1_495_978_707);
assert.equal(convertDistance(0, 'au', 'm'), 0);

assertClose(toMeters(1, 'ly'), 9_460_730_472_580_800);
assertClose(toMeters(1, 'mi'), 1609.344);
assertClose(toMeters(1, 'km'), 1000);
assertClose(toMeters(1, 'ls'), 299_792_458);
assertClose(toMeters(1, 'lm'), 17_987_547_480);

{
  const miles = convertDistance(1, 'au', 'mi');
  assertClose(miles, 92_955_807.273_295_18, 1e-9);
}

{
  const ly = convertDistance(1, 'au', 'ly');
  assertClose(ly, 0.000_015_812_507_409_57, 1e-9);
}

{
  const pc = convertDistance(1, 'au', 'pc');
  assertClose(pc, Math.PI / 648_000, 1e-12);
  assertClose(pc, 0.000_004_848_136_811_095, 1e-9);
}

{
  const auFromLy = convertDistance(1, 'ly', 'au');
  assertClose(auFromLy, 63_241.077_084_266_28, 1e-9);
}

{
  const auFromPc = convertDistance(1, 'pc', 'au');
  assertClose(auFromPc, 648_000 / Math.PI, 1e-9);
  assertClose(auFromPc, 206_264.806_247_096_36, 1e-9);
  assertClose(METERS_PER_PARSEC / METERS_PER_AU, auFromPc, 1e-12);
}

{
  const result = buildResult(DEFAULT_METERS, [...DEFAULT_FIELD_UNITS]);
  assertClose(result.values[0], 1);
  assertClose(result.values[1], 149_597_870_700);
  assertClose(result.values[2], 149_597_870.7);
  assertClose(result.values[3], 0.000_015_812_507_409_57, 1e-9);
  assertClose(result.values[4], Math.PI / 648_000, 1e-12);
  assertClose(result.values[5], 92_955_807.273_295_18, 1e-9);
  assertClose(result.lightTravelSeconds, 149_597_870_700 / 299_792_458, 1e-12);
}

assertClose(lightTravelSeconds(METERS_PER_AU), 499.004_783_836_156_43, 1e-9);
assert.match(formatLightTravelTime(lightTravelSeconds(METERS_PER_AU)), /8 min/);

{
  const back = convertDistance(convertDistance(1, 'au', 'km'), 'km', 'au');
  assertClose(back, 1, 1e-12);
}

assert.equal(formatDistance(0), '0');
assert.equal(parseOptionalNumber('1.'), null);
assert.equal(parseOptionalNumber('1e'), null);
assert.equal(parseOptionalNumber('1e6'), 1e6);
assert.equal(distanceValueState(-1), 'negative');
assert.equal(distanceValueState(1), 'ok');

console.log('astronomical-unit calculation.test.ts: ok');
