import assert from 'node:assert/strict';
import {
  calculateIdealFlowM3S,
  calculateIdealVelocity,
  calculatePipeArea,
  calculatePsiToGpm,
  diameterFromArea,
  fromMeters,
  m3sToUsGpm,
  psiToPascal,
  toMeters,
} from './calculation';
import {
  DEFAULT_PSI_TO_GPM_INPUT,
  PASCALS_PER_ATM,
  PASCALS_PER_PSI,
  STANDARD_ATM_PSI,
} from './types';
import { validatePsiToGpm } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

assertClose(PASCALS_PER_PSI, 6894.757293168361);
assertClose(psiToPascal(1), PASCALS_PER_PSI);
assertClose(psiToPascal(10), 10 * PASCALS_PER_PSI);
assert.equal(PASCALS_PER_ATM, 101_325);
assertClose(STANDARD_ATM_PSI, PASCALS_PER_ATM / PASCALS_PER_PSI);

assertClose(toMeters(2, 'cm'), 0.02);
assertClose(fromMeters(0.02, 'cm'), 2);

{
  const area = calculatePipeArea(0.02);
  assertClose(area, (Math.PI * 0.0004) / 4);
  assertClose(diameterFromArea(area), 0.02);
  assertClose(calculatePipeArea(0.1), (Math.PI * 0.01) / 4);
}

{
  const deltaP = psiToPascal(35.3);
  const v = calculateIdealVelocity(deltaP, 1000);
  assertClose(v, Math.sqrt((2 * deltaP) / 1000));
  const a = calculatePipeArea(0.02);
  const q = calculateIdealFlowM3S(deltaP, a, 1000, 1);
  assertClose(q, a * v);
  assertClose(m3sToUsGpm(q), (q * 60) / 0.003785411784);
}

{
  const r = calculatePsiToGpm(DEFAULT_PSI_TO_GPM_INPUT);
  assertClose(r.diameterM, 0.02);
  assertClose(r.areaM2, calculatePipeArea(0.02));
  assert.ok(r.flowUsGpm > 100 && r.flowUsGpm < 120);
  assertClose(r.deltaPPa, psiToPascal(50) - PASCALS_PER_ATM);
}

{
  const ok = validatePsiToGpm(DEFAULT_PSI_TO_GPM_INPUT);
  assert.equal(ok.isValid, true);

  const blank = validatePsiToGpm({
    ...DEFAULT_PSI_TO_GPM_INPUT,
    inletPsi: null,
    diameterM: null,
  });
  assert.equal(blank.isValid, false);

  const negDelta = validatePsiToGpm({
    ...DEFAULT_PSI_TO_GPM_INPUT,
    inletPsi: 10,
    outletPsi: 20,
  });
  assert.equal(negDelta.isValid, false);
  assert.ok(negDelta.errors.deltaP);

  const zeroD = validatePsiToGpm({
    ...DEFAULT_PSI_TO_GPM_INPUT,
    diameterM: 0,
  });
  assert.equal(zeroD.isValid, false);
}

{
  const zeroDelta = calculatePsiToGpm({
    ...DEFAULT_PSI_TO_GPM_INPUT,
    inletPsi: STANDARD_ATM_PSI,
    outletPsi: STANDARD_ATM_PSI,
  });
  assert.equal(zeroDelta.flowUsGpm, 0);
}

console.log('psi-to-gpm calculation.test.ts: ok');
