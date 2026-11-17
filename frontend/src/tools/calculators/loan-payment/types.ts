import type { SupportedCurrency } from '@/tools/shared/currency';

export type PaymentFrequency =
  | 'yearly'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: PaymentFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'yearly', label: 'Yearly', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semi-annually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
] as const;

export interface LoanPaymentInput {
  loanAmount: string;
  /** Currency of the loan amount (canonical calculation currency). */
  loanCurrency: SupportedCurrency;
  annualRatePercent: string;
  termYears: string;
  termMonths: string;
  paymentFrequency: PaymentFrequency;
  /** Independent display currency for periodic payment. */
  paymentCurrency: SupportedCurrency;
  /** Independent display currency for loan payment total. */
  totalCurrency: SupportedCurrency;
}

export interface LoanPaymentResult {
  numberOfInstallments: number;
  /** Full-precision periodic rate as a decimal (e.g. 0.05). */
  periodicInterestRate: number;
  /** Full-precision periodic rate as a percent (e.g. 5). */
  periodicInterestRatePercent: number;
  /** Full-precision payment in loan currency. */
  periodicPaymentInLoan: number;
  /** Full-precision payment in payment display currency. */
  periodicPayment: number;
  /** Full-precision total in loan currency. */
  loanPaymentTotalInLoan: number;
  /** Full-precision total in total display currency. */
  loanPaymentTotal: number;
  loanCurrency: SupportedCurrency;
  paymentCurrency: SupportedCurrency;
  totalCurrency: SupportedCurrency;
  formattedNumberOfInstallments: string;
  formattedPeriodicInterestRate: string;
  formattedPeriodicPayment: string;
  formattedLoanPaymentTotal: string;
}

export type LoanPaymentFieldErrors = {
  loanAmount?: string;
  annualRatePercent?: string;
  termYears?: string;
  termMonths?: string;
  paymentFrequency?: string;
  form?: string;
};

export function createDefaultInput(): LoanPaymentInput {
  return {
    loanAmount: '100000',
    loanCurrency: 'PKR',
    annualRatePercent: '5',
    termYears: '5',
    termMonths: '0',
    paymentFrequency: 'yearly',
    paymentCurrency: 'PKR',
    totalCurrency: 'PKR',
  };
}
