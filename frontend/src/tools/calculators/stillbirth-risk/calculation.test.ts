/**
 * Stillbirth Risk (Trudell 2017) — assert-based engine check.
 * Run: npx tsx src/tools/calculators/stillbirth-risk/calculation.test.ts
 */
import {
  COEFFICIENTS,
  INTERCEPT,
  computeLogit,
  deriveBmi,
  interceptOnlyProbabilityPercent,
  logitToProbabilityPercent,
} from './calculation';
import { createEmptyInput } from './types';
import { validateStillbirthRiskInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertClose(actual: number, expected: number, tol = 0.002): void {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tol) {
    throw new Error(`expected ~${expected}, got ${actual}`);
  }
}

const refPredictors = {
  ageYears: 28,
  bmi: 22,
  isBlack: false,
  nulliparous: false,
  smoking: false,
  chronicHypertension: false,
  pregestationalDiabetes: false,
};

// Reference woman — intercept-only logit
{
  const logit = computeLogit(refPredictors);
  assertClose(logit, INTERCEPT);
  const pct = logitToProbabilityPercent(logit);
  assertClose(pct, interceptOnlyProbabilityPercent());
  assertClose(pct, 0.103);
}

// Black + pregestational diabetes transition
{
  const base = logitToProbabilityPercent(computeLogit(refPredictors));
  const blackDiabetes = logitToProbabilityPercent(
    computeLogit({
      ...refPredictors,
      isBlack: true,
      pregestationalDiabetes: true,
    })
  );
  assert(blackDiabetes > base, 'Black + diabetes raises probability');
  const expectedLogit =
    INTERCEPT + COEFFICIENTS.blackRace + COEFFICIENTS.pregestationalDiabetes;
  assertClose(computeLogit({
    ...refPredictors,
    isBlack: true,
    pregestationalDiabetes: true,
  }), expectedLogit);
  assertClose(blackDiabetes, 0.645, 0.01);
}

// Invalid BMI via validation
{
  const v = validateStillbirthRiskInput({
    ...createEmptyInput(),
    ageYears: '30',
    heightCm: '50',
    weightKg: '80',
    previousPregnancies: true,
  });
  assert(!v.isValid && v.result == null, 'implausible BMI rejected');
}

// Missing age
{
  const v = validateStillbirthRiskInput({
    ...createEmptyInput(),
    heightCm: '165',
    weightKg: '60',
    previousPregnancies: true,
  });
  assert(!v.isValid && v.result == null, 'missing age inactive');
}

// BMI derivation spot-check
{
  const bmi = deriveBmi(60, 165);
  assert(bmi != null && Math.abs(bmi - 22.04) < 0.1, 'bmi from cm/kg');
}

// Nulliparous vs multiparous
{
  const multi = computeLogit(refPredictors);
  const nulli = computeLogit({ ...refPredictors, nulliparous: true });
  assert(nulli > multi, 'nulliparity increases logit');
}

console.log('stillbirth-risk calculation ok');