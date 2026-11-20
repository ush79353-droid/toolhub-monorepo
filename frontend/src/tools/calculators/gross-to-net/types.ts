import type { SupportedCurrency } from '@/tools/shared/currency';

/** Screenshot mode radios — which side is the authoritative money input. */
export type GrossToNetMode = 'gross-to-net' | 'net-to-gross';

export interface GrossToNetInput {
  mode: GrossToNetMode;
  taxRatePercent: string;
  grossAmount: string;
  grossCurrency: SupportedCurrency;
  netAmount: string;
  netCurrency: SupportedCurrency;
  taxAmountCurrency: SupportedCurrency;
}

export interface GrossToNetResult {
  mode: GrossToNetMode;
  taxRatePercent: number;
  grossCanonical: number;
  netCanonical: number;
  taxCanonical: number;
  grossAmount: number;
  netAmount: number;
  taxAmount: number;
  grossCurrency: SupportedCurrency;
  netCurrency: SupportedCurrency;
  taxAmountCurrency: SupportedCurrency;
  calcCurrency: SupportedCurrency;
  formattedGrossAmount: string;
  formattedNetAmount: string;
  formattedTaxAmount: string;
  formattedTaxRatePercent: string;
}

export type GrossToNetFieldErrors = {
  taxRatePercent?: string;
  grossAmount?: string;
  netAmount?: string;
  form?: string;
};

export function createDefaultInput(): GrossToNetInput {
  return {
    mode: 'gross-to-net',
    taxRatePercent: '',
    grossAmount: '',
    grossCurrency: 'PKR',
    netAmount: '',
    netCurrency: 'PKR',
    taxAmountCurrency: 'PKR',
  };
}

export function inputsEqual(a: GrossToNetInput, b: GrossToNetInput): boolean {
  return (
    a.mode === b.mode &&
    a.taxRatePercent === b.taxRatePercent &&
    a.grossAmount === b.grossAmount &&
    a.grossCurrency === b.grossCurrency &&
    a.netAmount === b.netAmount &&
    a.netCurrency === b.netCurrency &&
    a.taxAmountCurrency === b.taxAmountCurrency
  );
}
