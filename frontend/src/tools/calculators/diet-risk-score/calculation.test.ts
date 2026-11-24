/**
 * Run: npx tsx calculation.test.ts
 */
import {
  calculateDietRiskScore,
  maximumDrsTotal,
  minimumDrsTotal,
  scoreForItem,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDietRiskScoreInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateDietRiskScore(createDefaultInput());
  assert(!r.complete, 'all null incomplete');
  assert(r.totalScore === null, 'no score when incomplete');
}

{
  const input = {
    fast_food: 'never' as const,
    breads: 'never' as const,
    snacks: 'never' as const,
    processed_meats: 'never' as const,
    sweet_drinks: 'never' as const,
    nuts: 'daily' as const,
    fish: 'daily' as const,
    vegetables: 'daily' as const,
    fruit: 'daily' as const,
  };
  const r = calculateDietRiskScore(input);
  assert(r.totalScore === minimumDrsTotal(), 'published min profile');
  assert(r.riskBand === 'low', 'min is low risk');
}

{
  const input = {
    fast_food: 'daily' as const,
    breads: 'daily' as const,
    snacks: 'daily' as const,
    processed_meats: 'daily' as const,
    sweet_drinks: 'daily' as const,
    nuts: 'never' as const,
    fish: 'never' as const,
    vegetables: 'never' as const,
    fruit: 'never' as const,
  };
  const r = calculateDietRiskScore(input);
  assert(r.totalScore === maximumDrsTotal(), 'published max profile');
  assert(r.riskBand === 'high', 'max is high risk');
}

assert(scoreForItem('vegetables', 'daily') === 0, 'daily veg 0 risk pts');
assert(scoreForItem('fruit', 'never') === 3, 'never fruit 3 risk pts');
assert(scoreForItem('processed_meats', 'once_week') === 3, 'processed meat any freq except never = 3');

{
  const v = validateDietRiskScoreInput({
    ...createDefaultInput(),
    fast_food: 'daily',
  });
  assert(v.errors.form, 'one answered still incomplete');
}

console.log('diet-risk-score calculation.test.ts: ok');