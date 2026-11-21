/**
 * Run: npx tsx src/tools/calculators/twin-pregnancy-weight-gain/calculation.test.ts
 */
import { calculatePregnancyWeightGain } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const defaults = createDefaultInput();
assert(defaults.twins === true, 'twins default yes');
assert(defaults.week === '40', 'week 40');

const r = calculatePregnancyWeightGain({
  ...defaults,
  height: '165',
  weight: '60',
});
assert(r != null && r.twins === true, 'compute twins');
assert(r!.availability === 'ok', 'term twin ok for normal BMI');
assert(r!.minGainKg === 17 && r!.maxGainKg === 25, 'twin normal band');

const mid = calculatePregnancyWeightGain({
  ...defaults,
  height: '165',
  weight: '60',
  week: '20',
});
assert(
  mid != null && mid.availability === 'twins_midpregnancy_unavailable',
  'mid blocked',
);

const singleton = calculatePregnancyWeightGain({
  ...defaults,
  height: '165',
  weight: '60',
  twins: false,
});
assert(
  singleton != null &&
    singleton.minGainKg === 11.5 &&
    singleton.maxGainKg === 16,
  'singleton band',
);

console.log('twin-pregnancy-weight-gain calculation.test.ts: ok');
