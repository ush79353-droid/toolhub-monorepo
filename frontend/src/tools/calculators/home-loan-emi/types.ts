import type { SupportedCurrency } from '@/tools/shared/currency';

export type TermUnit = 'yrs' | 'mos';

export interface HomeLoanEmiInput {
  principal: string;
  /** Currency of the principal (canonical calculation currency). */
  currency: SupportedCurrency;
  loanTerm: string;
  termUnit: TermUnit;
  interestRatePercent: string;
  /** Display currency for EMI. */
  emiCurrency: SupportedCurrency;
  /** Display currency for total amount payable. */
  totalPayableCurrency: SupportedCurrency;
  /** Display currency for total interest due. */
  totalInterestCurrency: SupportedCurrency;
}

export interface HomeLoanEmiResult {
  principal: number;
  paymentCount: number;
  emiInPrincipalCurrency: number;
  emi: number;
  emiCurrency: SupportedCurrency;
  formattedEmi: string;
  totalPayableInPrincipalCurrency: number;
  totalPayable: number;
  totalPayableCurrency: SupportedCurrency;
  formattedTotalPayable: string;
  totalInterestInPrincipalCurrency: number;
  totalInterest: number;
  totalInterestCurrency: SupportedCurrency;
  formattedTotalInterest: string;
  principalSharePercent: number;
  interestSharePercent: number;
  currency: SupportedCurrency;
}

export type HomeLoanEmiFieldErrors = {
  principal?: string;
  loanTerm?: string;
  interestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): HomeLoanEmiInput {
  return {
    principal: '',
    currency: 'PKR',
    loanTerm: '',
    termUnit: 'mos',
    interestRatePercent: '',
    emiCurrency: 'PKR',
    totalPayableCurrency: 'PKR',
    totalInterestCurrency: 'PKR',
  };
}
