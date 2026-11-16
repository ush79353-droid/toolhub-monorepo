import type { SupportedCurrency } from '@/tools/shared/currency';

export type TermUnit = 'yrs' | 'mos';

export interface SimpleMortgageInput {
  loanAmount: string;
  loanCurrency: SupportedCurrency;
  annualInterestRatePercent: string;
  loanTerm: string;
  termUnit: TermUnit;
  monthlyPaymentCurrency: SupportedCurrency;
  /** Screenshot checkbox. No verified tax/insurance/fee fields in reference. */
  includeTaxesInsuranceFees: boolean;
}

export interface SimpleMortgageResult {
  monthlyPaymentInLoanCurrency: number;
  monthlyPayment: number;
  monthlyPaymentCurrency: SupportedCurrency;
  formattedMonthlyPayment: string;
  paymentCount: number;
}

export type SimpleMortgageFieldErrors = {
  loanAmount?: string;
  annualInterestRatePercent?: string;
  loanTerm?: string;
  form?: string;
};

export function createDefaultInput(): SimpleMortgageInput {
  return {
    loanAmount: '',
    loanCurrency: 'PKR',
    annualInterestRatePercent: '4.5',
    loanTerm: '30',
    termUnit: 'yrs',
    monthlyPaymentCurrency: 'PKR',
    includeTaxesInsuranceFees: false,
  };
}
