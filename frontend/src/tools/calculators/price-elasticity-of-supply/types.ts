import type { SupportedCurrency } from '@/tools/shared/currency';

export type PesMethod = 'standard' | 'midpoint';

export type PesClassification =
  | 'perfectlyInelastic'
  | 'inelastic'
  | 'unitElastic'
  | 'elastic'
  | 'negative'
  | 'undefined'
  | 'unavailable';

export type PesStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'undefinedElasticity';

export const PES_METHOD_OPTIONS: readonly {
  id: PesMethod;
  label: string;
  short: string;
}[] = [
  {
    id: 'standard',
    label: 'Standard',
    short: 'Percentage changes use Period 1 as the base (P₁, Q₁).',
  },
  {
    id: 'midpoint',
    label: 'Midpoint (Arc Elasticity)',
    short: 'Percentage changes use averages of the two observations (symmetric).',
  },
] as const;

export interface PriceElasticityOfSupplyInput {
  method: PesMethod;
  price1: string;
  price2: string;
  quantity1: string;
  quantity2: string;
  currency: SupportedCurrency;
}

export interface PriceElasticityOfSupplyResult {
  method: PesMethod;
  methodLabel: string;
  pes: number | null;
  classification: PesClassification;
  classificationLabel: string;
  percentPriceChange: number | null;
  percentQuantityChange: number | null;
  priceChange: number | null;
  quantityChange: number | null;
  status: PesStatus;
  interpretation: string;
  warningMessage: string | null;
  formulaBreakdown: string;
  steps: string[];
  currency: SupportedCurrency;
  formattedPes: string;
  formattedPercentPrice: string;
  formattedPercentQuantity: string;
  p1: number | null;
  p2: number | null;
  q1: number | null;
  q2: number | null;
}

export type PriceElasticityOfSupplyFieldErrors = {
  form?: string;
  price1?: string;
  price2?: string;
  quantity1?: string;
  quantity2?: string;
};

export function createDefaultInput(): PriceElasticityOfSupplyInput {
  return {
    method: 'standard',
    price1: '',
    price2: '',
    quantity1: '',
    quantity2: '',
    currency: 'USD',
  };
}

export function createEmptyInput(
  method: PesMethod = 'standard'
): PriceElasticityOfSupplyInput {
  return { ...createDefaultInput(), method };
}

export function createExampleInput(
  method: PesMethod = 'standard'
): PriceElasticityOfSupplyInput {
  return {
    method,
    price1: '100',
    price2: '120',
    quantity1: '500',
    quantity2: '600',
    currency: 'USD',
  };
}
