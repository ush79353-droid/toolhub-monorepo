import assert from 'node:assert/strict';
import {
  barToPsi,
  calculateBarToPsi,
  convertPressure,
  psiToBar,
  shareResultText,
} from './calculation';
import { PASCALS_PER_BAR, PASCALS_PER_PSI, PSI_PER_BAR } from './types';
import { parseOptionalNumber, validateBarToPsi } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(PASCALS_PER_BAR, 100_000);
assertClose(PASCALS_PER_PSI, 6894.757293168361, 12);
assertClose(PSI_PER_BAR, 14.503773773, 9);

assertClose(barToPsi(1), 14.503773773, 8);
assertClose(psiToBar(1), 0.0689475729317, 10);
assertClose(barToPsi(3), 43.511321319, 7);
assertClose(barToPsi(45), 652.669819785, 6);
assertClose(barToPsi(2.5), 36.259434433, 7);
assertClose(barToPsi(12.5), 181.297172163, 7);
assert.equal(barToPsi(0), 0);
assertClose(psiToBar(barToPsi(12.5)), 12.5, 10);
assertClose(convertPressure(1, 'bar', 'psi'), barToPsi(1), 12);
assertClose(psiToBar(100), 6.894757293, 8);

{
  const result = calculateBarToPsi({
    source: 'primary',
    primary: 1,
    secondary: null,
    primaryUnit: 'bar',
    secondaryUnit: 'psi',
  });
  assertClose(result.psi, 14.503773773, 8);
  assertClose(result.secondary, result.psi, 12);
  assert.match(shareResultText(result), /Bar to PSI/);
}

{
  const result = calculateBarToPsi({
    source: 'secondary',
    primary: null,
    secondary: 45,
    primaryUnit: 'bar',
    secondaryUnit: 'psi',
  });
  assertClose(result.bar, 3.102641, 5);
}

{
  const result = calculateBarToPsi({
    source: 'primary',
    primary: 100,
    secondary: null,
    primaryUnit: 'kPa',
    secondaryUnit: 'psi',
  });
  // 100 kPa = 1 bar
  assertClose(result.bar, 1, 12);
  assertClose(result.psi, barToPsi(1), 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateBarToPsi({
    source: 'primary',
    primary: -1,
    secondary: null,
    primaryUnit: 'bar',
    secondaryUnit: 'psi',
  }).isValid,
);
assert.ok(
  validateBarToPsi({
    source: 'primary',
    primary: 0,
    secondary: null,
    primaryUnit: 'bar',
    secondaryUnit: 'psi',
  }).isValid,
);

console.log('bar-to-psi calculation.test.ts: ok');
