import type { SupportedCurrency } from '@/tools/shared/currency';

export type EbitCalculationMode = 'ebit' | 'revenue' | 'operatingExpenses';

export type EbitStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'invalidReverseResult'
  | 'zeroRevenue';

export interface EbitInput {
  mode: EbitCalculationMode;
  revenue: string;
  operatingExpenses: string;
  ebit: string;
  currency: SupportedCurrency;
}

export interface EbitResult {
  revenue: number;
  operatingExpenses: number;
  ebit: number;
  ebitMargin: number | null;
  status: EbitStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedRevenue: string;
  formattedOperatingExpenses: string;
  formattedEbit: string;
  formattedEbitMargin: string | null;
}

export type EbitFieldErrors = {
  revenue?: string;
  operatingExpenses?: string;
  ebit?: string;
  form?: string;
};

export function createDefaultInput(): EbitInput {
  return {
    mode: 'ebit',
    revenue: '',
    operatingExpenses: '',
    ebit: '',
    currency: 'PKR',
  };
}
