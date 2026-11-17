import assert from 'node:assert/strict';
import {
  KGFCM2_TO_PSI,
  calculateKgCmToPsi,
  formatPressure,
  kgfCm2ToPsi,
  psiToKgfCm2,
  shareResultText,
} from './calculation';
import { validateKgCmToPsi } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(KGFCM2_TO_PSI, 98066.5 / 6894.757293168, 12);
assertClose(kgfCm2ToPsi(0), 0);
assertClose(kgfCm2ToPsi(0.1), 1.422334, 5);
assertClose(kgfCm2ToPsi(1), 14.223343, 5);
assertClose(kgfCm2ToPsi(2), 28.446687, 5);
assertClose(kgfCm2ToPsi(3.6), 51.204036, 5);
assertClose(kgfCm2ToPsi(7), 99.563403, 5);
assertClose(kgfCm2ToPsi(10), 142.233433, 5);
assertClose(kgfCm2ToPsi(100), 1422.334331, 5);

assertClose(psiToKgfCm2(0), 0);
assertClose(psiToKgfCm2(14.223343), 1, 5);
assertClose(psiToKgfCm2(100), 7.030696, 5);

assertClose(psiToKgfCm2(kgfCm2ToPsi(7)), 7, 10);
assertClose(kgfCm2ToPsi(psiToKgfCm2(50)), 50, 10);
assertClose(kgfCm2ToPsi(-2), -2 * KGFCM2_TO_PSI, 10);

{
  const result = calculateKgCmToPsi({
    source: 'kgfCm2',
    kgfCm2: 7,
    psi: null,
  });
  assertClose(result.psi, 99.563403, 5);
  assert.match(shareResultText(result), /kg\/cm² to PSI/);
}

{
  const result = calculateKgCmToPsi({
    source: 'psi',
    kgfCm2: null,
    psi: 100,
  });
  assertClose(result.kgfCm2, 7.030696, 5);
}

assert.ok(
  validateKgCmToPsi({
    source: 'kgfCm2',
    kgfCm2: 0,
    psi: null,
  }).isValid,
);
assert.ok(
  validateKgCmToPsi({
    source: 'kgfCm2',
    kgfCm2: -1.5,
    psi: null,
  }).isValid,
);
assert.ok(
  !validateKgCmToPsi({
    source: 'kgfCm2',
    kgfCm2: Number.NaN,
    psi: null,
  }).isValid,
);
assert.ok(
  !validateKgCmToPsi({
    source: 'psi',
    kgfCm2: null,
    psi: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.ok(formatPressure(kgfCm2ToPsi(1)).includes('14.223'));

console.log('kgcm-to-psi calculation.test.ts: ok');
