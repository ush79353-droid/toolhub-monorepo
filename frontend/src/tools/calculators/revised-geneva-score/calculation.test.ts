/**
 * Revised Geneva — assert-based engine check.
 * Run: npx tsx src/tools/calculators/revised-geneva-score/calculation.test.ts
 */
import {
  calculateRevisedGeneva,
  computeRevisedGenevaScore,
  heartRateBandFromPulse,
  heartRatePoints,
  threeLevelForScore,
  twoLevelForScore,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateRevisedGenevaInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(computeRevisedGenevaScore(createDefaultInput()) === 0, 'defaults 0');
assert(twoLevelForScore(0) === 'unlikely', '0 unlikely');
assert(twoLevelForScore(5) === 'unlikely', '5 unlikely');
assert(twoLevelForScore(6) === 'likely', '6 likely');
assert(threeLevelForScore(0) === 'low', '0 low');
assert(threeLevelForScore(3) === 'low', '3 low');
assert(threeLevelForScore(4) === 'intermediate', '4 int');
assert(threeLevelForScore(10) === 'intermediate', '10 int');
assert(threeLevelForScore(11) === 'high', '11 high');

assert(heartRateBandFromPulse(74) === 'under75', '74');
assert(heartRateBandFromPulse(75) === '75to94', '75');
assert(heartRateBandFromPulse(94) === '75to94', '94');
assert(heartRateBandFromPulse(95) === 'ge95', '95');
assert(heartRatePoints('under75') === 0, 'hr0');
assert(heartRatePoints('75to94') === 3, 'hr3');
assert(heartRatePoints('ge95') === 5, 'hr5');

{
  const r = calculateRevisedGeneva(createDefaultInput());
  assert(r.score === 0, 'score 0');
  assert(r.twoLevel === 'unlikely', '2-level');
  assert(r.threeLevel === 'low', '3-level');
  assert(r.twoLevelDetail.includes('10%'), '10% unlikely');
  assert(r.threeLevelDetail.includes('8–10%'), '8-10% low');
}

{
  const age = { ...createDefaultInput(), ageOver65: true };
  assert(computeRevisedGenevaScore(age) === 1, 'age 1');
}

{
  const surgery = { ...createDefaultInput(), surgeryOrFractureLastMonth: true };
  assert(computeRevisedGenevaScore(surgery) === 2, 'surgery 2');
}

{
  const mal = { ...createDefaultInput(), activeMalignancy: true };
  assert(computeRevisedGenevaScore(mal) === 2, 'malignancy 2');
}

{
  const prior = { ...createDefaultInput(), priorDvtOrPe: 'yes' as const };
  assert(computeRevisedGenevaScore(prior) === 3, 'prior 3');
}

{
  const pain = {
    ...createDefaultInput(),
    unilateralLowerLimbPain: 'yes' as const,
  };
  assert(computeRevisedGenevaScore(pain) === 3, 'limb pain 3');
}

{
  const combined = {
    ...createDefaultInput(),
    deepVenousPainAndUnilateralEdema: 'yes' as const,
  };
  assert(computeRevisedGenevaScore(combined) === 4, 'combined AND 4');
}

{
  const hemo = { ...createDefaultInput(), hemoptysis: 'yes' as const };
  assert(computeRevisedGenevaScore(hemo) === 2, 'hemoptysis 2');
}

{
  const v = validateRevisedGenevaInput(createExampleInput());
  assert(v.isValid && v.result?.score === 8, 'example 1+2+5=8');
  assert(v.result!.twoLevel === 'likely', 'example likely');
  assert(v.result!.threeLevel === 'intermediate', 'example int');
}

{
  const max: ReturnType<typeof createDefaultInput> = {
    ageOver65: true,
    surgeryOrFractureLastMonth: true,
    activeMalignancy: true,
    priorDvtOrPe: 'yes',
    heartRateBand: 'ge95',
    unilateralLowerLimbPain: 'yes',
    deepVenousPainAndUnilateralEdema: 'yes',
    hemoptysis: 'yes',
  };
  // 1+2+2+3+5+3+4+2 = 22
  assert(computeRevisedGenevaScore(max) === 22, 'max 22');
  assert(threeLevelForScore(22) === 'high', 'max high');
}

console.log('revised-geneva-score calculation.test.ts: ok');
