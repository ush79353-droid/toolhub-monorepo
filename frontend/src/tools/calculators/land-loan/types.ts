import type { SupportedCurrency } from '@/tools/shared/currency';

/** Business Loan payment-frequency set (screenshot default Monthly). */
export type PaymentFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'bi-weekly'
  | 'weekly';

export type DownPaymentSource = 'percent' | 'amount';

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: PaymentFrequency;
  label: string;
  paymentsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', paymentsPerYear: 1 },
  { value: 'semi-annually', label: 'Semi-annually', paymentsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', paymentsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', paymentsPerYear: 12 },
  { value: 'bi-weekly', label: 'Bi-weekly', paymentsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', paymentsPerYear: 52 },
];

export function paymentsPerYear(frequency: PaymentFrequency): number {
  return (
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.paymentsPerYear ?? 12
  );
}

export interface LandLoanInput {
  landValue: string;
  landValueCurrency: SupportedCurrency;
  downPaymentPercent: string;
  downPayment: string;
  downPaymentCurrency: SupportedCurrency;
  /** Tracks last edited down-payment control to avoid circular updates. */
  downPaymentSource: DownPaymentSource;
  loanValueCurrency: SupportedCurrency;
  annualInterestRatePercent: string;
  termYears: string;
  termMonths: string;
  paymentFrequency: PaymentFrequency;
  periodicPaymentCurrency: SupportedCurrency;
  totalPaymentCurrency: SupportedCurrency;
  totalInterestCurrency: SupportedCurrency;
}

export interface LandLoanResult {
  downPaymentCalc: number;
  downPaymentDisplay: number;
  loanValueCalc: number;
  loanValueDisplay: number;
  numberOfPayments: number;
  periodicRatePercent: number;
  periodicPaymentCalc: number;
  periodicPaymentDisplay: number;
  totalPaymentCalc: number;
  totalPaymentDisplay: number;
  totalInterestCalc: number;
  totalInterestDisplay: number;
  calcCurrency: SupportedCurrency;
  formattedDownPayment: string;
  formattedLoanValue: string;
  formattedNumberOfPayments: string;
  formattedPeriodicRate: string;
  formattedPeriodicPayment: string;
  formattedTotalPayment: string;
  formattedTotalInterest: string;
}

export type LandLoanFieldErrors = {
  landValue?: string;
  downPaymentPercent?: string;
  downPayment?: string;
  annualInterestRatePercent?: string;
  termYears?: string;
  termMonths?: string;
  form?: string;
};

export function createDefaultInput(): LandLoanInput {
  return {
    landValue: '',
    landValueCurrency: 'PKR',
    downPaymentPercent: '10',
    downPayment: '',
    downPaymentCurrency: 'PKR',
    downPaymentSource: 'percent',
    loanValueCurrency: 'PKR',
    annualInterestRatePercent: '',
    termYears: '',
    termMonths: '0',
    paymentFrequency: 'monthly',
    periodicPaymentCurrency: 'PKR',
    totalPaymentCurrency: 'PKR',
    totalInterestCurrency: 'PKR',
  };
}
