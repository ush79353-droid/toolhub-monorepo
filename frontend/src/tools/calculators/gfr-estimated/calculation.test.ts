/**
 * Run: cd frontend && npx tsx src/tools/calculators/gfr-estimated/calculation.test.ts
 */
import {
  categorizeEgfr,
  ckdEpi2009Creatinine,
  ckdEpi2012Cystatin,
  ckdEpi2021Creatinine,
  ckdEpi2021CreatinineCystatin,
  calculateGfrEstimated,
  creatinineToMgDl,
  mdrd175,
  roundEgfr,
} from './calculation';
import { createDefaultInput } from './types';
import { validateGfrEstimatedInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearly(actual: number, expected: number, tol = 0.15): void {
  assert(
    Math.abs(actual - expected) <= tol,
    `expected ~${expected}, got ${actual}`,
  );
}

{
  // Female 55y, Scr 0.9 mg/dL, non-Black — CKD-EPI 2009 vs 2021 differ; both finite.
  const a2009 = ckdEpi2009Creatinine(55, 'female', 'other', 0.9);
  const a2021 = ckdEpi2021Creatinine(55, 'female', 0.9);
  assert(a2009 > 0 && a2021 > 0, 'positive egfr');
  nearly(a2009, 72.0, 1.5);
  nearly(a2021, 77.0, 2.0);
}

{
  // Black coefficient increases 2009 / MDRD; 2021 unchanged by ethnicity.
  const nonBlack = ckdEpi2009Creatinine(40, 'male', 'other', 1.2);
  const black = ckdEpi2009Creatinine(40, 'male', 'black', 1.2);
  assert(black > nonBlack, '2009 black coefficient');
  nearly(black / nonBlack, 1.159, 0.001);

  const mOther = mdrd175(40, 'male', 'other', 1.2);
  const mBlack = mdrd175(40, 'male', 'black', 1.2);
  nearly(mBlack / mOther, 1.212, 0.001);

  assert(
    Math.abs(
      ckdEpi2021Creatinine(40, 'male', 1.2) -
        ckdEpi2021Creatinine(40, 'male', 1.2),
    ) < 1e-12,
    '2021 race-free identity',
  );
}

{
  // Cystatin-only fixture: female 50y, Scys 1.0 mg/L
  // 133 × (1/0.8)^−1.328 × 0.996^50 × 0.932
  const cys = ckdEpi2012Cystatin(50, 'female', 1.0);
  assert(cys > 0, 'cystatin positive');
  nearly(cys, 75.43, 0.2);
}

{
  // Combined 2021: male 60y Scr 1.1 Scys 1.0 — finite and below creatinine-only 2021
  const both = ckdEpi2021CreatinineCystatin(60, 'male', 1.1, 1.0);
  const crOnly = ckdEpi2021Creatinine(60, 'male', 1.1);
  assert(both > 0 && both < 150, 'combined positive bounded');
  assert(Math.abs(both - crOnly) > 0.01, 'combined differs from cr-only');
}

{
  // µmol/L conversion
  assert(
    Math.abs(creatinineToMgDl(88.4, 'umol_l') - 1) < 1e-9,
    'umol convert',
  );
}

{
  assert(categorizeEgfr(90) === 'normal', '90');
  assert(categorizeEgfr(89.9) === 'mild', '89.9');
  assert(categorizeEgfr(60) === 'mild', '60');
  assert(categorizeEgfr(59.9) === 'mild_moderate', '59.9');
  assert(categorizeEgfr(45) === 'mild_moderate', '45');
  assert(categorizeEgfr(44.9) === 'moderate_severe', '44.9');
  assert(categorizeEgfr(30) === 'moderate_severe', '30');
  assert(categorizeEgfr(29.9) === 'severe', '29.9');
  assert(categorizeEgfr(15) === 'severe', '15');
  assert(categorizeEgfr(14.9) === 'failure', '14.9');
}

{
  const blank = validateGfrEstimatedInput(createDefaultInput());
  assert(blank.result != null && blank.result.equations.length === 0, 'blank');
}

{
  const r = calculateGfrEstimated({
    ...createDefaultInput(),
    ageYearsText: '50',
    creatinineText: '1.0',
    ethnicity: 'other',
    sex: 'female',
  });
  assert(r.equations.length === 3, 'creatinine mode rows');
  assert(r.equations[0].id === 'ckd-epi-2021-cr', '2021 primary');
  assert(r.equations[1].id === 'ckd-epi-2009-cr', '2009');
  assert(r.equations[2].id === 'mdrd-175', 'mdrd');
  assert(r.equations[0].usesRaceCoefficient === false, '2021 no race');
  assert(r.equations[1].usesRaceCoefficient === true, '2009 race');
  assert(r.band != null, 'banded');
  assert(roundEgfr(r.equations[0].valueMlMin173!) > 0, 'rounded');
}

{
  const r = calculateGfrEstimated({
    ...createDefaultInput(),
    markerMode: 'cystatin',
    ageYearsText: '45',
    cystatinText: '0.9',
  });
  assert(r.equations.length === 1, 'cystatin only');
  assert(r.equations[0].usesRaceCoefficient === false, 'no race cystatin');
}

{
  const r = calculateGfrEstimated({
    ...createDefaultInput(),
    markerMode: 'both',
    ageYearsText: '50',
    creatinineText: '1.0',
    cystatinText: '1.0',
    ethnicity: 'black',
  });
  assert(r.equations.length === 4, 'both mode');
  assert(r.equations[0].id === 'ckd-epi-2021-cr-cys', '2021 combined primary');
}

{
  const young = calculateGfrEstimated({
    ...createDefaultInput(),
    ageYearsText: '17',
    creatinineText: '1.0',
  });
  assert(young.equations.length === 0, 'pediatric blocked');
}

console.log('gfr-estimated calculation.test.ts: ok');
