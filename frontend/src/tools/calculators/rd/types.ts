import type { SupportedCurrency } from '@/tools/shared/currency';

export type RdTermUnit = 'years' | 'months';

export interface RdInput {
  monthlyDeposit: string;
  monthlyDepositCurrency: SupportedCurrency;
  term: string;
  termUnit: RdTermUnit;
  annualRatePercent: string;
  totalDepositsCurrency: SupportedCurrency;
  totalInterestCurrency: SupportedCurrency;
  maturityCurrency: SupportedCurrency;
}

export interface RdResult {
  months: number;
  quarters: number;
  totalDepositsCanonical: number;
  totalInterestCanonical: number;
  maturityCanonical: number;
  totalDeposits: number;
  totalInterest: number;
  maturityAmount: number;
  monthlyDepositCurrency: SupportedCurrency;
  totalDepositsCurrency: SupportedCurrency;
  totalInterestCurrency: SupportedCurrency;
  maturityCurrency: SupportedCurrency;
  formattedTotalDeposits: string;
  formattedTotalInterest: string;
  formattedMaturity: string;
  compoundingNote: string;
  formulaBreakdown: string;
}

export type RdFieldErrors = {
  form?: string;
  monthlyDeposit?: string;
  term?: string;
  annualRatePercent?: string;
};

/** Screenshot defaults: empty amounts, PKR, term in years. */
export function createDefaultInput(): RdInput {
  return {
    monthlyDeposit: '',
    monthlyDepositCurrency: 'PKR',
    term: '',
    termUnit: 'years',
    annualRatePercent: '',
    totalDepositsCurrency: 'PKR',
    totalInterestCurrency: 'PKR',
    maturityCurrency: 'PKR',
  };
}

export function createEmptyInput(): RdInput {
  return createDefaultInput();
}

/** Worked example: 5,000/mo · 5y · 6% quarterly-compounded RD. */
export function createExampleInput(): RdInput {
  return {
    monthlyDeposit: '5000',
    monthlyDepositCurrency: 'PKR',
    term: '5',
    termUnit: 'years',
    annualRatePercent: '6',
    totalDepositsCurrency: 'PKR',
    totalInterestCurrency: 'PKR',
    maturityCurrency: 'PKR',
  };
}
