import {
  calculateCheckDigitFromInput,
  detectGTINFormatByPayloadLength,
  detectGTINFormatByTotalLength,
  isDigitsOnly,
} from './calculation';
import {
  GTIN_PAYLOAD_LENGTH,
  GTIN_TOTAL_LENGTH,
  type CheckDigitFieldErrors,
  type CheckDigitInput,
  type CheckDigitResult,
} from './types';

export interface CheckDigitValidation {
  isValid: boolean;
  errors: CheckDigitFieldErrors;
  result: CheckDigitResult | null;
}

function hasErrors(errors: CheckDigitFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: CheckDigitInput,
): CheckDigitFieldErrors {
  const errors: CheckDigitFieldErrors = {};

  if (input.mode === 'validate') {
    const raw = input.completeCode.trim().replace(/\s+/g, '');
    if (raw === '') {
      errors.completeCode = 'Enter a complete GTIN including its check digit.';
      return errors;
    }
    if (!isDigitsOnly(raw)) {
      errors.completeCode =
        'Enter digits only (0–9). Letters, symbols, and decimals are not allowed.';
      return errors;
    }
    if (raw.length > 14) {
      errors.completeCode = 'GTIN identifiers cannot exceed 14 digits.';
      return errors;
    }

    if (input.format === 'auto') {
      if (!detectGTINFormatByTotalLength(raw.length)) {
        errors.completeCode =
          'Length does not match GTIN-8, GTIN-12, GTIN-13, or GTIN-14. Select a format or enter a complete identifier.';
      }
    } else if (raw.length !== GTIN_TOTAL_LENGTH[input.format]) {
      errors.completeCode = `${input.format} requires exactly ${GTIN_TOTAL_LENGTH[input.format]} digits including the check digit.`;
    }
    return errors;
  }

  const zerosRaw = input.leadingZeros.trim();
  if (zerosRaw === '') {
    errors.leadingZeros = 'Select the number of leading zeros.';
  } else {
    const zeros = Number(zerosRaw);
    if (
      !Number.isInteger(zeros) ||
      zeros < 0 ||
      zeros > 13 ||
      String(zeros) !== zerosRaw
    ) {
      errors.leadingZeros = 'Leading zeros must be an integer from 0 to 13.';
    }
  }

  const code = input.code.trim().replace(/\s+/g, '');
  if (code === '') {
    errors.code = 'Enter the code without the check digit.';
  } else if (!isDigitsOnly(code)) {
    errors.code =
      'Enter digits only (0–9). Letters, symbols, decimals, and scientific notation are not allowed.';
  } else if (code.length > 13) {
    errors.code = 'Payload without leading zeros cannot exceed 13 digits.';
  }

  if (errors.leadingZeros || errors.code) return errors;

  const zeros = Number(zerosRaw);
  const paddedLength = zeros + code.length;

  if (paddedLength > 13) {
    errors.code =
      'Combined leading zeros and code exceed the maximum payload length (13 digits).';
    return errors;
  }

  if (input.format === 'auto') {
    if (!detectGTINFormatByPayloadLength(paddedLength)) {
      errors.format = `Padded payload length ${paddedLength} does not uniquely match a supported GTIN format. Select a barcode format or adjust leading zeros.`;
    }
  } else {
    const needed = GTIN_PAYLOAD_LENGTH[input.format];
    if (paddedLength !== needed) {
      errors.code = `${input.format} requires a ${needed}-digit payload (including leading zeros). Current padded length is ${paddedLength}.`;
    }
  }

  return errors;
}

export function validateCheckDigitInput(
  input: CheckDigitInput,
): CheckDigitValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCheckDigitFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
