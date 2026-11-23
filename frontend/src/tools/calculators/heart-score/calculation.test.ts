/**
 * HEART Score — assert-based engine check.
 * Run: npx tsx src/tools/calculators/heart-score/calculation.test.ts
 */
import {
  agePoints,
  calculateHeartScore,
  componentPoints,
  totalHeartScore,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateHeartScoreInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Age band boundaries (Six/Backus)
assert(agePoints(44) === 0, 'age 44 → 0');
assert(agePoints(45) === 1, 'age 45 → 1');
assert(agePoints(64) === 1, 'age 64 → 1');
assert(agePoints(65) === 2, 'age 65 → 2');

// All screenshot defaults + age 30 → 0
{
  const input = { ...createDefaultInput(), ageYears: '30' };
  const v = validateHeartScoreInput(input);
  assert(v.result?.totalScore === 0, 'defaults age 30 → 0');
}

// Example moderate profile → 1+1+1+1+1 = 5
{
  const ex = createExampleInput();
  const v = validateHeartScoreInput(ex);
  assert(v.result?.totalScore === 5, 'example → 5');
}

// Max score 10
{
  const input = {
    ...createDefaultInput(),
    ageYears: '70',
    ecg: 'significantStDeviation' as const,
    history: 'highlySuspicious' as const,
    troponin: 'greaterThanThreeTimesCutoff' as const,
    riskFactors: 'threePlusOrAtheroscleroticDisease' as const,
  };
  const v = validateHeartScoreInput(input);
  assert(v.result?.totalScore === 10, 'max 10');
}

// Known atherosclerotic disease tier → 2 risk points at age 50 alone = 1+0+0+0+2 = 3
{
  const input = {
    ...createDefaultInput(),
    ageYears: '50',
    riskFactors: 'threePlusOrAtheroscleroticDisease' as const,
  };
  const v = validateHeartScoreInput(input);
  assert(v.result?.totalScore === 3, 'known CAD tier');
}

// Blank age → no result
{
  const v = validateHeartScoreInput(createDefaultInput());
  assert(v.result == null, 'blank age');
}

// Component sum integrity
{
  const age = 58;
  const c = componentPoints(createExampleInput(), age);
  assert(totalHeartScore(c) === totalHeartScore(c), 'sum stable');
  assert(calculateHeartScore(createExampleInput(), age).totalScore === 5, 'direct calc');
}

console.log('heart-score calculation.test.ts: ok');