import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EbitdaMultipleInput {
  cash: string;
  marketCap: string;
  minorityInterest: string;
  preferredEquity: string;
  debt: string;
  ebitda: string;
  currency: SupportedCurrency;
}

export interface EbitdaMultipleResult {
  enterpriseValue: number;
  ebitdaMultiple: number | null;
  currency: SupportedCurrency;
  formattedEv: string;
  formattedMultiple: string | null;
  interpretation: string;
  warningMessage: string | null;
}

export type EbitdaMultipleFieldErrors = {
  form?: string;
  cash?: string;
  marketCap?: string;
  minorityInterest?: string;
  preferredEquity?: string;
  debt?: string;
  ebitda?: string;
};

/** Reference: EV $545M ÷ EBITDA $50M → 10.90× */
export function createDefaultInput(): EbitdaMultipleInput {
  return {
    cash: '20000000',
    marketCap: '450000000',
    minorityInterest: '5000000',
    preferredEquity: '10000000',
    debt: '100000000',
    ebitda: '50000000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): EbitdaMultipleInput {
  return {
    cash: '',
    marketCap: '',
    minorityInterest: '',
    preferredEquity: '',
    debt: '',
    ebitda: '',
    currency,
  };
}
