import assert from 'node:assert/strict';
import {
  buildResult,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from './calculation';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_METERS,
  LENGTH_UNIT_BY_ID,
  METERS_PER_AU,
  METERS_PER_LIGHT_YEAR,
  SPEED_OF_LIGHT_MPS,
} from './types';
import { lengthValueState, parseOptionalNumber } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(LENGTH_UNIT_BY_ID.m.factorToMeters, 1);
assert.equal(LENGTH_UNIT_BY_ID.cm.factorToMeters, 0.01);
assert.equal(LENGTH_UNIT_BY_ID.mm.factorToMeters, 0.001);
assert.equal(LENGTH_UNIT_BY_ID.km.factorToMeters, 1000);
assert.equal(LENGTH_UNIT_BY_ID.in.factorToMeters, 0.0254);
assert.equal(LENGTH_UNIT_BY_ID.ft.factorToMeters, 0.3048);
assert.equal(LENGTH_UNIT_BY_ID.yd.factorToMeters, 0.9144);
assert.equal(LENGTH_UNIT_BY_ID.mi.factorToMeters, 1609.344);
assert.equal(LENGTH_UNIT_BY_ID.nmi.factorToMeters, 1852);
assert.equal(LENGTH_UNIT_BY_ID.au.factorToMeters, METERS_PER_AU);
assert.equal(LENGTH_UNIT_BY_ID.ly.factorToMeters, METERS_PER_LIGHT_YEAR);
assert.equal(SPEED_OF_LIGHT_MPS, 299_792_458);

assert.equal(fromMeters(1, 'cm'), 100);
assert.equal(fromMeters(1, 'mm'), 1000);
assert.equal(toMeters(1, 'km'), 1000);
assert.equal(toMeters(1, 'in'), 0.0254);
assertClose(fromMeters(0.3048, 'in'), 12);
assertClose(fromMeters(0.9144, 'ft'), 3);
assertClose(fromMeters(1609.344, 'ft'), 5280);
assert.equal(toMeters(1, 'mi'), 1609.344);
assert.equal(toMeters(1, 'nmi'), 1852);
assert.equal(toMeters(1, 'au'), 149_597_870_700);

assertClose(convertLength(10, 'm', 'ft'), 32.80839895013123);
assertClose(convertLength(5, 'km', 'mi'), 3.1068559611866697);
assertClose(convertLength(12, 'in', 'cm'), 30.48);
assertClose(convertLength(1, 'mi', 'km'), 1.609344);

{
  const result = buildResult(DEFAULT_METERS, [...DEFAULT_FIELD_UNITS]);
  assert.equal(result.values[0], 100);
  assert.equal(result.values[1], 0.1);
  assert.equal(result.values[2], 10_000);
  assertClose(result.values[3], 328.0839895013123);
  assertClose(result.values[4], 3937.007874015748);
  assertClose(result.values[5], 0.06213711922373339);
  assert.ok(result.otherUnits.some((row) => row.id === 'yd'));
  assert.ok(result.otherUnits.some((row) => row.id === 'ly'));
}

{
  const ft = convertLength(100, 'm', 'ft');
  const back = convertLength(ft, 'ft', 'm');
  assertClose(back, 100, 1e-10);
}

assert.equal(formatLength(0), '0');
assert.equal(parseOptionalNumber('1.'), null);
assert.equal(parseOptionalNumber('1e'), null);
assert.equal(parseOptionalNumber('-5'), -5);
assert.equal(lengthValueState(-1), 'ok');
assert.equal(lengthValueState(null), 'blank');
assert.equal(lengthValueState(Number.NaN), 'bad');

console.log('length-converter calculation.test.ts: ok');
