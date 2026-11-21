import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited price field drives net↔gross solve. */
export type GstDriver = 'net' | 'gross';

export interface GstInput {
  gstPercent: string;
  netPrice: string;
  netCurrency: SupportedCurrency;
  grossPrice: string;
  grossCurrency: SupportedCurrency;
  taxAmountCurrency: SupportedCurrency;
  driver: GstDriver;
}

export interface GstResult {
  gstPercent: number;
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
  formattedGstPercent: string;
}

export type GstFieldErrors = {
  gstPercent?: string;
  netPrice?: string;
  grossPrice?: string;
  form?: string;
};

/** No default GST % — prompt forbids inventing an unverified rate. */
export function createDefaultInput(): GstInput {
  return {
    gstPercent: '',
    netPrice: '',
    netCurrency: 'PKR',
    grossPrice: '',
    grossCurrency: 'PKR',
    taxAmountCurrency: 'PKR',
    driver: 'gross',
  };
}

export function inputsEqual(a: GstInput, b: GstInput): boolean {
  return (
    a.gstPercent === b.gstPercent &&
    a.netPrice === b.netPrice &&
    a.netCurrency === b.netCurrency &&
    a.grossPrice === b.grossPrice &&
    a.grossCurrency === b.grossCurrency &&
    a.taxAmountCurrency === b.taxAmountCurrency &&
    a.driver === b.driver
  );
}
