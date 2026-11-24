import assert from 'node:assert/strict';
import {
  AGE_POINTS,
  buildBreakdown,
  calculateTimiStemiScore,
  mortality30DayPercent,
  sumBreakdown,
} from './calculation';
import {
  createDefaultInput,
  createExampleInput,
  type TimiStemiInput,
} from './types';
import { validateTimiStemiInput } from './validation';

function allFactors(ageBand: TimiStemiInput['ageBand']): TimiStemiInput {
  return {
    ageBand,
    diabetesHypertensionOrAngina: true,
    heartRateOver100: true,
    sbpUnder100: true,
    timeToTreatmentOver4h: true,
    weightUnder67kg: true,
    killipClassIiToIv: 'yes',
    anteriorStElevationOrLbbb: 'yes',
  };
}

// Defaults: age unset → no result
{
  const v = validateTimiStemiInput(createDefaultInput());
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Example: age <65 alone → 0 · 0.8%
{
  const r = calculateTimiStemiScore(createExampleInput());
  assert.equal(r.totalScore, 0);
  assert.equal(r.mortality30DayPercent, 0.8);
  assert.equal(r.formattedMortality, '0.8%');
}

// Age points: 65–74 → 2; ≥75 → 3
{
  assert.equal(AGE_POINTS.under65, 0);
  assert.equal(AGE_POINTS.age65to74, 2);
  assert.equal(AGE_POINTS.age75plus, 3);
  const mid = calculateTimiStemiScore({
    ...createDefaultInput(),
    ageBand: 'age65to74',
  });
  assert.equal(mid.totalScore, 2);
  assert.equal(mid.mortality30DayPercent, 2.2);
  const old = calculateTimiStemiScore({
    ...createDefaultInput(),
    ageBand: 'age75plus',
  });
  assert.equal(old.totalScore, 3);
  assert.equal(old.mortality30DayPercent, 4.4);
}

// Individual factor weights (exact published cutoffs as boolean flags)
{
  const base = { ...createDefaultInput(), ageBand: 'under65' as const };
  assert.equal(
    calculateTimiStemiScore({ ...base, diabetesHypertensionOrAngina: true })
      .totalScore,
    1,
  );
  assert.equal(
    calculateTimiStemiScore({ ...base, heartRateOver100: true }).totalScore,
    2,
  );
  assert.equal(
    calculateTimiStemiScore({ ...base, sbpUnder100: true }).totalScore,
    3,
  );
  assert.equal(
    calculateTimiStemiScore({ ...base, timeToTreatmentOver4h: true })
      .totalScore,
    1,
  );
  assert.equal(
    calculateTimiStemiScore({ ...base, weightUnder67kg: true }).totalScore,
    1,
  );
  assert.equal(
    calculateTimiStemiScore({ ...base, killipClassIiToIv: 'yes' }).totalScore,
    2,
  );
  assert.equal(
    calculateTimiStemiScore({ ...base, anteriorStElevationOrLbbb: 'yes' })
      .totalScore,
    1,
  );
}

// Extremes: min 0, max 14
{
  const min = calculateTimiStemiScore({
    ...createDefaultInput(),
    ageBand: 'under65',
  });
  assert.equal(min.totalScore, 0);
  assert.equal(mortality30DayPercent(0), 0.8);

  const max = calculateTimiStemiScore(allFactors('age75plus'));
  assert.equal(max.totalScore, 14);
  assert.equal(max.breakdown.agePoints, 3);
  assert.equal(max.mortality30DayPercent, 35.9);
  assert.equal(sumBreakdown(buildBreakdown(allFactors('age75plus'))), 14);
}

// Mortality bands at boundaries 8 vs >8
{
  assert.equal(mortality30DayPercent(8), 26.8);
  assert.equal(mortality30DayPercent(9), 35.9);
  assert.equal(mortality30DayPercent(14), 35.9);
}

// Validate wires result when age set
{
  const v = validateTimiStemiInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result?.totalScore, 0);
}

console.log('timi-stemi calculation.test.ts: ok');
