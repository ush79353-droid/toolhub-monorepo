import assert from 'node:assert/strict';
import {
  calculateBudget,
  formatBudgetAmount,
  toAnnual,
  toMonthly,
} from './calculation';
import { validateBudgetInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Frequency helpers
{
  assert.equal(toMonthly(1_200, 'year'), 100);
  assert.equal(toMonthly(100, 'month'), 100);
  assert.equal(toAnnual(100, 'month'), 1_200);
  assert.equal(toAnnual(1_200, 'year'), 1_200);
}

// Default zeros
{
  const out = calculateBudget({
    salary: 0,
    salaryFrequency: 'month',
    taxRatePercent: 0,
    pension: 0,
    pensionFrequency: 'month',
    otherMonthlyIncome: 0,
    otherMonthlyIncomeFrequency: 'month',
    taxRefunds: 0,
    taxRefundsFrequency: 'year',
    otherAnnualIncome: 0,
    otherAnnualIncomeFrequency: 'year',
    savings: [],
    monthlyExpenses: [],
    annualExpenses: [],
    currency: 'PKR',
  });
  assert.ok(out);
  assert.equal(out.monthlyIncome, 0);
  assert.equal(out.monthlyBudgetBalance, 0);
  assert.equal(out.annualBudgetBalance, 0);
}

// Gross salary + tax rate
{
  const out = calculateBudget({
    salary: 100_000,
    salaryFrequency: 'month',
    taxRatePercent: 10,
    pension: 0,
    pensionFrequency: 'month',
    otherMonthlyIncome: 0,
    otherMonthlyIncomeFrequency: 'month',
    taxRefunds: 0,
    taxRefundsFrequency: 'year',
    otherAnnualIncome: 0,
    otherAnnualIncomeFrequency: 'year',
    savings: [{ amount: 5_000, frequency: 'month' }],
    monthlyExpenses: [{ amount: 20_000, frequency: 'month' }],
    annualExpenses: [{ amount: 12_000, frequency: 'year' }],
    currency: 'PKR',
  });
  assert.ok(out);
  // net salary 90k; income 90k; savings 5k; mo exp 20k; annual/12 = 1k
  assert.equal(out.monthlyIncome, 90_000);
  assert.equal(out.monthlySavings, 5_000);
  assert.equal(out.monthlyExpenses, 20_000);
  assert.equal(out.annualExpenses, 12_000);
  assert.equal(out.monthlyBudgetBalance, 90_000 - 5_000 - 20_000 - 1_000);
  assert.equal(out.annualBudgetBalance, out.monthlyBudgetBalance * 12);
}

// Yearly salary + monthly expense mixed frequencies
{
  const out = calculateBudget({
    salary: 1_200_000,
    salaryFrequency: 'year',
    taxRatePercent: 0,
    pension: 24_000,
    pensionFrequency: 'year',
    otherMonthlyIncome: 1_000,
    otherMonthlyIncomeFrequency: 'month',
    taxRefunds: 12_000,
    taxRefundsFrequency: 'year',
    otherAnnualIncome: 0,
    otherAnnualIncomeFrequency: 'year',
    savings: [{ amount: 6_000, frequency: 'year' }],
    monthlyExpenses: [{ amount: 2_000, frequency: 'month' }],
    annualExpenses: [{ amount: 100, frequency: 'month' }], // 1,200 / yr
    currency: 'PKR',
  });
  assert.ok(out);
  // income: 100k + 2k + 1k + 1k = 104k
  assert.equal(out.monthlyIncome, 104_000);
  assert.equal(out.monthlySavings, 500);
  assert.equal(out.monthlyExpenses, 2_000);
  assert.equal(out.annualExpenses, 1_200);
  approxEqual(out.monthlyBudgetBalance, 104_000 - 500 - 2_000 - 100);
}

// Negative balance allowed
{
  const out = calculateBudget({
    salary: 1_000,
    salaryFrequency: 'month',
    taxRatePercent: 0,
    pension: 0,
    pensionFrequency: 'month',
    otherMonthlyIncome: 0,
    otherMonthlyIncomeFrequency: 'month',
    taxRefunds: 0,
    taxRefundsFrequency: 'year',
    otherAnnualIncome: 0,
    otherAnnualIncomeFrequency: 'year',
    savings: [],
    monthlyExpenses: [{ amount: 2_000, frequency: 'month' }],
    annualExpenses: [],
    currency: 'PKR',
  });
  assert.ok(out);
  assert.equal(out.monthlyBudgetBalance, -1_000);
  assert.equal(out.annualBudgetBalance, -12_000);
}

// Rejects
{
  assert.equal(
    calculateBudget({
      salary: -1,
      salaryFrequency: 'month',
      taxRatePercent: 0,
      pension: 0,
      pensionFrequency: 'month',
      otherMonthlyIncome: 0,
      otherMonthlyIncomeFrequency: 'month',
      taxRefunds: 0,
      taxRefundsFrequency: 'year',
      otherAnnualIncome: 0,
      otherAnnualIncomeFrequency: 'year',
      savings: [],
      monthlyExpenses: [],
      annualExpenses: [],
      currency: 'PKR',
    }),
    null
  );
}

// Display
{
  assert.equal(formatBudgetAmount(90000), '90,000.00');
  assert.equal(formatBudgetAmount(-1000.5), '-1,000.50');
}

// Validation defaults (same-currency, no rates needed)
{
  const sameCurrency = validateBudgetInput(createDefaultInput(), null);
  assert.equal(sameCurrency.isValid, true);
  assert.ok(sameCurrency.result);
  assert.equal(sameCurrency.result.monthlyIncome, 0);
}

// Validation: tax on salary only; pension untaxed
{
  const input = createDefaultInput();
  input.salary = { amount: '100000', currency: 'PKR', frequency: 'month' };
  input.taxRate = '10';
  input.pension = { amount: '5000', currency: 'PKR', frequency: 'month' };
  const ok = validateBudgetInput(input, null);
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.monthlyIncome, 95_000); // 90k net + 5k pension
}

console.log('budget calculation.test.ts: all assertions passed');
