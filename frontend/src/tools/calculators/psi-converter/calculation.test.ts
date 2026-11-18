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

assertClose(PASCALS_PER_PSI, 6894.757293168, 8);
assertClose(convertPressure(1, 'psi', 'Pa'), PASCALS_PER_PSI, 8);
assertClose(convertPressure(1, 'psi', 'kPa'), PASCALS_PER_PSI / 1000, 8);
assertClose(convertPressure(1, 'psi', 'bar'), PASCALS_PER_PSI / PASCALS_PER_BAR, 8);
assertClose(convertPressure(1, 'psi', 'atm'), PASCALS_PER_PSI / PASCALS_PER_ATM, 8);

assertClose(convertPressure(1, 'bar', 'psi'), PASCALS_PER_BAR / PASCALS_PER_PSI, 8);
assertClose(convertPressure(1, 'atm', 'psi'), PASCALS_PER_ATM / PASCALS_PER_PSI, 8);
assertClose(convertPressure(100, 'kPa', 'psi'), (100 * PASCALS_PER_KPA) / PASCALS_PER_PSI, 8);

assertClose(convertPressure(10, 'psi', 'kPa'), (10 * PASCALS_PER_PSI) / 1000, 8);
assertClose(convertPressure(50, 'psi', 'bar'), (50 * PASCALS_PER_PSI) / PASCALS_PER_BAR, 8);
assertClose(convertPressure(100, 'psi', 'kPa'), (100 * PASCALS_PER_PSI) / 1000, 8);

assert.equal(convertPressure(0, 'psi', 'Pa'), 0);
assertClose(convertPressure(-1, 'psi', 'Pa'), -PASCALS_PER_PSI, 8);

assert.ok(pascalsFromField(-2.5, 'psi').ok);
assert.equal(parsePressureInput('').blank, true);
assert.ok(parsePressureInput('abc').value === null);

assert.match(shareResultText(PASCALS_PER_PSI), /PSI Converter/);
assert.match(shareResultText(PASCALS_PER_PSI), /1 psi/);
assert.ok(formatPressure(convertPressure(1, 'psi', 'bar')).startsWith('0.0689'));

console.log('psi-converter calculation.test.ts: ok');
