import assert from 'node:assert/strict';
import {
  calculateKpaToPsi,
  formatPressure,
  kPaToPsi,
  psiToKPa,
  shareResultText,
} from './calculation';
import { validateKpaToPsi } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(kPaToPsi(100), 14.503773773, 8);
assertClose(psiToKPa(30), 206.842718795, 8);
assertClose(kPaToPsi(40), 5.801509509, 8);
assertClose(psiToKPa(15), 103.421359397, 8);
assert.equal(kPaToPsi(0), 0);
assert.equal(psiToKPa(0), 0);
assertClose(kPaToPsi(-100), -14.503773773, 8);
assertClose(kPaToPsi(1), 0.14503773773, 8);
assertClose(kPaToPsi(210), 30.457925, 5);
assertClose(psiToKPa(20), 137.895145863, 8);

{
  const original = 245.75;
  assertClose(psiToKPa(kPaToPsi(original)), original, 10);
}

{
  const result = calculateKpaToPsi({ source: 'kPa', kPa: 100, psi: null });
  assertClose(result.psi, 14.503773773, 8);
  assert.match(shareResultText(result), /kPa to psi Conversion/);
}

{
  const result = calculateKpaToPsi({ source: 'psi', kPa: null, psi: 30 });
  assertClose(result.kPa, 206.842718795, 8);
}

assert.ok(validateKpaToPsi({ source: 'kPa', kPa: 0, psi: null }).isValid);
assert.ok(validateKpaToPsi({ source: 'kPa', kPa: -1.5, psi: null }).isValid);
assert.ok(!validateKpaToPsi({ source: 'kPa', kPa: Number.NaN, psi: null }).isValid);
assert.ok(
  !validateKpaToPsi({
    source: 'psi',
    kPa: null,
    psi: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.ok(formatPressure(kPaToPsi(100)).startsWith('14.5'));

console.log('kpa-to-psi calculation.test.ts: ok');
