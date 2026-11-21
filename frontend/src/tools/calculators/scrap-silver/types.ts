import type { SupportedCurrency } from '@/tools/shared/currency';

/** Precious-metal weight units (troy ounce, not avoirdupois). */
export type ScrapSilverWeightUnit = 'g' | 'kg' | 'ozt' | 'dwt' | 'gr';

export type SilverPurityPreset =
  | 'fine-999'
  | 'fine-9999'
  | 'sterling-925'
  | 'coin-900'
  | 'britannia-958'
  | 'mexican-950'
  | 'pct-900'
  | 'pct-800'
  | 'custom';

export const SCRAP_SILVER_WEIGHT_UNIT_OPTIONS: readonly {
  value: ScrapSilverWeightUnit;
  label: string;
  short: string;
}[] = [
  { value: 'g', label: 'Grams (g)', short: 'g' },
  { value: 'kg', label: 'Kilograms (kg)', short: 'kg' },
  { value: 'ozt', label: 'Troy ounces (oz t)', short: 'oz t' },
  { value: 'dwt', label: 'Pennyweights (dwt)', short: 'dwt' },
  { value: 'gr', label: 'Grains (gr)', short: 'gr' },
] as const;

export const SILVER_PURITY_PRESETS: readonly {
  value: SilverPurityPreset;
  label: string;
  /** Fineness fraction 0–1, or null for custom. */
  fineness: number | null;
}[] = [
  { value: 'fine-999', label: 'Fine Silver (.999)', fineness: 0.999 },
  { value: 'fine-9999', label: 'Fine Silver (.9999)', fineness: 0.9999 },
  { value: 'sterling-925', label: 'Sterling Silver (.925)', fineness: 0.925 },
  { value: 'coin-900', label: 'Coin Silver (.900)', fineness: 0.9 },
  { value: 'britannia-958', label: 'Britannia Silver (.958)', fineness: 0.958 },
  { value: 'mexican-950', label: 'Mexican Silver (.950)', fineness: 0.95 },
  { value: 'pct-900', label: '90% Silver (.900)', fineness: 0.9 },
  { value: 'pct-800', label: '80% Silver (.800)', fineness: 0.8 },
  { value: 'custom', label: 'Custom Purity', fineness: null },
] as const;

export interface ScrapSilverInput {
  weight: string;
  weightUnit: ScrapSilverWeightUnit;
  purityPreset: SilverPurityPreset;
  /** Purity percentage 0–100 (e.g. 92.5 for sterling). */
  purityPercent: string;
  pureSilverUnit: ScrapSilverWeightUnit;
  pricePerUnit: string;
  priceUnit: ScrapSilverWeightUnit;
  currency: SupportedCurrency;
  sellOpen: boolean;
  dealerDiscountPercent: string;
  refiningFee: string;
  transactionFee: string;
}

export interface ScrapSilverResult {
  weight: number;
  weightUnit: ScrapSilverWeightUnit;
  weightInGrams: number;
  purityPreset: SilverPurityPreset;
  purityPercent: number;
  purityFraction: number;
  pureSilverWeightInGrams: number;
  pureSilverWeight: number;
  pureSilverUnit: ScrapSilverWeightUnit;
  pricePerUnit: number;
  priceUnit: ScrapSilverWeightUnit;
  pricePerGram: number;
  silverValue: number;
  dealerDiscountPercent: number;
  dealerDiscountAmount: number;
  refiningFee: number;
  transactionFee: number;
  totalFees: number;
  estimatedSellingValue: number;
  currency: SupportedCurrency;
  summaryText: string;
}

export type ScrapSilverFieldErrors = Partial<
  Record<
    | 'weight'
    | 'purityPercent'
    | 'pricePerUnit'
    | 'dealerDiscountPercent'
    | 'refiningFee'
    | 'transactionFee'
    | 'form',
    string
  >
>;

export function purityPercentForPreset(
  preset: SilverPurityPreset,
): number | null {
  const found = SILVER_PURITY_PRESETS.find((p) => p.value === preset);
  if (!found || found.fineness === null) return null;
  return found.fineness * 100;
}

export function createDefaultInput(): ScrapSilverInput {
  return {
    weight: '',
    weightUnit: 'g',
    purityPreset: 'sterling-925',
    purityPercent: '92.5',
    pureSilverUnit: 'g',
    pricePerUnit: '',
    priceUnit: 'g',
    currency: 'USD',
    sellOpen: false,
    dealerDiscountPercent: '0',
    refiningFee: '0',
    transactionFee: '0',
  };
}

export function createExampleInput(): ScrapSilverInput {
  return {
    weight: '100',
    weightUnit: 'g',
    purityPreset: 'sterling-925',
    purityPercent: '92.5',
    pureSilverUnit: 'g',
    pricePerUnit: '0.85',
    priceUnit: 'g',
    currency: 'USD',
    sellOpen: false,
    dealerDiscountPercent: '0',
    refiningFee: '0',
    transactionFee: '0',
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): ScrapSilverInput {
  return {
    ...createDefaultInput(),
    currency,
  };
}
