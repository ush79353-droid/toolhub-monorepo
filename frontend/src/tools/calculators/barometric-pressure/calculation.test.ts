import assert from 'node:assert/strict';
import {
  buildResult,
  convertPressure,
  convertPressureByFactor,
  formatPressure,
  fromPascals,
  shareResultText,
  toPascals,
} from './calculation';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_PASCALS,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
  PRESSURE_TO_PASCALS,
} from './types';
import { pressureValueState } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(PRESSURE_TO_PASCALS.atm, 101_325);
assert.equal(PRESSURE_TO_PASCALS.bar, 100_000);
assert.equal(PRESSURE_TO_PASCALS.hPa, 100);
assert.equal(PRESSURE_TO_PASCALS.mbar, 100);
assertClose(PRESSURE_TO_PASCALS.psi, 6894.757293168);
assert.equal(PASCALS_PER_ATM, 101_325);
assert.equal(PASCALS_PER_BAR, 100_000);
assertClose(PASCALS_PER_TORR, 101_325 / 760);
assert.equal(PASCALS_PER_MMHG, 133.322387415);
assert.ok(Math.abs(PASCALS_PER_MMHG - PASCALS_PER_TORR) > 1e-9);

assert.equal(convertPressureByFactor(1, 101_325, 1), 101_325);
assert.equal(convertPressureByFactor(1, 100_000, 1), 100_000);
assertClose(convertPressureByFactor(1, 101_325, 100_000), 1.01325, 1e-12);
assertClose(convertPressureByFactor(1, 101_325, 6894.757293168), 14.69595, 1e-4);
assert.equal(convertPressureByFactor(1, 100, 100), 1);
assert.equal(convertPressureByFactor(0, 101_325, 1), 0);

assert.equal(toPascals(1, 'atm'), 101_325);
assert.equal(convertPressure(1, 'atm', 'bar'), 1.01325);
assert.equal(convertPressure(1, 'atm', 'hPa'), 1013.25);
assert.equal(convertPressure(1, 'atm', 'mbar'), 1013.25);
assert.equal(toPascals(1, 'bar'), 100_000);
assertClose(convertPressure(1, 'bar', 'atm'), 100_000 / 101_325);
assertClose(convertPressure(1, 'atm', 'psi'), 101_325 / PASCALS_PER_PSI);
assert.equal(toPascals(760, 'Torr'), 101_325);
assert.equal(convertPressure(1, 'hPa', 'mbar'), 1);

{
  const r = buildResult(DEFAULT_PASCALS, [...DEFAULT_FIELD_UNITS], 0);
  assert.equal(r.values[0], 1);
  assert.equal(r.values[1], 1.01325);
  assert.equal(r.values[2], 101_325);
  assertClose(r.values[3], 101_325 / PASCALS_PER_PSI);
  assertClose(r.otherUnits.find((u) => u.id === 'hPa')!.value, 1013.25);
  assert.match(shareResultText(r), /Barometric Pressure Conversion/);
}

{
  const r = buildResult(toPascals(2, 'bar'), [...DEFAULT_FIELD_UNITS], 1);
  assert.equal(r.pascals, 200_000);
  assertClose(r.values[0], 200_000 / 101_325);
  assert.equal(r.values[1], 2);
}

assert.equal(fromPascals(50_000, 'bar'), 0.5);
assert.equal(pressureValueState(null), 'blank');
assert.equal(pressureValueState(0), 'ok');
assert.equal(pressureValueState(-1), 'ok');
assert.equal(formatPressure(0), '0');

console.log('barometric-pressure calculation.test.ts: ok');
