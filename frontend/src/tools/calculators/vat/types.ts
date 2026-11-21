import type { SupportedCurrency } from '@/tools/shared/currency';

/** How the primary Amount field is interpreted. */
export type VatMode = 'excluded' | 'included';

/** Last edited money driver (prevents circular updates). */
export type VatDriver = 'amount' | 'net' | 'gross';

export interface VatInput {
  amount: string;
  vatRate: string;
  mode: VatMode;
  netPrice: string;
  grossPrice: string;
  driver: VatDriver;
  currency: SupportedCurrency;
}

export interface VatResult {
  mode: VatMode;
  vatRate: number;
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
  currency: SupportedCurrency;
  formattedVatRate: string;
  formattedNetPrice: string;
  formattedVatAmount: string;
  formattedGrossPrice: string;
}

export type VatFieldErrors = {
  amount?: string;
  vatRate?: string;
  netPrice?: string;
  grossPrice?: string;
  form?: string;
};

export function createDefaultInput(): VatInput {
  return {
    amount: '100',
    vatRate: '20',
    mode: 'excluded',
    netPrice: '100',
    grossPrice: '120',
    driver: 'amount',
    currency: 'USD',
  };
}
