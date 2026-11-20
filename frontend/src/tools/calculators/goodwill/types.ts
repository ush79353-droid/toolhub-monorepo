import type { SupportedCurrency } from '@/tools/shared/currency';

export type GoodwillStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroGoodwill'
  | 'potentialBargainPurchase';

export interface GoodwillInput {
  purchasePrice: string;
  fairValueOfAssets: string;
  fairValueOfLiabilities: string;
  currency: SupportedCurrency;
}

export interface GoodwillResult {
  purchasePrice: number;
  fairValueOfAssets: number;
  fairValueOfLiabilities: number;
  netIdentifiableAssets: number;
  /** Signed residual: Purchase Price − Net Identifiable Assets. */
  acquisitionResidual: number;
  /** Recognized goodwill under simplified model: max(0, residual). */
  goodwill: number;
  /** Absolute value when residual < 0; otherwise 0. */
  bargainPurchaseDifference: number;
  status: GoodwillStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedPurchasePrice: string;
  formattedFairValueOfAssets: string;
  formattedFairValueOfLiabilities: string;
  formattedNetIdentifiableAssets: string;
  formattedGoodwill: string;
  formattedBargainPurchaseDifference: string | null;
}

export type GoodwillFieldErrors = {
  purchasePrice?: string;
  fairValueOfAssets?: string;
  fairValueOfLiabilities?: string;
  form?: string;
};

export function createDefaultInput(): GoodwillInput {
  return {
    purchasePrice: '',
    fairValueOfAssets: '',
    fairValueOfLiabilities: '',
    currency: 'PKR',
  };
}
