import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PartiallyAmortizedLoanInput {
  fullLoan: string;
  annualInterestRatePercent: string;
  amortYears: string;
  amortMonths: string;
  paymentYears: string;
  paymentMonths: string;
  /** Canonical calculation currency for the full loan principal. */
  loanCurrency: SupportedCurrency;
  monthlyPaymentCurrency: SupportedCurrency;
  totalPaidCurrency: SupportedCurrency;
  balloonCurrency: SupportedCurrency;
  totalCurrency: SupportedCurrency;
}

export interface PartiallyAmortizedLoanResult {
  /** Full-precision values in loan currency. */
  monthlyPaymentInLoan: number;
  totalPaidInLoan: number;
  balloonInLoan: number;
  totalInLoan: number;
  amortMonthsTotal: number;
  paymentMonthsTotal: number;
  /** Display amounts (full precision) in each field's currency. */
  monthlyPayment: number;
  totalPaid: number;
  balloon: number;
  total: number;
  loanCurrency: SupportedCurrency;
  monthlyPaymentCurrency: SupportedCurrency;
  totalPaidCurrency: SupportedCurrency;
  balloonCurrency: SupportedCurrency;
  totalCurrency: SupportedCurrency;
  formattedMonthlyPayment: string;
  formattedTotalPaid: string;
  formattedBalloon: string;
  formattedTotal: string;
}

export type PartiallyAmortizedLoanFieldErrors = {
  fullLoan?: string;
  annualInterestRatePercent?: string;
  amortYears?: string;
  amortMonths?: string;
  paymentYears?: string;
  paymentMonths?: string;
  form?: string;
};

export function createDefaultInput(): PartiallyAmortizedLoanInput {
  return {
    fullLoan: '',
    annualInterestRatePercent: '',
    amortYears: '',
    amortMonths: '',
    paymentYears: '',
    paymentMonths: '',
    loanCurrency: 'PKR',
    monthlyPaymentCurrency: 'PKR',
    totalPaidCurrency: 'PKR',
    balloonCurrency: 'PKR',
    totalCurrency: 'PKR',
  };
}
