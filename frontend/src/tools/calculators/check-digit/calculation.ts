/**
 * Check Digit Calculator — GS1 Modulo 10 (ADR-018).
 *
 * CheckDigit = (10 − (S mod 10)) mod 10
 * Weights alternate 3,1 from the rightmost payload digit.
 */

import {
  FORMAT_LABELS,
  GTIN_PAYLOAD_LENGTH,
  GTIN_TOTAL_LENGTH,
  type CheckDigitInput,
  type CheckDigitResult,
  type CheckDigitStep,
  type GTINFormat,
} from './types';

const DIGITS_ONLY = /^\d+$/;

export function isDigitsOnly(value: string): boolean {
  return value.length > 0 && DIGITS_ONLY.test(value);
}

export function detectGTINFormatByTotalLength(
  length: number,
): GTINFormat | null {
  switch (length) {
    case 8:
      return 'GTIN-8';
    case 12:
      return 'GTIN-12';
    case 13:
      return 'GTIN-13';
    case 14:
      return 'GTIN-14';
    default:
      return null;
  }
}

export function detectGTINFormatByPayloadLength(
  length: number,
): GTINFormat | null {
  switch (length) {
    case 7:
      return 'GTIN-8';
    case 11:
      return 'GTIN-12';
    case 12:
      return 'GTIN-13';
    case 13:
      return 'GTIN-14';
    default:
      return null;
  }
}

export function detectGTINFormat(gtin: string): GTINFormat | null {
  if (!isDigitsOnly(gtin)) return null;
  return detectGTINFormatByTotalLength(gtin.length);
}

/** Pure GS1 Modulo 10 on a digit-string payload (no check digit). */
export function calculateGS1CheckDigit(payload: string): {
  checkDigit: string;
  weightedSum: number;
  remainder: number;
  steps: CheckDigitStep[];
} | null {
  if (!isDigitsOnly(payload)) return null;

  const steps: CheckDigitStep[] = [];
  let weightedSum = 0;

  for (let i = payload.length - 1; i >= 0; i -= 1) {
    const digit = payload.charCodeAt(i) - 48;
    const fromRight = payload.length - 1 - i;
    const weight: 1 | 3 = fromRight % 2 === 0 ? 3 : 1;
    const product = digit * weight;
    weightedSum += product;
    steps.push({
      digit,
      weight,
      product,
      position: i + 1,
    });
  }

  // Present steps left-to-right for display
  steps.reverse();

  const remainder = weightedSum % 10;
  const checkDigit = String((10 - remainder) % 10);

  return { checkDigit, weightedSum, remainder, steps };
}

export function validateGTIN(gtin: string): boolean {
  if (!isDigitsOnly(gtin)) return false;
  if (!detectGTINFormatByTotalLength(gtin.length)) return false;
  const payload = gtin.slice(0, -1);
  const supplied = gtin.slice(-1);
  const calc = calculateGS1CheckDigit(payload);
  if (!calc) return false;
  return calc.checkDigit === supplied;
}

function buildPaddedPayload(
  code: string,
  leadingZeros: number,
): string | null {
  if (!Number.isInteger(leadingZeros) || leadingZeros < 0) return null;
  if (code !== '' && !isDigitsOnly(code)) return null;
  if (leadingZeros === 0) return code;
  return `${'0'.repeat(leadingZeros)}${code}`;
}

function buildResult(args: {
  mode: CheckDigitResult['mode'];
  format: GTINFormat | null;
  payload: string;
  leadingZerosApplied: number;
  paddedPayload: string;
  checkDigit: string;
  weightedSum: number;
  remainder: number;
  steps: CheckDigitStep[];
  isValid: boolean | null;
  suppliedCheckDigit: string | null;
}): CheckDigitResult {
  const {
    mode,
    format,
    payload,
    leadingZerosApplied,
    paddedPayload,
    checkDigit,
    weightedSum,
    remainder,
    steps,
    isValid,
    suppliedCheckDigit,
  } = args;

  const completeGTIN = `${paddedPayload}${checkDigit}`;
  const formatLabel = format ? FORMAT_LABELS[format] : 'Unrecognized length';

  const weightRows = steps
    .map(
      (s) =>
        `  pos ${s.position}: digit ${s.digit} × weight ${s.weight} = ${s.product}`,
    )
    .join('\n');

  const formulaBreakdown = [
    `Payload (padded) = ${paddedPayload}`,
    'Weights from the right: 3, 1, 3, 1, …',
    weightRows,
    `Weighted sum S = ${weightedSum}`,
    `Remainder = S mod 10 = ${remainder}`,
    `CheckDigit = (10 − ${remainder}) mod 10 = ${checkDigit}`,
    `Complete GTIN = ${completeGTIN}`,
  ].join('\n');

  const narrativeSteps = [
    `Start with code "${payload}" and ${leadingZerosApplied} leading zero(s).`,
    `Padded payload = ${paddedPayload} (${paddedPayload.length} digits).`,
    'Assign alternating weights 3 and 1 from the rightmost digit.',
    `Multiply each digit by its weight and sum → S = ${weightedSum}.`,
    `Remainder = ${remainder}; CheckDigit = (10 − ${remainder}) mod 10 = ${checkDigit}.`,
    `Complete identifier = ${completeGTIN}.`,
  ];

  let interpretation: string;
  if (mode === 'validate') {
    if (isValid) {
      interpretation = `Valid check digit. The GTIN passes the GS1 Modulo 10 checksum (expected ${checkDigit}).`;
    } else {
      interpretation = `Invalid check digit. Expected ${checkDigit}, but the supplied check digit is ${suppliedCheckDigit}.`;
    }
  } else {
    interpretation = `Valid check digit generated: ${checkDigit}. Complete ${formatLabel} = ${completeGTIN}.`;
  }

  const explanation =
    'A passing checksum confirms numerical structure only — it does not prove the GTIN is officially assigned, registered, or linked to a specific product.';

  return {
    mode,
    format,
    formatLabel,
    payload,
    leadingZerosApplied,
    paddedPayload,
    checkDigit,
    completeGTIN,
    weightedSum,
    remainder,
    steps,
    formulaBreakdown,
    narrativeSteps,
    interpretation,
    explanation,
    isValid,
    suppliedCheckDigit,
    expectedCheckDigit: checkDigit,
  };
}

export function generateCompleteGTIN(
  payload: string,
  format: GTINFormat,
): CheckDigitResult | null {
  if (!isDigitsOnly(payload)) return null;
  if (payload.length !== GTIN_PAYLOAD_LENGTH[format]) return null;
  const calc = calculateGS1CheckDigit(payload);
  if (!calc) return null;
  return buildResult({
    mode: 'generate',
    format,
    payload,
    leadingZerosApplied: 0,
    paddedPayload: payload,
    checkDigit: calc.checkDigit,
    weightedSum: calc.weightedSum,
    remainder: calc.remainder,
    steps: calc.steps,
    isValid: null,
    suppliedCheckDigit: null,
  });
}

export function calculateCheckDigitFromInput(
  input: CheckDigitInput,
): CheckDigitResult | null {
  if (input.mode === 'validate') {
    const raw = input.completeCode.trim().replace(/\s+/g, '');
    if (!isDigitsOnly(raw)) return null;
    const format =
      input.format === 'auto'
        ? detectGTINFormatByTotalLength(raw.length)
        : input.format;
    if (!format) return null;
    if (raw.length !== GTIN_TOTAL_LENGTH[format]) return null;

    const paddedPayload = raw.slice(0, -1);
    const supplied = raw.slice(-1);
    const calc = calculateGS1CheckDigit(paddedPayload);
    if (!calc) return null;

    return buildResult({
      mode: 'validate',
      format,
      payload: paddedPayload,
      leadingZerosApplied: 0,
      paddedPayload,
      checkDigit: calc.checkDigit,
      weightedSum: calc.weightedSum,
      remainder: calc.remainder,
      steps: calc.steps,
      isValid: calc.checkDigit === supplied,
      suppliedCheckDigit: supplied,
    });
  }

  const zerosRaw = input.leadingZeros.trim();
  const leadingZeros = Number(zerosRaw);
  if (
    !Number.isInteger(leadingZeros) ||
    leadingZeros < 0 ||
    leadingZeros > 13
  ) {
    return null;
  }

  const code = input.code.trim().replace(/\s+/g, '');
  if (code !== '' && !isDigitsOnly(code)) return null;

  const padded = buildPaddedPayload(code, leadingZeros);
  if (padded == null || padded === '') return null;
  if (!isDigitsOnly(padded)) return null;

  let format: GTINFormat | null;
  if (input.format === 'auto') {
    format = detectGTINFormatByPayloadLength(padded.length);
    if (!format) return null;
  } else {
    format = input.format;
    if (padded.length !== GTIN_PAYLOAD_LENGTH[format]) return null;
  }

  const calc = calculateGS1CheckDigit(padded);
  if (!calc) return null;

  return buildResult({
    mode: 'generate',
    format,
    payload: code,
    leadingZerosApplied: leadingZeros,
    paddedPayload: padded,
    checkDigit: calc.checkDigit,
    weightedSum: calc.weightedSum,
    remainder: calc.remainder,
    steps: calc.steps,
    isValid: null,
    suppliedCheckDigit: null,
  });
}
