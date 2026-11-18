import assert from 'node:assert/strict';
import {
  PASCALS_PER_PSI,
  calculatePaToPsi,
  formatPressure,
  pascalToPsi,
  psiToPascal,
  shareResultText,
} from './calculation';
import { validatePaToPsi } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(PASCALS_PER_PSI, 6894.757293168361, 8);
assertClose(pascalToPsi(1), 1 / PASCALS_PER_PSI, 12);
assertClose(pascalToPsi(1000), 1000 / PASCALS_PER_PSI, 10);
assertClose(pascalToPsi(101_325), 14.6959487755, 8);
assertClose(psiToPascal(1), PASCALS_PER_PSI, 8);
assertClose(psiToPascal(10), 10 * PASCALS_PER_PSI, 8);
assertClose(psiToPascal(30), 30 * PASCALS_PER_PSI, 8);
assertClose(psiToPascal(122), 122 * PASCALS_PER_PSI, 8);
assert.equal(pascalToPsi(0), 0);
assert.equal(psiToPascal(0), 0);
assertClose(pascalToPsi(-1000), -1000 / PASCALS_PER_PSI, 10);

{
  const original = 245.75;
  assertClose(psiToPascal(pascalToPsi(original)), original, 10);
}

{
  const result = calculatePaToPsi({ source: 'Pa', Pa: 1000, psi: null });
  assertClose(result.psi, 1000 / PASCALS_PER_PSI, 10);
  assert.match(shareResultText(result), /Pa to PSI Converter/);
}

{
  const result = calculatePaToPsi({ source: 'psi', Pa: null, psi: 30 });
  assertClose(result.Pa, 30 * PASCALS_PER_PSI, 8);
}

assert.ok(validatePaToPsi({ source: 'Pa', Pa: 0, psi: null }).isValid);
assert.ok(validatePaToPsi({ source: 'Pa', Pa: -1.5, psi: null }).isValid);
assert.ok(!validatePaToPsi({ source: 'Pa', Pa: Number.NaN, psi: null }).isValid);
assert.ok(
  !validatePaToPsi({
    source: 'psi',
    Pa: null,
    psi: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.ok(formatPressure(pascalToPsi(1000)).startsWith('0.145'));

console.log('pa-to-psi calculation.test.ts: ok');
