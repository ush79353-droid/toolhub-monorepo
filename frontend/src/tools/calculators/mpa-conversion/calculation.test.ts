import assert from 'node:assert/strict';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MPA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
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

assert.equal(PASCALS_PER_MPA, 1_000_000);
assert.equal(PASCALS_PER_BAR, 100_000);
assert.equal(PASCALS_PER_ATM, 101_325);
assert.equal(PASCALS_PER_TORR, PASCALS_PER_ATM / 760);
assertClose(PASCALS_PER_PSI, 6894.757293168361, 8);

assert.equal(convertPressure(1, 'MPa', 'bar'), 10);
assert.equal(convertPressure(10, 'bar', 'MPa'), 1);
assert.equal(convertPressure(100, 'bar', 'MPa'), 10);
assertClose(convertPressure(1, 'MPa', 'psi'), 145.03773773, 6);
assertClose(convertPressure(1, 'MPa', 'atm'), 9.869232667, 8);
assertClose(convertPressure(1, 'MPa', 'Torr'), 7500.616827, 6);

assert.equal(convertPressure(1, 'atm', 'MPa'), 0.101325);
assert.equal(convertPressure(760, 'Torr', 'atm'), 1);
assert.equal(convertPressure(1000, 'kPa', 'MPa'), 1);
assert.equal(convertPressure(0, 'MPa', 'psi'), 0);

assertClose(convertPressure(25, 'bar', 'MPa'), 2.5, 12);
assertClose(convertPressure(25, 'bar', 'psi'), 362.5943443, 5);
assertClose(convertPressure(25, 'bar', 'atm'), 24.67308167, 6);
assertClose(convertPressure(25, 'bar', 'Torr'), 18751.54207, 5);

assertClose(convertPressure(1, 'atm', 'bar'), 1.01325, 12);
assertClose(convertPressure(1, 'atm', 'psi'), 14.69594877, 6);

{
  const original = 3.75;
  const psi = convertPressure(original, 'MPa', 'psi');
  assertClose(convertPressure(psi, 'psi', 'MPa'), original, 10);
  const torr = convertPressure(original, 'MPa', 'Torr');
  assertClose(convertPressure(torr, 'Torr', 'MPa'), original, 10);
}

assert.ok(pascalsFromField(-2.5, 'MPa').ok);
assert.equal(parsePressureInput('').blank, true);
assert.ok(parsePressureInput('abc').value === null);

assert.match(shareResultText(1_000_000), /MPa Conversion/);
assert.ok(formatPressure(convertPressure(1, 'MPa', 'psi')).startsWith('145'));

console.log('mpa-conversion calculation.test.ts: ok');
