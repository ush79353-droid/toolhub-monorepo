import type { SupportedCurrency } from '@/tools/shared/currency';

/** Compounding frequency for deriving the effective monthly rate. */
export type BalloonCompoundingMethod =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export type BalloonAfterUnit = 'yrs' | 'mos';

export interface BalloonPaymentInput {
  loanAmount: string;
  /** Calculation currency for the loan principal (and all money results). */
  currency: SupportedCurrency;
  amortYears: string;
  amortMonths: string;
  balloonAfter: string;
  balloonAfterUnit: BalloonAfterUnit;
  interestRatePercent: string;
  compoundingMethod: BalloonCompoundingMethod;
}

export interface BalloonPaymentResult {
  monthlyPayment: number;
  balloonPayment: number;
  totalMonthlyPayments: number;
  totalRepayment: number;
  totalInterest: number;
  balloonAfterMonths: number;
  amortMonthsTotal: number;
  currency: SupportedCurrency;
  formattedMonthlyPayment: string;
  formattedBalloonPayment: string;
  formattedTotalMonthlyPayments: string;
  formattedTotalRepayment: string;
  formattedTotalInterest: string;
}

export type BalloonPaymentFieldErrors = {
  loanAmount?: string;
  amortYears?: string;
  amortMonths?: string;
  balloonAfter?: string;
  interestRatePercent?: string;
  form?: string;
};

export const COMPOUNDING_METHOD_OPTIONS: readonly {
  value: BalloonCompoundingMethod;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semi-annually', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
] as const;

export function createDefaultInput(): BalloonPaymentInput {
  return {
    loanAmount: '200000',
    currency: 'PKR',
    amortYears: '20',
    amortMonths: '0',
    balloonAfter: '5',
    balloonAfterUnit: 'yrs',
    interestRatePercent: '7',
    compoundingMethod: 'monthly',
  };
}
