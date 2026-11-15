export type BinaryWidth = 8 | 16 | 32 | 64;

export const BINARY_WIDTHS = [8, 16, 32, 64] as const satisfies readonly BinaryWidth[];

export const DEFAULT_BINARY_WIDTH: BinaryWidth = 8;

export interface SignedRange {
  min: bigint;
  max: bigint;
}

export interface DecimalToBinaryResult {
  bits: BinaryWidth;
  decimal: bigint;
  binary: string;
  decimalDisplay: string;
}

export interface BinaryToDecimalResult {
  bits: BinaryWidth;
  binary: string;
  decimal: bigint;
  decimalDisplay: string;
}

export type BinaryFieldErrors = Partial<Record<'decimal' | 'binary' | 'bits', string>>;
