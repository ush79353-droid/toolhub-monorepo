/**
 * Illustrative comparison catalog for Trump's Taxes vs. Your Taxes.
 *
 * Unit prices below are reverse-engineered so that, at the screenshot defaults
 * (user tax $3,202 · Trump reported tax $750 → difference $2,452), quantities
 * match the reference screenshot. They are NOT verified current retail prices.
 */

export type ComparisonBucket = 'luxury' | 'essential';

export interface ComparisonItemDef {
  id: string;
  label: string;
  unitLabel: string;
  bucket: ComparisonBucket;
  /** Illustrative USD unit price (assumption; editable in the UI). */
  defaultUnitPriceUsd: number;
  /** Screenshot quantity at default taxes — documentation only, not a hard lock. */
  referenceQuantityAtDefault: number;
  sourceNote: string;
}

/** Default tax pair from the reference screenshot (USD). */
export const DEFAULT_USER_TAX_USD = 3202;
export const DEFAULT_TRUMP_TAX_USD = 750;

/** Screenshot tax difference used only to document price assumptions. */
export const REFERENCE_TAX_DIFFERENCE_USD = DEFAULT_USER_TAX_USD - DEFAULT_TRUMP_TAX_USD;

export const COMPARISON_ITEMS: readonly ComparisonItemDef[] = [
  {
    id: 'dom-perignon',
    label: 'Dom Pérignon bottles',
    unitLabel: 'bottles',
    bucket: 'luxury',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 43,
    referenceQuantityAtDefault: 43,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 43 at the screenshot default tax difference. Not a verified retail price.',
  },
  {
    id: 'osetra-caviar',
    label: 'Pounds of Osetra caviar',
    unitLabel: 'pounds',
    bucket: 'luxury',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 17,
    referenceQuantityAtDefault: 17,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 17 at the screenshot default tax difference. Not a verified retail price.',
  },
  {
    id: 'tiffany-rings',
    label: 'Tiffany rings',
    unitLabel: 'rings',
    bucket: 'luxury',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 13,
    referenceQuantityAtDefault: 13,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 13 at the screenshot default tax difference. Not a verified retail price.',
  },
  {
    id: 'trump-vodka',
    label: 'Bottles of Trump Premium Vodka',
    unitLabel: 'bottles',
    bucket: 'luxury',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 2,
    referenceQuantityAtDefault: 2,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 2 at the screenshot default tax difference. Not a verified retail price.',
  },
  {
    id: 'rolex',
    label: 'Rolex watches',
    unitLabel: 'watches',
    bucket: 'luxury',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 1,
    referenceQuantityAtDefault: 1,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 1 at the screenshot default tax difference. Not a verified retail price.',
  },
  {
    id: 'masks',
    label: 'Masks',
    unitLabel: 'masks',
    bucket: 'essential',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 1541,
    referenceQuantityAtDefault: 1541,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 1,541 at the screenshot default tax difference. Not a verified retail price.',
  },
  {
    id: 'hand-sanitizer',
    label: 'Hand sanitizer',
    unitLabel: 'units',
    bucket: 'essential',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 855,
    referenceQuantityAtDefault: 855,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 855 at the screenshot default tax difference. Not a verified retail price.',
  },
  {
    id: 'covid-tests',
    label: 'COVID tests',
    unitLabel: 'tests',
    bucket: 'essential',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 67,
    referenceQuantityAtDefault: 67,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 67 at the screenshot default tax difference. Not a verified retail price.',
  },
  {
    id: 'food-stamps',
    label: 'Food stamps',
    unitLabel: 'monthly allotments (illustrative)',
    bucket: 'essential',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 66,
    referenceQuantityAtDefault: 66,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 66 at the screenshot default tax difference. Not a verified benefit amount.',
  },
  {
    id: 'textbooks',
    label: 'Sets of textbooks',
    unitLabel: 'sets',
    bucket: 'essential',
    defaultUnitPriceUsd: REFERENCE_TAX_DIFFERENCE_USD / 9,
    referenceQuantityAtDefault: 9,
    sourceNote:
      'Illustrative unit price chosen so quantity ≈ 9 at the screenshot default tax difference. Not a verified retail price.',
  },
] as const;

export function defaultUnitPriceMap(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const item of COMPARISON_ITEMS) {
    out[item.id] = formatAssumptionPrice(item.defaultUnitPriceUsd);
  }
  return out;
}

/** Compact editable string for assumption prices (keeps enough digits for screenshot parity). */
export function formatAssumptionPrice(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  // Avoid short rounding that drops floor(diff/price) by 1 (e.g. 43 → 42).
  return Number(amount.toPrecision(14)).toString();
}
