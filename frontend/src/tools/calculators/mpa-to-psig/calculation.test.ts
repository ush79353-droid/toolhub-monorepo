import assert from 'node:assert/strict';
import {
  calculateMpaToPsig,
  formatPressure,
  mpaGaugeToPsig,
  psigToMpaGauge,
  shareResultText,
} from './calculation';
import { validateMpaToPsig } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(mpaGaugeToPsig(0), 0);
assertClose(mpaGaugeToPsig(1), 145.03773773, 8);
assertClose(mpaGaugeToPsig(2), 290.07547546, 8);
assertClose(mpaGaugeToPsig(5), 725.18868865, 8);
assertClose(mpaGaugeToPsig(6), 870.22642638, 7);
assertClose(mpaGaugeToPsig(10), 1450.3773773, 7);
assertClose(mpaGaugeToPsig(100), 14503.773773, 6);

assertClose(psigToMpaGauge(1), 0.006894757293, 10);
assertClose(psigToMpaGauge(150), 1.034213594, 8);
assertClose(psigToMpaGauge(300), 2.068427188, 8);
assertClose(psigToMpaGauge(1000), 6.894757293, 8);

assertClose(mpaGaugeToPsig(-1), -145.03773773, 8);
assertClose(psigToMpaGauge(-50), -0.3447378646, 8);

{
  const original = 12.5;
  assertClose(psigToMpaGauge(mpaGaugeToPsig(original)), original, 10);
}

{
  const result = calculateMpaToPsig({ source: 'MPa', MPa: 6, psig: null });
  assertClose(result.psig, 870.22642638, 7);
  assert.match(shareResultText(result), /MPa to PSIG Conversion/);
  assert.match(shareResultText(result), /MPa\(g\)/);
}

{
  const result = calculateMpaToPsig({ source: 'psig', MPa: null, psig: 300 });
  assertClose(result.MPa, 2.068427188, 8);
}

assert.ok(validateMpaToPsig({ source: 'MPa', MPa: 0, psig: null }).isValid);
assert.ok(validateMpaToPsig({ source: 'MPa', MPa: -1.5, psig: null }).isValid);
assert.ok(!validateMpaToPsig({ source: 'MPa', MPa: Number.NaN, psig: null }).isValid);
assert.ok(
  !validateMpaToPsig({
    source: 'psig',
    MPa: null,
    psig: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.ok(formatPressure(mpaGaugeToPsig(1)).startsWith('145'));
// Reject the inaccurate ~130.34 absolute-with-atm factor for gauge conversion.
assert.ok(Math.abs(mpaGaugeToPsig(1) - 130.34) > 10);

console.log('mpa-to-psig calculation.test.ts: ok');
