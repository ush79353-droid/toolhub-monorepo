import assert from 'node:assert/strict';
import {
  buildResult,
  convertPressure,
  formatPressure,
  fromPascals,
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
} from './types';
import { pressureValueState } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

assert.equal(PASCALS_PER_BAR, 100_000);
assert.equal(PASCALS_PER_ATM, 101_325);
assertClose(PASCALS_PER_PSI, 6894.757293168361);
assertClose(PASCALS_PER_TORR, 101325 / 760);
assert.equal(PASCALS_PER_MMHG, 133.322387415);
assert.ok(Math.abs(PASCALS_PER_MMHG - PASCALS_PER_TORR) > 1e-9);

assert.equal(toPascals(1000, 'Pa'), 1000);
assert.equal(fromPascals(1000, 'kPa'), 1);
assert.equal(fromPascals(1_000_000, 'MPa'), 1);
assert.equal(fromPascals(100_000, 'bar'), 1);

assert.equal(toPascals(1, 'bar'), 100_000);
assert.equal(toPascals(2, 'bar'), 200_000);
assert.equal(toPascals(5, 'bar'), 500_000);
assert.equal(convertPressure(1, 'bar', 'kPa'), 100);

assert.equal(toPascals(1, 'atm'), 101_325);
assert.equal(convertPressure(1, 'atm', 'bar'), 1.01325);
assert.equal(toPascals(2, 'atm'), 202_650);

assertClose(toPascals(1, 'psi'), PASCALS_PER_PSI);
assertClose(toPascals(10, 'psi'), 10 * PASCALS_PER_PSI);
assertClose(convertPressure(1, 'bar', 'psi'), 100_000 / PASCALS_PER_PSI);
assertClose(convertPressure(1, 'atm', 'psi'), 101_325 / PASCALS_PER_PSI);

assert.equal(toPascals(760, 'Torr'), 101_325);
assert.equal(convertPressure(760, 'Torr', 'atm'), 1);

{
  const r = buildResult(DEFAULT_PASCALS, [...DEFAULT_FIELD_UNITS]);
  assert.equal(r.values[0], 1);
  assertClose(r.values[1], 100_000 / PASCALS_PER_PSI);
  assertClose(r.values[2], 100_000 / 101_325);
  assert.equal(r.values[3], 100_000);
  assertClose(r.otherUnits.find((u) => u.id === 'kPa')!.value, 100);
}

assert.equal(pressureValueState(null), 'blank');
assert.equal(pressureValueState(0), 'ok');
assert.equal(pressureValueState(-1), 'ok');
assert.equal(pressureValueState(Number.NaN), 'bad');
assert.equal(formatPressure(0), '0');

console.log('pressure-conversion calculation.test.ts: ok');
