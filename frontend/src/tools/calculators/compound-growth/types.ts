import type { SupportedCurrency } from '@/tools/shared/currency';

/** Shared compound set (Business Loan / APY). */
export type CompoundFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'bi-weekly'
  | 'weekly'
  | 'daily';

export type ContributionFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'bi-weekly'
  | 'weekly';

export type ContributionTiming = 'beginning' | 'end';

export interface CompoundGrowthInput {
  initialDeposit: string;
  interestRate: string;
  termYears: string;
  termMonths: string;
  compoundFrequency: CompoundFrequency;
  contributionFrequency: ContributionFrequency;
  contributionAmount: string;
  contributionTiming: ContributionTiming;
  annualContributionGrowth: string;
  periodicContributionGrowth: string;
  currency: SupportedCurrency;
}

export interface YearSnapshot {
  year: number;
  initialPrincipal: number;
  additionalPrincipal: number;
  growthOnInitial: number;
  growthOnAdditional: number;
  balance: number;
}

export interface CompoundGrowthResult {
  finalBalance: number;
  totalCompoundedGrowth: number;
  totalDeposits: number;
  initialDeposit: number;
  additionalPrincipal: number;
  growthOnInitial: number;
  growthOnAdditional: number;
  finalInitialBalance: number;
  finalAdditionalBalance: number;
  years: YearSnapshot[];
  formattedFinalBalance: string;
  formattedTotalCompoundedGrowth: string;
  formattedInitialPrincipal: string;
  formattedAdditionalPrincipal: string;
  formattedGrowthOnInitial: string;
  formattedGrowthOnAdditional: string;
  formattedFinalInitial: string;
  formattedFinalAdditional: string;
}

export type CompoundGrowthFieldErrors = {
  initialDeposit?: string;
  interestRate?: string;
  termYears?: string;
  termMonths?: string;
  contributionAmount?: string;
  annualContributionGrowth?: string;
  periodicContributionGrowth?: string;
  form?: string;
};

export const COMPOUND_OPTIONS: readonly { value: CompoundFrequency; label: string }[] = [
  { value: 'annually', label: 'Annually (1/Yr)' },
  { value: 'semi-annually', label: 'Semi-annually (2/Yr)' },
  { value: 'quarterly', label: 'Quarterly (4/Yr)' },
  { value: 'monthly', label: 'Monthly (12/Yr)' },
  { value: 'bi-weekly', label: 'Bi-weekly (26/Yr)' },
  { value: 'weekly', label: 'Weekly (52/Yr)' },
  { value: 'daily', label: 'Daily (365/Yr)' },
];

export const CONTRIBUTION_FREQUENCY_OPTIONS: readonly {
  value: ContributionFrequency;
  label: string;
}[] = [
  { value: 'annually', label: 'Annually' },
  { value: 'semi-annually', label: 'Semi-annually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
];

export function createDefaultInput(): CompoundGrowthInput {
  return {
    initialDeposit: '1000',
    interestRate: '8',
    termYears: '20',
    termMonths: '0',
    compoundFrequency: 'monthly',
    contributionFrequency: 'monthly',
    contributionAmount: '50',
    contributionTiming: 'beginning',
    annualContributionGrowth: '0',
    periodicContributionGrowth: '0',
    currency: 'PKR',
  };
}
