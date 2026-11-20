import type { SupportedCurrency } from '@/tools/shared/currency';

export type PivotMethod =
  | 'classic'
  | 'woodie'
  | 'camarilla'
  | 'fibonacci'
  | 'demark';

export interface PivotPointInput {
  method: PivotMethod;
  high: string;
  low: string;
  close: string;
  open: string;
  currency: SupportedCurrency;
}

export interface PivotPointResult {
  method: PivotMethod;
  pivot: number | null;
  r1: number | null;
  r2: number | null;
  r3: number | null;
  r4: number | null;
  s1: number | null;
  s2: number | null;
  s3: number | null;
  s4: number | null;
  currency: SupportedCurrency;
  formattedPivot: string | null;
  formattedR1: string | null;
  formattedR2: string | null;
  formattedR3: string | null;
  formattedR4: string | null;
  formattedS1: string | null;
  formattedS2: string | null;
  formattedS3: string | null;
  formattedS4: string | null;
  warningMessage: string | null;
}

export type PivotPointFieldErrors = {
  form?: string;
  high?: string;
  low?: string;
  close?: string;
  open?: string;
};

export const PIVOT_METHOD_LABELS: Record<PivotMethod, string> = {
  classic: 'Classic',
  woodie: 'Woodie',
  camarilla: 'Camarilla',
  fibonacci: 'Fibonacci',
  demark: 'DeMark',
};

/** Reference Classic: H110 L90 C100 → PP100 R1 110 R2 120 R3 130 S1 90 S2 80 S3 70 */
export function createDefaultInput(): PivotPointInput {
  return {
    method: 'classic',
    high: '110',
    low: '90',
    close: '100',
    open: '95',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): PivotPointInput {
  return {
    method: 'classic',
    high: '',
    low: '',
    close: '',
    open: '',
    currency,
  };
}
