import type { FractionPrecision } from '../inches-to-fraction/types';
import {
  DEFAULT_PRECISION,
  PRECISION_OPTIONS,
} from '../inches-to-fraction/types';

export type { FractionPrecision };
export { DEFAULT_PRECISION, PRECISION_OPTIONS };

export type FeetInchesOperation = 'add' | 'subtract' | 'multiply' | 'divide';

export interface LengthParts {
  /** Parsed feet component; null if blank/incomplete. */
  feet: number | null;
  /** Parsed inches component; null if blank/incomplete. */
  inches: number | null;
}

export interface FeetAndInchesInput {
  operation: FeetInchesOperation;
  first: LengthParts;
  /** Used for add/subtract. */
  second: LengthParts;
  /** Used for multiply/divide. */
  scalar: number | null;
  precision: FractionPrecision;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface NormalizedLength {
  /** Exact total inches before display rounding. */
  totalInches: number;
  /** Display-rounded total inches at the selected precision. */
  roundedTotalInches: number;
  feet: number;
  /** Remaining whole + fractional inches label without unit (e.g. `2 1/2` or `0`). */
  inchesLabel: string;
  /** Full mixed label such as `8 ft 2 1/2 in` or `-1 ft 6 in`. */
  mixedLabel: string;
  isApproximate: boolean;
  negative: boolean;
}

export interface FeetAndInchesResult {
  operation: FeetInchesOperation;
  precision: FractionPrecision;
  firstTotalInches: number;
  secondTotalInches: number | null;
  scalar: number | null;
  normalized: NormalizedLength;
  decimalFeet: number;
  totalInches: number;
  otherUnits: readonly OtherUnitRow[];
}

export type FeetAndInchesFieldErrors = {
  firstFeet?: string;
  firstInches?: string;
  secondFeet?: string;
  secondInches?: string;
  scalar?: string;
};

export const OPERATION_OPTIONS: readonly {
  value: FeetInchesOperation;
  label: string;
}[] = [
  { value: 'add', label: 'Addition (+)' },
  { value: 'subtract', label: 'Subtraction (−)' },
  { value: 'multiply', label: 'Multiplication (×)' },
  { value: 'divide', label: 'Division (÷)' },
] as const;

export const INCHES_PER_FOOT = 12;
export const MM_PER_INCH = 25.4;
export const CM_PER_INCH = 2.54;
export const M_PER_INCH = 0.0254;
export const INCHES_PER_YARD = 36;
export const MAX_ABS_VALUE = 1e9;

/** Demo: 5 ft 8 in + 2 ft 4 in = 8 ft 0 in. */
export const DEFAULT_FEET_AND_INCHES_INPUT: FeetAndInchesInput = {
  operation: 'add',
  first: { feet: 5, inches: 8 },
  second: { feet: 2, inches: 4 },
  scalar: null,
  precision: DEFAULT_PRECISION,
};
