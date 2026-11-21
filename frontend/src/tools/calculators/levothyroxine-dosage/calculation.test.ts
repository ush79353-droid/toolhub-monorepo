/**
 * Run: npx tsx src/tools/calculators/levothyroxine-dosage/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateLevothyroxineDosage,
  devineIdealBodyWeightKg,
  dosingWeightKg,
  educationalFullReplacementMcg,
  heightToInches,
} from './calculation';
import { createDefaultInput } from './types';

function run() {
  const blank = calculateLevothyroxineDosage(createDefaultInput());
  assert.equal(blank.outcome, 'awaiting_inputs');
  assert.equal(blank.doseMcgPerDay, null);

  const weightOnly = calculateLevothyroxineDosage({
    ...createDefaultInput(),
    weightText: '70',
  });
  assert.equal(weightOnly.outcome, 'awaiting_inputs');

  const normalFt4 = calculateLevothyroxineDosage({
    ...createDefaultInput(),
    weightText: '70',
    heightText: '165',
    ft4: 'normal',
  });
  assert.equal(normalFt4.outcome, 'insufficient_clinical_information');
  assert.equal(normalFt4.doseMcgPerDay, null);

  // Devine female 165 cm ≈ 64.96 in → IBW ≈ 56.9 kg; min(60, IBW)*1.6
  const inches = heightToInches(165, 'cm');
  const ibw = devineIdealBodyWeightKg('female', inches);
  assert.ok(ibw > 56 && ibw < 58);
  const dw = dosingWeightKg(60, ibw);
  assert.equal(dw, ibw);
  const expected = educationalFullReplacementMcg(dw);

  const approved = calculateLevothyroxineDosage({
    ...createDefaultInput(),
    sex: 'female',
    ageBand: '15_50',
    weightText: '60',
    heightText: '165',
    ft4: 'low',
    heartDisease: 'no',
  });
  assert.equal(approved.outcome, 'approved_estimate_available');
  assert.equal(approved.doseMcgPerDay, expected);

  const cardiac = calculateLevothyroxineDosage({
    ...createDefaultInput(),
    weightText: '70',
    heightText: '170',
    heartDisease: 'yes',
  });
  assert.equal(cardiac.outcome, 'clinician_review_required');
  assert.equal(cardiac.doseMcgPerDay, null);

  const short = calculateLevothyroxineDosage({
    ...createDefaultInput(),
    weightText: '50',
    heightText: '140',
  });
  assert.equal(short.outcome, 'unsupported_population');
  assert.equal(short.doseMcgPerDay, null);

  assert.equal(educationalFullReplacementMcg(70), 112);
  assert.equal(devineIdealBodyWeightKg('male', 70), 50 + 2.3 * 10);

  console.log('levothyroxine-dosage calculation.test.ts: ok');
}

run();
