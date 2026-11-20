import type { SupportedCurrency } from '@/tools/shared/currency';

export type ConsumerSurplusMode =
  | 'consumerSurplus'
  | 'willingPrice'
  | 'actualPrice';

export type ConsumerSurplusStatus =
  | 'valid'
  | 'zeroSurplus'
  | 'priceExceedsWillingness'
  | 'incomplete'
  | 'invalid';

export interface ConsumerSurplusInput {
  mode: ConsumerSurplusMode;
  actualPrice: string;
  willingPrice: string;
  consumerSurplus: string;
  currency: SupportedCurrency;
}

export interface ConsumerSurplusResult {
  actualPrice: number;
  willingPrice: number;
  signedPriceDifference: number;
  consumerSurplus: number | null;
  savingsPercentage: number | null;
  status: ConsumerSurplusStatus;
  warningMessage: string | null;
  interpretation: string;
  currency: SupportedCurrency;
  formattedActualPrice: string;
  formattedWillingPrice: string;
  formattedSignedDifference: string;
  formattedConsumerSurplus: string | null;
  formattedSavingsPercentage: string | null;
}

export type ConsumerSurplusFieldErrors = {
  actualPrice?: string;
  willingPrice?: string;
  consumerSurplus?: string;
  form?: string;
};

export function createDefaultInput(): ConsumerSurplusInput {
  return {
    mode: 'consumerSurplus',
    actualPrice: '',
    willingPrice: '',
    consumerSurplus: '',
    currency: 'PKR',
  };
}
