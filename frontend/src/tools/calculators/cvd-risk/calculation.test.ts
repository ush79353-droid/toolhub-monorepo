import assert from 'node:assert/strict';
import {
  calculateCvdRisk,
  cholToMgDl,
  computeFraminghamCvdRisk,
  MMOL_TO_MGDL,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCvdRiskInput } from './validation';

assert.equal(calculateCvdRisk(createDefaultInput()), null);
assert.equal(validateCvdRiskInput(createDefaultInput()).incomplete, true);

assert.ok(Math.abs(cholToMgDl(1, 'mmol_l') - MMOL_TO_MGDL) < 1e-9);
assert.equal(cholToMgDl(50, 'mg_dl'), 50);

// Representative male case — finite risk in (0,100)
{
  const risk = computeFraminghamCvdRisk({
    sex: 'male',
    ageYears: 55,
    totalCholMgDl: 200,
    hdlMgDl: 45,
    sbpMmHg: 130,
    treatedHypertension: false,
    smoker: false,
    diabetes: false,
  });
  assert.ok(risk > 0 && risk < 100);
}

// Treatment switch increases risk vs untreated same SBP
{
  const base = {
    sex: 'male' as const,
    ageYears: 60,
    totalCholMgDl: 220,
    hdlMgDl: 40,
    sbpMmHg: 140,
    smoker: true,
    diabetes: false,
  };
  const untreated = computeFraminghamCvdRisk({
    ...base,
    treatedHypertension: false,
  });
  const treated = computeFraminghamCvdRisk({
    ...base,
    treatedHypertension: true,
  });
  assert.ok(treated > untreated);
}

// Female path
{
  const r = calculateCvdRisk({
    sex: 'female',
    ageYears: '50',
    hdl: '55',
    hdlUnit: 'mg_dl',
    totalChol: '190',
    totalCholUnit: 'mg_dl',
    sbpMmHg: '120',
    treatedHypertension: false,
    smoker: false,
    diabetes: false,
  });
  assert.ok(r);
  assert.ok(r.riskPercent > 0);
}

// mmol equivalence
{
  const mg = calculateCvdRisk({
    sex: 'male',
    ageYears: '50',
    hdl: '40',
    hdlUnit: 'mg_dl',
    totalChol: '200',
    totalCholUnit: 'mg_dl',
    sbpMmHg: '125',
    treatedHypertension: false,
    smoker: false,
    diabetes: false,
  });
  const mmol = calculateCvdRisk({
    sex: 'male',
    ageYears: '50',
    hdl: String(40 / MMOL_TO_MGDL),
    hdlUnit: 'mmol_l',
    totalChol: String(200 / MMOL_TO_MGDL),
    totalCholUnit: 'mmol_l',
    sbpMmHg: '125',
    treatedHypertension: false,
    smoker: false,
    diabetes: false,
  });
  assert.ok(mg && mmol);
  assert.ok(Math.abs(mg.riskPercent - mmol.riskPercent) < 1e-6);
}

// Age gate
{
  const v = validateCvdRiskInput({
    sex: 'male',
    ageYears: '25',
    hdl: '40',
    hdlUnit: 'mg_dl',
    totalChol: '200',
    totalCholUnit: 'mg_dl',
    sbpMmHg: '120',
    treatedHypertension: false,
    smoker: false,
    diabetes: false,
  });
  assert.ok(v.errors.ageYears);
  assert.equal(v.result, null);
}

console.log('cvd-risk calculation.test.ts: ok');
