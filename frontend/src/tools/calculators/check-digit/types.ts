export type GTINFormat = 'GTIN-8' | 'GTIN-12' | 'GTIN-13' | 'GTIN-14';

export type CheckDigitMode = 'generate' | 'validate';

export type BarcodeFormatOption = 'auto' | GTINFormat;

export interface CheckDigitStep {
  digit: number;
  weight: 1 | 3;
  product: number;
  /** 1-based index from the left of the payload string */
  position: number;
}

export interface CheckDigitInput {
  mode: CheckDigitMode;
  leadingZeros: string;
  code: string;
  format: BarcodeFormatOption;
  /** Complete GTIN including check digit (validate mode) */
  completeCode: string;
}

export interface CheckDigitResult {
  mode: CheckDigitMode;
  format: GTINFormat | null;
  formatLabel: string;
  payload: string;
  leadingZerosApplied: number;
  paddedPayload: string;
  checkDigit: string;
  completeGTIN: string;
  weightedSum: number;
  remainder: number;
  steps: CheckDigitStep[];
  formulaBreakdown: string;
  narrativeSteps: string[];
  interpretation: string;
  explanation: string;
  /** Validate mode */
  isValid: boolean | null;
  suppliedCheckDigit: string | null;
  expectedCheckDigit: string | null;
}

export type CheckDigitFieldErrors = {
  form?: string;
  leadingZeros?: string;
  code?: string;
  completeCode?: string;
  format?: string;
};

export const GTIN_PAYLOAD_LENGTH: Record<GTINFormat, number> = {
  'GTIN-8': 7,
  'GTIN-12': 11,
  'GTIN-13': 12,
  'GTIN-14': 13,
};

export const GTIN_TOTAL_LENGTH: Record<GTINFormat, number> = {
  'GTIN-8': 8,
  'GTIN-12': 12,
  'GTIN-13': 13,
  'GTIN-14': 14,
};

export const FORMAT_LABELS: Record<GTINFormat, string> = {
  'GTIN-8': 'GTIN-8 / EAN-8',
  'GTIN-12': 'GTIN-12 / UPC-A',
  'GTIN-13': 'GTIN-13 / EAN-13',
  'GTIN-14': 'GTIN-14',
};

export function createDefaultInput(): CheckDigitInput {
  return {
    mode: 'generate',
    leadingZeros: '0',
    code: '',
    format: 'auto',
    completeCode: '',
  };
}

export function createEmptyInput(): CheckDigitInput {
  return createDefaultInput();
}

/** Reference: EAN-13 payload 400638133393 → check digit 1 */
export function createExampleInput(): CheckDigitInput {
  return {
    mode: 'generate',
    leadingZeros: '0',
    code: '400638133393',
    format: 'GTIN-13',
    completeCode: '',
  };
}
