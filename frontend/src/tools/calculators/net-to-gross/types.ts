import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited field drives the solve. */
export type NetToGrossDriver = 'net' | 'rateFromNet' | 'rateFromGross' | 'gross' | 'tax';

export interface NetToGrossInput {
  netAmount: string;
  netCurrency: SupportedCurrency;
  rateFromNet: string;
  rateFromGross: string;
  grossAmount: string;
  grossCurrency: SupportedCurrency;
  taxAmount: string;
  taxCurrency: SupportedCurrency;
  driver: NetToGrossDriver;
}

export interface NetToGrossResult {
  netCanonical: number;
  grossCanonical: number;
  taxCanonical: number;
  rateFromNet: number;
  rateFromGross: number;
  netAmount: number;
  grossAmount: number;
  taxAmount: number;
  netCurrency: SupportedCurrency;
  grossCurrency: SupportedCurrency;
  taxCurrency: SupportedCurrency;
  calcCurrency: SupportedCurrency;
  formattedNetAmount: string;
  formattedGrossAmount: string;
  formattedTaxAmount: string;
  formattedRateFromNet: string;
  formattedRateFromGross: string;
}

export type NetToGrossFieldErrors = {
  netAmount?: string;
  rateFromNet?: string;
  rateFromGross?: string;
  grossAmount?: string;
  taxAmount?: string;
  form?: string;
};

export function createDefaultInput(): NetToGrossInput {
  return {
    netAmount: '',
    netCurrency: 'PKR',
    rateFromNet: '',
    rateFromGross: '',
    grossAmount: '',
    grossCurrency: 'PKR',
    taxAmount: '',
    taxCurrency: 'PKR',
    driver: 'net',
  };
}

export function inputsEqual(a: NetToGrossInput, b: NetToGrossInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
