import type { SupportedCurrency } from '@/tools/shared/currency';

export type PeriodUnit = 'years' | 'months';
export type ContributionFrequency = 'none' | 'monthly' | 'quarterly' | 'annually';
export type RoiSourceField = 'rate' | 'returned';
export type AnnualizedFindMode = 'annualized' | 'time-needed';

export interface RoiInput {
  periodValue: string;
  periodUnit: PeriodUnit;
  initialInvestment: string;
  contributionFrequency: ContributionFrequency;
  contributionAmount: string;
  rateOfReturnPercent: string;
  returnedAmount: string;
  sourceField: RoiSourceField;
  showTotalGain: boolean;
  annualizedMode: AnnualizedFindMode;
  startDate: string;
  endDate: string;
  compareEnabled: boolean;
  currency: SupportedCurrency;
}

export interface RoiResult {
  totalInvestment: number;
  totalContributions: number;
  totalGainLoss: number;
  roiPercent: number;
  returnedAmount: number;
  rateOfReturnPercent: number;
  years: number;
  annualizedRoiPercent: number | null;
  annualizedYears: number | null;
  currency: SupportedCurrency;
  formattedTotalInvestment: string;
  formattedTotalGainLoss: string;
  formattedReturnedAmount: string;
  formattedRoiPercent: string;
  formattedRateOfReturnPercent: string;
  formattedAnnualizedRoiPercent: string;
}

export type RoiFieldErrors = {
  periodValue?: string;
  initialInvestment?: string;
  contributionAmount?: string;
  rateOfReturnPercent?: string;
  returnedAmount?: string;
  startDate?: string;
  endDate?: string;
  form?: string;
};

export const CONTRIBUTION_FREQUENCY_OPTIONS: readonly {
  value: ContributionFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'none', label: 'None', periodsPerYear: 0 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
];

export function createDefaultInput(): RoiInput {
  return {
    periodValue: '5',
    periodUnit: 'years',
    initialInvestment: '10000',
    contributionFrequency: 'none',
    contributionAmount: '',
    rateOfReturnPercent: '',
    returnedAmount: '15000',
    sourceField: 'returned',
    showTotalGain: false,
    annualizedMode: 'annualized',
    startDate: '2026-11-15',
    endDate: '2031-11-15',
    compareEnabled: false,
    currency: 'PKR',
  };
}
