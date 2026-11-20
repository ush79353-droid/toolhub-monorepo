import type { SupportedCurrency } from '@/tools/shared/currency';

export type DiscountMode = 'amount' | 'percentage';

export type OfferStatus =
  | 'valid'
  | 'zeroOffer'
  | 'negativeOffer'
  | 'incomplete'
  | 'invalid';

export interface WhatToOfferInput {
  fairMarketValue: string;
  renovationCost: string;
  discountMode: DiscountMode;
  desiredDiscount: string;
  desiredProfit: string;
  currency: SupportedCurrency;
}

export interface WhatToOfferResult {
  fairMarketValue: number;
  renovationCost: number;
  discountAmount: number;
  desiredProfit: number;
  totalDeductions: number;
  rawOfferAmount: number;
  /** Positive actionable offer, or null when zero/negative. */
  actionableOfferAmount: number | null;
  offerToValuePercentage: number | null;
  totalOfferReductionPercentage: number | null;
  status: OfferStatus;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedFairMarketValue: string;
  formattedRenovationCost: string;
  formattedDiscountAmount: string;
  formattedDesiredProfit: string;
  formattedTotalDeductions: string;
  formattedRawOfferAmount: string;
  formattedActionableOfferAmount: string | null;
  formattedOfferToValue: string | null;
  formattedTotalOfferReduction: string | null;
}

export type WhatToOfferFieldErrors = {
  fairMarketValue?: string;
  renovationCost?: string;
  desiredDiscount?: string;
  desiredProfit?: string;
  form?: string;
};

export function createDefaultInput(): WhatToOfferInput {
  return {
    fairMarketValue: '',
    renovationCost: '',
    discountMode: 'amount',
    desiredDiscount: '',
    desiredProfit: '',
    currency: 'PKR',
  };
}
