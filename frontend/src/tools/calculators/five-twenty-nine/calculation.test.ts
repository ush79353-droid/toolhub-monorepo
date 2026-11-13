import assert from 'node:assert/strict';
import { calculateFiveTwentyNine } from './calculation';
import { DEFAULT_FIVE_TWENTY_NINE_INPUT, type FiveTwentyNineInput } from './types';
import { validateFiveTwentyNineInput } from './validation';

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${description}`);
  } catch (err) {
    console.error(`  FAIL - ${description}`);
    throw err;
  }
}

function withInput(patch: Partial<FiveTwentyNineInput>): FiveTwentyNineInput {
  return { ...DEFAULT_FIVE_TWENTY_NINE_INPUT, ...patch };
}

function must(input: FiveTwentyNineInput) {
  const result = calculateFiveTwentyNine(input);
  assert.ok(result);
  return result;
}

function close(actual: number, expected: number, epsilon = 1e-6): void {
  assert.ok(Math.abs(actual - expected) < epsilon, `${actual} !== ${expected}`);
}

console.log('Running 529 Calculator tests...');

test('zero savings leaves the full education cost as a gap', () => {
  const result = must(
    withInput({
      currentAge: 18,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1000,
      educationInflationPercent: 0,
      currentBalance: 0,
      initialLumpSum: 0,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
    })
  );
  assert.equal(result.balanceAtCollegeStart, 0);
  assert.equal(result.totalEducationCost, 1000);
  assert.equal(result.coveredByPlan, 0);
  assert.equal(result.fundingGap, 1000);
  assert.equal(result.requiredContributionImpossible, true);
  assert.equal(result.requiredMonthlyContribution, null);
});

test('lump sum with no return covers an equal college bill', () => {
  const result = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1200,
      educationInflationPercent: 0,
      currentBalance: 0,
      initialLumpSum: 1200,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
    })
  );
  assert.equal(result.totalContributions, 1200);
  assert.equal(result.balanceAtCollegeStart, 1200);
  assert.equal(result.coveredByPlan, 1200);
  assert.equal(result.fundingGap, 0);
  assert.equal(result.surplusBalance, 0);
});

test('monthly deposits with zero return equal deposits times months', () => {
  const result = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 0,
      monthlyContribution: 100,
      annualReturnPercent: 0,
      annualFeePercent: 0,
      contributionTiming: 'end',
    })
  );
  assert.equal(result.monthsUntilCollege, 12);
  assert.equal(result.totalContributions, 1200);
  assert.equal(result.balanceAtCollegeStart, 1200);
  assert.equal(result.investmentGrowth, 0);
});

test('nominal monthly compounding matches one percent per month', () => {
  const result = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 1000,
      monthlyContribution: 0,
      annualReturnPercent: 12,
      annualFeePercent: 0,
    })
  );
  close(result.balanceAtCollegeStart, 1000 * 1.01 ** 12);
  close(result.monthlyReturnRate, 0.01);
});

test('zero return does not invent growth, and a negative return shrinks the balance', () => {
  const flat = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 1000,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
    })
  );
  assert.equal(flat.balanceAtCollegeStart, 1000);

  const down = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 1000,
      monthlyContribution: 0,
      annualReturnPercent: -12,
      annualFeePercent: 0,
    })
  );
  close(down.balanceAtCollegeStart, 1000 * 0.99 ** 12);
  assert.ok(down.investmentGrowth < 0);
});

test('education inflation raises the first college year', () => {
  const result = must(
    withInput({
      currentAge: 16,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1000,
      educationInflationPercent: 10,
      currentBalance: 0,
      monthlyContribution: 0,
      annualReturnPercent: 0,
    })
  );
  close(result.firstYearCost, 1210);
  close(result.totalEducationCost, 1210);
});

test('four college years stack inflation from the first future year', () => {
  const result = must(
    withInput({
      currentAge: 18,
      collegeStartAge: 18,
      collegeYears: 4,
      currentAnnualCost: 1000,
      educationInflationPercent: 10,
      currentBalance: 0,
      monthlyContribution: 0,
      annualReturnPercent: 0,
    })
  );
  close(result.totalEducationCost, 1000 + 1100 + 1210 + 1331);
  assert.equal(result.rows.filter((row) => row.phase === 'college').length, 4);
});

test('scholarship reduces the bill once and is not withdrawn again', () => {
  const result = must(
    withInput({
      currentAge: 18,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1000,
      educationInflationPercent: 0,
      annualScholarship: 400,
      currentBalance: 0,
      monthlyContribution: 0,
      annualReturnPercent: 0,
    })
  );
  close(result.totalScholarships, 400);
  close(result.netEducationCost, 600);
  assert.equal(result.coveredByPlan, 0);
  close(result.fundingGap, 600);
  close(result.percentFunded ?? -1, 40);
});

test('a full scholarship leaves no gap and no plan withdrawal', () => {
  const result = must(
    withInput({
      currentAge: 18,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1000,
      educationInflationPercent: 0,
      annualScholarship: 5000,
      currentBalance: 100,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
    })
  );
  close(result.totalScholarships, 1000);
  assert.equal(result.coveredByPlan, 0);
  assert.equal(result.fundingGap, 0);
  assert.equal(result.surplusBalance, 100);
});

test('funding gap and surplus follow what the plan can actually pay', () => {
  const short = must(
    withInput({
      currentAge: 18,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1000,
      educationInflationPercent: 0,
      currentBalance: 250,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
      collegePaymentTiming: 'start',
    })
  );
  assert.equal(short.coveredByPlan, 250);
  assert.equal(short.fundingGap, 750);
  assert.equal(short.surplusBalance, 0);

  const extra = must(
    withInput({
      currentAge: 18,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1000,
      educationInflationPercent: 0,
      currentBalance: 1500,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
    })
  );
  assert.equal(extra.coveredByPlan, 1000);
  assert.equal(extra.fundingGap, 0);
  assert.equal(extra.surplusBalance, 500);
});

test('required monthly contribution solves a zero-return savings year', () => {
  const result = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1200,
      educationInflationPercent: 0,
      currentBalance: 0,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
      targetFundingPercent: 100,
      contributionTiming: 'end',
    })
  );
  assert.ok(result.requiredMonthlyContribution !== null);
  close(result.requiredMonthlyContribution, 100, 0.01);
});

test('a 50 percent target needs half the zero-return deposits', () => {
  const result = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 1200,
      educationInflationPercent: 0,
      currentBalance: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
      targetFundingPercent: 50,
      contributionTiming: 'end',
    })
  );
  assert.ok(result.requiredMonthlyContribution !== null);
  close(result.requiredMonthlyContribution, 50, 0.01);
});

test('paying at the end of the college year can use that year of growth', () => {
  const shared = {
    currentAge: 18,
    collegeStartAge: 18,
    collegeYears: 1,
    currentAnnualCost: 1010,
    educationInflationPercent: 0,
    currentBalance: 1000,
    monthlyContribution: 0,
    annualReturnPercent: 12,
    annualFeePercent: 0,
  } satisfies Partial<FiveTwentyNineInput>;
  const start = must(withInput({ ...shared, collegePaymentTiming: 'start' }));
  const end = must(withInput({ ...shared, collegePaymentTiming: 'end' }));
  assert.equal(start.coveredByPlan, 1000);
  close(start.fundingGap, 10);
  close(end.coveredByPlan, 1010);
  assert.equal(end.fundingGap, 0);
  assert.ok(end.surplusBalance > 0);
});

test('fees reduce the balance and beginning deposits earn one extra month', () => {
  const fee = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 1000,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 6,
    })
  );
  close(fee.balanceAtCollegeStart, 1000 * 0.995 ** 12);
  assert.ok(fee.investmentFees > 0);

  const begin = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 0,
      monthlyContribution: 100,
      annualReturnPercent: 12,
      annualFeePercent: 0,
      contributionTiming: 'beginning',
    })
  );
  const end = must(
    withInput({
      currentAge: 17,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 0,
      monthlyContribution: 100,
      annualReturnPercent: 12,
      annualFeePercent: 0,
      contributionTiming: 'end',
    })
  );
  assert.ok(begin.balanceAtCollegeStart > end.balanceAtCollegeStart);
});

test('contribution growth and extra annual deposits are included once per year', () => {
  const grown = must(
    withInput({
      currentAge: 16,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 0,
      monthlyContribution: 100,
      annualReturnPercent: 0,
      annualFeePercent: 0,
      annualContributionGrowthPercent: 100,
    })
  );
  assert.equal(grown.totalContributions, 3600);
  assert.equal(grown.balanceAtCollegeStart, 3600);

  const annual = must(
    withInput({
      currentAge: 16,
      collegeStartAge: 18,
      collegeYears: 1,
      currentAnnualCost: 0,
      currentBalance: 0,
      monthlyContribution: 0,
      annualReturnPercent: 0,
      annualFeePercent: 0,
      additionalAnnualContribution: 1000,
    })
  );
  assert.equal(annual.totalContributions, 2000);
  assert.equal(annual.balanceAtCollegeStart, 2000);
});

test('savings rows reconcile to the balance at college start', () => {
  const input = withInput({
    currentAge: 16,
    collegeStartAge: 18,
    collegeYears: 2,
    currentAnnualCost: 5000,
    educationInflationPercent: 4,
    annualScholarship: 500,
    currentBalance: 2000,
    initialLumpSum: 300,
    monthlyContribution: 80,
    annualReturnPercent: 6,
    annualFeePercent: 0.5,
    annualContributionGrowthPercent: 5,
    additionalAnnualContribution: 100,
    contributionTiming: 'beginning',
    collegePaymentTiming: 'end',
  });
  const result = must(input);
  const saving = result.rows.filter((row) => row.phase === 'saving');
  const growth = saving.reduce((sum, row) => sum + row.growth, 0);
  const fees = saving.reduce((sum, row) => sum + row.fees, 0);
  const contributions = saving.reduce((sum, row) => sum + row.contributions, 0);
  close(
    input.currentBalance + input.initialLumpSum + contributions + growth - fees,
    result.balanceAtCollegeStart,
    1e-6
  );
  assert.ok(Number.isFinite(result.fundingGap));
  assert.notEqual(result.balanceAtCollegeStart, result.coveredByPlan + result.surplusBalance);
});

test('invalid ages, empty numbers, and a bad currency are rejected', () => {
  const ages = validateFiveTwentyNineInput(withInput({ currentAge: 20, collegeStartAge: 18 }));
  assert.equal(ages.isValid, false);
  assert.ok(ages.errors.collegeStartAge);

  const fractional = validateFiveTwentyNineInput(withInput({ currentAge: 8.5 }));
  assert.equal(fractional.isValid, false);

  const nan = validateFiveTwentyNineInput(withInput({ monthlyContribution: Number.NaN }));
  assert.equal(nan.isValid, false);
  assert.equal(calculateFiveTwentyNine(withInput({ currentAnnualCost: -1 })), null);

  const currency = validateFiveTwentyNineInput(
    withInput({ currency: 'BTC' as FiveTwentyNineInput['currency'] })
  );
  assert.equal(currency.isValid, false);
});

test('large balances and fractional inflation stay finite', () => {
  const result = must(
    withInput({
      currentBalance: 1_000_000_000,
      currentAnnualCost: 12345.67,
      educationInflationPercent: 5.5,
      annualReturnPercent: 6.25,
      annualFeePercent: 0.15,
      monthlyContribution: 10.5,
    })
  );
  assert.equal(Number.isFinite(result.balanceAtCollegeStart), true);
  assert.equal(Number.isFinite(result.totalEducationCost), true);
  assert.ok(result.totalEducationCost > 0);
  assert.equal(result.contributionExceedsAlert, false);
});

test('a user-entered contribution alert is not treated as an IRS limit', () => {
  const result = must(withInput({ monthlyContribution: 100, annualContributionAlert: 1000, initialLumpSum: 0 }));
  assert.equal(result.contributionExceedsAlert, true);
});

console.log('All 529 Calculator tests passed.');
