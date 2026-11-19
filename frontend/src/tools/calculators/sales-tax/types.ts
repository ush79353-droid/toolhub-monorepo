import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited price field drives net↔gross solve. */
export type SalesTaxDriver = 'net' | 'gross';

export interface SalesTaxInput {
  salesTaxPercent: string;
  netPrice: string;
  netCurrency: SupportedCurrency;
  grossPrice: string;
  grossCurrency: SupportedCurrency;
  taxAmountCurrency: SupportedCurrency;
  driver: SalesTaxDriver;
}

export interface SalesTaxResult {
  salesTaxPercent: number;
  netPriceCanonical: number;
  grossPriceCanonical: number;
  taxAmountCanonical: number;
  netPrice: number;
  grossPrice: number;
  taxAmount: number;
  netCurrency: SupportedCurrency;
  grossCurrency: SupportedCurrency;
  taxAmountCurrency: SupportedCurrency;
  calcCurrency: SupportedCurrency;
  formattedNetPrice: string;
  formattedGrossPrice: string;
  formattedTaxAmount: string;
  formattedSalesTaxPercent: string;
}

export type SalesTaxFieldErrors = {
  salesTaxPercent?: string;
  netPrice?: string;
  grossPrice?: string;
  form?: string;
};

export function createDefaultInput(): SalesTaxInput {
  return {
    salesTaxPercent: '10',
    netPrice: '',
    netCurrency: 'PKR',
    grossPrice: '',
    grossCurrency: 'PKR',
    taxAmountCurrency: 'PKR',
    driver: 'net',
  };
}

export function inputsEqual(a: SalesTaxInput, b: SalesTaxInput): boolean {
  return (
    a.salesTaxPercent === b.salesTaxPercent &&
    a.netPrice === b.netPrice &&
    a.netCurrency === b.netCurrency &&
    a.grossPrice === b.grossPrice &&
    a.grossCurrency === b.grossCurrency &&
    a.taxAmountCurrency === b.taxAmountCurrency &&
    a.driver === b.driver
  );
}
