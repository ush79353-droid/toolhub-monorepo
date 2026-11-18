import {
  KG_PER_OUNCE,
  KG_PER_POUND,
  KG_PER_TROY_OUNCE,
  type MassUnitId,
} from '../weight-converter/types';

/** Which field the user last edited. */
export type KgOzSource = 'kg' | 'oz' | 'troyOz' | 'lbOz' | 'more';

/** Optional “More units” selector ids (metric tonne = SI t). */
export type MoreMassUnit = Extract<MassUnitId, 'g' | 'mg' | 't' | 'lb' | 'st' | 'ct' | 'ug'>;

export const MORE_MASS_UNITS: readonly MoreMassUnit[] = [
  'g',
  'mg',
  't',
  'lb',
  'st',
  'ct',
  'ug',
] as const;

export const MORE_UNIT_LABELS: Record<MoreMassUnit, string> = {
  g: 'Grams',
  mg: 'Milligrams',
  t: 'Metric tons',
  lb: 'Pounds',
  st: 'Stones',
  ct: 'Carats',
  ug: 'Micrograms',
};

export const MORE_UNIT_SYMBOLS: Record<MoreMassUnit, string> = {
  g: 'g',
  mg: 'mg',
  t: 't',
  lb: 'lb',
  st: 'st',
  ct: 'ct',
  ug: 'µg',
};

export interface KgToOunceInput {
  source: KgOzSource;
  kg: number | null;
  oz: number | null;
  troyOz: number | null;
  lbPart: number | null;
  ozPart: number | null;
  moreUnit: MoreMassUnit;
  moreValue: number | null;
}

export type KgToOunceFieldErrors = {
  kg?: string;
  oz?: string;
  troyOz?: string;
  lbPart?: string;
  ozPart?: string;
  moreValue?: string;
};

export { KG_PER_OUNCE, KG_PER_POUND, KG_PER_TROY_OUNCE };

/** Exact reciprocal: avoirdupois oz per kg. */
export const OZ_PER_KG = 1 / KG_PER_OUNCE;

/** Exact: 1 lb = 16 avoirdupois oz. */
export const OZ_PER_LB = 16;

export const MAX_ABS_VALUE = 1e15;
