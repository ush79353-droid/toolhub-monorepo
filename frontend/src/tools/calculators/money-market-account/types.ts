import type { SupportedCurrency } from '@/tools/shared/currency';

export type InvestmentMode = 'sip' | 'one-time';

export type ContributionFrequency =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export interface MoneyMarketAccountInput {
  mode: InvestmentMode;
  startingBalance: string;
  recurringInvestment: string;
  contributionFrequency: ContributionFrequency;
  annualReturnPercent: string;
  years: string;
  months: string;
  currency: SupportedCurrency;
}

export interface MoneyMarketAccountResult {
  totalDeposit: number;
  totalInterest: number;
  futureValue: number;
  periods: number;
  periodRate: number;
  currency: SupportedCurrency;
  formattedTotalDeposit: string;
  formattedTotalInterest: string;
  formattedFutureValue: string;
}

export type MoneyMarketAccountFieldErrors = {
  startingBalance?: string;
  recurringInvestment?: string;
  annualReturnPercent?: string;
  years?: string;
  months?: string;
  form?: string;
};

export const CONTRIBUTION_FREQUENCY_OPTIONS: readonly {
  value: ContributionFrequency;
  label: string;
  shortLabel: string;
  periodsPerYear: number;
}[] = [
  { value: 'weekly', label: 'Weekly', shortLabel: 'wk', periodsPerYear: 52 },
  { value: 'biweekly', label: 'Biweekly', shortLabel: '2wk', periodsPerYear: 26 },
  { value: 'monthly', label: 'Monthly', shortLabel: 'mo', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', shortLabel: 'qtr', periodsPerYear: 4 },
  {
    value: 'semiannually',
    label: 'Semiannually',
    shortLabel: '6mo',
    periodsPerYear: 2,
  },
  { value: 'annually', label: 'Annually', shortLabel: 'yr', periodsPerYear: 1 },
];

export function createDefaultInput(): MoneyMarketAccountInput {
  return {
    mode: 'sip',
    startingBalance: '10000',
    recurringInvestment: '1000',
    contributionFrequency: 'monthly',
    annualReturnPercent: '6',
    years: '1',
    months: '0',
    currency: 'PKR',
  };
}
