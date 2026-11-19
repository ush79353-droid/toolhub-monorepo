import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CashRatioInput {
  cashAndEquivalents: string;
  cashCurrency: SupportedCurrency;
  currentLiabilities: string;
  liabilitiesCurrency: SupportedCurrency;
  /** Collapsed disclosure only — no component fields until specs exist. */
  cashBreakdownOpen: boolean;
}

export interface CashRatioResult {
  cashNormalized: number;
  liabilitiesNormalized: number;
  cashRatio: number;
  calcCurrency: SupportedCurrency;
  formattedCashRatio: string;
  summaryText: string;
}

export type CashRatioFieldErrors = {
  cashAndEquivalents?: string;
  currentLiabilities?: string;
  form?: string;
};

export function createDefaultInput(): CashRatioInput {
  return {
    cashAndEquivalents: '',
    cashCurrency: 'PKR',
    currentLiabilities: '',
    liabilitiesCurrency: 'PKR',
    cashBreakdownOpen: false,
  };
}
