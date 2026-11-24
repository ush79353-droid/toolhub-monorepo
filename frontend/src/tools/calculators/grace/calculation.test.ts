import assert from 'node:assert/strict';
import {
  agePoints,
  calculateGraceScore,
  creatininePointsMgDl,
  creatinineToMgDl,
  heartRatePoints,
  riskCategoryFromTotal,
  systolicBpPoints,
  sumBreakdown,
  buildBreakdown,
} from './calculation';
import {
  createDefaultInput,
  createExampleInput,
  CREATININE_UMOL_PER_MG_DL,
} from './types';
import { validateGraceInput } from './validation';

// Defaults: all unset → no result
{
  const v = validateGraceInput(createDefaultInput());
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Age band boundaries (Granger 2003)
{
  assert.equal(agePoints(29), 0);
  assert.equal(agePoints(30), 8);
  assert.equal(agePoints(39), 8);
  assert.equal(agePoints(40), 25);
  assert.equal(agePoints(69), 58);
  assert.equal(agePoints(70), 75);
  assert.equal(agePoints(89), 91);
  assert.equal(agePoints(90), 100);
}

// Heart rate boundaries
{
  assert.equal(heartRatePoints(49), 0);
  assert.equal(heartRatePoints(50), 3);
  assert.equal(heartRatePoints(89), 9);
  assert.equal(heartRatePoints(90), 15);
  assert.equal(heartRatePoints(109), 15);
  assert.equal(heartRatePoints(110), 24);
  assert.equal(heartRatePoints(199), 38);
  assert.equal(heartRatePoints(200), 46);
}

// Systolic BP boundaries
{
  assert.equal(systolicBpPoints(79), 58);
  assert.equal(systolicBpPoints(80), 53);
  assert.equal(systolicBpPoints(99), 53);
  assert.equal(systolicBpPoints(100), 43);
  assert.equal(systolicBpPoints(119), 43);
  assert.equal(systolicBpPoints(120), 34);
  assert.equal(systolicBpPoints(199), 10);
  assert.equal(systolicBpPoints(200), 0);
}

// Creatinine mg/dL tiers (< thresholds)
{
  assert.equal(creatininePointsMgDl(0), 1);
  assert.equal(creatininePointsMgDl(0.39), 1);
  assert.equal(creatininePointsMgDl(0.4), 4);
  assert.equal(creatininePointsMgDl(0.79), 4);
  assert.equal(creatininePointsMgDl(0.8), 7);
  assert.equal(creatininePointsMgDl(1.19), 7);
  assert.equal(creatininePointsMgDl(1.2), 10);
  assert.equal(creatininePointsMgDl(1.59), 10);
  assert.equal(creatininePointsMgDl(1.6), 13);
  assert.equal(creatininePointsMgDl(3.99), 21);
  assert.equal(creatininePointsMgDl(4.0), 28);
}

// µmol/L → mg/dL (÷ 88.4) then score
{
  const mg = creatinineToMgDl(88.4, 'µmol/L');
  assert.equal(mg, 1);
  assert.equal(creatininePointsMgDl(mg!), 7);
  const umol115 = 1.3 * CREATININE_UMOL_PER_MG_DL;
  const mgFromUmol = creatinineToMgDl(umol115, 'µmol/L');
  assert.ok(mgFromUmol != null && Math.abs(mgFromUmol - 1.3) < 1e-9);
  assert.equal(creatininePointsMgDl(mgFromUmol!), 10);
}

// Binary points
{
  const b = buildBreakdown(40, 60, 120, 1.0, 'I', true, true, true);
  assert.equal(b.cardiacArrestPoints, 39);
  assert.equal(b.stDeviationPoints, 28);
  assert.equal(b.elevatedEnzymesPoints, 14);
  assert.equal(b.killipPoints, 0);
}

// Risk category boundaries
{
  assert.equal(riskCategoryFromTotal(108), 'low');
  assert.equal(riskCategoryFromTotal(109), 'intermediate');
  assert.equal(riskCategoryFromTotal(140), 'intermediate');
  assert.equal(riskCategoryFromTotal(141), 'high');
}

// Incomplete: Killip unset
{
  const partial = {
    ...createDefaultInput(),
    ageYears: '50',
    heartRateBpm: '70',
    systolicBpMmHg: '120',
    creatinineValue: '1.0',
    cardiacArrestAtAdmission: 'no' as const,
    stSegmentDeviation: 'no' as const,
    elevatedCardiacEnzymes: 'no' as const,
  };
  const v = validateGraceInput(partial);
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Incomplete: cardiac arrest unset (must not score as no)
{
  const partial = {
    ...createDefaultInput(),
    ageYears: '50',
    heartRateBpm: '70',
    systolicBpMmHg: '120',
    creatinineValue: '1.0',
    killipClass: 'I' as const,
    stSegmentDeviation: 'no' as const,
    elevatedCardiacEnzymes: 'no' as const,
  };
  const v = validateGraceInput(partial);
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Worked example: age 68, HR 95, SBP 110, Cr 1.3 mg/dL, Killip II,
// no arrest, ST yes, enzymes yes → 188 high risk
{
  const v = validateGraceInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result?.totalScore, 188);
  assert.equal(v.result?.riskCategory, 'high');
  assert.equal(
    sumBreakdown(v.result!.breakdown),
    58 + 15 + 43 + 10 + 20 + 0 + 28 + 14,
  );
  const direct = calculateGraceScore(68, 95, 110, 1.3, 'II', false, true, true);
  assert.equal(direct.totalScore, 188);
}

console.log('grace calculation.test.ts: ok');