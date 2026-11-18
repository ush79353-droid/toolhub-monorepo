import type { SupportedCurrency } from '@/tools/shared/currency';

/** Which dependent field the user last edited (drives recalculation). */
export type LtvDriver = 'downPayment' | 'loanAmount' | 'ltv';

export interface LtvInput {
  purchasePrice: string;
  purchaseCurrency: SupportedCurrency;
  downPayment: string;
  downPaymentCurrency: SupportedCurrency;
  loanAmount: string;
  loanAmountCurrency: SupportedCurrency;
  ltvPercent: string;
  /** Last intentionally edited dependent field. */
  driver: LtvDriver;
}

export interface LtvResult {
  purchasePrice: number;
  purchaseCurrency: SupportedCurrency;
  /** Canonical amounts in purchase currency. */
  downPaymentInPurchase: number;
  loanAmountInPurchase: number;
  /** Display amounts in their selected currencies. */
  downPayment: number;
  loanAmount: number;
  downPaymentCurrency: SupportedCurrency;
  loanAmountCurrency: SupportedCurrency;
  formattedDownPayment: string;
  formattedLoanAmount: string;
  formattedPurchasePrice: string;
  ltvPercent: number;
  formattedLtvPercent: string;
}

export type LtvFieldErrors = {
  purchasePrice?: string;
  downPayment?: string;
  loanAmount?: string;
  ltvPercent?: string;
  form?: string;
};

export function createDefaultInput(): LtvInput {
  return {
    purchasePrice: '',
    purchaseCurrency: 'PKR',
    downPayment: '',
    downPaymentCurrency: 'PKR',
    loanAmount: '',
    loanAmountCurrency: 'PKR',
    ltvPercent: '',
    driver: 'downPayment',
  };
}
