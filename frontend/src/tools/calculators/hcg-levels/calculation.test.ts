/**
 * Run: npx tsx src/tools/calculators/hcg-levels/calculation.test.ts
 */
import { calculateHcgLevels } from './calculation';
import { validateHcgLevelsInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

const r = calculateHcgLevels(100, 200, 2, 'days')!;
assert(nearly(r.difference, 100), 'diff +100');
assert(nearly(r.percentageChange, 100), '% +100');
assert(r.doublingTimeDays != null && nearly(r.doublingTimeDays, 2), 'DT 2d');
assert(
  r.oneDayIncreasePct != null && nearly(r.oneDayIncreasePct, 41.42),
  '1d +41.42%'
);
assert(
  r.twoDayIncreasePct != null && nearly(r.twoDayIncreasePct, 100),
  '2d +100%'
);

const fall = calculateHcgLevels(200, 100, 2, 'days')!;
assert(fall.trend === 'falling', 'falling');
assert(fall.doublingTimeDays === null, 'no DT when falling');

const blank = validateHcgLevelsInput({
  firstLevel: '',
  secondLevel: '',
  elapsedValue: '',
  elapsedUnit: 'days',
  doublingTimeUnit: 'days',
});
assert(!blank.isValid && blank.result === null, 'blank');

console.log('hcg-levels calculation.test.ts: ok');
