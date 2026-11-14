import type { SupportedCurrency } from '@/tools/shared/currency';

export type ConversionField = 'decimal' | 'percent' | 'permille' | 'basisPoints';

export interface BasisPointInput {
  decimal: string;
  percent: string;
  permille: string;
  basisPoints: string;
  xBps: string;
  ofAmount: string;
  currency: SupportedCurrency;
}

export interface ConversionSnapshot {
  decimal: number;
  percent: number;
  permille: number;
  basisPoints: number;
  formattedDecimal: string;
  formattedPercent: string;
  formattedPermille: string;
  formattedBasisPoints: string;
}

export interface AmountSnapshot {
  xBps: number;
  ofAmount: number;
  equals: number;
  formattedEquals: string;
  explanation: string;
}

export type BasisPointFieldErrors = {
  decimal?: string;
  percent?: string;
  permille?: string;
  basisPoints?: string;
  xBps?: string;
  ofAmount?: string;
  form?: string;
};

export function createDefaultInput(): BasisPointInput {
  return {
    decimal: '',
    percent: '',
    permille: '',
    basisPoints: '',
    xBps: '',
    ofAmount: '',
    currency: 'PKR',
  };
}
