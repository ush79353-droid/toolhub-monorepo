export type ConversionDirection = 'decimal-to-octal' | 'octal-to-decimal';

export interface DivisionStep {
  dividend: string;
  quotient: string;
  remainder: string;
}

export interface PositionalStep {
  digit: string;
  power: number;
  contribution: string;
}

export interface DecimalOctalResult {
  direction: ConversionDirection;
  input: string;
  inputNormalized: string;
  output: string;
  formula: string;
  divisionSteps?: readonly DivisionStep[];
  positionalSteps?: readonly PositionalStep[];
  stepsTruncated: boolean;
}

export type DecimalOctalFieldErrors = Partial<Record<'input', string>>;

export const MAX_INPUT_LENGTH = 1024;
export const MAX_DISPLAYED_STEPS = 64;
