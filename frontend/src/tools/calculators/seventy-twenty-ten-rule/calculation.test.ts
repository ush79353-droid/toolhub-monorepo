import assert from 'node:assert/strict';
import { calculateSeventyTwentyTen, percentsSumTo100, withFrequency } from './calculation';
import {
  createDefaultSeventyTwentyTenInput,
  type SeventyTwentyTenInput,
} from './types';
import { validateSeventyTwentyTen } from './validation';

function base(patch: Partial<SeventyTwentyTenInput> = {}): SeventyTwentyTenInput {
  return { ...createDefaultSeventyTwentyTenInput(), ...patch };
}

const standard = calculateSeventyTwentyTen(base());
assert.equal(standard.defined, true);
assert.equal(standard.categories[0]?.budget, 70000);
assert.equal(standard.categories[1]?.budget, 20000);
assert.equal(standard.categories[2]?.budget, 10000);
assert.equal(
  standard.categories.reduce((sum, category) => sum + category.budget, 0),
  standard.income
);
assert.equal(standard.annualIncome, 1200000);
assert.equal(standard.categories[0]?.annualBudget, 840000);
assert.equal(standard.unallocated, 100000);
assert.equal(standard.overspending, 0);

const annual = calculateSeventyTwentyTen(withFrequency(base(), 'annual'));
assert.equal(annual.income, 1200000);
assert.equal(annual.categories[0]?.budget, 840000);
assert.equal(annual.monthlyIncome, 100000);
assert.equal(annual.categories[2]?.monthlyBudget, 10000);

const roundTrip = withFrequency(withFrequency(base({ needsSpending: 40000 }), 'annual'), 'monthly');
assert.equal(roundTrip.income, 100000);
assert.equal(roundTrip.needsSpending, 40000);
assert.equal(roundTrip.frequency, 'monthly');

const compared = calculateSeventyTwentyTen(
  base({ needsSpending: 60000, savingsSpending: 25000, lifestyleSpending: 10000 })
);
assert.equal(compared.categories[0]?.status, 'within');
assert.equal(compared.categories[0]?.remaining, 10000);
assert.equal(compared.categories[1]?.status, 'over');
assert.equal(compared.categories[1]?.remaining, -5000);
assert.equal(compared.categories[2]?.status, 'exact');
assert.equal(compared.categories[2]?.usagePercent, 100);
assert.equal(compared.totalSpending, 95000);
assert.equal(compared.unallocated, 5000);

const overIncome = calculateSeventyTwentyTen(base({ needsSpending: 110000 }));
assert.equal(overIncome.overspending, 10000);
assert.equal(overIncome.categories[0]?.status, 'over');

const zeroIncome = calculateSeventyTwentyTen(base({ income: 0, lifestyleSpending: 25 }));
assert.equal(zeroIncome.defined, true);
assert.equal(zeroIncome.categories[2]?.budget, 0);
assert.equal(zeroIncome.categories[2]?.usagePercent, null);
assert.equal(zeroIncome.overspending, 25);

const zeroSpend = calculateSeventyTwentyTen(base());
assert.equal(zeroSpend.totalSpending, 0);
assert.equal(zeroSpend.categories.every((category) => category.status === 'within'), true);

const custom = calculateSeventyTwentyTen(
  base({ customPercents: true, needsPercent: 50, savingsPercent: 30, lifestylePercent: 20 })
);
assert.equal(custom.categories[0]?.budget, 50000);
assert.equal(custom.categories[1]?.budget, 30000);
assert.equal(custom.categories[2]?.budget, 20000);

const badPercents = validateSeventyTwentyTen(
  base({ customPercents: true, needsPercent: 70, savingsPercent: 20, lifestylePercent: 9 })
);
assert.equal(badPercents.isValid, false);
assert.match(badPercents.errors.percents ?? '', /100%/);

assert.equal(percentsSumTo100(33.33, 33.33, 33.34), true);
assert.equal(percentsSumTo100(33.33, 33.33, 33.33), false);

const pennies = calculateSeventyTwentyTen(base({ income: 100.01, currency: 'USD' }));
assert.equal(pennies.income, 100.01);
assert.equal(
  (pennies.categories[0]?.budget ?? 0) + (pennies.categories[1]?.budget ?? 0) + (pennies.categories[2]?.budget ?? 0),
  100.01
);

const wholeRupees = calculateSeventyTwentyTen(base({ income: 100.01 }));
assert.equal(wholeRupees.income, 100);
assert.equal(
  (wholeRupees.categories[0]?.budget ?? 0) +
    (wholeRupees.categories[1]?.budget ?? 0) +
    (wholeRupees.categories[2]?.budget ?? 0),
  wholeRupees.income
);

const large = calculateSeventyTwentyTen(base({ income: 1_000_000_000 }));
assert.equal(large.categories[0]?.budget, 700_000_000);
assert.equal(large.categories[1]?.budget, 200_000_000);
assert.equal(large.categories[2]?.budget, 100_000_000);

const empty = validateSeventyTwentyTen(base({ income: Number.NaN }));
assert.equal(empty.isValid, false);
assert.match(empty.errors.income ?? '', /Enter/);

const negative = validateSeventyTwentyTen(base({ savingsSpending: -1 }));
assert.equal(negative.isValid, false);

const fresh = createDefaultSeventyTwentyTenInput();
const again = calculateSeventyTwentyTen(fresh);
assert.deepEqual(calculateSeventyTwentyTen(fresh), again);
assert.equal(validateSeventyTwentyTen(fresh).isValid, true);
assert.equal(calculateSeventyTwentyTen(createDefaultSeventyTwentyTenInput()).categories[0]?.budget, 70000);

console.log('70/20/10 calculation.test ok');
