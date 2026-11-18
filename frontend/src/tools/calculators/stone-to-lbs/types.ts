import { KG_PER_POUND, KG_PER_STONE } from '../weight-converter/types';

export { KG_PER_POUND, KG_PER_STONE };

/** Exact: 1 imperial stone = 14 avoirdupois pounds. */
export const POUNDS_PER_STONE = 14;

/** Which field the user last edited. */
export type StLbSource = 'st' | 'lb' | 'other';

export const OTHER_MASS_OPTIONS = [
  { value: 'kg', label: 'Kilograms', symbol: 'kg' },
  { value: 'g', label: 'Grams', symbol: 'g' },
  { value: 'mg', label: 'Milligrams', symbol: 'mg' },
  { value: 'oz', label: 'Ounces', symbol: 'oz' },
  { value: 't', label: 'Metric tonnes', symbol: 't' },
  { value: 'shortTon', label: 'US short tons', symbol: 'ton (US)' },
  { value: 'longTon', label: 'Imperial long tons', symbol: 'ton (Imp)' },
  { value: 'gr', label: 'Grains', symbol: 'gr' },
] as const;

/** Extra equivalence units (st and lb are the primary pair). */
export type OtherMassUnit = (typeof OTHER_MASS_OPTIONS)[number]['value'];

export interface StoneToLbsInput {
  source: StLbSource;
  value: number | null;
  otherUnit: OtherMassUnit;
}

export interface StoneToLbsResult {
  st: number;
  lb: number;
  otherValue: number;
  otherUnit: OtherMassUnit;
  explanation: string;
}

export type StoneToLbsFieldErrors = Partial<
  Record<'st' | 'lb' | 'other' | 'otherUnit', string>
>;

export const OTHER_UNIT_SYMBOL: Record<OtherMassUnit, string> = Object.fromEntries(
  OTHER_MASS_OPTIONS.map((u) => [u.value, u.symbol]),
) as Record<OtherMassUnit, string>;

export const DEFAULT_OTHER_UNIT: OtherMassUnit = 'kg';

export const MAX_ABS_VALUE = 1e15;
