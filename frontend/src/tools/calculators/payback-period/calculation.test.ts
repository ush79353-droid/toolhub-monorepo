import {
  formatPaybackPeriod,
  irregularDiscountedPaybackYears,
  irregularPaybackYears,
  steadyDiscountedPaybackYears,
  steadyPaybackYears,
} from './calculation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(steadyPaybackYears(100_000, 25_000) === 4, 'steady 4 years');
assert(steadyDiscountedPaybackYears(100_000, 25_000, 0) === 4, 'discounted r=0');
assert(formatPaybackPeriod(4, 'years') === '4', 'format years');
assert(formatPaybackPeriod(4, 'months') === '48', 'format months');
assert(formatPaybackPeriod(null, 'years') === 'Not recovered', 'not recovered');

assert(steadyPaybackYears(100_000, 0) === null, 'zero cf');
assert(steadyPaybackYears(100_000, -10) === null, 'negative cf');

const irregular = irregularPaybackYears(100_000, [25_000, 25_000, 25_000, 25_000]);
assert(irregular !== null && Math.abs(irregular - 4) < 1e-9, 'irregular equal');

const partial = irregularPaybackYears(100_000, [40_000, 40_000, 40_000]);
assert(partial !== null && Math.abs(partial - 2.5) < 1e-9, 'irregular fractional');

assert(irregularPaybackYears(100_000, [10_000, 10_000, 10_000]) === null, 'shortfall');

const disc = irregularDiscountedPaybackYears(100_000, [25_000, 25_000, 25_000, 25_000, 25_000], 0.1);
assert(disc === null || disc > 4, 'positive discount stretches payback');

console.log('payback-period calculation.test.ts: ok');
