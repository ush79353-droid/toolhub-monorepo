/**
 * Duke Treadmill Score — assert-based engine check.
 * Run: npx tsx src/tools/calculators/duke-treadmill-score/calculation.test.ts
 */
import {
  anginaIndexPoints,
  dukeTreadmillScore,
  calculateDukeTreadmillScore,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDukeTreadmillScoreInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(anginaIndexPoints('none') === 0, 'angina 0');
assert(anginaIndexPoints('nonLimiting') === 1, 'angina 1');
assert(anginaIndexPoints('limiting') === 2, 'angina 2');

// Prompt: 10 min, 1 mm → 5 / 1 / −3
assert(dukeTreadmillScore(10, 1, 'none') === 5, '10-5-0=5');
assert(dukeTreadmillScore(10, 1, 'nonLimiting') === 1, '10-5-4=1');
assert(dukeTreadmillScore(10, 1, 'limiting') === -3, '10-5-8=-3');

// Fractional minutes preserved
assert(dukeTreadmillScore(10.5, 1, 'none') === 5.5, 'fractional minutes');

// Blank until both numerics
{
  const v = validateDukeTreadmillScoreInput(createDefaultInput());
  assert(v.result != null && v.result.score == null, 'blank score');
}
{
  const v = validateDukeTreadmillScoreInput({
    ...createDefaultInput(),
    durationMinutesText: '10',
  });
  assert(v.result!.score == null, 'needs ST');
}
{
  const r = calculateDukeTreadmillScore({
    durationMinutesText: '10',
    stDeviationMmText: '1',
    angina: 'none',
  });
  assert(r.score === 5, 'complete yes path');
}

console.log('duke-treadmill-score calculation.test.ts: ok');
