/**
 * Framingham Risk — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/framingham-risk/calculation.test.ts
 */
import {
  cholesterolToMgDl,
  MMOL_L_TO_MG_DL,
  scoreAgePoints,
  scoreSbpPoints,
  calculateFraminghamRisk,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateFraminghamRiskInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Negative age points for young adults
assert(scoreAgePoints(25, 'male') === -9, 'man 25 → -9');
assert(scoreAgePoints(25, 'female') === -7, 'woman 25 → -7');

// Both sexes — example fixture
{
  const v = validateFraminghamRiskInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assert(v.result!.totalPoints === 7, `man example got ${v.result!.totalPoints}`);
}

{
  const v = validateFraminghamRiskInput({
    ...createExampleInput(),
    sex: 'female',
    ageYears: '50',
    sbpMmHg: '115',
    totalCholesterolValue: '150',
    hdlCholesterolValue: '60',
  });
  assert(v.isValid && v.result != null, 'woman 50 valid');
  // age 6 + TC<160 50-59 0 + HDL≥60 -1 + SBP<120 0 + nonsmoke 0 = 5 pts
  assert(v.result!.totalPoints === 5, `woman 50 got ${v.result!.totalPoints}`);
}

// Treated vs untreated SBP (man 50, SBP 125)
{
  const base = {
    ...createDefaultInput(),
    ageYears: '50',
    sbpMmHg: '125',
    totalCholesterolValue: '150',
    hdlCholesterolValue: '55',
  };
  const untreated = validateFraminghamRiskInput({
    ...base,
    bpTreatment: 'no',
  });
  const treated = validateFraminghamRiskInput({
    ...base,
    bpTreatment: 'yes',
  });
  assert(untreated.result != null && treated.result != null, 'SBP cases');
  assert(
    untreated.result!.breakdown.sbpPoints === 0,
    '125 untreated man → 0 SBP pts'
  );
  assert(
    treated.result!.breakdown.sbpPoints === 1,
    '125 treated man → 1 SBP pt'
  );
  assert(
    scoreSbpPoints(125, 'male', false) === 0 &&
      scoreSbpPoints(125, 'male', true) === 1,
    'direct SBP scoring'
  );
}

// mmol/L path matches mg/dL
{
  const mg = validateFraminghamRiskInput({
    ...createDefaultInput(),
    ageYears: '30',
    sex: 'male',
    sbpMmHg: '110',
    totalCholesterolValue: '180',
    totalCholesterolUnit: 'mg_dl',
    hdlCholesterolValue: '50',
    hdlCholesterolUnit: 'mg_dl',
  });
  // Round-trip mmol entries that stay in the same ATP III bands after × 38.67.
  const mmol = validateFraminghamRiskInput({
    ...createDefaultInput(),
    ageYears: '30',
    sex: 'male',
    sbpMmHg: '110',
    totalCholesterolValue: '4.65',
    totalCholesterolUnit: 'mmol_l',
    hdlCholesterolValue: '1.30',
    hdlCholesterolUnit: 'mmol_l',
  });
  assert(mg.result != null && mmol.result != null, 'mmol valid');
  assert(
    mg.result!.totalPoints === mmol.result!.totalPoints,
  'mmol matches mg/dL points'
  );
  assert(
    Math.abs(cholesterolToMgDl(4.65, 'mmol_l')! - 180) < 0.2,
    'mmol conversion'
  );
}

// Blank → inactive
{
  const v = validateFraminghamRiskInput(createDefaultInput());
  assert(!v.isValid && v.result == null, 'blank inactive');
}

// Direct young man negative total
{
  const r = calculateFraminghamRisk(
    { ...createDefaultInput(), sex: 'male', smoker: 'no', bpTreatment: 'no' },
    22,
    110,
    150,
    55
  );
  assert(r != null, 'young man calc');
  assert(r!.totalPoints === -9, `young man total ${r!.totalPoints}`);
}

console.log('framingham-risk calculation.test.ts: ok');