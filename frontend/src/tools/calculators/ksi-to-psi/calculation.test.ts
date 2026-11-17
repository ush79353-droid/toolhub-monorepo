import assert from 'node:assert/strict';
import {
  PSI_PER_KSI,
  calculateKsiToPsi,
  formatPressure,
  ksiToPsi,
  psiToKsi,
  shareResultText,
} from './calculation';
import { validateKsiToPsi } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(PSI_PER_KSI, 1000);
assert.equal(ksiToPsi(1), 1000);
assert.equal(ksiToPsi(5), 5000);
assert.equal(ksiToPsi(150), 150_000);
assert.equal(psiToKsi(5000), 5);
assert.equal(ksiToPsi(0.75), 750);
assert.equal(ksiToPsi(0), 0);
assert.equal(psiToKsi(0), 0);
assert.equal(ksiToPsi(-2), -2000);
assert.equal(psiToKsi(-2000), -2);
assert.equal(psiToKsi(25_000), 25);
assert.equal(ksiToPsi(0.01), 10);

{
  const original = 25.75;
  assertClose(psiToKsi(ksiToPsi(original)), original, 10);
}

{
  const result = calculateKsiToPsi({ source: 'ksi', ksi: 5, psi: null });
  assert.equal(result.psi, 5000);
  assert.match(shareResultText(result), /KSI to PSI Conversion/);
}

{
  const result = calculateKsiToPsi({ source: 'psi', ksi: null, psi: 5000 });
  assert.equal(result.ksi, 5);
}

assert.ok(validateKsiToPsi({ source: 'ksi', ksi: 0, psi: null }).isValid);
assert.ok(validateKsiToPsi({ source: 'ksi', ksi: -1.5, psi: null }).isValid);
assert.ok(!validateKsiToPsi({ source: 'ksi', ksi: Number.NaN, psi: null }).isValid);
assert.ok(
  !validateKsiToPsi({
    source: 'psi',
    ksi: null,
    psi: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.equal(formatPressure(ksiToPsi(1)), '1000');

console.log('ksi-to-psi calculation.test.ts: ok');
