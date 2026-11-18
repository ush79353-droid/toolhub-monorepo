import type { SupportedCurrency } from '@/tools/shared/currency';

export type IrpVersion = 'covered' | 'uncovered';

/** Tracks which interest-rate field was last edited to avoid circular sync. */
export type RateSource = 'annualised' | 'periodic';

export interface InterestRateParityInput {
  version: IrpVersion;
  contractDays: string;
  annualisedPriceRatePercent: string;
  priceRatePercent: string;
  priceRateSource: RateSource;
  annualisedBaseRatePercent: string;
  baseRatePercent: string;
  baseRateSource: RateSource;
  spotPrice: string;
  /** Quote (price) currency of the spot FX rate: price-currency units per one base unit. */
  spotCurrency: SupportedCurrency;
  /** Display quote currency for the calculated forward / expected future spot. */
  forwardCurrency: SupportedCurrency;
}

export interface InterestRateParityResult {
  priceRatePercent: number;
  baseRatePercent: number;
  annualisedPriceRatePercent: number;
  annualisedBaseRatePercent: number;
  /** Forward (covered) or expected future spot (uncovered), in spot quote currency. */
  forwardInSpotCurrency: number;
  forwardDisplay: number;
  spotCurrency: SupportedCurrency;
  forwardCurrency: SupportedCurrency;
  version: IrpVersion;
  formattedForward: string;
}

export type InterestRateParityFieldErrors = {
  contractDays?: string;
  annualisedPriceRatePercent?: string;
  priceRatePercent?: string;
  annualisedBaseRatePercent?: string;
  baseRatePercent?: string;
  spotPrice?: string;
  form?: string;
};

/** Omni example defaults: USD/EUR, 90 days, 0.8% / 3.2% annualised, spot 0.1735. */
export function createDefaultInput(): InterestRateParityInput {
  return {
    version: 'covered',
    contractDays: '90',
    annualisedPriceRatePercent: '0.8',
    priceRatePercent: '0.2',
    priceRateSource: 'annualised',
    annualisedBaseRatePercent: '3.2',
    baseRatePercent: '0.8',
    baseRateSource: 'annualised',
    spotPrice: '0.1735',
    spotCurrency: 'PKR',
    forwardCurrency: 'PKR',
  };
}
