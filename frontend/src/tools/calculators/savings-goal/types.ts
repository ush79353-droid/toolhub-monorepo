import type { SupportedCurrency } from '@/tools/shared/currency';

/** How the savings horizon is specified. */
export type GoalHorizonMode = 'at_age' | 'in_years';

export type CompoundFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'daily';

export type ContributionFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export type ContributionTiming = 'beginning' | 'end';

export const GOAL_HORIZON_OPTIONS: readonly {
  value: GoalHorizonMode;
  label: string;
}[] = [
  { value: 'at_age', label: 'at a certain age' },
  { value: 'in_years', label: 'in a number of years' },
] as const;

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
] as const;

export const CONTRIBUTION_FREQUENCY_OPTIONS: readonly {
  value: ContributionFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
] as const;

export const CONTRIBUTION_TIMING_OPTIONS: readonly {
  value: ContributionTiming;
  label: string;
}[] = [
  { value: 'beginning', label: 'Beginning of period' },
  { value: 'end', label: 'End of period' },
] as const;

export interface SavingsGoalInput {
  goalAmount: string;
  goalCurrency: SupportedCurrency;
  horizonMode: GoalHorizonMode;
  currentAge: string;
  targetAge: string;
  yearsUntilGoal: string;
  startingSavings: string;
  startingCurrency: SupportedCurrency;
  interestRatePercent: string;
  compounding: CompoundFrequency;
  inflationRatePercent: string;
  contributionFrequency: ContributionFrequency;
  contributionTiming: ContributionTiming;
  annualGrowthPercent: string;
  periodicGrowthPercent: string;
  objectivesOpen: boolean;
  conditionsOpen: boolean;
  contributionOpen: boolean;
}

export interface SavingsGoalResult {
  /** Required initial periodic contribution (full precision, goal currency). */
  requiredContribution: number;
  /** Sum of all periodic contributions over the horizon. */
  totalContributions: number;
  /** Investment return = final balance − starting − total contributions. */
  totalReturn: number;
  /** Nominal future target after inflation adjustment. */
  nominalTarget: number;
  /** Future value of starting savings alone. */
  startingFutureValue: number;
  years: number;
  periods: number;
  contributionFrequency: ContributionFrequency;
  contributionFrequencyLabel: string;
  currency: SupportedCurrency;
  formattedRequiredContribution: string;
  formattedTotalContributions: string;
  formattedTotalReturn: string;
  formattedNominalTarget: string;
  alreadyFunded: boolean;
  summary: string;
  breakdown: string;
}

export type SavingsGoalFieldErrors = {
  goalAmount?: string;
  currentAge?: string;
  targetAge?: string;
  yearsUntilGoal?: string;
  startingSavings?: string;
  interestRatePercent?: string;
  compounding?: string;
  inflationRatePercent?: string;
  contributionFrequency?: string;
  contributionTiming?: string;
  annualGrowthPercent?: string;
  periodicGrowthPercent?: string;
  form?: string;
};

export function createDefaultInput(): SavingsGoalInput {
  return {
    goalAmount: '1000000',
    goalCurrency: 'PKR',
    horizonMode: 'at_age',
    currentAge: '32',
    targetAge: '65',
    yearsUntilGoal: '33',
    startingSavings: '0',
    startingCurrency: 'PKR',
    interestRatePercent: '4',
    compounding: 'monthly',
    inflationRatePercent: '0',
    contributionFrequency: 'monthly',
    contributionTiming: 'end',
    annualGrowthPercent: '0',
    periodicGrowthPercent: '0',
    objectivesOpen: true,
    conditionsOpen: true,
    contributionOpen: true,
  };
}
