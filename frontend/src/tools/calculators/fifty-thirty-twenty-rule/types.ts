import type { SupportedCurrency } from '@/tools/shared/currency';

export type BudgetView = 'monthly' | 'annual';

export const BUDGET_PERCENTS = {
  necessities: 50,
  wants: 30,
  savings: 20,
} as const;

export interface FiftyThirtyTwentyInput {
  monthlyAfterTaxIncome: string;
  distributionOpen: boolean;
  budgetView: BudgetView;
  currency: SupportedCurrency;
}

export interface BudgetAllocation {
  key: 'necessities' | 'wants' | 'savings';
  label: string;
  percentage: number;
  monthlyAmount: number;
  annualAmount: number;
}

export interface FiftyThirtyTwentyResult {
  monthlyIncome: number;
  annualIncome: number;
  necessities: BudgetAllocation;
  wants: BudgetAllocation;
  savings: BudgetAllocation;
  categories: BudgetAllocation[];
  totalMonthlyAllocated: number;
  totalAnnualAllocated: number;
  monthlyRemainingBalance: number;
  annualRemainingBalance: number;
  currency: SupportedCurrency;
}

export type FiftyThirtyTwentyFieldErrors = Partial<
  Record<'monthlyAfterTaxIncome' | 'form', string>
>;

export function createDefaultInput(): FiftyThirtyTwentyInput {
  return {
    monthlyAfterTaxIncome: '',
    distributionOpen: true,
    budgetView: 'monthly',
    currency: 'USD',
  };
}

export function createExampleInput(): FiftyThirtyTwentyInput {
  return {
    monthlyAfterTaxIncome: '4500',
    distributionOpen: true,
    budgetView: 'monthly',
    currency: 'USD',
  };
}
