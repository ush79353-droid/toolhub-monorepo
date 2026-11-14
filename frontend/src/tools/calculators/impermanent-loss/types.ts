import type { SupportedCurrency } from '@/tools/shared/currency';

export type WeightPair = '50/50' | '80/20' | '20/80' | '70/30' | '30/70';

export interface ImpermanentLossInput {
  weights: WeightPair;
  initialDeposit: string;
  initialPriceA: string;
  futurePriceA: string;
  initialPriceB: string;
  futurePriceB: string;
  currency: SupportedCurrency;
}

export interface ImpermanentLossResult {
  weights: WeightPair;
  weightA: number;
  weightB: number;
  initialDeposit: number;
  initialPriceA: number;
  futurePriceA: number;
  initialPriceB: number;
  futurePriceB: number;
  quantityA: number;
  quantityB: number;
  hodlValue: number;
  poolValue: number;
  impermanentLossPercent: number;
  netLossVsHolding: number;
  currency: SupportedCurrency;
  formattedQuantityA: string;
  formattedQuantityB: string;
  formattedImpermanentLoss: string;
  formattedHodlValue: string;
  formattedPoolValue: string;
  formattedNetLoss: string;
}

export type ImpermanentLossFieldErrors = {
  initialDeposit?: string;
  initialPriceA?: string;
  futurePriceA?: string;
  initialPriceB?: string;
  futurePriceB?: string;
  form?: string;
};

export const WEIGHT_OPTIONS: readonly {
  value: WeightPair;
  label: string;
  weightA: number;
  weightB: number;
}[] = [
  { value: '50/50', label: '50/50', weightA: 0.5, weightB: 0.5 },
  { value: '80/20', label: '80/20', weightA: 0.8, weightB: 0.2 },
  { value: '20/80', label: '20/80', weightA: 0.2, weightB: 0.8 },
  { value: '70/30', label: '70/30', weightA: 0.7, weightB: 0.3 },
  { value: '30/70', label: '30/70', weightA: 0.3, weightB: 0.7 },
] as const;

export function createDefaultInput(): ImpermanentLossInput {
  return {
    weights: '50/50',
    initialDeposit: '',
    initialPriceA: '',
    futurePriceA: '',
    initialPriceB: '',
    futurePriceB: '',
    currency: 'PKR',
  };
}

export function weightParts(weights: WeightPair): { weightA: number; weightB: number } {
  const opt = WEIGHT_OPTIONS.find((o) => o.value === weights);
  return { weightA: opt?.weightA ?? 0.5, weightB: opt?.weightB ?? 0.5 };
}
