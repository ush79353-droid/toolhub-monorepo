import type { SupportedCurrency } from '@/tools/shared/currency';

/** Omni-confirmed compounding conventions for fixed-rate mortgages. */
export type CompoundingFrequency =
  | 'yearly'
  | 'semi_annual_canada'
  | 'quarterly'
  | 'monthly_uk_us';

export type TermUnit = 'yrs' | 'mos';

/** Screenshot + ADR-023: Fixed-rate only — do not invent ARM modes. */
export type MortgageType = 'fixed_rate';

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
}[] = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'semi_annual_canada', label: 'Semi-annually (Canada)' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly_uk_us', label: 'Monthly (UK & US)' },
] as const;

export const MORTGAGE_TYPE_OPTIONS: readonly {
  value: MortgageType;
  label: string;
}[] = [{ value: 'fixed_rate', label: 'Fixed-rate' }] as const;

export const TERM_UNIT_OPTIONS: readonly {
  value: TermUnit;
  label: string;
}[] = [
  { value: 'yrs', label: 'yrs' },
  { value: 'mos', label: 'mos' },
] as const;

export interface MortgageRateInput {
  loanBalance: string;
  loanCurrency: SupportedCurrency;
  mortgageTerm: string;
  termUnit: TermUnit;
  mortgageRatePercent: string;
  compounding: CompoundingFrequency;
  mortgageType: MortgageType;
  mortgagePointsPercent: string;
  upfrontFee: string;
  upfrontFeeCurrency: SupportedCurrency;
  annualFee: string;
  annualFeeCurrency: SupportedCurrency;
  /** Independent display currency for monthly payment. */
  paymentCurrency: SupportedCurrency;
  /** Independent display currency for paid interest. */
  interestCurrency: SupportedCurrency;
  /** Independent display currency for total payments. */
  totalCurrency: SupportedCurrency;
}

export interface MortgageRateResult {
  monthlyPaymentInLoan: number;
  monthlyPayment: number;
  formattedMonthlyPayment: string;
  aprPercent: number;
  formattedApr: string;
  paidInterestInLoan: number;
  paidInterest: number;
  formattedPaidInterest: string;
  totalPaymentsInLoan: number;
  totalPayments: number;
  formattedTotalPayments: string;
  pointsCostInLoan: number;
  loanCurrency: SupportedCurrency;
  paymentCurrency: SupportedCurrency;
  interestCurrency: SupportedCurrency;
  totalCurrency: SupportedCurrency;
}

export type MortgageRateFieldErrors = {
  loanBalance?: string;
  mortgageTerm?: string;
  mortgageRatePercent?: string;
  mortgagePointsPercent?: string;
  upfrontFee?: string;
  annualFee?: string;
  form?: string;
};

export function createDefaultInput(): MortgageRateInput {
  return {
    loanBalance: '200000',
    loanCurrency: 'PKR',
    mortgageTerm: '30',
    termUnit: 'yrs',
    mortgageRatePercent: '5',
    compounding: 'monthly_uk_us',
    mortgageType: 'fixed_rate',
    mortgagePointsPercent: '0',
    upfrontFee: '0',
    upfrontFeeCurrency: 'PKR',
    annualFee: '0',
    annualFeeCurrency: 'PKR',
    paymentCurrency: 'PKR',
    interestCurrency: 'PKR',
    totalCurrency: 'PKR',
  };
}
