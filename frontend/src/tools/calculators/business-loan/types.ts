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

export interface BusinessLoanInput {
  knownRate: KnownRateType;
  interestRate: string;
  compoundFrequency: CompoundFrequency;
  loanAmount: string;
  termYears: string;
  termMonths: string;
  paymentFrequency: PaymentFrequency;
  prepaidFee: string;
  loanedFee: string;
  originationFee: string;
  originationFeeRepayment: OriginationFeeRepayment;
  currency: SupportedCurrency;
}

export interface BusinessLoanParsedValues {
  knownRate: KnownRateType;
  interestRate: number;
  compoundFrequency: CompoundFrequency;
  loanAmount: number;
  termYears: number;
  termMonths: number;
  paymentFrequency: PaymentFrequency;
  prepaidFee: number;
  loanedFee: number;
  originationFee: number;
  originationFeeRepayment: OriginationFeeRepayment;
  currency: SupportedCurrency;
}

export interface BusinessLoanResult {
  netLoanReceived: number;
  periodicPayment: number;
  totalInterest: number;
  totalPayment: number;
  totalFinanceCharge: number;
  apr: number;
  effectiveApr: number;
  totalPaymentsCount: number;
  financedPrincipal: number;
  originationFeeAmount: number;
  prepaidFeeAmount: number;
  loanedFeeAmount: number;
  calloutMessage: string;
  currency: SupportedCurrency;
}

export type BusinessLoanFieldErrors = Partial<Record<keyof BusinessLoanInput | 'general', string>>;
