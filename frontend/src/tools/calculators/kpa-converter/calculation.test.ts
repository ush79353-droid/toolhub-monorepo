import assert from 'node:assert/strict';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
  PASCALS_PER_PSI,
  convertPressure,
  formatPressure,
  shareResultText,
} from './calculation';
import { parsePressureInput, pascalsFromField } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(PASCALS_PER_KPA, 1000);
assert.equal(PASCALS_PER_BAR, 100_000);
assert.equal(PASCALS_PER_ATM, 101_325);
assertClose(PASCALS_PER_PSI, 6894.757293168361, 8);

assert.equal(convertPressure(100, 'kPa', 'bar'), 1);
assert.equal(convertPressure(2, 'bar', 'kPa'), 200);
assertClose(convertPressure(100, 'kPa', 'psi'), 14.503773773, 6);
assertClose(convertPressure(30, 'psi', 'kPa'), 206.842718795, 6);
assert.equal(convertPressure(1, 'atm', 'kPa'), 101.325);
assertClose(convertPressure(101.325, 'kPa', 'atm'), 1, 10);
assert.equal(convertPressure(0, 'kPa', 'psi'), 0);

assertClose(convertPressure(1, 'kPa', 'bar'), 0.01, 12);
assertClose(convertPressure(10, 'kPa', 'bar'), 0.1, 12);
assertClose(convertPressure(50, 'kPa', 'bar'), 0.5, 12);
assertClose(convertPressure(200, 'kPa', 'bar'), 2, 12);
assertClose(convertPressure(1000, 'kPa', 'bar'), 10, 12);

assertClose(convertPressure(1, 'kPa', 'atm'), 0.009869232667, 8);
assertClose(convertPressure(10, 'kPa', 'atm'), 0.09869232667, 8);

{
  const original = 245.75;
  const psi = convertPressure(original, 'kPa', 'psi');
  assertClose(convertPressure(psi, 'psi', 'kPa'), original, 10);
}

assert.ok(pascalsFromField(-10, 'kPa').ok);
assert.equal(parsePressureInput('').blank, true);
assert.ok(parsePressureInput('abc').value === null);

assert.match(shareResultText(100_000), /kPa Converter/);
assert.ok(formatPressure(convertPressure(100, 'kPa', 'psi')).startsWith('14.5'));

console.log('kpa-converter calculation.test.ts: ok');
