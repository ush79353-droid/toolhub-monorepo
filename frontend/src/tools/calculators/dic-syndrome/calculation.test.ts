/**
 * Run: npx tsx calculation.test.ts
 */
import { calculateDicSyndrome, computeIsthDicScore, OVERT_DIC_THRESHOLD } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateDicSyndrome(createDefaultInput());
  assert(r.score === 0, 'screenshot defaults score 0');
  assert(!r.meetsOvertThreshold, 'score 0 not overt');
}

{
  const score = computeIsthDicScore({
    platelets: 'lt50',
    fibrinMarkers: 'strong_increase',
    ptProlongation: 'gt6',
    fibrinogen: 'lt1',
  });
  assert(score === 2 + 3 + 2 + 1, 'max component sum 8');
}

{
  const r = calculateDicSyndrome({
    platelets: '50to100',
    fibrinMarkers: 'moderate_increase',
    ptProlongation: '3to6',
    fibrinogen: 'lt1',
  });
  assert(r.score === 5, '1+2+1+1 = 5 overt');
  assert(r.meetsOvertThreshold, 'meets threshold at 5');
  assert(r.score >= OVERT_DIC_THRESHOLD, 'threshold constant');
}

console.log('dic-syndrome calculation.test.ts: ok');