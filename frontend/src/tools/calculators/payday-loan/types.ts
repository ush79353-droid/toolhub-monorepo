import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last intentional economic edit between finance charge and APR (not currency switches). */
export type PaydayLoanEditSource = 'financeCharge' | 'apr';

export interface PaydayLoanInput {
  loanAmount: string;
  financeCharge: string;
  loanTermDays: string;
  aprPercent: string;
  monthlyFeePercent: string;
  loanAmountCurrency: SupportedCurrency;
  financeChargeCurrency: SupportedCurrency;
  /** Display currency for annualized APR amount (derived). */
  aprAmountCurrency: SupportedCurrency;
  /** Display currency for calculated monthly fee. */
  monthlyFeeCurrency: SupportedCurrency;
  /** Display currency for total debt. */
  totalDebtCurrency: SupportedCurrency;
  editSource: PaydayLoanEditSource;
}

export interface PaydayLoanResult {
  /** Canonical loan principal in loanAmountCurrency. */
  loanAmount: number;
  /** Finance charge normalized into loanAmountCurrency. */
  financeChargeCanonical: number;
  loanTermDays: number;
  aprPercent: number;
  /** Annualized finance charge in loanAmountCurrency: F × (365 / d). */
  aprAmountCanonical: number;
  monthlyFeePercent: number;
  /** One-period monthly fee in loanAmountCurrency: P × (q / 100). */
  monthlyFeeCanonical: number;
  /** Total debt in loanAmountCurrency: P + F + MF (APR amount not added). */
  totalDebtCanonical: number;
  loanAmountCurrency: SupportedCurrency;
  aprAmountDisplay: number;
  aprAmountCurrency: SupportedCurrency;
  monthlyFeeDisplay: number;
  monthlyFeeCurrency: SupportedCurrency;
  totalDebtDisplay: number;
  totalDebtCurrency: SupportedCurrency;
  formattedAprPercent: string;
  formattedAprAmount: string;
  formattedMonthlyFee: string;
  formattedTotalDebt: string;
  /** Finance charge string in financeChargeCurrency after APR→F sync (optional). */
  syncedFinanceCharge?: string;
  /** APR string after F→APR sync (optional). */
  syncedAprPercent?: string;
}

export type PaydayLoanFieldErrors = {
  loanAmount?: string;
  financeCharge?: string;
  loanTermDays?: string;
  aprPercent?: string;
  monthlyFeePercent?: string;
  form?: string;
};

export function createDefaultInput(): PaydayLoanInput {
  return {
    loanAmount: '',
    financeCharge: '',
    loanTermDays: '',
    aprPercent: '',
    monthlyFeePercent: '0',
    loanAmountCurrency: 'PKR',
    financeChargeCurrency: 'PKR',
    aprAmountCurrency: 'PKR',
    monthlyFeeCurrency: 'PKR',
    totalDebtCurrency: 'PKR',
    editSource: 'financeCharge',
  };
}
