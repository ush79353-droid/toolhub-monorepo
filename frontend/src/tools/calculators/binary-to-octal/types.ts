export type ConversionDirection = 'binary-to-octal' | 'octal-to-binary';

export interface ConversionStep {
  inputGroup: string;
  outputGroup: string;
}

export interface BinaryOctalResult {
  direction: ConversionDirection;
  input: string;
  inputNormalized: string;
  output: string;
  steps: readonly ConversionStep[];
  paddedInput: string;
}

export type BinaryOctalFieldErrors = Partial<Record<'input', string>>;

export const MAX_BINARY_OCTAL_INPUT_LENGTH = 4096;

/** Three-bit binary → octal digit. */
export const TRIAD_TO_OCTAL: Readonly<Record<string, string>> = Object.freeze({
  '000': '0',
  '001': '1',
  '010': '2',
  '011': '3',
  '100': '4',
  '101': '5',
  '110': '6',
  '111': '7',
});

export const OCTAL_TO_TRIAD: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    Object.entries(TRIAD_TO_OCTAL).map(([triad, octal]) => [octal, triad])
  )
);
