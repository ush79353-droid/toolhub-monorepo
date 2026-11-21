import type { SupportedCurrency } from '@/tools/shared/currency';

export interface DreamComeTrueInput {
  dreamPrice: string;
  initialSavings: string;
  monthlySavings: string;
  annualInterestRate: string;
  currency: SupportedCurrency;
}

export interface DreamSavingsBreakdown {
  month: number;
  initialSavingsGrowth: number;
  monthlyContributions: number;
  /** Interest so chart series sum to total: total − initialGrowth − contrib principal. */
  interestEarned: number;
  totalSavings: number;
}

export type DreamGoalStatus = 'incomplete' | 'achieved' | 'reachable' | 'unreachable';

export interface DreamComeTrueResult {
  monthlyInterestRate: number;
  timeRequiredMonths: number;
  yearsRequired: number;
  remainingMonths: number;
  timeLabel: string;
  totalInitialSavings: number;
  totalMonthlyContributions: number;
  totalInterestEarned: number;
  finalSavingsBalance: number;
  dreamPrice: number;
  savingsProgressPercentage: number;
  goalAlreadyAchieved: boolean;
  goalReachable: boolean;
  status: DreamGoalStatus;
  statusMessage: string;
  explanation: string;
  breakdown: DreamSavingsBreakdown[];
  currency: SupportedCurrency;
}

export type DreamComeTrueFieldErrors = Partial<
  Record<
    | 'dreamPrice'
    | 'initialSavings'
    | 'monthlySavings'
    | 'annualInterestRate'
    | 'form',
    string
  >
>;

export const DREAM_MAX_MONTHS = 1200; // 100 years

export function createDefaultInput(): DreamComeTrueInput {
  return {
    dreamPrice: '',
    initialSavings: '0',
    monthlySavings: '',
    annualInterestRate: '4',
    currency: 'USD',
  };
}

export function createExampleInput(): DreamComeTrueInput {
  return {
    dreamPrice: '30000',
    initialSavings: '5000',
    monthlySavings: '500',
    annualInterestRate: '4',
    currency: 'USD',
  };
}
