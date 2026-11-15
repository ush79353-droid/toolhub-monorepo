import type { SupportedCurrency } from '@/tools/shared/currency';

export type CalculationMode = 'loan' | 'deposit';

export type CapitalizationFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'continuous';

export type PaymentFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export interface InterestRateInput {
  mode: CalculationMode;
  loanAmount: string;
  termYears: string;
  termMonths: string;
  capitalizationFrequency: CapitalizationFrequency;
  paymentFrequency: PaymentFrequency;
  periodicPayment: string;
  prepaidFees: string;
  loanedFees: string;
  initialDeposit: string;
  currentBalance: string;
  currency: SupportedCurrency;
}

export interface InterestRateResult {
  mode: CalculationMode;
  currency: SupportedCurrency;
  annualNominalPercent: number;
  periodicRatePercent: number | null;
  earPercent: number;
  aprPercent: number | null;
  totalPayments: number | null;
  totalInterest: number | null;
  additionalFees: number | null;
  adjustedPeriodicPayment: number | null;
  formattedAnnualNominal: string;
  formattedPeriodicRate: string | null;
  formattedEar: string;
  formattedApr: string | null;
  formattedTotalPayments: string | null;
  formattedTotalInterest: string | null;
  formattedAdditionalFees: string | null;
  formattedAdjustedPayment: string | null;
}

export type InterestRateFieldErrors = {
  loanAmount?: string;
  termYears?: string;
  termMonths?: string;
  periodicPayment?: string;
  prepaidFees?: string;
  loanedFees?: string;
  initialDeposit?: string;
  currentBalance?: string;
  form?: string;
};

export const CAPITALIZATION_OPTIONS: readonly {
  value: CapitalizationFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semi-annually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52.1775 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365.242 },
  { value: 'continuous', label: 'Continuous', periodsPerYear: 0 },
] as const;

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: PaymentFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semi-annually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Bi-weekly', periodsPerYear: 26.08875 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52.1775 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365.242 },
] as const;

export function createDefaultInput(): InterestRateInput {
  return {
    mode: 'loan',
    loanAmount: '10000',
    termYears: '10',
    termMonths: '0',
    capitalizationFrequency: 'monthly',
    paymentFrequency: 'monthly',
    periodicPayment: '150',
    prepaidFees: '200',
    loanedFees: '300',
    initialDeposit: '2000',
    currentBalance: '10000',
    currency: 'PKR',
  };
}
