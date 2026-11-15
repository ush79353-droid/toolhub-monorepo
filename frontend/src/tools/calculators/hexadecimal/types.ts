export interface DecimalHexStep {
  dividend: string;
  quotient: string;
  remainder: string;
  hexDigit: string;
}

export interface BinaryHexStep {
  inputGroup: string;
  outputGroup: string;
}

export interface HexPositionalStep {
  digit: string;
  power: number;
  placeValue: string;
  contribution: string;
}

export interface DecimalToHexResult {
  decimal: string;
  hexadecimal: string;
  divisionSteps: readonly DecimalHexStep[];
}

export interface BinaryToHexResult {
  binary: string;
  binaryNormalized: string;
  hexadecimal: string;
  paddedBinary: string;
  steps: readonly BinaryHexStep[];
}

export interface HexToBothResult {
  hexadecimal: string;
  hexadecimalNormalized: string;
  decimal: string;
  binary: string;
  positionalSteps: readonly HexPositionalStep[];
  nibbleSteps: readonly BinaryHexStep[];
}

export type HexFieldErrors = Partial<Record<'decimal' | 'binary' | 'hex', string>>;

export const MAX_DECIMAL_INPUT_LENGTH = 1024;
export const MAX_BINARY_INPUT_LENGTH = 4096;
export const MAX_HEX_INPUT_LENGTH = 1024;

/** Four-bit binary → hex digit (uppercase). */
export const NIBBLE_TO_HEX: Readonly<Record<string, string>> = Object.freeze({
  '0000': '0',
  '0001': '1',
  '0010': '2',
  '0011': '3',
  '0100': '4',
  '0101': '5',
  '0110': '6',
  '0111': '7',
  '1000': '8',
  '1001': '9',
  '1010': 'A',
  '1011': 'B',
  '1100': 'C',
  '1101': 'D',
  '1110': 'E',
  '1111': 'F',
});

export const HEX_TO_NIBBLE: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    Object.entries(NIBBLE_TO_HEX).map(([nibble, hex]) => [hex, nibble])
  )
);

export const DECIMAL_HEX_DIGITS = '0123456789ABCDEF';
