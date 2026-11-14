import assert from 'node:assert/strict';
import {
  buildResult,
  convertMass,
  formatMass,
  fromKilograms,
  toKilograms,
} from './calculation';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_KILOGRAMS,
  KG_PER_ATOMIC_MASS_UNIT,
  KG_PER_CARAT,
  KG_PER_LONG_TON,
  KG_PER_OUNCE,
  KG_PER_POUND,
  KG_PER_SHORT_TON,
  KG_PER_STONE,
  KG_PER_TROY_OUNCE,
  KG_PER_TROY_POUND,
  MASS_UNIT_BY_ID,
} from './types';
import { massValueState, parseOptionalNumber } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(MASS_UNIT_BY_ID.kg.kilogramsPerUnit, 1);
assert.equal(MASS_UNIT_BY_ID.g.kilogramsPerUnit, 0.001);
assert.equal(MASS_UNIT_BY_ID.mg.kilogramsPerUnit, 1e-6);
assert.equal(MASS_UNIT_BY_ID.t.kilogramsPerUnit, 1000);
assert.equal(MASS_UNIT_BY_ID.lb.kilogramsPerUnit, KG_PER_POUND);
assert.equal(MASS_UNIT_BY_ID.oz.kilogramsPerUnit, KG_PER_OUNCE);
assert.equal(MASS_UNIT_BY_ID.st.kilogramsPerUnit, KG_PER_STONE);
assert.equal(MASS_UNIT_BY_ID.shortTon.kilogramsPerUnit, KG_PER_SHORT_TON);
assert.equal(MASS_UNIT_BY_ID.longTon.kilogramsPerUnit, KG_PER_LONG_TON);
assert.equal(MASS_UNIT_BY_ID.ozt.kilogramsPerUnit, KG_PER_TROY_OUNCE);
assert.equal(MASS_UNIT_BY_ID.troyLb.kilogramsPerUnit, KG_PER_TROY_POUND);
assert.equal(MASS_UNIT_BY_ID.ct.kilogramsPerUnit, KG_PER_CARAT);
assert.equal(MASS_UNIT_BY_ID.u.kilogramsPerUnit, KG_PER_ATOMIC_MASS_UNIT);
assert.equal(MASS_UNIT_BY_ID.u.approximate, true);

assert.equal(KG_PER_POUND, 0.45359237);
assert.equal(KG_PER_OUNCE, 0.028349523125);
assert.equal(KG_PER_STONE, 6.35029318);
assert.equal(KG_PER_TROY_OUNCE, 0.0311034768);
assert.equal(KG_PER_CARAT, 0.0002);

assert.equal(toKilograms(1000, 'mg'), 0.001);
assert.equal(toKilograms(1000, 'g'), 1);
assert.equal(toKilograms(1000, 'kg'), 1000);
assert.equal(fromKilograms(1, 'g'), 1000);
assert.equal(fromKilograms(1, 'mg'), 1_000_000);
assert.equal(fromKilograms(0, 'g'), 0);

assert.equal(toKilograms(1, 'lb'), 0.45359237);
assertClose(toKilograms(2, 'lb'), 0.90718474);
assertClose(toKilograms(5, 'lb'), 2.26796185);
assertClose(toKilograms(10, 'lb'), 4.5359237);
assert.equal(convertMass(1, 'lb', 'oz'), 16);

assertClose(toKilograms(1, 'oz') * 1000, 28.349523125);
assertClose(convertMass(2, 'oz', 'g'), 56.69904625);
assertClose(convertMass(4, 'oz', 'g'), 113.3980925);
assertClose(convertMass(8, 'oz', 'g'), 226.796185);
assertClose(convertMass(16, 'oz', 'g'), 453.59237);

assert.equal(convertMass(1, 'st', 'lb'), 14);
assert.equal(toKilograms(1, 'st'), 6.35029318);
assert.equal(convertMass(2, 'st', 'lb'), 28);

assert.equal(toKilograms(1, 't'), 1000);
assert.equal(convertMass(1, 'shortTon', 'lb'), 2000);
assert.equal(convertMass(1, 'longTon', 'lb'), 2240);

assertClose(convertMass(1, 'ozt', 'g'), 31.1034768);
assert.equal(convertMass(1, 'troyLb', 'ozt'), 12);
assertClose(convertMass(1, 'ct', 'g'), 0.2);
assertClose(convertMass(5, 'ct', 'g'), 1);

{
  const result = buildResult(DEFAULT_KILOGRAMS, [...DEFAULT_FIELD_UNITS]);
  assert.equal(result.values[2], 1);
  assert.equal(result.values[1], 1000);
  assert.equal(result.values[0], 1_000_000);
  assertClose(result.values[4], 1 / KG_PER_POUND);
  assertClose(result.values[3], 1 / KG_PER_OUNCE);
  assertClose(result.values[5], 1 / KG_PER_STONE);
  assert.equal(result.values[6], 0.001);
  assertClose(result.values[7], 1 / KG_PER_TROY_OUNCE);
  assert.ok(result.otherUnits.some((row) => row.id === 'shortTon'));
  assert.ok(result.otherUnits.some((row) => row.id === 'u' && row.approximate));
}

{
  const kg = toKilograms(5, 'lb');
  assertClose(kg, 2.26796185);
  assertClose(fromKilograms(kg, 'g'), 2267.96185);
  assertClose(fromKilograms(kg, 'oz'), 80);
  assertClose(fromKilograms(kg, 'st'), 5 / 14);
}

{
  const oz = convertMass(100, 'g', 'oz');
  assertClose(oz, 100 / 28.349523125);
  const back = convertMass(oz, 'oz', 'g');
  assertClose(back, 100, 1e-10);
}

{
  const a = convertMass(1, 'kg', 'g');
  assert.equal(a, 1000);
  const b = convertMass(a, 'g', 'mg');
  assert.equal(b, 1_000_000);
  const c = convertMass(b, 'mg', 'kg');
  assertClose(c, 1, 1e-12);
}

assertClose(convertMass(5, 'kg', 'lb'), 5 / KG_PER_POUND);
assertClose(convertMass(10, 'lb', 'kg'), 4.5359237);
assertClose(convertMass(100, 'g', 'oz'), 100 / 28.349523125);
assertClose(convertMass(8, 'oz', 'g'), 226.796185);

assert.equal(formatMass(0), '0');
assert.equal(parseOptionalNumber('1.'), null);
assert.equal(parseOptionalNumber('1e'), null);
assert.equal(parseOptionalNumber('-5'), -5);
assert.equal(massValueState(-1), 'negative');
assert.equal(massValueState(0), 'ok');
assert.equal(massValueState(null), 'blank');
assert.equal(massValueState(Number.NaN), 'bad');

console.log('weight-converter calculation.test.ts: ok');
