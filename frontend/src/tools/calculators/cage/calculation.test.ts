/**
 * Run: cd frontend && npx tsx src/tools/calculators/cage/calculation.test.ts
 */
import { bandForScore, calculateCage, computeCageScore } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateCage(createDefaultInput());
  assert(r.score === 0, 'default 0');
  assert(r.screenBand === 'low', 'default low');
  assert(/probably do not have an alcohol problem/i.test(r.statusDetail), 'copy');
}

{
  assert(computeCageScore({
    cutDown: true,
    annoyed: false,
    guilty: false,
    eyeOpener: false,
  }) === 1, 'one yes');
  assert(bandForScore(1) === 'low', '1 low');
  assert(bandForScore(2) === 'positive', '2 positive');
}

{
  const r = calculateCage({
    cutDown: true,
    annoyed: true,
    guilty: false,
    eyeOpener: false,
  });
  assert(r.score === 2, 'score 2');
  assert(r.screenBand === 'positive', 'positive');
}

{
  const r = calculateCage({
    cutDown: true,
    annoyed: true,
    guilty: true,
    eyeOpener: true,
  });
  assert(r.score === 4, 'max');
}

console.log('cage calculation.test.ts: ok');
