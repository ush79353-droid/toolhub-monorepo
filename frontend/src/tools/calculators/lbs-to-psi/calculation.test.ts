import assert from 'node:assert/strict';
import { calculateLbsToPsi, psfToPsi, psiToPsf, shareResultText } from './calculation';
import { SQUARE_INCHES_PER_SQUARE_FOOT } from './types';
import { parseOptionalNumber, validateLbsToPsi } from './validation';

function close(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(psfToPsi(144), 1);
close(psfToPsi(100), 0.6944444444);
close(psfToPsi(150), 1.0416666667);
assert.equal(psiToPsf(1), 144);
assert.equal(psiToPsf(10), 1440);
assert.equal(psfToPsi(0), 0);
assert.equal(psfToPsi(-144), -1);
assert.equal(SQUARE_INCHES_PER_SQUARE_FOOT, 144);

{
  const result = calculateLbsToPsi({ source: 'psf', psf: 144, psi: null });
  assert.equal(result.psi, 1);
  assert.match(shareResultText(result), /144/);
}

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('12.'), null);
assert.ok(Number.isNaN(parseOptionalNumber('abc')!));
assert.ok(validateLbsToPsi({ source: 'psf', psf: -10, psi: null }).isValid);

console.log('lbs-to-psi calculation.test.ts: ok');
