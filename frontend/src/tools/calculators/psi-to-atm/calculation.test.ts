import assert from 'node:assert/strict';
import {
  ATM_PER_PSI,
  PASCALS_PER_ATM,
  PASCALS_PER_PSI,
  PSI_PER_ATM,
  atmToPsi,
  calculatePsiToAtm,
  psiToAtm,
  shareResultText,
} from './calculation';
import { validatePsiToAtm } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(PASCALS_PER_ATM, 101_325);
assertClose(PASCALS_PER_PSI, 6894.757293168, 8);
assertClose(ATM_PER_PSI, PASCALS_PER_PSI / PASCALS_PER_ATM, 12);
assertClose(PSI_PER_ATM, PASCALS_PER_ATM / PASCALS_PER_PSI, 8);

assert.equal(psiToAtm(0), 0);
assertClose(psiToAtm(1), ATM_PER_PSI, 10);
assertClose(psiToAtm(10), 10 * ATM_PER_PSI, 10);
assertClose(psiToAtm(100), 100 * ATM_PER_PSI, 10);
assertClose(psiToAtm(1000), 1000 * ATM_PER_PSI, 10);

assert.equal(atmToPsi(0), 0);
assertClose(atmToPsi(1), PSI_PER_ATM, 8);
assertClose(atmToPsi(2), 2 * PSI_PER_ATM, 8);
assertClose(atmToPsi(5), 5 * PSI_PER_ATM, 8);

assertClose(psiToAtm(PSI_PER_ATM), 1, 10);
assertClose(atmToPsi(ATM_PER_PSI), 1, 8);
assertClose(psiToAtm(-10), -10 * ATM_PER_PSI, 10);

{
  const result = calculatePsiToAtm({ source: 'psi', psi: 100, atm: null });
  assertClose(result.atm, 100 * ATM_PER_PSI, 10);
  assert.match(shareResultText(result), /PSI to ATM Conversion/);
  assert.match(shareResultText(result), /100 psi/);
}

{
  const result = calculatePsiToAtm({ source: 'atm', psi: null, atm: 1 });
  assertClose(result.psi, PSI_PER_ATM, 8);
}

assert.ok(validatePsiToAtm({ source: 'psi', psi: 0, atm: null }).isValid);
assert.ok(validatePsiToAtm({ source: 'psi', psi: -5, atm: null }).isValid);
assert.ok(!validatePsiToAtm({ source: 'psi', psi: Number.NaN, atm: null }).isValid);
assert.ok(!validatePsiToAtm({ source: 'atm', psi: null, atm: null }).isValid);

console.log('psi-to-atm calculation.test.ts: ok');
