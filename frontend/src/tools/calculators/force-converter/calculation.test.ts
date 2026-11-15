import assert from 'node:assert/strict';
import {
  buildResult,
  convertForce,
  formatForce,
  fromNewtons,
  toNewtons,
} from './calculation';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_NEWTONS,
  FORCE_UNIT_BY_ID,
  NEWTONS_PER_DYNE,
  NEWTONS_PER_GF,
  NEWTONS_PER_KGF,
  NEWTONS_PER_LBF,
  NEWTONS_PER_POUNDAL,
  NEWTONS_PER_TF,
  STANDARD_GRAVITY,
} from './types';
import { forceValueState, parseOptionalNumber } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(STANDARD_GRAVITY, 9.80665);
assert.equal(FORCE_UNIT_BY_ID.N.newtonsPerUnit, 1);
assert.equal(FORCE_UNIT_BY_ID.kN.newtonsPerUnit, 1000);
assert.equal(FORCE_UNIT_BY_ID.MN.newtonsPerUnit, 1e6);
assert.equal(FORCE_UNIT_BY_ID.mN.newtonsPerUnit, 0.001);
assert.equal(FORCE_UNIT_BY_ID.uN.newtonsPerUnit, 1e-6);
assert.equal(FORCE_UNIT_BY_ID.dyn.newtonsPerUnit, NEWTONS_PER_DYNE);
assert.equal(FORCE_UNIT_BY_ID.kgf.newtonsPerUnit, NEWTONS_PER_KGF);
assert.equal(FORCE_UNIT_BY_ID.gf.newtonsPerUnit, NEWTONS_PER_GF);
assert.equal(FORCE_UNIT_BY_ID.lbf.newtonsPerUnit, NEWTONS_PER_LBF);
assert.equal(FORCE_UNIT_BY_ID.tf.newtonsPerUnit, NEWTONS_PER_TF);
assert.equal(NEWTONS_PER_KGF, 9.80665);
assert.equal(NEWTONS_PER_GF, 0.00980665);
assert.equal(NEWTONS_PER_TF, 9806.65);
assert.equal(NEWTONS_PER_DYNE, 1e-5);
assertClose(NEWTONS_PER_LBF, 4.4482216152605);
assertClose(NEWTONS_PER_POUNDAL, 0.138254954376);

assert.equal(toNewtons(1000, 'N'), 1000);
assert.equal(fromNewtons(1000, 'kN'), 1);
assert.equal(fromNewtons(1e6, 'MN'), 1);
assert.equal(toNewtons(1, 'mN'), 0.001);
assert.equal(toNewtons(1, 'uN'), 1e-6);

assertClose(fromNewtons(1, 'dyn'), 100_000);
assert.equal(toNewtons(1, 'dyn'), 1e-5);
assertClose(fromNewtons(5, 'dyn'), 500_000);

assert.equal(toNewtons(1, 'kgf'), 9.80665);
assertClose(toNewtons(2, 'kgf'), 19.6133);
assertClose(toNewtons(10, 'kgf'), 98.0665);

assert.equal(toNewtons(1, 'gf'), 0.00980665);
assert.equal(convertForce(1000, 'gf', 'kgf'), 1);
assertClose(toNewtons(100, 'gf'), 0.980665);

assertClose(toNewtons(1, 'lbf'), 4.4482216152605);
assertClose(toNewtons(10, 'lbf'), 44.482216152605);
assertClose(toNewtons(100, 'lbf'), 444.82216152605);

assert.equal(toNewtons(1, 'tf'), 9806.65);
assert.equal(convertForce(1, 'tf', 'kgf'), 1000);
assert.equal(convertForce(1, 'tf', 'kN'), 9.80665);

assert.equal(convertForce(1, 'kip', 'lbf'), 1000);
assert.equal(convertForce(1, 'ozf', 'lbf'), 1 / 16);
assert.equal(convertForce(1, 'shortTonf', 'lbf'), 2000);
assert.equal(convertForce(1, 'longTonf', 'lbf'), 2240);

{
  const result = buildResult(DEFAULT_NEWTONS, [...DEFAULT_FIELD_UNITS]);
  assert.equal(result.values[0], 1);
  assert.equal(result.values[1], 0.001);
  assertClose(result.values[2], 100_000);
  assertClose(result.values[3], 1 / NEWTONS_PER_LBF);
  assertClose(result.values[4], 1 / NEWTONS_PER_GF);
  assertClose(result.values[5], 1 / NEWTONS_PER_KGF);
  assertClose(result.values[6], 1 / NEWTONS_PER_TF);
  assert.ok(result.otherUnits.some((row) => row.id === 'kip'));
}

{
  const r = buildResult(1000, [...DEFAULT_FIELD_UNITS]);
  assert.equal(r.values[0], 1000);
  assert.equal(r.values[1], 1);
  assertClose(r.values[2], 100_000_000, 1e-4);
  assertClose(r.values[3], 1000 / NEWTONS_PER_LBF);
  assertClose(r.values[5], 1000 / NEWTONS_PER_KGF);
  assertClose(r.values[6], 1000 / NEWTONS_PER_TF);
}

{
  const a = convertForce(1, 'kN', 'N');
  assert.equal(a, 1000);
  const b = convertForce(a, 'N', 'mN');
  assert.equal(b, 1_000_000);
  const c = convertForce(b, 'mN', 'kN');
  assertClose(c, 1, 1e-12);
}

assert.equal(formatForce(0), '0');
assert.equal(parseOptionalNumber('1.'), null);
assert.equal(parseOptionalNumber('-5'), -5);
assert.equal(forceValueState(-1), 'ok');
assert.equal(forceValueState(0), 'ok');
assert.equal(forceValueState(null), 'blank');
assert.equal(forceValueState(Number.NaN), 'bad');

console.log('force-converter calculation.test.ts: ok');
