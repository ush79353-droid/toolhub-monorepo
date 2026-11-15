import assert from 'node:assert/strict';
import {
  buildResult,
  convertDistance,
  formatDistance,
  fromMeters,
  toMeters,
} from './calculation';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_METERS,
  JULIAN_YEAR_SECONDS,
  LIGHT_YEAR_UNIT_BY_ID,
  METERS_PER_AU,
  METERS_PER_LIGHT_YEAR,
  METERS_PER_PARSEC,
  SPEED_OF_LIGHT_MPS,
} from './types';
import { distanceValueState, parseOptionalNumber } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-6): void {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) / scale < eps || Math.abs(actual - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

assert.equal(SPEED_OF_LIGHT_MPS, 299_792_458);
assert.equal(JULIAN_YEAR_SECONDS, 31_557_600);
assert.equal(METERS_PER_LIGHT_YEAR, SPEED_OF_LIGHT_MPS * JULIAN_YEAR_SECONDS);
assert.equal(METERS_PER_AU, 149_597_870_700);
assert.equal(LIGHT_YEAR_UNIT_BY_ID.km.factorToMeters, 1000);
assert.equal(LIGHT_YEAR_UNIT_BY_ID.mi.factorToMeters, 1609.344);
assert.equal(LIGHT_YEAR_UNIT_BY_ID.m.factorToMeters, 1);

assertClose(toMeters(1, 'ly'), 9_460_730_472_580_800);
assertClose(fromMeters(METERS_PER_LIGHT_YEAR, 'km'), 9_460_730_472_580.8);
assertClose(toMeters(1, 'au'), 149_597_870_700);
assertClose(toMeters(1, 'mi'), 1609.344);
assertClose(toMeters(1, 'km'), 1000);

assertClose(convertDistance(1, 'ly', 'km'), 9_460_730_472_580.8);
assertClose(convertDistance(2, 'ly', 'km'), 18_921_460_945_161.6);
assertClose(convertDistance(0.5, 'ly', 'km'), 4_730_365_236_290.4);
assert.equal(convertDistance(0, 'ly', 'km'), 0);

{
  const miles = convertDistance(1, 'ly', 'mi');
  assertClose(miles, 5.878_625_373_183_608e12, 1e-9);
}

{
  const au = convertDistance(1, 'ly', 'au');
  assertClose(au, 63_241.077_084_266_28, 1e-9);
}

{
  const lyFromPc = convertDistance(1, 'pc', 'ly');
  assertClose(lyFromPc, 3.261_563_777_167_433_5, 1e-6);
  assertClose(METERS_PER_PARSEC / METERS_PER_LIGHT_YEAR, lyFromPc, 1e-9);
}

{
  const result = buildResult(DEFAULT_METERS, [...DEFAULT_FIELD_UNITS]);
  assertClose(result.values[0], 1);
  assertClose(result.values[1], 9_460_730_472_580.8);
  assertClose(result.values[2], 5.878_625_373_183_608e12, 1e-9);
  assertClose(result.values[3], 63_241.077_084_266_28, 1e-9);
}

{
  const km = convertDistance(1, 'ly', 'km');
  const back = convertDistance(km, 'km', 'ly');
  assertClose(back, 1, 1e-12);
}

assert.equal(formatDistance(0), '0');
assert.equal(parseOptionalNumber('1.'), null);
assert.equal(parseOptionalNumber('1e'), null);
assert.equal(parseOptionalNumber('1e10'), 1e10);
assert.equal(distanceValueState(-1), 'negative');
assert.equal(distanceValueState(null), 'blank');
assert.equal(distanceValueState(Number.NaN), 'bad');
assert.equal(distanceValueState(1), 'ok');

console.log('light-year-conversion calculation.test.ts: ok');
