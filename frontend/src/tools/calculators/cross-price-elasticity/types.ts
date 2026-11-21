import type { SupportedCurrency } from '@/tools/shared/currency';

export type ElasticityMethod = 'initialValue' | 'midpoint';

export type CrossPriceRelationship =
  | 'substitutes'
  | 'complements'
  | 'approximatelyUnrelated'
  | 'unknown';

export type CrossPriceMagnitude =
  | 'inelastic'
  | 'unitMagnitude'
  | 'elastic'
  | 'zero'
  | 'unknown';

export type CrossPriceStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroPriceChange'
  | 'undefinedPercentageChange';

export interface CrossPriceElasticityInput {
  method: ElasticityMethod;
  initialPriceA: string;
  initialDemandB: string;
  finalPriceA: string;
  finalDemandB: string;
  currency: SupportedCurrency;
  quantityUnit: string;
}

export interface CrossPriceElasticityResult {
  priceChangePercentage: number;
  demandChangePercentage: number;
  elasticity: number;
  relationship: CrossPriceRelationship;
  magnitude: CrossPriceMagnitude;
  status: CrossPriceStatus;
  interpretation: string;
  method: ElasticityMethod;
  currency: SupportedCurrency;
  quantityUnit: string;
  formattedPriceChangePercentage: string;
  formattedDemandChangePercentage: string;
  formattedElasticity: string;
}

export type CrossPriceElasticityFieldErrors = {
  initialPriceA?: string;
  initialDemandB?: string;
  finalPriceA?: string;
  finalDemandB?: string;
  form?: string;
};

export function createDefaultInput(): CrossPriceElasticityInput {
  return {
    method: 'initialValue',
    initialPriceA: '',
    initialDemandB: '',
    finalPriceA: '',
    finalDemandB: '',
    currency: 'PKR',
    quantityUnit: 'units',
  };
}
