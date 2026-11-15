import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EffectiveCorporateTaxRateInput {
  earningsBeforeTax: string;
  incomeTaxPaid: string;
  currency: SupportedCurrency;
}

export interface EffectiveCorporateTaxRateResult {
  earningsBeforeTax: number;
  incomeTaxPaid: number;
  effectiveRatePercent: number;
  currency: SupportedCurrency;
  formattedRate: string;
}

export type EffectiveCorporateTaxRateFieldErrors = {
  earningsBeforeTax?: string;
  incomeTaxPaid?: string;
  currency?: string;
  form?: string;
};

export function createDefaultInput(): EffectiveCorporateTaxRateInput {
  return {
    earningsBeforeTax: '',
    incomeTaxPaid: '',
    currency: 'PKR',
  };
}
