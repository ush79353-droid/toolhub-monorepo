import type { SupportedCurrency } from '@/tools/shared/currency';

export type KnownRateType = 'nominal' | 'effective';

export type CompoundFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'bi-weekly'
  | 'weekly'
  | 'daily';

export type PaymentFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'bi-weekly'
  | 'weekly';

export type OriginationFeeRepayment = 'from_loan' | 'rolling' | 'out_of_pocket';

export const KNOWN_RATE_OPTIONS: readonly { value: KnownRateType; label: string }[] = [
  { value: 'nominal', label: 'Nominal interest rate' },
  { value: 'effective', label: 'Effective interest rate' },
];

export const COMPOUND_FREQUENCY_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semi-annually', label: 'Semi-annually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'bi-weekly', label: 'Bi-weekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
];

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

export interface StudentLoanPaymentInput {
  knownRate: KnownRateType;
  interestRate: string;
  compoundFrequency: CompoundFrequency;
  loanAmount: string;
  loanCurrency: SupportedCurrency;
  termYears: string;
  termMonths: string;
  paymentFrequency: PaymentFrequency;
  prepaidFee: string;
  prepaidFeeCurrency: SupportedCurrency;
  loanedFee: string;
  loanedFeeCurrency: SupportedCurrency;
  originationFee: string;
  originationFeeRepayment: OriginationFeeRepayment;
}

export interface StudentLoanPaymentParsed {
  knownRate: KnownRateType;
  interestRate: number;
  compoundFrequency: CompoundFrequency;
  loanAmount: number;
  termYears: number;
  termMonths: number;
  paymentFrequency: PaymentFrequency;
  prepaidFee: number;
  loanedFee: number;
  originationFeePercent: number;
  originationFeeRepayment: OriginationFeeRepayment;
  currency: SupportedCurrency;
}

export interface StudentLoanPaymentResult {
  currency: SupportedCurrency;
  netLoanReceived: number;
  originationFeeAmount: number;
  prepaidFeeAmount: number;
  loanedFeeAmount: number;
  financedPrincipal: number;
  periodicPayment: number;
  paymentOnLoanedFees: number;
  paymentCount: number;
  totalInterest: number;
  interestOnLoanAmount: number;
  interestOnLoanedFees: number;
  totalAdditionalFeesWithInterest: number;
  totalPayment: number;
  totalFinanceCharge: number;
  apr: number;
  effectiveApr: number;
  calloutMessage: string;
  summaryParagraphs: string[];
  formattedNetLoanReceived: string;
  formattedOriginationFee: string;
  formattedPeriodicPayment: string;
  formattedPaymentOnLoanedFees: string;
  formattedTotalInterest: string;
  formattedInterestOnLoanAmount: string;
  formattedInterestOnLoanedFees: string;
  formattedTotalAdditionalFeesWithInterest: string;
  formattedTotalPayment: string;
  formattedTotalFinanceCharge: string;
  formattedApr: string;
  formattedEffectiveApr: string;
}

export type StudentLoanPaymentFieldErrors = {
  loanAmount?: string;
  interestRate?: string;
  termYears?: string;
  termMonths?: string;
  prepaidFee?: string;
  loanedFee?: string;
  originationFee?: string;
  form?: string;
};

export function createDefaultInput(): StudentLoanPaymentInput {
  return {
    knownRate: 'nominal',
    interestRate: '5',
    compoundFrequency: 'monthly',
    loanAmount: '10000',
    loanCurrency: 'PKR',
    termYears: '6',
    termMonths: '0',
    paymentFrequency: 'monthly',
    prepaidFee: '200',
    prepaidFeeCurrency: 'PKR',
    loanedFee: '500',
    loanedFeeCurrency: 'PKR',
    originationFee: '8',
    originationFeeRepayment: 'from_loan',
  };
}
