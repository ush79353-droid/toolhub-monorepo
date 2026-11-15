/** Denominator of the selected fractional increment (e.g. 16 for 1/16"). */
export type FractionPrecision = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256;

export interface InchesToFractionInput {
  /** Parsed decimal inches from the distance field. null while blank/incomplete. */
  inches: number | null;
  precision: FractionPrecision;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface InchesToFractionResult {
  inches: number;
  precision: FractionPrecision;
  /** Reduced display string such as `1 3/8` or `1/2` (no unit). */
  fractionLabel: string;
  /** Whole inches after rounding (absolute). */
  whole: number;
  /** Reduced numerator of the fractional part (absolute). */
  numerator: number;
  /** Reduced denominator of the fractional part. */
  denominator: number;
  /** Rounded decimal inches (includes sign). */
  roundedInches: number;
  /** True when rounded value differs from the entered decimal. */
  isApproximate: boolean;
  negative: boolean;
  otherUnits: readonly OtherUnitRow[];
}

export type InchesToFractionFieldErrors = {
  inches?: string;
};

export const PRECISION_OPTIONS: readonly {
  value: FractionPrecision;
  label: string;
}[] = [
  { value: 2, label: '1/2' },
  { value: 4, label: '1/4' },
  { value: 8, label: '1/8' },
  { value: 16, label: '1/16' },
  { value: 32, label: '1/32' },
  { value: 64, label: '1/64' },
  { value: 128, label: '1/128' },
  { value: 256, label: '1/256' },
] as const;

export const DEFAULT_PRECISION: FractionPrecision = 16;

/** Exact international inch. */
export const MM_PER_INCH = 25.4;
export const CM_PER_INCH = 2.54;
export const M_PER_INCH = 0.0254;
export const INCHES_PER_FOOT = 12;
export const INCHES_PER_YARD = 36;

export const MAX_ABS_VALUE = 1e9;

/** Demo: 1.375 in → 1 3/8 at 1/16. */
export const DEFAULT_INCHES_TO_FRACTION_INPUT: InchesToFractionInput = {
  inches: 1.375,
  precision: DEFAULT_PRECISION,
};
