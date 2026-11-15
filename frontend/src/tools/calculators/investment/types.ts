import type { SupportedCurrency } from '@/tools/shared/currency';

/** Screenshot default mode only — do not invent extra solve targets. */
export type InvestmentGoal = 'final-balance';

export type CompoundFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export type ContributionFrequency =
  | 'never'
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export type ContributionTiming = 'beginning' | 'end';

export const INVESTMENT_GOAL_OPTIONS: readonly {
  value: InvestmentGoal;
  label: string;
}[] = [{ value: 'final-balance', label: 'Final balance' }] as const;

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
] as const;

export const CONTRIBUTION_FREQUENCY_OPTIONS: readonly {
  value: ContributionFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'never', label: 'Never', periodsPerYear: 0 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
] as const;

export interface InvestmentInput {
  goal: InvestmentGoal;
  initialInvestment: string;
  rateOfReturn: string;
  termYears: string;
  compounding: CompoundFrequency;
  inflationRate: string;
  contributionFrequency: ContributionFrequency;
  contributionAmount: string;
  contributionTiming: ContributionTiming;
  currency: SupportedCurrency;
}

export interface AnnualBalancePoint {
  year: number;
  principal: number;
  interest: number;
  totalBalance: number;
}

export interface InvestmentResult {
  finalBalance: number;
  totalContributions: number;
  investmentReturn: number;
  inflationAdjustedBalance: number | null;
  inflationRatePercent: number;
  years: number;
  annualPoints: AnnualBalancePoint[];
  currency: SupportedCurrency;
  formattedFinalBalance: string;
  formattedReturn: string;
  formattedInflationAdjusted: string | null;
}

export type InvestmentFieldErrors = Partial<
  Record<
    | 'initialInvestment'
    | 'rateOfReturn'
    | 'termYears'
    | 'inflationRate'
    | 'contributionAmount'
    | 'form',
    string
  >
>;

export function createDefaultInput(): InvestmentInput {
  return {
    goal: 'final-balance',
    initialInvestment: '10000',
    rateOfReturn: '5',
    termYears: '10',
    compounding: 'monthly',
    inflationRate: '0',
    contributionFrequency: 'never',
    contributionAmount: '',
    contributionTiming: 'end',
    currency: 'PKR',
  };
}
