import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EvaInput {
  nopat: string;
  investedCapital: string;
  waccPercent: string;
  operatingAssets: string;
  operatingLiabilities: string;
  currency: SupportedCurrency;
}

export interface EvaResult {
  eva: number;
  capitalCharge: number;
  waccDecimal: number;
  currency: SupportedCurrency;
  formattedEva: string;
  formattedCapitalCharge: string;
  formattedWacc: string;
  interpretation: string;
  warningMessage: string | null;
}

export type EvaFieldErrors = {
  form?: string;
  nopat?: string;
  investedCapital?: string;
  waccPercent?: string;
  operatingAssets?: string;
  operatingLiabilities?: string;
  investedCapitalHelper?: string;
};

/** Reference: NOPAT $750k · IC $1M · WACC 10% → EVA $650k */
export function createDefaultInput(): EvaInput {
  return {
    nopat: '750000',
    investedCapital: '1000000',
    waccPercent: '10',
    operatingAssets: '',
    operatingLiabilities: '',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): EvaInput {
  return {
    nopat: '',
    investedCapital: '',
    waccPercent: '',
    operatingAssets: '',
    operatingLiabilities: '',
    currency,
  };
}
