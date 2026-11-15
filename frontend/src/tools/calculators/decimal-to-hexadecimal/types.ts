export type ConversionDirection = 'decimal-to-hex' | 'hex-to-decimal';

export type HexRepresentation = 'unsigned' | 'signed-16';

export interface DecimalHexStep {
  dividend: string;
  quotient: string;
  remainder: string;
  hexDigit: string;
}

export interface HexPositionalStep {
  digit: string;
  power: number;
  contribution: string;
}

export interface DecimalHexResult {
  direction: ConversionDirection;
  representation: HexRepresentation;
  input: string;
  output: string;
  formula: string;
  divisionSteps?: readonly DecimalHexStep[];
  positionalSteps?: readonly HexPositionalStep[];
  signedNote?: string;
  fixedWidth: boolean;
}

export type DecimalHexFieldErrors = Partial<Record<'input', string>>;

export const INT16_MIN = -32768;
export const INT16_MAX = 32767;
export const UINT16_MOD = 65536;
export const MAX_DECIMAL_INPUT_LENGTH = 32;
export const MAX_HEX_INPUT_LENGTH = 16;

export const DECIMAL_HEX_DIGITS = '0123456789ABCDEF';
