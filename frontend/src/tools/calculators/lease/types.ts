import type { SupportedCurrency } from '@/tools/shared/currency';

export type TermUnit = 'yrs' | 'mos';
export type ResidualMode = 'amount' | 'percent';

export interface LeaseInput {
  productValue: string;
  productCurrency: SupportedCurrency;
  residualAmount: string;
  residualCurrency: SupportedCurrency;
  residualPercent: string;
  residualMode: ResidualMode;
  leaseTerm: string;
  termUnit: TermUnit;
  annualInterestRatePercent: string;
  includeDownPayment: boolean;
  downPayment: string;
  downPaymentCurrency: SupportedCurrency;
  monthlyPaymentCurrency: SupportedCurrency;
  totalPaymentsCurrency: SupportedCurrency;
  totalInterestCurrency: SupportedCurrency;
  totalCostCurrency: SupportedCurrency;
}

export interface LeaseResult {
  monthlyPaymentCanonical: number;
  totalPaymentsCanonical: number;
  totalInterestCanonical: number;
  totalCostToOwnCanonical: number;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalCostToOwn: number;
  monthlyPaymentCurrency: SupportedCurrency;
  totalPaymentsCurrency: SupportedCurrency;
  totalInterestCurrency: SupportedCurrency;
  totalCostCurrency: SupportedCurrency;
  formattedMonthlyPayment: string;
  formattedTotalPayments: string;
  formattedTotalInterest: string;
  formattedTotalCostToOwn: string;
  paymentCount: number;
  residualCanonical: number;
  downPaymentCanonical: number;
}

export type LeaseFieldErrors = {
  productValue?: string;
  residualAmount?: string;
  residualPercent?: string;
  leaseTerm?: string;
  annualInterestRatePercent?: string;
  downPayment?: string;
  form?: string;
};

export function createDefaultInput(): LeaseInput {
  return {
    productValue: '',
    productCurrency: 'PKR',
    residualAmount: '',
    residualCurrency: 'PKR',
    residualPercent: '',
    residualMode: 'amount',
    leaseTerm: '3',
    termUnit: 'yrs',
    annualInterestRatePercent: '5',
    includeDownPayment: false,
    downPayment: '',
    downPaymentCurrency: 'PKR',
    monthlyPaymentCurrency: 'PKR',
    totalPaymentsCurrency: 'PKR',
    totalInterestCurrency: 'PKR',
    totalCostCurrency: 'PKR',
  };
}

export function inputsEqual(a: LeaseInput, b: LeaseInput): boolean {
  return (
    a.productValue === b.productValue &&
    a.productCurrency === b.productCurrency &&
    a.residualAmount === b.residualAmount &&
    a.residualCurrency === b.residualCurrency &&
    a.residualPercent === b.residualPercent &&
    a.residualMode === b.residualMode &&
    a.leaseTerm === b.leaseTerm &&
    a.termUnit === b.termUnit &&
    a.annualInterestRatePercent === b.annualInterestRatePercent &&
    a.includeDownPayment === b.includeDownPayment &&
    a.downPayment === b.downPayment &&
    a.downPaymentCurrency === b.downPaymentCurrency &&
    a.monthlyPaymentCurrency === b.monthlyPaymentCurrency &&
    a.totalPaymentsCurrency === b.totalPaymentsCurrency &&
    a.totalInterestCurrency === b.totalInterestCurrency &&
    a.totalCostCurrency === b.totalCostCurrency
  );
}
