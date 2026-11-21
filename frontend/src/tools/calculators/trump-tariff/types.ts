import type { SupportedCurrency } from '@/tools/shared/currency';

export type TariffMode = 'product' | 'country';

export type ProductCategory =
  | 'popular'
  | 'auto'
  | 'electronics'
  | 'apparel'
  | 'steel-aluminum'
  | 'other';

export type ProductPresetId =
  | 'smartphone'
  | 'laptop'
  | 'passenger-vehicle'
  | 'auto-parts'
  | 'television'
  | 'clothing'
  | 'steel'
  | 'aluminum'
  | 'furniture'
  | 'custom';

export interface ProductPreset {
  id: ProductPresetId;
  label: string;
  category: ProductCategory;
  /** Illustrative only — not an official rate */
  suggestedBaseRate: number;
  suggestedAdditionalRate: number;
  note: string;
}

export const PRODUCT_CATEGORIES: readonly {
  id: ProductCategory;
  label: string;
}[] = [
  { id: 'popular', label: 'Popular products' },
  { id: 'auto', label: 'Automobiles & auto parts' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'apparel', label: 'Clothing & apparel' },
  { id: 'steel-aluminum', label: 'Steel & aluminum' },
  { id: 'other', label: 'Other products' },
] as const;

/** Illustrative hypothetical presets — not official HTSUS rates. */
export const PRODUCT_PRESETS: readonly ProductPreset[] = [
  {
    id: 'smartphone',
    label: 'Smartphone (illustrative)',
    category: 'electronics',
    suggestedBaseRate: 0,
    suggestedAdditionalRate: 0,
    note: 'Hypothetical placeholder rates — classify the actual HTSUS line before importing.',
  },
  {
    id: 'laptop',
    label: 'Laptop (illustrative)',
    category: 'electronics',
    suggestedBaseRate: 0,
    suggestedAdditionalRate: 0,
    note: 'Hypothetical placeholder rates — not a verified duty.',
  },
  {
    id: 'passenger-vehicle',
    label: 'Passenger vehicle (illustrative)',
    category: 'auto',
    suggestedBaseRate: 2.5,
    suggestedAdditionalRate: 0,
    note: 'Illustrative textbook example only — vehicle duties vary by classification and origin.',
  },
  {
    id: 'auto-parts',
    label: 'Automobile parts (illustrative)',
    category: 'auto',
    suggestedBaseRate: 2.5,
    suggestedAdditionalRate: 0,
    note: 'Illustrative only — parts classifications differ widely.',
  },
  {
    id: 'television',
    label: 'Television (illustrative)',
    category: 'electronics',
    suggestedBaseRate: 3.9,
    suggestedAdditionalRate: 0,
    note: 'Illustrative only — verify the HTSUS line and any additional measures.',
  },
  {
    id: 'clothing',
    label: 'Clothing (illustrative)',
    category: 'apparel',
    suggestedBaseRate: 12,
    suggestedAdditionalRate: 0,
    note: 'Illustrative apparel-style rate — actual textile duties vary by fabric and construction.',
  },
  {
    id: 'steel',
    label: 'Steel products (illustrative)',
    category: 'steel-aluminum',
    suggestedBaseRate: 0,
    suggestedAdditionalRate: 25,
    note: 'Hypothetical Section 232-style scenario for education — check current legal status.',
  },
  {
    id: 'aluminum',
    label: 'Aluminum products (illustrative)',
    category: 'steel-aluminum',
    suggestedBaseRate: 0,
    suggestedAdditionalRate: 10,
    note: 'Hypothetical aluminum scenario for education — not an official live rate.',
  },
  {
    id: 'furniture',
    label: 'Furniture (illustrative)',
    category: 'other',
    suggestedBaseRate: 0,
    suggestedAdditionalRate: 0,
    note: 'Custom entry recommended — furniture HTSUS lines vary.',
  },
  {
    id: 'custom',
    label: 'Custom product',
    category: 'other',
    suggestedBaseRate: 5,
    suggestedAdditionalRate: 20,
    note: 'Matches the worked educational example (5% + 20% additive) — hypothetical only.',
  },
] as const;

export const ORIGIN_COUNTRIES: readonly {
  code: string;
  label: string;
}[] = [
  { code: 'CN', label: 'China' },
  { code: 'CA', label: 'Canada' },
  { code: 'MX', label: 'Mexico' },
  { code: 'IN', label: 'India' },
  { code: 'VN', label: 'Vietnam' },
  { code: 'JP', label: 'Japan' },
  { code: 'KR', label: 'South Korea' },
  { code: 'DE', label: 'Germany' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'TW', label: 'Taiwan' },
  { code: 'OTHER', label: 'Other / unspecified' },
] as const;

export interface TrumpTariffInput {
  mode: TariffMode;
  currency: SupportedCurrency;
  category: ProductCategory;
  productPreset: ProductPresetId;
  countryCode: string;
  unitCustomsValue: string;
  quantity: string;
  baseTariffRate: string;
  additionalTariffRate: string;
  /** User affirms simplified additive ad valorem stacking */
  assumeAdditiveStacking: boolean;
  shippingCost: string;
  insuranceCost: string;
  otherFees: string;
  htsusCode: string;
  /** Optional pass-through */
  retailPrice: string;
  passThroughPercent: string;
}

export interface TrumpTariffResult {
  mode: TariffMode;
  currency: SupportedCurrency;
  countryCode: string;
  countryLabel: string;
  productLabel: string;
  scenarioLabel: string;
  unitCustomsValue: number;
  quantity: number;
  totalCustomsValue: number;
  baseTariffRate: number;
  additionalTariffRate: number;
  combinedTariffRate: number;
  baseDuty: number;
  additionalDuty: number;
  totalTariff: number;
  tariffInclusiveValue: number;
  shippingCost: number;
  insuranceCost: number;
  otherFees: number;
  estimatedLandedCost: number;
  landedCostPerUnit: number;
  costIncreasePercent: number;
  stackingAssumed: boolean;
  htsusCode: string | null;
  retailPrice: number | null;
  passThroughPercent: number | null;
  consumerPriceIncrease: number | null;
  newRetailPrice: number | null;
  formattedCustomsValue: string;
  formattedBaseDuty: string;
  formattedAdditionalDuty: string;
  formattedTotalTariff: string;
  formattedCombinedRate: string;
  formattedTariffInclusive: string;
  formattedLanded: string;
  formattedPerUnit: string;
  formattedCostIncrease: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  chartParts: { label: string; value: number; formatted: string }[];
}

export type TrumpTariffFieldErrors = {
  form?: string;
  countryCode?: string;
  unitCustomsValue?: string;
  quantity?: string;
  baseTariffRate?: string;
  additionalTariffRate?: string;
  shippingCost?: string;
  insuranceCost?: string;
  otherFees?: string;
  htsusCode?: string;
  retailPrice?: string;
  passThroughPercent?: string;
};

export function createDefaultInput(): TrumpTariffInput {
  return {
    mode: 'product',
    currency: 'USD',
    category: 'other',
    productPreset: 'custom',
    countryCode: 'CN',
    unitCustomsValue: '',
    quantity: '1',
    baseTariffRate: '',
    additionalTariffRate: '',
    assumeAdditiveStacking: true,
    shippingCost: '',
    insuranceCost: '',
    otherFees: '',
    htsusCode: '',
    retailPrice: '',
    passThroughPercent: '',
  };
}

export function createEmptyInput(mode: TariffMode = 'product'): TrumpTariffInput {
  return { ...createDefaultInput(), mode, quantity: '' };
}

/** Worked educational example from the brief (hypothetical rates). */
export function createExampleInput(): TrumpTariffInput {
  return {
    mode: 'product',
    currency: 'USD',
    category: 'other',
    productPreset: 'custom',
    countryCode: 'CN',
    unitCustomsValue: '800',
    quantity: '10',
    baseTariffRate: '5',
    additionalTariffRate: '20',
    assumeAdditiveStacking: true,
    shippingCost: '250',
    insuranceCost: '50',
    otherFees: '0',
    htsusCode: '',
    retailPrice: '1000',
    passThroughPercent: '60',
  };
}

export function presetsForCategory(
  category: ProductCategory
): ProductPreset[] {
  if (category === 'popular') {
    return PRODUCT_PRESETS.filter((p) =>
      ['smartphone', 'laptop', 'clothing', 'custom'].includes(p.id)
    );
  }
  return PRODUCT_PRESETS.filter(
    (p) => p.category === category || p.id === 'custom'
  );
}
