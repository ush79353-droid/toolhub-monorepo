import type { SupportedCurrency } from '@/tools/shared/currency';

export type ValuationMethod = 'property-value' | 'average-price';
export type AreaUnit = 'ft2' | 'm2';

export interface ArvInput {
  method: ValuationMethod;
  /** Direct property current value (method = property-value). */
  propertyValue: string;
  /** Average price per area unit (method = average-price). */
  averagePrice: string;
  propertyArea: string;
  areaUnit: AreaUnit;
  /** Value added by renovations (not necessarily renovation cost). */
  renovationValue: string;
  /** Total renovation cost for bid / ROI. */
  renovationCost: string;
  /** Investor purchase rule percent (default 70). */
  purchaseRulePercent: string;
  /** Optional custom purchase price for primary ROI (Additional settings). */
  purchasePrice: string;
  /** Optional target ROI % for reverse purchase-price estimate. */
  targetRoiPercent: string;
  currency: SupportedCurrency;
}

export interface ArvResult {
  propertyValue: number;
  arv: number;
  maximumBid: number;
  maximumBidNegative: boolean;
  /** Primary ROI %; null when investment is zero / unavailable. */
  roiPercent: number | null;
  /** Whether ROI used maximum bid as assumed purchase price. */
  roiUsedMaximumBid: boolean;
  purchasePriceUsed: number;
  totalInvestment: number;
  estimatedGrossProfit: number | null;
  /** Reverse solve for target ROI; null when target blank/invalid. */
  targetPurchasePrice: number | null;
  currency: SupportedCurrency;
  formattedPropertyValue: string;
  formattedArv: string;
  formattedMaximumBid: string;
  formattedRoi: string | null;
  formattedPurchasePriceUsed: string;
  formattedTotalInvestment: string;
  formattedGrossProfit: string | null;
  formattedTargetPurchasePrice: string | null;
}

export type ArvFieldErrors = {
  propertyValue?: string;
  averagePrice?: string;
  propertyArea?: string;
  renovationValue?: string;
  renovationCost?: string;
  purchaseRulePercent?: string;
  purchasePrice?: string;
  targetRoiPercent?: string;
  form?: string;
};

export function createDefaultInput(): ArvInput {
  return {
    method: 'property-value',
    propertyValue: '',
    averagePrice: '',
    propertyArea: '',
    areaUnit: 'ft2',
    renovationValue: '',
    renovationCost: '',
    purchaseRulePercent: '70',
    purchasePrice: '',
    targetRoiPercent: '',
    currency: 'USD',
  };
}
