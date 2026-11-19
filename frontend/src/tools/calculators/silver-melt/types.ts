import type { SupportedCurrency } from '@/tools/shared/currency';

/** Includes troy (ozt) and avoirdupois (oz). */
export type SilverMeltWeightUnit = 'g' | 'kg' | 'ozt' | 'oz' | 'dwt' | 'gr';

export type SilverMeltPurityPreset =
  | 'fine-9999'
  | 'fine-999'
  | 'britannia-958'
  | 'mexican-950'
  | 'sterling-925'
  | 'coin-900'
  | 'european-835'
  | 'silver-800'
  | 'custom';

export type OtherMetalType = 'copper' | 'other' | 'custom';

export const SILVER_MELT_WEIGHT_UNIT_OPTIONS: readonly {
  value: SilverMeltWeightUnit;
  label: string;
  short: string;
}[] = [
  { value: 'g', label: 'Grams (g)', short: 'g' },
  { value: 'kg', label: 'Kilograms (kg)', short: 'kg' },
  { value: 'ozt', label: 'Troy ounces (oz t)', short: 'oz t' },
  { value: 'oz', label: 'Ounces (oz)', short: 'oz' },
  { value: 'dwt', label: 'Pennyweights (dwt)', short: 'dwt' },
  { value: 'gr', label: 'Grains (gr)', short: 'gr' },
] as const;

export const SILVER_MELT_PURITY_PRESETS: readonly {
  value: SilverMeltPurityPreset;
  label: string;
  purityPercent: number | null;
}[] = [
  { value: 'fine-9999', label: 'Fine Silver (99.99%)', purityPercent: 99.99 },
  { value: 'fine-999', label: 'Fine Silver (99.9%)', purityPercent: 99.9 },
  { value: 'britannia-958', label: 'Britannia Silver (95.8%)', purityPercent: 95.8 },
  { value: 'mexican-950', label: 'Mexican Silver (95%)', purityPercent: 95 },
  { value: 'sterling-925', label: 'Sterling Silver (92.5%)', purityPercent: 92.5 },
  { value: 'coin-900', label: 'Coin Silver (90%)', purityPercent: 90 },
  { value: 'european-835', label: 'European Silver (83.5%)', purityPercent: 83.5 },
  { value: 'silver-800', label: 'Silver (80%)', purityPercent: 80 },
  { value: 'custom', label: 'Custom Purity', purityPercent: null },
] as const;

export const OTHER_METAL_OPTIONS: readonly {
  value: OtherMetalType;
  label: string;
}[] = [
  { value: 'copper', label: 'Copper' },
  { value: 'other', label: 'Other metal' },
  { value: 'custom', label: 'Custom metal' },
] as const;

export interface SilverMeltInput {
  weight: string;
  weightUnit: SilverMeltWeightUnit;
  purityPreset: SilverMeltPurityPreset;
  purityPercent: string;
  pureSilverUnit: SilverMeltWeightUnit;
  pricePerUnit: string;
  priceUnit: SilverMeltWeightUnit;
  currency: SupportedCurrency;
  alloyOpen: boolean;
  otherMetalType: OtherMetalType;
  otherMetalLabel: string;
  /** When true, other metal grams = total grams − pure silver grams. */
  deriveOtherFromRemainder: boolean;
  otherMetalWeight: string;
  otherMetalWeightUnit: SilverMeltWeightUnit;
  otherMetalPrice: string;
  otherMetalPriceUnit: SilverMeltWeightUnit;
}

export interface SilverMeltResult {
  weight: number;
  weightUnit: SilverMeltWeightUnit;
  weightInGrams: number;
  purityPreset: SilverMeltPurityPreset;
  purityPercent: number;
  purityFraction: number;
  pureSilverWeightInGrams: number;
  pureSilverWeight: number;
  pureSilverUnit: SilverMeltWeightUnit;
  pricePerUnit: number;
  priceUnit: SilverMeltWeightUnit;
  pricePerGram: number;
  silverMeltValue: number;
  alloyOpen: boolean;
  otherMetalType: OtherMetalType;
  otherMetalLabel: string;
  otherMetalWeightInGrams: number | null;
  otherMetalWeight: number | null;
  otherMetalWeightUnit: SilverMeltWeightUnit;
  otherMetalPrice: number | null;
  otherMetalPriceUnit: SilverMeltWeightUnit;
  otherMetalValue: number | null;
  combinedAlloyValue: number | null;
  currency: SupportedCurrency;
  summaryText: string;
}

export type SilverMeltFieldErrors = Partial<
  Record<
    | 'weight'
    | 'purityPercent'
    | 'pricePerUnit'
    | 'otherMetalWeight'
    | 'otherMetalPrice'
    | 'form',
    string
  >
>;

export function purityPercentForPreset(
  preset: SilverMeltPurityPreset,
): number | null {
  return (
    SILVER_MELT_PURITY_PRESETS.find((p) => p.value === preset)?.purityPercent ??
    null
  );
}

export function createDefaultInput(): SilverMeltInput {
  return {
    weight: '',
    weightUnit: 'g',
    purityPreset: 'sterling-925',
    purityPercent: '92.5',
    pureSilverUnit: 'g',
    pricePerUnit: '',
    priceUnit: 'g',
    currency: 'USD',
    alloyOpen: false,
    otherMetalType: 'copper',
    otherMetalLabel: '',
    deriveOtherFromRemainder: true,
    otherMetalWeight: '',
    otherMetalWeightUnit: 'g',
    otherMetalPrice: '',
    otherMetalPriceUnit: 'g',
  };
}

export function createExampleInput(): SilverMeltInput {
  return {
    weight: '225',
    weightUnit: 'g',
    purityPreset: 'sterling-925',
    purityPercent: '92.5',
    pureSilverUnit: 'g',
    pricePerUnit: '0.90',
    priceUnit: 'g',
    currency: 'USD',
    alloyOpen: false,
    otherMetalType: 'copper',
    otherMetalLabel: '',
    deriveOtherFromRemainder: true,
    otherMetalWeight: '',
    otherMetalWeightUnit: 'g',
    otherMetalPrice: '',
    otherMetalPriceUnit: 'g',
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): SilverMeltInput {
  return {
    ...createDefaultInput(),
    currency,
  };
}
