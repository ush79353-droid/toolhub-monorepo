import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ExpectedUtilityInput {
  probability1: string;
  value1: string;
  probability2: string;
  value2: string;
  currency: SupportedCurrency;
}

export interface ExpectedUtilityResult {
  probability1: number;
  value1: number;
  probability2: number;
  value2: number;
  expectedUtility: number;
  currency: SupportedCurrency;
  formattedExpectedUtility: string;
}

export type ExpectedUtilityFieldErrors = {
  probability1?: string;
  value1?: string;
  probability2?: string;
  value2?: string;
  form?: string;
};

export function createDefaultInput(): ExpectedUtilityInput {
  return {
    probability1: '',
    value1: '',
    probability2: '',
    value2: '',
    currency: 'PKR',
  };
}
