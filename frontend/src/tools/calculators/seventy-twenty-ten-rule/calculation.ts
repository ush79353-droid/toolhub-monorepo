import { getCurrencyFractionDigits } from '@/tools/shared/currency';
import {
  STANDARD_PERCENTS,
  type BudgetCategory,
  type BudgetStatus,
  type IncomeFrequency,
  type SeventyTwentyTenInput,
  type SeventyTwentyTenResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function activePercents(input: SeventyTwentyTenInput): {
  needs: number;
  savings: number;
  lifestyle: number;
} {
  if (!input.customPercents) return { ...STANDARD_PERCENTS };
  return {
    needs: input.needsPercent,
    savings: input.savingsPercent,
    lifestyle: input.lifestylePercent,
  };
}

/** Percent fields are accepted when they are finite, non-negative, and total 100.00. */
export function percentsSumTo100(needs: number, savings: number, lifestyle: number): boolean {
  if (![needs, savings, lifestyle].every(finite)) return false;
  if (needs < 0 || savings < 0 || lifestyle < 0) return false;
  const sum = Math.round((needs + savings + lifestyle) * 100) / 100;
  return sum === 100;
}

function scale(value: number, factor: number): number {
  return finite(value) ? value * factor : value;
}

/**
 * Rewrite entered amounts into another period once.
 * Calling this monthly→annual→monthly returns the original numbers.
 */
export function withFrequency(input: SeventyTwentyTenInput, next: IncomeFrequency): SeventyTwentyTenInput {
  if (input.frequency === next) return input;
  const factor = input.frequency === 'monthly' ? 12 : 1 / 12;
  return {
    ...input,
    frequency: next,
    income: scale(input.income, factor),
    needsSpending: scale(input.needsSpending, factor),
    savingsSpending: scale(input.savingsSpending, factor),
    lifestyleSpending: scale(input.lifestyleSpending, factor),
  };
}

function toPeriod(amount: number, from: IncomeFrequency, to: IncomeFrequency): number {
  if (from === to) return amount;
  return from === 'monthly' ? amount * 12 : amount / 12;
}

function statusFor(budget: number, spending: number): BudgetStatus {
  if (spending > budget) return 'over';
  if (spending === budget) return 'exact';
  return 'within';
}

function category(
  input: SeventyTwentyTenInput,
  key: BudgetCategory['key'],
  label: string,
  percent: number,
  budget: number,
  spending: number
): BudgetCategory {
  return {
    key,
    label,
    percent,
    budget,
    spending,
    remaining: budget - spending,
    usagePercent: budget === 0 ? null : (spending / budget) * 100,
    status: statusFor(budget, spending),
    monthlyBudget: toPeriod(budget, input.frequency, 'monthly'),
    annualBudget: toPeriod(budget, input.frequency, 'annual'),
    monthlySpending: toPeriod(spending, input.frequency, 'monthly'),
    annualSpending: toPeriod(spending, input.frequency, 'annual'),
  };
}

function undefinedResult(input: SeventyTwentyTenInput, explanation: string): SeventyTwentyTenResult {
  return {
    defined: false,
    explanation,
    frequency: input.frequency,
    currency: input.currency,
    customPercents: input.customPercents,
    income: 0,
    monthlyIncome: 0,
    annualIncome: 0,
    categories: [],
    totalSpending: 0,
    unallocated: 0,
    overspending: 0,
  };
}

/**
 * Split income into currency units, then give the lifestyle bucket the leftover unit
 * so the three allocations add back to the rounded income.
 */
function splitIncome(income: number, percents: { needs: number; savings: number }, digits: number): {
  income: number;
  needs: number;
  savings: number;
  lifestyle: number;
} {
  const scaleFactor = 10 ** digits;
  const incomeUnits = Math.round(income * scaleFactor);
  const needsUnits = Math.round((incomeUnits * percents.needs) / 100);
  const savingsUnits = Math.round((incomeUnits * percents.savings) / 100);
  const lifestyleUnits = incomeUnits - needsUnits - savingsUnits;
  const fromUnits = (units: number) => units / scaleFactor;
  return {
    income: fromUnits(incomeUnits),
    needs: fromUnits(needsUnits),
    savings: fromUnits(savingsUnits),
    lifestyle: fromUnits(lifestyleUnits),
  };
}

export function calculateSeventyTwentyTen(input: SeventyTwentyTenInput): SeventyTwentyTenResult {
  const percents = activePercents(input);
  const amounts = [input.income, input.needsSpending, input.savingsSpending, input.lifestyleSpending];
  if (!amounts.every(finite) || !percentsSumTo100(percents.needs, percents.savings, percents.lifestyle)) {
    return undefinedResult(
      input,
      'Enter an after-tax income and percentages that add up to 100 before calculating a budget.'
    );
  }
  if (amounts.some((value) => value < 0) || percents.needs < 0 || percents.savings < 0 || percents.lifestyle < 0) {
    return undefinedResult(input, 'Income, spending, and percentages cannot be negative.');
  }

  const digits = getCurrencyFractionDigits(input.currency);
  const split = splitIncome(input.income, percents, digits);
  const categories = [
    category(input, 'needs', 'Needs', percents.needs, split.needs, input.needsSpending),
    category(input, 'savings', 'Savings and debt', percents.savings, split.savings, input.savingsSpending),
    category(input, 'lifestyle', 'Lifestyle', percents.lifestyle, split.lifestyle, input.lifestyleSpending),
  ];
  const totalSpending = input.needsSpending + input.savingsSpending + input.lifestyleSpending;
  const unallocated = split.income - totalSpending;
  return {
    defined: true,
    explanation: null,
    frequency: input.frequency,
    currency: input.currency,
    customPercents: input.customPercents,
    income: split.income,
    monthlyIncome: toPeriod(split.income, input.frequency, 'monthly'),
    annualIncome: toPeriod(split.income, input.frequency, 'annual'),
    categories,
    totalSpending,
    unallocated,
    overspending: unallocated < 0 ? -unallocated : 0,
  };
}

export function describeResult(result: SeventyTwentyTenResult): string {
  if (!result.defined) return result.explanation ?? '';
  const period = result.frequency === 'monthly' ? 'month' : 'year';
  if (result.overspending > 0) {
    return `Spending is above after-tax income for this ${period}. Savings and debt payments are not the same as day-to-day spending, and this split is a guideline, not a rule every household has to follow.`;
  }
  if (result.unallocated === 0) {
    return `Actual amounts use the whole after-tax income for this ${period}. Savings and debt payments are set aside from ordinary spending. The 70/20/10 split is a guideline, not a requirement.`;
  }
  return `Some after-tax income for this ${period} is not assigned to needs, savings and debt, or lifestyle. Those savings and debt amounts are not ordinary consumption. The split is a guideline, not a requirement.`;
}
