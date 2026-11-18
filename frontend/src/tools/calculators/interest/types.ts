export type ContributionTiming = 'beginning' | 'end';

export type CompoundFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'daily', periodsPerYear: 365 },
];

export interface InterestInput {
  initialInvestment: string;
  annualContribution: string;
  monthlyContribution: string;
  contributionTiming: ContributionTiming;
  interestRatePercent: string;
  compounding: CompoundFrequency;
  termYears: string;
  termMonths: string;
  taxRatePercent: string;
  inflationRatePercent: string;
}

export interface InterestResult {
  endingBalance: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInterest: number;
  interestOnInitial: number;
  interestOnContributions: number;
  inflationAdjustedBalance: number;
  initialSharePercent: number;
  contributionsSharePercent: number;
  interestSharePercent: number;
  formattedEndingBalance: string;
  formattedTotalPrincipal: string;
  formattedTotalContributions: string;
  formattedTotalInterest: string;
  formattedInterestOnInitial: string;
  formattedInterestOnContributions: string;
  formattedInflationAdjustedBalance: string;
}

export type InterestFieldErrors = {
  initialInvestment?: string;
  annualContribution?: string;
  monthlyContribution?: string;
  interestRatePercent?: string;
  termYears?: string;
  termMonths?: string;
  taxRatePercent?: string;
  inflationRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): InterestInput {
  return {
    initialInvestment: '20000',
    annualContribution: '5000',
    monthlyContribution: '0',
    contributionTiming: 'beginning',
    interestRatePercent: '5',
    compounding: 'annually',
    termYears: '5',
    termMonths: '0',
    taxRatePercent: '0',
    inflationRatePercent: '3',
  };
}
