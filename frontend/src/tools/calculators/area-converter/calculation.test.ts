import assert from 'node:assert/strict';
import {
  buildResult,
  convertArea,
  formatArea,
  fromSquareMeters,
  toSquareMeters,
} from './calculation';
import { AREA_UNIT_BY_ID, DEFAULT_FIELD_UNITS, DEFAULT_SQUARE_METERS } from './types';
import { areaValueState, parseOptionalNumber } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(AREA_UNIT_BY_ID.m2.toSquareMeters, 1);
assert.equal(AREA_UNIT_BY_ID.cm2.toSquareMeters, 0.0001);
assert.equal(AREA_UNIT_BY_ID.mm2.toSquareMeters, 0.000001);
assert.equal(AREA_UNIT_BY_ID.ft2.toSquareMeters, 0.09290304);
assert.equal(AREA_UNIT_BY_ID.yd2.toSquareMeters, 0.83612736);
assert.equal(AREA_UNIT_BY_ID.ac.toSquareMeters, 4046.8564224);
assert.equal(AREA_UNIT_BY_ID.ha.toSquareMeters, 10_000);
assert.equal(AREA_UNIT_BY_ID.a.toSquareMeters, 100);
assert.equal(AREA_UNIT_BY_ID.daa.toSquareMeters, 1_000);
assert.equal(AREA_UNIT_BY_ID.km2.toSquareMeters, 1_000_000);
assert.equal(AREA_UNIT_BY_ID.mi2.toSquareMeters, 2_589_988.110336);

assert.equal(toSquareMeters(1, 'm2'), 1);
assert.equal(fromSquareMeters(1, 'cm2'), 10_000);
assert.equal(fromSquareMeters(1, 'mm2'), 1_000_000);
assertClose(fromSquareMeters(1, 'ft2'), 10.76391041671);
assert.equal(toSquareMeters(1, 'ft2'), 0.09290304);
assert.equal(toSquareMeters(1, 'yd2'), 0.83612736);
assert.equal(toSquareMeters(1, 'ac'), 4046.8564224);
assertClose(fromSquareMeters(4046.8564224, 'ft2'), 43_560);
assertClose(fromSquareMeters(4046.8564224, 'yd2'), 4_840);
assert.equal(toSquareMeters(1, 'ha'), 10_000);
assertClose(fromSquareMeters(10_000, 'ac'), 2.471053814671653);
assert.equal(toSquareMeters(1, 'a'), 100);
assert.equal(toSquareMeters(1, 'daa'), 1_000);

assertClose(convertArea(10, 'm2', 'ft2'), 107.6391041671);
assertClose(convertArea(5, 'ac', 'ha'), 2.0234282112);
assertClose(convertArea(1, 'ha', 'ac'), 2.471053814671653);
assertClose(convertArea(50, 'm2', 'yd2'), 59.799502315);

{
  const result = buildResult(DEFAULT_SQUARE_METERS, [...DEFAULT_FIELD_UNITS]);
  assert.equal(result.values[0], 100);
  assertClose(result.values[1], 1076.391041671);
  assert.equal(result.values[2], 1_000_000);
  assertClose(result.values[3], 119.59900463);
  assert.equal(result.values[4], 1);
}

// Round-trip: m² → ft² → m² should not drift meaningfully.
{
  const ft = convertArea(100, 'm2', 'ft2');
  const back = convertArea(ft, 'ft2', 'm2');
  assertClose(back, 100, 1e-10);
}

assert.equal(formatArea(0), '0');
assert.equal(formatArea(10000), '10000');
assert.equal(parseOptionalNumber('1.'), null);
assert.equal(parseOptionalNumber('100'), 100);
assert.equal(areaValueState(-1), 'negative');
assert.equal(areaValueState(null), 'blank');
assert.equal(areaValueState(Number.NaN), 'bad');

console.log('area-converter calculation.test.ts: ok');
