import type { SupportedCurrency } from '@/tools/shared/currency';

/** Precious-metal weight units (troy ounce, not avoirdupois). */
export type ScrapGoldWeightUnit = 'g' | 'kg' | 'ozt' | 'dwt' | 'gr';

export type PurityDriver = 'karat' | 'percent';

export const SCRAP_GOLD_WEIGHT_UNIT_OPTIONS: readonly {
  value: ScrapGoldWeightUnit;
  label: string;
  short: string;
}[] = [
  { value: 'g', label: 'Grams (g)', short: 'g' },
  { value: 'kg', label: 'Kilograms (kg)', short: 'kg' },
  { value: 'ozt', label: 'Troy ounces (oz t)', short: 'oz t' },
  { value: 'dwt', label: 'Pennyweights (dwt)', short: 'dwt' },
  { value: 'gr', label: 'Grains (gr)', short: 'gr' },
] as const;

export const SUGGESTED_KARATS = [24, 22, 21, 20, 18, 14, 12, 10, 9] as const;

export interface ScrapGoldInput {
  weight: string;
  weightUnit: ScrapGoldWeightUnit;
  karat: string;
  purityPercent: string;
  purityDriver: PurityDriver;
  pureGoldUnit: ScrapGoldWeightUnit;
  pricePerUnit: string;
  priceUnit: ScrapGoldWeightUnit;
  currency: SupportedCurrency;
}

export interface ScrapGoldResult {
  weight: number;
  weightUnit: ScrapGoldWeightUnit;
  weightInGrams: number;
  karat: number;
  purityPercent: number;
  pureGoldWeightInGrams: number;
  pureGoldWeight: number;
  pureGoldUnit: ScrapGoldWeightUnit;
  pricePerUnit: number;
  priceUnit: ScrapGoldWeightUnit;
  pricePerGram: number;
  totalValue: number;
  currency: SupportedCurrency;
  summaryText: string;
}

export type ScrapGoldFieldErrors = Partial<
  Record<'weight' | 'karat' | 'purityPercent' | 'pricePerUnit' | 'form', string>
>;

export function createDefaultInput(): ScrapGoldInput {
  return {
    weight: '',
    weightUnit: 'g',
    karat: '24',
    purityPercent: '100',
    purityDriver: 'karat',
    pureGoldUnit: 'g',
    pricePerUnit: '',
    priceUnit: 'g',
    currency: 'USD',
  };
}

export function createExampleInput(): ScrapGoldInput {
  return {
    weight: '120',
    weightUnit: 'g',
    karat: '18',
    purityPercent: '75',
    purityDriver: 'karat',
    pureGoldUnit: 'g',
    pricePerUnit: '39',
    priceUnit: 'g',
    currency: 'USD',
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): ScrapGoldInput {
  return {
    ...createDefaultInput(),
    currency,
  };
}
