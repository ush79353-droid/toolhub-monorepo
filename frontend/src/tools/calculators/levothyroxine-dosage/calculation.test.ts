/**
 * Run: npx tsx src/tools/calculators/levothyroxine-dosage/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateLevothyroxineDosage,
  educationalFullReplacementMcg,
} from './calculation';
import { createDefaultInput } from './types';

function run() {
  const blank = calculateLevothyroxineDosage(createDefaultInput());
  assert.equal(blank.outcome, 'awaiting_inputs');
  assert.equal(blank.doseMcgPerDay, null);

  const normalFt4 = calculateLevothyroxineDosage({
    ...createDefaultInput(),
    weightText: '70',
    ft4: 'normal',
  });
  assert.equal(normalFt4.outcome, 'cannot_determine');
  assert.equal(normalFt4.doseMcgPerDay, null);

  const gated = calculateLevothyroxineDosage({
    ...createDefaultInput(),
    weightText: '70',
    ft4: 'low',
    heartDisease: 'no',
    ageBand: '15_50',
  });
  assert.equal(gated.outcome, 'clinician_review_required');
  assert.equal(gated.doseMcgPerDay, null);
  assert.match(gated.statusDetail, /112/); // 1.6*70 educational context only

  const cardiac = calculateLevothyroxineDosage({
    ...createDefaultInput(),
    weightText: '70',
    heartDisease: 'yes',
  });
  assert.equal(cardiac.outcome, 'clinician_review_required');
  assert.equal(cardiac.doseMcgPerDay, null);

  assert.equal(educationalFullReplacementMcg(70), 112);

  console.log('levothyroxine-dosage calculation.test.ts: ok');
}

run();
