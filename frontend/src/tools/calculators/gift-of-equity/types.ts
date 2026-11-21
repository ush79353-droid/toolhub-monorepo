import type { SupportedCurrency } from '@/tools/shared/currency';

/** Explicit calculation direction — avoids circular field updates. */
export type GiftOfEquityMode = 'gift' | 'salesPrice' | 'marketValue';

export interface GiftOfEquityInput {
  mode: GiftOfEquityMode;
  marketValue: string;
  salesPrice: string;
  giftOfEquity: string;
  currency: SupportedCurrency;
}

export interface GiftOfEquityResult {
  marketValue: number;
  salesPrice: number;
  giftOfEquity: number;
  /** True when MV − SP is negative (not a positive gift). */
  isNegativeDifference: boolean;
  currency: SupportedCurrency;
  formattedMarketValue: string;
  formattedSalesPrice: string;
  formattedGiftOfEquity: string;
}

export type GiftOfEquityFieldErrors = {
  marketValue?: string;
  salesPrice?: string;
  giftOfEquity?: string;
  form?: string;
};

export function createDefaultInput(): GiftOfEquityInput {
  return {
    mode: 'gift',
    marketValue: '',
    salesPrice: '',
    giftOfEquity: '',
    currency: 'PKR',
  };
}
