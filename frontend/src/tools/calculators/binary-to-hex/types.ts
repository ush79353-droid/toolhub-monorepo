export interface BinaryConversionStep {
  binaryGroup: string;
  hexadecimalDigit: string;
}

export interface BinaryConversionResult {
  binary: string;
  binaryNormalized: string;
  hexadecimal: string;
  decimal: string;
  octal: string;
  steps: readonly BinaryConversionStep[];
  paddedBinary: string;
}

export interface HexToBinaryResult {
  hexadecimal: string;
  hexadecimalNormalized: string;
  binary: string;
  binaryGrouped: string;
  decimal: string;
  octal: string;
}

export type BinaryHexFieldErrors = Partial<Record<'binary' | 'hex', string>>;

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
