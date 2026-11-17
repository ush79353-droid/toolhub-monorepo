import assert from 'node:assert/strict';
import {
  MPA_PER_KSI,
  calculateKsiToMpa,
  formatPressure,
  ksiToMPa,
  mPaToKsi,
  shareResultText,
} from './calculation';
import { validateKsiToMpa } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(ksiToMPa(1), 6.894757293168, 10);
assertClose(MPA_PER_KSI, 6.894757293168, 10);
assertClose(ksiToMPa(5), 34.47378646584, 8);
assertClose(mPaToKsi(100), 14.503773773, 8);
assert.equal(ksiToMPa(0), 0);
assert.equal(mPaToKsi(0), 0);
assertClose(ksiToMPa(-2), -13.789514586336, 8);
assertClose(ksiToMPa(10), 68.94757293168, 8);
assertClose(ksiToMPa(150), 1034.2135939752, 6);
assertClose(mPaToKsi(50), 7.2518868865, 8);

{
  const original = 25.75;
  assertClose(mPaToKsi(ksiToMPa(original)), original, 10);
}

{
  const result = calculateKsiToMpa({ source: 'ksi', ksi: 5, mpa: null });
  assertClose(result.mpa, 34.47378646584, 8);
  assert.match(shareResultText(result), /KSI to MPa Converter/);
}

{
  const result = calculateKsiToMpa({ source: 'MPa', ksi: null, mpa: 100 });
  assertClose(result.ksi, 14.503773773, 8);
}

assert.ok(validateKsiToMpa({ source: 'ksi', ksi: 0, mpa: null }).isValid);
assert.ok(validateKsiToMpa({ source: 'ksi', ksi: -1.5, mpa: null }).isValid);
assert.ok(!validateKsiToMpa({ source: 'ksi', ksi: Number.NaN, mpa: null }).isValid);
assert.ok(
  !validateKsiToMpa({
    source: 'MPa',
    ksi: null,
    mpa: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.ok(formatPressure(ksiToMPa(1)).startsWith('6.894'));

console.log('ksi-to-mpa calculation.test.ts: ok');
