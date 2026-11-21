/**
 * Assert self-check for US Income Percentile Calculator.
 * Run: npx tsx src/tools/calculators/us-income-percentile/calculation.test.ts
 */
import {
  calculateIncomePercentile,
  formatUsd,
  interpolatePercentile,
  roundPercentile,
  shareIncomePercentileText,
} from './calculation';
import {
  INDIVIDUAL_WITH_INCOME_THOUSANDS,
  datasetFor,
} from './datasets';
import {
  createDefaultInput,
  hasIncomePercentileChanges,
} from './types';
import { validateUsIncomePercentileInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const defaults = createDefaultInput();
assert(defaults.incomeType === 'individual', 'default individual');
assert(defaults.annualIncome === '0', 'default income 0');

const zero = validateUsIncomePercentileInput(defaults);
assert(zero.isValid && zero.result?.rangeStatus === 'zero', 'zero handled');
assert(zero.result?.percentile === null, 'zero has no percentile');
assert(zero.result?.referenceYear === 2024, 'year shown');
assert(zero.result?.medianIncome === 46440, 'individual median');
assert(zero.result?.meanIncome === 69360, 'individual mean');

const household = datasetFor('household');
assert(household.medianIncome === 83730, 'household median');
assert(household.meanIncome === 121000, 'household mean');
assert(household.brackets[0]?.percentile === 10, 'starts at 10th');
assert(household.brackets.at(-1)?.percentile === 95, 'stops at 95th');

assert(
  interpolatePercentile(83730, household.brackets) === 50,
  'median threshold is 50',
);
const between =
  60 + ((120000 - 105500) / (135000 - 105500)) * 10;
const household120 = calculateIncomePercentile({
  incomeType: 'household',
  annualIncome: 120000,
});
assert(household120?.rangeStatus === 'inside', '120k inside');
assert(
  household120?.percentile === roundPercentile(between),
  `120k percentile ${household120?.percentile} vs ${roundPercentile(between)}`,
);
assert(
  household120?.percentageAbove ===
    roundPercentile(100 - (household120?.percentile ?? 0)),
  'above is complement',
);

const below = calculateIncomePercentile({
  incomeType: 'household',
  annualIncome: 10000,
});
assert(below?.rangeStatus === 'below' && below.percentile === null, 'below 10th');

const above = calculateIncomePercentile({
  incomeType: 'household',
  annualIncome: 1000000,
});
assert(above?.rangeStatus === 'above' && above.percentile === 95, 'above 95th floor');

const individual = datasetFor('individual');
const independent = individual.brackets.map((bracket) => bracket);
assert(independent.length === 40, '40 person-income bins');
assert(independent[0]?.income === 2499, 'first upper bound');
assert(
  Math.abs(
    (independent.at(-1)?.percentile ?? 0) -
      ((INDIVIDUAL_WITH_INCOME_THOUSANDS - 42940) / INDIVIDUAL_WITH_INCOME_THOUSANDS) *
        100,
  ) < 0.05,
  'top closed bin matches counts',
);
const at75 = calculateIncomePercentile({
  incomeType: 'individual',
  annualIncome: 75000,
});
const expected75 = interpolatePercentile(75000, individual.brackets);
assert(at75?.rangeStatus === 'inside', '75k inside person bins');
assert(
  at75?.percentile === roundPercentile(expected75 ?? -1),
  '75k matches independent interpolation',
);

const openTop = calculateIncomePercentile({
  incomeType: 'individual',
  annualIncome: 100000,
});
assert(openTop?.rangeStatus === 'above', '100k is open interval');

const negative = validateUsIncomePercentileInput({
  ...defaults,
  annualIncome: '-5',
});
assert(
  !negative.isValid && Boolean(negative.errors.annualIncome),
  'negative rejected'
);

const switched = validateUsIncomePercentileInput({
  incomeType: 'household',
  annualIncome: '83730',
});
assert(switched.result?.percentile === 50, 'household median hit');
assert(switched.result?.medianIncome === 83730, 'switched median');

assert(formatUsd(75000).includes('75,000'), 'usd format');
const share = shareIncomePercentileText(household120!);
assert(share.includes('2024') && share.includes('household'), 'share text');
assert(hasIncomePercentileChanges({ incomeType: 'household', annualIncome: '1' }), 'dirty');
assert(!hasIncomePercentileChanges(defaults), 'clean default');

console.log('us-income-percentile calculation.test.ts: all asserts passed');
