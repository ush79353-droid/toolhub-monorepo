import assert from 'node:assert/strict';
import {
  calculateMpaToPsi,
  formatPressure,
  mpaToPsi,
  psiToMpa,
  shareResultText,
} from './calculation';
import { validateMpaToPsi } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(mpaToPsi(1), 145.03773773, 8);
assertClose(mpaToPsi(2), 290.07547546, 8);
assertClose(mpaToPsi(5), 725.18868865, 8);
assertClose(mpaToPsi(10), 1450.3773773, 7);
assertClose(mpaToPsi(22), 3190.830230, 6);
assertClose(mpaToPsi(100), 14503.773773, 6);

assertClose(psiToMpa(1), 0.006894757293, 10);
assertClose(psiToMpa(150), 1.034213594, 8);
assertClose(psiToMpa(240), 1.654741750, 8);
assertClose(psiToMpa(1000), 6.894757293, 8);

assert.equal(mpaToPsi(0), 0);
assert.equal(psiToMpa(0), 0);
assertClose(mpaToPsi(-1), -145.03773773, 8);

{
  const original = 17.25;
  assertClose(psiToMpa(mpaToPsi(original)), original, 10);
}

{
  const result = calculateMpaToPsi({ source: 'MPa', MPa: 1, psi: null });
  assertClose(result.psi, 145.03773773, 8);
  assert.match(shareResultText(result), /MPa to PSI Conversion/);
}

{
  const result = calculateMpaToPsi({ source: 'psi', MPa: null, psi: 150 });
  assertClose(result.MPa, 1.034213594, 8);
}

assert.ok(validateMpaToPsi({ source: 'MPa', MPa: 0, psi: null }).isValid);
assert.ok(validateMpaToPsi({ source: 'MPa', MPa: -1.5, psi: null }).isValid);
assert.ok(!validateMpaToPsi({ source: 'MPa', MPa: Number.NaN, psi: null }).isValid);
assert.ok(
  !validateMpaToPsi({
    source: 'psi',
    MPa: null,
    psi: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.ok(formatPressure(mpaToPsi(1)).startsWith('145'));

console.log('mpa-to-psi calculation.test.ts: ok');
