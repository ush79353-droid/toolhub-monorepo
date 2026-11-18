import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CreditCardPayoffInput {
  balance: string;
  balanceCurrency: SupportedCurrency;
  aprPercent: string;
  monthlyPayment: string;
  monthlyPaymentCurrency: SupportedCurrency;
  totalPaidCurrency: SupportedCurrency;
}

export interface CreditCardPayoffResult {
  years: number;
  months: number;
  days: number;
  totalPaidCanonical: number;
  totalPaid: number;
  currency: SupportedCurrency;
  totalPaidCurrency: SupportedCurrency;
  formattedYears: string;
  formattedMonths: string;
  formattedDays: string;
  formattedTotalPaid: string;
  summary: string;
  breakdown: string;
  neverPaysOff: boolean;
}

export type CreditCardPayoffFieldErrors = {
  balance?: string;
  aprPercent?: string;
  monthlyPayment?: string;
  form?: string;
};

export function createDefaultInput(): CreditCardPayoffInput {
  return {
    balance: '2000',
    balanceCurrency: 'PKR',
    aprPercent: '18',
    monthlyPayment: '100',
    monthlyPaymentCurrency: 'PKR',
    totalPaidCurrency: 'PKR',
  };
}
