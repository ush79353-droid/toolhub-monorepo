import assert from 'node:assert/strict';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
  PASCALS_PER_MBAR,
  PASCALS_PER_MMHG,
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

assert.equal(convertPressure(1, 'bar', 'Pa'), 100_000);
assert.equal(convertPressure(1, 'bar', 'kPa'), 100);
assertClose(convertPressure(1, 'bar', 'psi'), 100_000 / PASCALS_PER_PSI, 8);
assertClose(convertPressure(1, 'bar', 'atm'), 100_000 / PASCALS_PER_ATM, 8);

assert.equal(convertPressure(1, 'atm', 'Pa'), 101_325);
assert.equal(convertPressure(1, 'atm', 'Torr'), 760);
assert.equal(convertPressure(1, 'atm', 'bar'), 1.01325);

assert.equal(convertPressure(1, 'MPa', 'Pa'), 1_000_000);
assert.equal(convertPressure(1, 'MPa', 'bar'), 10);

assert.equal(convertPressure(1, 'kPa', 'Pa'), 1_000);
assert.equal(convertPressure(1, 'kPa', 'mbar'), 10);

assertClose(convertPressure(1, 'psi', 'Pa'), PASCALS_PER_PSI, 8);
assertClose(convertPressure(1, 'psi', 'kPa'), PASCALS_PER_PSI / 1000, 8);

assert.equal(convertPressure(0, 'bar', 'Pa'), 0);
assert.equal(convertPressure(-1, 'bar', 'Pa'), -100_000);

assert.equal(PASCALS_PER_BAR, 100_000);
assert.equal(PASCALS_PER_ATM, 101_325);
assert.equal(PASCALS_PER_TORR, PASCALS_PER_ATM / 760);
assert.equal(PASCALS_PER_KPA, 1_000);
assert.equal(PASCALS_PER_MPA, 1_000_000);
assert.equal(PASCALS_PER_MBAR, 100);
assert.equal(PASCALS_PER_MMHG, 133.322387415);
assert.notEqual(PASCALS_PER_MMHG, PASCALS_PER_TORR);

assertClose(convertPressure(25, 'Torr', 'mmHg'), (25 * PASCALS_PER_TORR) / PASCALS_PER_MMHG, 8);
assertClose(convertPressure(2, 'bar', 'psi'), 200_000 / PASCALS_PER_PSI, 8);

assert.ok(pascalsFromField(-2.5, 'bar').ok);
assert.equal(parsePressureInput('').blank, true);
assert.ok(parsePressureInput('abc').value === null);

assert.match(shareResultText(100_000), /Pressure Unit Conversion/);
assert.match(shareResultText(100_000), /1 bar/);
assert.ok(formatPressure(convertPressure(1, 'bar', 'psi')).startsWith('14.5'));

console.log('pressure-unit-conversion calculation.test.ts: ok');
