import assert from 'node:assert/strict';
import {
  calculateBmi,
  calculateVteRiskScore,
  obesityPointsFromBmi,
  bandSummaryFor,
} from './calculation';
import { validateVteRiskPregnancyInput } from './validation';
import { createDefaultInput } from './types';

{
  const bmi = calculateBmi(1.7, 90);
  assert.ok(bmi != null && Math.abs(bmi - 31.1418685121) < 1e-9);
  assert.equal(obesityPointsFromBmi(bmi), 1);
  assert.equal(obesityPointsFromBmi(40), 2);
  assert.equal(obesityPointsFromBmi(29.9), 0);
}

{
  const input = createDefaultInput();
  input.preExisting.ageOver35 = true;
  input.preExisting.smoker = true;
  const result = calculateVteRiskScore(input, null);
  assert.equal(result.totalScore, 2);
  assert.ok(result.bandSummary.toLowerCase().includes('below'));
}

{
  const input = createDefaultInput();
  input.preExisting.previousVte = true;
  input.preExisting.previousVteMajorSurgery = true;
  const result = calculateVteRiskScore(input, null);
  assert.equal(result.totalScore, 4);
  assert.equal(result.excludedNotes.length, 1);
}

{
  const input = createDefaultInput();
  input.situation = 'postpartum';
  input.obstetric.artIvf = true;
  input.transient.ohss = true;
  input.preExisting.ageOver35 = true;
  const result = calculateVteRiskScore(input, null);
  assert.equal(result.totalScore, 1);
  assert.equal(result.excludedNotes.length, 2);
  assert.ok(bandSummaryFor('postpartum', 1).toLowerCase().includes('below'));
  assert.ok(bandSummaryFor('postpartum', 2).toLowerCase().includes('≥2'));
}

{
  const input = createDefaultInput();
  input.heightValue = '170';
  input.weightValue = '120';
  const v = validateVteRiskPregnancyInput(input);
  assert.equal(v.isValid, true);
  assert.equal(v.result?.obesityPoints, 2);
  assert.ok((v.result?.totalScore ?? 0) >= 2);
}

{
  const input = createDefaultInput();
  input.heightValue = '0';
  const v = validateVteRiskPregnancyInput(input);
  assert.equal(v.isValid, false);
  assert.ok(v.errors.heightValue);
}

console.log('vte-risk-pregnancy calculation.test.ts: ok');
