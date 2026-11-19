import type { SupportedCurrency } from '@/tools/shared/currency';

export type WeightUnit = 'g' | 'kg' | 'ozt' | 'oz' | 'dwt' | 'gr';

export type PriceUnit = 'per-gram' | 'per-troy-ounce' | 'per-kilogram';

export type KaratOption =
  | '24'
  | '23'
  | '22'
  | '21'
  | '20'
  | '18'
  | '14'
  | '12'
  | '10'
  | '9'
  | '8'
  | 'custom';

export const KARAT_OPTIONS: readonly {
  value: KaratOption;
  label: string;
  purityPercent: number | null;
}[] = [
  { value: '24', label: '24K', purityPercent: 99.9 },
  { value: '23', label: '23K', purityPercent: 95.83 },
  { value: '22', label: '22K', purityPercent: 91.67 },
  { value: '21', label: '21K', purityPercent: 87.5 },
  { value: '20', label: '20K', purityPercent: 83.33 },
  { value: '18', label: '18K', purityPercent: 75 },
  { value: '14', label: '14K', purityPercent: 58.33 },
  { value: '12', label: '12K', purityPercent: 50 },
  { value: '10', label: '10K', purityPercent: 41.67 },
  { value: '9', label: '9K', purityPercent: 37.5 },
  { value: '8', label: '8K', purityPercent: 33.33 },
  { value: 'custom', label: 'Custom purity', purityPercent: null },
] as const;

export const WEIGHT_UNIT_OPTIONS: readonly {
  value: WeightUnit;
  label: string;
}[] = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'ozt', label: 'Troy ounces (ozt)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'dwt', label: 'Pennyweights (dwt)' },
  { value: 'gr', label: 'Grains' },
] as const;

export const PRICE_UNIT_OPTIONS: readonly {
  value: PriceUnit;
  label: string;
}[] = [
  { value: 'per-troy-ounce', label: 'Per troy ounce' },
  { value: 'per-gram', label: 'Per gram' },
  { value: 'per-kilogram', label: 'Per kilogram' },
] as const;

export interface GoldMeltInput {
  karat: KaratOption;
  purity: string;
  weight: string;
  weightUnit: WeightUnit;
  marketPrice: string;
  marketPriceUnit: PriceUnit;
  currency: SupportedCurrency;
  spread: string;
  bidPrice: string;
  askPrice: string;
  bidPriceManuallySet: boolean;
  askPriceManuallySet: boolean;
}

export interface GoldMeltResult {
  weightInGrams: number;
  purityPercentage: number;
  pureGoldWeight: number;
  marketPricePerGram: number;
  meltValue: number;
  bidPricePerUnit: number;
  askPricePerUnit: number;
  bidPricePerGram: number;
  askPricePerGram: number;
  bidValue: number;
  askValue: number;
  spreadDifference: number;
  spreadPercentage: number;
  currency: SupportedCurrency;
  marketPriceUnit: PriceUnit;
  weightUnit: WeightUnit;
  karat: KaratOption;
  summaryText: string;
}

export type GoldMeltFieldErrors = {
  purity?: string;
  weight?: string;
  marketPrice?: string;
  spread?: string;
  bidPrice?: string;
  askPrice?: string;
  form?: string;
};

export function createDefaultInput(): GoldMeltInput {
  return {
    karat: '18',
    purity: '75',
    weight: '10',
    weightUnit: 'g',
    marketPrice: '2000',
    marketPriceUnit: 'per-troy-ounce',
    currency: 'USD',
    spread: '5',
    bidPrice: '',
    askPrice: '',
    bidPriceManuallySet: false,
    askPriceManuallySet: false,
  };
}

export function createBlankInput(currency: SupportedCurrency = 'USD'): GoldMeltInput {
  return {
    karat: '18',
    purity: '75',
    weight: '',
    weightUnit: 'g',
    marketPrice: '',
    marketPriceUnit: 'per-troy-ounce',
    currency,
    spread: '5',
    bidPrice: '',
    askPrice: '',
    bidPriceManuallySet: false,
    askPriceManuallySet: false,
  };
}

export function purityForKarat(karat: KaratOption): number | null {
  return KARAT_OPTIONS.find((o) => o.value === karat)?.purityPercent ?? null;
}
