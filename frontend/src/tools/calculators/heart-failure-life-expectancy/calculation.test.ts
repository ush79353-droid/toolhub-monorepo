/**
 * MAGGIC engine — assert-based check.
 * Run: npx tsx src/tools/calculators/heart-failure-life-expectancy/calculation.test.ts
 */
import {
  computeMaggicScore,
  computeBmiKgM2,
  efInteractionColumn,
  lookupTable4Mortality,
  mortalityToSurvivalPercent,
  pointsForEf,
  calculateHeartFailureLifeExpectancy,
  pointsForAgeByEf,
  pointsForCreatinineUmolL,
  type MaggicClinicalInput,
} from './calculation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const baselineLowRisk: MaggicClinicalInput = {
  sex: 'female',
  ageYears: 50,
  efPercent: 55,
  nyhaClass: 'I',
  creatinineUmolL: 80,
  bmiKgM2: 30,
  systolicMmHg: 150,
  diabetes: false,
  betaBlockerPrescribed: true,
  aceiArbPrescribed: true,
  hfDurationGt18Months: false,
  currentSmoker: false,
  copd: false,
};

// Published Magent / paper worked example → score 0
assert(computeMaggicScore(baselineLowRisk) === 0, 'Magent low-risk score 0');
{
  const r = calculateHeartFailureLifeExpectancy(baselineLowRisk);
  assert(r.maggicScore === 0, 'score 0');
  assert(r.mortality1Year === 0.015, 'Table4 1y mort 0');
  assert(r.mortality3Year === 0.039, 'Table4 3y mort 0');
  assert(r.survival1YearPercent === 98.5, 'survival 1y');
  assert(r.survival3YearPercent === 96.1, 'survival 3y');
}

// Table 4 score 23 → 0.134 / 0.316 mortality (paper example band)
{
  const t = lookupTable4Mortality(23)!;
  assert(t.mortality1Year === 0.134, 'score 23 one-year mort');
  assert(t.mortality3Year === 0.316, 'score 23 three-year mort');
  assert(
    mortalityToSurvivalPercent(t.mortality1Year) === 86.6,
    'survival from mort',
  );
}

// Medication direction: not prescribed beta-blocker +3, not ACE-I/ARB +1
{
  const withMeds = computeMaggicScore(baselineLowRisk);
  const noBeta = computeMaggicScore({
    ...baselineLowRisk,
    betaBlockerPrescribed: false,
  });
  assert(noBeta - withMeds === 3, 'beta-blocker penalty 3');
  const noAce = computeMaggicScore({
    ...baselineLowRisk,
    aceiArbPrescribed: false,
  });
  assert(noAce - withMeds === 1, 'ACE-I/ARB penalty 1');
}

// HF duration >18 months +2
{
  const longHf = computeMaggicScore({
    ...baselineLowRisk,
    hfDurationGt18Months: true,
  });
  assert(longHf - computeMaggicScore(baselineLowRisk) === 2, 'HF duration +2');
}

// EF boundaries for base EF points and interaction column
assert(pointsForEf(39.9) === 2, 'EF 39.9 → 2');
assert(pointsForEf(40) === 0, 'EF 40 → 0');
assert(efInteractionColumn(39.9) === 1, 'EF col 30-39');
assert(efInteractionColumn(40) === 2, 'EF col ≥40');
assert(pointsForAgeByEf(65, 25) === 4, 'age 65 EF<30 column');
assert(pointsForAgeByEf(65, 42) === 7, 'age 65 EF≥40 column');

// Creatinine 90 µmol/L → band 90–109 → 1 point
assert(pointsForCreatinineUmolL(90) === 1, 'creatinine 90 → 1');

// Male +1
assert(
  computeMaggicScore({ ...baselineLowRisk, sex: 'male' }) === 1,
  'male +1',
);

// BMI derivation
assert(computeBmiKgM2(1.75, 70) != null && Math.abs(computeBmiKgM2(1.75, 70)! - 22.86) < 0.1, 'bmi');

// Score >50 → no table mortality
{
  const high: MaggicClinicalInput = {
    sex: 'male',
    ageYears: 85,
    efPercent: 18,
    nyhaClass: 'IV',
    creatinineUmolL: 260,
    bmiKgM2: 18,
    systolicMmHg: 95,
    diabetes: true,
    betaBlockerPrescribed: false,
    aceiArbPrescribed: false,
    hfDurationGt18Months: true,
    currentSmoker: true,
    copd: true,
  };
  const s = computeMaggicScore(high);
  assert(s > 50, 'high risk exceeds 50');
  const r = calculateHeartFailureLifeExpectancy(high);
  assert(r.mortality1Year == null && r.survival1YearPercent == null, 'no table');
}

console.log('heart-failure-life-expectancy calculation.test ok');