import { calculateStimulusCheck40k, formatStimulusUsd } from './calculation';
import type {
  StimulusCheck40kFieldErrors,
  StimulusCheck40kInput,
  StimulusCheck40kResult,
} from './types';

function parseNonNegativeInt(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value) || value < 0) return null;
  return value;
}

function parseNonNegativeMoney(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

export function validateStimulusCheck40kInput(input: StimulusCheck40kInput): {
  isValid: boolean;
  errors: StimulusCheck40kFieldErrors;
  result: StimulusCheck40kResult | null;
} {
  const errors: StimulusCheck40kFieldErrors = {};

  const dependents = parseNonNegativeInt(input.dependents);
  if (dependents === null) {
    errors.dependents = 'Enter a whole number of dependents (0 or more).';
  }

  const incomeRaw = input.incomeAgi.trim();
  const incomeAgi = incomeRaw === '' ? null : parseNonNegativeMoney(input.incomeAgi);
  if (incomeRaw !== '' && incomeAgi === null) {
    errors.incomeAgi = 'Enter a valid non-negative AGI in USD.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  // Empty AGI → no estimate yet (matches screenshot empty result).
  if (incomeAgi === null || dependents === null) {
    return { isValid: true, errors, result: null };
  }

  const calc = calculateStimulusCheck40k({
    filingStatus: input.filingStatus,
    dependents,
    incomeAgi,
  });
  if (!calc) {
    return {
      isValid: false,
      errors: { form: 'Unable to estimate payment from the entered values.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors,
    result: {
      ...calc,
      formattedPayment: formatStimulusUsd(calc.paymentUsd),
    },
  };
}
