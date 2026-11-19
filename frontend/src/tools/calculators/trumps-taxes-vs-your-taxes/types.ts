import {
  COMPARISON_ITEMS,
  DEFAULT_TRUMP_TAX_USD,
  DEFAULT_USER_TAX_USD,
  defaultUnitPriceMap,
} from './comparison-items';

export interface TrumpsTaxesInput {
  userTax: string;
  trumpTax: string;
  /** Editable illustrative unit prices keyed by comparison item id. */
  unitPrices: Record<string, string>;
  showLuxury: boolean;
  showEssential: boolean;
  showPriceAssumptions: boolean;
}

export interface ComparisonLineResult {
  id: string;
  label: string;
  unitLabel: string;
  bucket: 'luxury' | 'essential';
  unitPrice: number;
  quantity: number;
  formattedQuantity: string;
  formattedUnitPrice: string;
}

export interface TrumpsTaxesResult {
  userTax: number;
  trumpTax: number;
  taxRatio: number;
  taxDifference: number;
  percentageDifference: number;
  /** Absolute extra paid by the user vs Trump when user > Trump; else 0. */
  availableForComparisons: number;
  ratioLabel: string;
  comparisonPhrase: string;
  formattedUserTax: string;
  formattedTrumpTax: string;
  formattedDifference: string;
  formattedPercentageDifference: string;
  formattedRatio: string;
  luxuryLines: readonly ComparisonLineResult[];
  essentialLines: readonly ComparisonLineResult[];
}

export type TrumpsTaxesFieldErrors = {
  userTax?: string;
  trumpTax?: string;
  unitPrices?: string;
  form?: string;
};

export function createDefaultInput(): TrumpsTaxesInput {
  return {
    userTax: DEFAULT_USER_TAX_USD.toFixed(2),
    trumpTax: DEFAULT_TRUMP_TAX_USD.toFixed(2),
    unitPrices: defaultUnitPriceMap(),
    showLuxury: true,
    showEssential: true,
    showPriceAssumptions: false,
  };
}

export function comparisonItemIds(): readonly string[] {
  return COMPARISON_ITEMS.map((item) => item.id);
}
