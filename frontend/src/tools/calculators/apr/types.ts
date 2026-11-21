import type { SupportedCurrency } from '@/tools/shared/currency';

export type PaymentFrequency =
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'annual';

export type FeeTreatment = 'deducted' | 'financed' | 'paid-upfront';

export type OriginationFeeType = 'fixed' | 'percentage';

export type TermUnit = 'years' | 'months';

export type AprStatus =
  | 'valid'
  | 'partial'
  | 'incomplete'
  | 'invalid'
  | 'solverFailed';

export interface AprInput {
  loanAmount: string;
  annualInterestRate: string;
  loanTerm: string;
  loanTermUnit: TermUnit;
  paymentFrequency: PaymentFrequency;
  originationFee: string;
  originationFeeType: OriginationFeeType;
  otherFinanceCharges: string;
  feeTreatment: FeeTreatment;
  currency: SupportedCurrency;
}

export interface AprScheduleRow {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface AprResult {
  periodicPayment: number | null;
  paymentCount: number | null;
  paymentsPerYear: number;
  amortizingPrincipal: number | null;
  netProceeds: number | null;
  totalFees: number | null;
  totalInterest: number | null;
  totalPayments: number | null;
  totalFinanceCharges: number | null;
  apr: number | null;
  effectiveAnnualRate: number | null;
  nominalAnnualRate: number | null;
  schedule: AprScheduleRow[];
  status: AprStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedPeriodicPayment: string | null;
  formattedNetProceeds: string | null;
  formattedAmortizingPrincipal: string | null;
  formattedTotalFees: string | null;
  formattedTotalInterest: string | null;
  formattedTotalPayments: string | null;
  formattedTotalFinanceCharges: string | null;
  formattedApr: string | null;
  formattedEar: string | null;
}

export type AprFieldErrors = {
  loanAmount?: string;
  annualInterestRate?: string;
  loanTerm?: string;
  originationFee?: string;
  otherFinanceCharges?: string;
  form?: string;
};

export function createDefaultInput(): AprInput {
  return {
    loanAmount: '',
    annualInterestRate: '',
    loanTerm: '',
    loanTermUnit: 'years',
    paymentFrequency: 'monthly',
    originationFee: '',
    originationFeeType: 'fixed',
    otherFinanceCharges: '',
    feeTreatment: 'deducted',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): AprInput {
  return {
    ...createDefaultInput(),
    currency,
  };
}
