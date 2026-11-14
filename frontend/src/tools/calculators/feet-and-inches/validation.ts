import { parseFeetInput, parseLengthInput } from './calculation';
import {
  MAX_ABS_VALUE,
  type FeetAndInchesFieldErrors,
  type FeetAndInchesInput,
  type FeetInchesOperation,
  type LengthParts,
} from './types';

function parseOptionalFeet(raw: string): {
  value: number | null;
  error?: string;
  incomplete: boolean;
} {
  const parsed = parseFeetInput(raw);
  if (parsed.kind === 'incomplete') return { value: null, incomplete: raw.trim() !== '' };
  if (parsed.kind === 'invalid') return { value: null, error: parsed.message, incomplete: false };
  if (Math.abs(parsed.value) > MAX_ABS_VALUE) {
    return { value: null, error: 'Enter a smaller value.', incomplete: false };
  }
  return { value: parsed.value, incomplete: false };
}

function parseOptionalInches(raw: string): {
  value: number | null;
  error?: string;
  incomplete: boolean;
} {
  const parsed = parseLengthInput(raw);
  if (parsed.kind === 'incomplete') return { value: null, incomplete: raw.trim() !== '' };
  if (parsed.kind === 'invalid') return { value: null, error: parsed.message, incomplete: false };
  if (Math.abs(parsed.value) > MAX_ABS_VALUE) {
    return { value: null, error: 'Enter a smaller value.', incomplete: false };
  }
  return { value: parsed.value, incomplete: false };
}

function validateLengthOperand(
  feetRaw: string,
  inchesRaw: string,
  feetKey: keyof FeetAndInchesFieldErrors,
  inchesKey: keyof FeetAndInchesFieldErrors,
  errors: FeetAndInchesFieldErrors
): LengthParts | null {
  const feetEmpty = feetRaw.trim() === '';
  const inchesEmpty = inchesRaw.trim() === '';

  if (feetEmpty && inchesEmpty) {
    return null;
  }

  const feetParsed = parseOptionalFeet(feetRaw);
  const inchesParsed = parseOptionalInches(inchesRaw);

  if (feetParsed.error) errors[feetKey] = feetParsed.error;
  if (inchesParsed.error) errors[inchesKey] = inchesParsed.error;

  if (feetParsed.incomplete || inchesParsed.incomplete) {
    return null;
  }

  if (feetParsed.error || inchesParsed.error) {
    return null;
  }

  const feet = feetEmpty ? 0 : feetParsed.value!;
  const inches = inchesEmpty ? 0 : inchesParsed.value!;

  // Inconsistent signs: negative inches with non-negative feet.
  if (feet >= 0 && inches < 0) {
    errors[inchesKey] =
      'Use a single leading sign on the whole measurement (negative feet), not negative inches alone.';
    return null;
  }

  return { feet, inches };
}

export function draftScalars(
  operation: FeetInchesOperation,
  firstFeet: string,
  firstInches: string,
  secondFeet: string,
  secondInches: string,
  scalarRaw: string,
  precision: FeetAndInchesInput['precision']
): {
  isValid: boolean;
  errors: FeetAndInchesFieldErrors;
  input: FeetAndInchesInput | null;
} {
  const errors: FeetAndInchesFieldErrors = {};

  const first = validateLengthOperand(
    firstFeet,
    firstInches,
    'firstFeet',
    'firstInches',
    errors
  );

  if (!first) {
    if (firstFeet.trim() === '' && firstInches.trim() === '') {
      // Completely empty first operand — not valid.
    }
    return { isValid: false, errors, input: null };
  }

  if (operation === 'add' || operation === 'subtract') {
    const second = validateLengthOperand(
      secondFeet,
      secondInches,
      'secondFeet',
      'secondInches',
      errors
    );
    if (!second || Object.keys(errors).length > 0) {
      return { isValid: false, errors, input: null };
    }
    return {
      isValid: true,
      errors,
      input: {
        operation,
        first,
        second,
        scalar: null,
        precision,
      },
    };
  }

  const scalarParsed = parseOptionalFeet(scalarRaw);
  if (scalarRaw.trim() === '') {
    return { isValid: false, errors, input: null };
  }
  if (scalarParsed.incomplete) {
    return { isValid: false, errors, input: null };
  }
  if (scalarParsed.error) {
    errors.scalar = scalarParsed.error;
    return { isValid: false, errors, input: null };
  }
  if (scalarParsed.value === null) {
    errors.scalar = 'Enter a valid number.';
    return { isValid: false, errors, input: null };
  }
  if (operation === 'divide' && scalarParsed.value === 0) {
    errors.scalar = 'Cannot divide by zero.';
    return { isValid: false, errors, input: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, input: null };
  }

  return {
    isValid: true,
    errors,
    input: {
      operation,
      first,
      second: { feet: null, inches: null },
      scalar: scalarParsed.value,
      precision,
    },
  };
}
