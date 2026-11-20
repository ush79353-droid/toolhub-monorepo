import type { SupportedCurrency } from '@/tools/shared/currency';

export type PedClassification =
  | 'elastic'
  | 'unitElastic'
  | 'inelastic'
  | 'perfectlyInelastic'
  | 'positiveUnit'
  | 'positiveRelationship'
  | 'unavailable';

export type PedStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'undefinedElasticity';

export interface PriceElasticityOfDemandInput {
  initialPrice: string;
  initialQuantity: string;
  finalPrice: string;
  finalQuantity: string;
  currency: SupportedCurrency;
}

export interface PriceElasticityOfDemandResult {
  priceElasticity: number | null;
  classification: PedClassification;
  classificationLabel: string;
  initialRevenue: number | null;
  finalRevenue: number | null;
  revenueIncreasePercent: number | null;
  revenueIncreaseUndefinedReason: string | null;
  priceChange: number | null;
  averagePrice: number | null;
  percentPriceChange: number | null;
  quantityChange: number | null;
  averageQuantity: number | null;
  percentQuantityChange: number | null;
  revenueChangeAmount: number | null;
  status: PedStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedPriceElasticity: string | null;
  formattedInitialRevenue: string | null;
  formattedFinalRevenue: string | null;
  formattedRevenueIncrease: string | null;
  formattedPriceChange: string | null;
  formattedAveragePrice: string | null;
  formattedPercentPriceChange: string | null;
  formattedQuantityChange: string | null;
  formattedAverageQuantity: string | null;
  formattedPercentQuantityChange: string | null;
  formattedRevenueChangeAmount: string | null;
}

export type PriceElasticityOfDemandFieldErrors = {
  initialPrice?: string;
  initialQuantity?: string;
  finalPrice?: string;
  finalQuantity?: string;
  form?: string;
};

export function createDefaultInput(): PriceElasticityOfDemandInput {
  return {
    initialPrice: '',
    initialQuantity: '',
    finalPrice: '',
    finalQuantity: '',
    currency: 'PKR',
  };
}
