import assert from 'node:assert/strict';
import {
  INH2O_PER_PSI,
  PASCALS_PER_INH2O,
  PASCALS_PER_INH2O_4C,
  PASCALS_PER_PSI,
  PSI_PER_INH2O,
  calculatePsiToInchesOfWater,
  inH2OToPsi,
  psiToInH2O,
  shareResultText,
} from './calculation';
import { validatePsiToInchesOfWater } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(PASCALS_PER_PSI, 6894.757293168, 8);
assertClose(PASCALS_PER_INH2O, 249.08891, 8);
assert.equal(PASCALS_PER_INH2O_4C, PASCALS_PER_INH2O);
assertClose(INH2O_PER_PSI, PASCALS_PER_PSI / PASCALS_PER_INH2O, 12);
assertClose(PSI_PER_INH2O, PASCALS_PER_INH2O / PASCALS_PER_PSI, 12);

assert.equal(psiToInH2O(0), 0);
assertClose(psiToInH2O(1), 27.6799, 4);
assertClose(psiToInH2O(2), 55.3598, 4);
assertClose(psiToInH2O(5), 138.399, 3);
assertClose(psiToInH2O(8), 221.439, 3);
assertClose(psiToInH2O(10), 276.799, 3);
assertClose(psiToInH2O(15), 415.197, 3);
assertClose(psiToInH2O(20), 553.596, 3);
assertClose(psiToInH2O(30), 830.394, 3);
assertClose(psiToInH2O(50), 1383.99, 2);
assertClose(psiToInH2O(100), 2767.99, 2);

assert.equal(inH2OToPsi(0), 0);
assertClose(inH2OToPsi(1), PSI_PER_INH2O, 10);
assertClose(inH2OToPsi(10), 10 * PSI_PER_INH2O, 10);
assertClose(inH2OToPsi(27.6799), inH2OToPsi(INH2O_PER_PSI), 4);
assertClose(inH2OToPsi(100), 100 * PSI_PER_INH2O, 10);
assertClose(inH2OToPsi(250), 250 * PSI_PER_INH2O, 10);

assertClose(inH2OToPsi(psiToInH2O(8)), 8, 10);
assertClose(psiToInH2O(inH2OToPsi(100)), 100, 10);
assertClose(psiToInH2O(-10), -10 * INH2O_PER_PSI, 10);

{
  const result = calculatePsiToInchesOfWater({
    source: 'psi',
    psi: 8,
    inH2O: null,
  });
  assertClose(result.inH2O, psiToInH2O(8), 10);
  assert.match(shareResultText(result), /PSI to Inches of Water Conversion/);
  assert.match(shareResultText(result), /8 psi/);
  assert.match(shareResultText(result), /4°C/);
}

{
  const result = calculatePsiToInchesOfWater({
    source: 'inH2O',
    psi: null,
    inH2O: 100,
  });
  assertClose(result.psi, inH2OToPsi(100), 10);
}

assert.ok(validatePsiToInchesOfWater({ source: 'psi', psi: 0, inH2O: null }).isValid);
assert.ok(validatePsiToInchesOfWater({ source: 'psi', psi: -5, inH2O: null }).isValid);
assert.ok(
  !validatePsiToInchesOfWater({ source: 'psi', psi: Number.NaN, inH2O: null }).isValid,
);
assert.ok(
  !validatePsiToInchesOfWater({ source: 'inH2O', psi: null, inH2O: null }).isValid,
);

console.log('psi-to-inches-of-water calculation.test.ts: ok');
