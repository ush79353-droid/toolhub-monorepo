/**
 * Wells PE — assert-based engine check.
 * Run: npx tsx src/tools/calculators/wells-pe/calculation.test.ts
 */
import {
  calculateWellsPe,
  computeWellsPeScore,
  heartRateExceeds100,
  threeLevelForScore,
  twoLevelForScore,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateWellsPeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(computeWellsPeScore(createDefaultInput()) === 0, 'defaults 0');
assert(twoLevelForScore(0) === 'unlikely', '0 unlikely');
assert(twoLevelForScore(4) === 'unlikely', '4 unlikely');
assert(twoLevelForScore(4.5) === 'likely', '4.5 likely');
assert(threeLevelForScore(0) === 'low', '0 low');
assert(threeLevelForScore(1.5) === 'low', '1.5 low');
assert(threeLevelForScore(2) === 'intermediate', '2 int');
assert(threeLevelForScore(6) === 'intermediate', '6 int');
assert(threeLevelForScore(6.5) === 'high', '6.5 high');

assert(heartRateExceeds100(100) === false, 'HR 100 does not score');
assert(heartRateExceeds100(101) === true, 'HR 101 scores');
assert(heartRateExceeds100(99) === false, 'HR 99 no');

{
  const r = calculateWellsPe(createDefaultInput());
  assert(r.score === 0, 'score 0');
  assert(r.formattedScore === '0', 'fmt 0');
  assert(r.twoLevel === 'unlikely', '2-level');
  assert(r.threeLevel === 'low', '3-level');
  assert(r.twoLevelDetail.includes('12%'), '12% unlikely');
  assert(r.threeLevelDetail.includes('10%'), '10% low');
}

{
  const dvt = { ...createDefaultInput(), clinicalDvtSigns: true };
  assert(computeWellsPeScore(dvt) === 3, 'DVT 3');
  const r = calculateWellsPe(dvt);
  assert(r.twoLevel === 'unlikely', '3 unlikely');
  assert(r.threeLevel === 'intermediate', '3 int');
}

{
  const hr = { ...createDefaultInput(), heartRateOver100: true };
  assert(computeWellsPeScore(hr) === 1.5, 'HR 1.5');
  assert(threeLevelForScore(1.5) === 'low', '1.5 still low');
}

{
  const imm = { ...createDefaultInput(), immobilizationOrSurgery: true };
  assert(computeWellsPeScore(imm) === 1.5, 'immob 1.5');
}

{
  const prior = { ...createDefaultInput(), priorDvtOrPe: true };
  assert(computeWellsPeScore(prior) === 1.5, 'prior 1.5');
}

{
  const hemo = { ...createDefaultInput(), hemoptysis: true };
  assert(computeWellsPeScore(hemo) === 1, 'hemo 1');
}

{
  const mal = { ...createDefaultInput(), malignancy: true };
  assert(computeWellsPeScore(mal) === 1, 'mal 1');
}

{
  const alt = { ...createDefaultInput(), peAsLikelyOrMore: true };
  assert(computeWellsPeScore(alt) === 3, 'alt 3');
}

{
  // Boundary 4: DVT (3) + hemo (1)
  const s4 = {
    ...createDefaultInput(),
    clinicalDvtSigns: true,
    hemoptysis: true,
  };
  assert(computeWellsPeScore(s4) === 4, 'score 4');
  assert(twoLevelForScore(4) === 'unlikely', '4 ≤4 unlikely');
  assert(threeLevelForScore(4) === 'intermediate', '4 int');
}

{
  // Boundary 4.5: DVT (3) + HR (1.5)
  const s45 = {
    ...createDefaultInput(),
    clinicalDvtSigns: true,
    heartRateOver100: true,
  };
  assert(computeWellsPeScore(s45) === 4.5, 'score 4.5');
  assert(twoLevelForScore(4.5) === 'likely', '4.5 >4 likely');
  assert(threeLevelForScore(4.5) === 'intermediate', '4.5 int');
  assert(calculateWellsPe(s45).formattedScore === '4.5', 'fmt 4.5');
}

{
  // Boundary 6: alt (3) + DVT (3)
  const s6 = {
    ...createDefaultInput(),
    clinicalDvtSigns: true,
    peAsLikelyOrMore: true,
  };
  assert(computeWellsPeScore(s6) === 6, 'score 6');
  assert(twoLevelForScore(6) === 'likely', '6 likely');
  assert(threeLevelForScore(6) === 'intermediate', '6 still int');
}

{
  // Boundary 6.5: alt (3) + DVT (3) + hemo (0.5? no) → alt+DVT+HR = 7.5
  // Use DVT (3) + imm (1.5) + prior (1.5) + hemo (1) = 7 — better: alt(3)+HR(1.5)+imm(1.5)+hemo(1)=7
  // Prompt asks 6.5: DVT(3)+HR(1.5)+imm(1.5)+hemo(0.5 no)
  // 6.5 = DVT(3) + imm(1.5) + prior(1.5) + hemo(0.5) NO
  // 6.5 = alt(3) + HR(1.5) + imm(1.5) + malignancy(0.5) NO
  // 6.5 = DVT(3) + HR(1.5) + prior(1.5) + malignancy(0.5) NO
  // 6.5 = DVT(3) + HR(1.5) + imm(1.5) + malignancy(0.5)? 3+1.5+1.5+1=7
  // 6.5 = alt(3) + DVT(3) + hemo(0.5)? = 6 + need 0.5
  // 6.5 = DVT(3) + HR(1.5) + imm(1.5) + ? = 6, need +0.5 — not possible with published weights alone without hemo making 7
  // Wait: DVT(3) + HR(1.5) + imm(1.5) + malignancy? = 7
  // Actual 6.5: HR(1.5)+imm(1.5)+prior(1.5)+hemo(1)+mal(1) = 6.5 ✓
  const s65 = {
    ...createDefaultInput(),
    heartRateOver100: true,
    immobilizationOrSurgery: true,
    priorDvtOrPe: true,
    hemoptysis: true,
    malignancy: true,
  };
  assert(computeWellsPeScore(s65) === 6.5, 'score 6.5');
  assert(twoLevelForScore(6.5) === 'likely', '6.5 likely');
  assert(threeLevelForScore(6.5) === 'high', '6.5 high');
}

{
  const max = {
    clinicalDvtSigns: true,
    heartRateOver100: true,
    immobilizationOrSurgery: true,
    priorDvtOrPe: true,
    hemoptysis: true,
    malignancy: true,
    peAsLikelyOrMore: true,
  };
  // 3+1.5+1.5+1.5+1+1+3 = 12.5
  assert(computeWellsPeScore(max) === 12.5, 'max 12.5');
  assert(twoLevelForScore(12.5) === 'likely', 'max likely');
  assert(threeLevelForScore(12.5) === 'high', 'max high');
  assert(calculateWellsPe(max).formattedScore === '12.5', 'fmt 12.5');
}

{
  const v = validateWellsPeInput(createExampleInput());
  assert(v.isValid && v.result?.score === 3, 'example 3');
  assert(v.result!.twoLevel === 'unlikely', 'example unlikely');
  assert(v.result!.threeLevel === 'intermediate', 'example int');
}

console.log('wells-pe calculation.test.ts: ok');
