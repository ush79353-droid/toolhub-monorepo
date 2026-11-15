import type { SupportedCurrency } from '@/tools/shared/currency';

export const INCOME_FREQUENCIES = ['monthly', 'annual'] as const;
export type IncomeFrequency = (typeof INCOME_FREQUENCIES)[number];

export const STANDARD_PERCENTS = { needs: 70, savings: 20, lifestyle: 10 } as const;

export interface SeventyTwentyTenInput {
  frequency: IncomeFrequency;
  /** After-tax income in the selected frequency. */
  income: number;
  needsSpending: number;
  savingsSpending: number;
  lifestyleSpending: number;
  /** When false, the engine uses 70/20/10 and ignores the percent fields. */
  customPercents: boolean;
  needsPercent: number;
  savingsPercent: number;
  lifestylePercent: number;
  currency: SupportedCurrency;
}

export type BudgetStatus = 'within' | 'exact' | 'over';

export interface BudgetCategory {
  key: 'needs' | 'savings' | 'lifestyle';
  label: string;
  percent: number;
  budget: number;
  spending: number;
  /** Budget minus spending. Negative when spending is over the allocation. */
  remaining: number;
  /** Null when the allocation is zero, so the ratio is not invented. */
  usagePercent: number | null;
  status: BudgetStatus;
  monthlyBudget: number;
  annualBudget: number;
  monthlySpending: number;
  annualSpending: number;
}

export interface SeventyTwentyTenResult {
  defined: boolean;
  explanation: string | null;
  frequency: IncomeFrequency;
  currency: SupportedCurrency;
  customPercents: boolean;
  income: number;
  monthlyIncome: number;
  annualIncome: number;
  categories: BudgetCategory[];
  totalSpending: number;
  /** Income minus total spending. Negative when spending exceeds income. */
  unallocated: number;
  overspending: number;
}

export type SeventyTwentyTenFieldErrors = Record<string, string>;

export function createDefaultSeventyTwentyTenInput(): SeventyTwentyTenInput {
  return {
    frequency: 'monthly',
    income: 100000,
    needsSpending: 0,
    savingsSpending: 0,
    lifestyleSpending: 0,
    customPercents: false,
    needsPercent: STANDARD_PERCENTS.needs,
    savingsPercent: STANDARD_PERCENTS.savings,
    lifestylePercent: STANDARD_PERCENTS.lifestyle,
    currency: 'PKR',
  };
}

export function periodNoun(frequency: IncomeFrequency): 'month' | 'year' {
  return frequency === 'monthly' ? 'month' : 'year';
}
