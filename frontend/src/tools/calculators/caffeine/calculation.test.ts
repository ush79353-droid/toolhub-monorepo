import { calculateCaffeine, drinkMg, maxRecommendedMg } from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateCaffeineInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(drinkMg('filterCoffeeMug', 1) === 140, 'filter coffee');
assert(drinkMg('teaCup', 2) === 100, 'tea');
assert(drinkMg('colaCan', 0.5) === 20, 'fractional cola');

const ex = calculateCaffeine(createExampleInput());
assert(ex.totalMg === 280, `example ${ex.totalMg}`);
assert(ex.maxRecommendedMg === 400, 'adult max');
assert(!ex.overLimit, 'under limit');

assert(maxRecommendedMg('pregnant') === 200, 'pregnant');
assert(maxRecommendedMg('teenager') === 100, 'teen');
assert(maxRecommendedMg('child') === 0, 'child');

const switched = calculateCaffeine({
  ...createExampleInput(),
  population: 'teenager',
});
assert(switched.overLimit, '280 > 100');

const blank = validateCaffeineInput(createDefaultInput());
assert(blank.result?.totalMg === 0, 'blank first count → 0');

const neg = validateCaffeineInput({ ...createDefaultInput(), count2: -1 });
assert(neg.result === null, 'reject negative');

console.log('caffeine calculation.test.ts: ok');
