import assert from 'node:assert/strict';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
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

assert.equal(convertPressure(1, 'Pa', 'Pa'), 1);
assert.equal(convertPressure(1000, 'Pa', 'kPa'), 1);
assert.equal(convertPressure(100_000, 'Pa', 'bar'), 1);
assert.equal(convertPressure(101_325, 'Pa', 'atm'), 1);
assert.equal(convertPressure(101_325, 'Pa', 'Torr'), 760);
assert.equal(convertPressure(1_000_000, 'Pa', 'MPa'), 1);
assert.equal(convertPressure(1, 'bar', 'Pa'), 100_000);
assert.equal(convertPressure(0, 'Pa', 'bar'), 0);
assert.equal(convertPressure(-1000, 'Pa', 'kPa'), -1);
assert.equal(convertPressure(41, 'Pa', 'kPa'), 0.041);

assertClose(PASCALS_PER_PSI, 6894.757293168, 8);
assertClose(convertPressure(1, 'psi', 'Pa'), PASCALS_PER_PSI, 8);
assertClose(convertPressure(PASCALS_PER_PSI, 'Pa', 'psi'), 1, 8);
assertClose(convertPressure(10, 'psi', 'Pa'), 10 * PASCALS_PER_PSI, 8);
assertClose(convertPressure(41, 'Pa', 'Torr'), 41 * (760 / 101_325), 8);

assert.equal(PASCALS_PER_BAR, 100_000);
assert.equal(PASCALS_PER_ATM, 101_325);
assert.equal(PASCALS_PER_TORR, PASCALS_PER_ATM / 760);
assert.equal(PASCALS_PER_KPA, 1_000);
assert.equal(PASCALS_PER_MPA, 1_000_000);
assert.equal(PASCALS_PER_MMHG, 133.322387415);
assert.notEqual(PASCALS_PER_MMHG, PASCALS_PER_TORR);

assertClose(convertPressure(1, 'Pa', 'mbar'), 0.01, 12);
assertClose(convertPressure(1, 'mmHg', 'Pa'), PASCALS_PER_MMHG, 12);

{
  const original = 101_325;
  const psi = convertPressure(original, 'Pa', 'psi');
  assertClose(convertPressure(psi, 'psi', 'Pa'), original, 8);
  const torr = convertPressure(original, 'Pa', 'Torr');
  assertClose(convertPressure(torr, 'Torr', 'Pa'), original, 10);
}

assert.ok(pascalsFromField(-2.5, 'Pa').ok);
assert.equal(parsePressureInput('').blank, true);
assert.ok(parsePressureInput('abc').value === null);

assert.match(shareResultText(101_325), /Pascal Conversion/);
assert.match(shareResultText(101_325), /1 atm/);
assert.ok(formatPressure(convertPressure(1, 'Pa', 'psi')).startsWith('0.000145'));

console.log('pascal-conversion calculation.test.ts: ok');
