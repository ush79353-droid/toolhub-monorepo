import assert from 'node:assert/strict';
import {
  calculateBreastCancerRecurrenceRisk,
  computeRecurrenceScore,
  formatRiskPercent,
  riskPercentForScore,
  SCORE_TO_RISK_PERCENT,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBreastCancerRecurrenceInput } from './validation';

// Incomplete defaults → no result
assert.equal(calculateBreastCancerRecurrenceRisk(createDefaultInput()), null);
assert.equal(validateBreastCancerRecurrenceInput(createDefaultInput()).incomplete, true);

// Minima: I + neg + none → 16 → 8.5%
{
  const r = calculateBreastCancerRecurrenceRisk({
    grade: 'I',
    lymphNodes: 'negative',
    lvi: 'none',
  });
  assert.ok(r);
  assert.equal(r.score, 16);
  assert.equal(r.riskPercent, 8.5);
  assert.equal(r.formattedRiskPercent, '8.5%');
  assert.match(r.riskSentence, /8\.5%/);
}

// Maxima: III + pos + present → 38 → 48%
{
  const r = calculateBreastCancerRecurrenceRisk({
    grade: 'III',
    lymphNodes: 'positive',
    lvi: 'present',
  });
  assert.ok(r);
  assert.equal(r.score, 38);
  assert.equal(r.riskPercent, 48);
  assert.equal(formatRiskPercent(48), '48%');
}

// Omni-cited: II + pos + present → 32 → 33%
assert.equal(computeRecurrenceScore('II', 'positive', 'present'), 32);
assert.equal(riskPercentForScore(32), 33);

// Non-monotonic published cell: I + pos + present → 26 → 10%
assert.equal(computeRecurrenceScore('I', 'positive', 'present'), 26);
assert.equal(riskPercentForScore(26), 10);

// All eight attainable scores map
const combos: Array<['I' | 'II' | 'III', 'negative' | 'positive', 'none' | 'present']> = [
  ['I', 'negative', 'none'],
  ['I', 'negative', 'present'],
  ['I', 'positive', 'none'],
  ['I', 'positive', 'present'],
  ['II', 'negative', 'none'],
  ['II', 'negative', 'present'],
  ['II', 'positive', 'none'],
  ['II', 'positive', 'present'],
  ['III', 'negative', 'none'],
  ['III', 'negative', 'present'],
  ['III', 'positive', 'none'],
  ['III', 'positive', 'present'],
];
for (const [grade, lymphNodes, lvi] of combos) {
  const score = computeRecurrenceScore(grade, lymphNodes, lvi);
  assert.ok(score in SCORE_TO_RISK_PERCENT, `missing map for ${score}`);
  const r = calculateBreastCancerRecurrenceRisk({ grade, lymphNodes, lvi });
  assert.ok(r);
  assert.equal(r.score, score);
}

// Unsupported score
assert.equal(riskPercentForScore(999), null);

console.log('breast-cancer-recurrence-risk calculation.test.ts: ok');
