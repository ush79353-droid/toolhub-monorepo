import { calculateCES, toCESResult } from './calculation';
import type {
  CESFieldErrors,
  CESInput,
  CESResult,
  CESScale,
  CESScore,
} from './types';

function parseCount(raw: string): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: 0 };
  if (!/^-?\d+$/.test(cleaned)) {
    if (/[.]/.test(cleaned)) {
      return { ok: false, error: 'Response counts must be whole numbers.' };
    }
    return { ok: false, error: 'Enter a whole number of responses.' };
  }
  const value = Number(cleaned);
  if (!Number.isSafeInteger(value)) {
    return { ok: false, error: 'Response count is too large.' };
  }
  if (value < 0) {
    return { ok: false, error: 'The number of responses cannot be negative.' };
  }
  return { ok: true, value };
}

export function validateCESInput(input: CESInput): {
  isValid: boolean;
  errors: CESFieldErrors;
  result: CESResult | null;
} {
  const scale: CESScale = input.scale;
  const errors: CESFieldErrors = {};
  const responses: Record<number, number> = {};
  let anyEntered = false;

  for (let score = 1; score <= scale; score += 1) {
    const raw = input.counts[String(score)] ?? '';
    if (raw.trim() !== '') anyEntered = true;
    const parsed = parseCount(raw);
    if (!parsed.ok) {
      errors[`score${score as CESScore}`] = parsed.error;
      continue;
    }
    responses[score] = parsed.value;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (!anyEntered) {
    return {
      isValid: false,
      errors: {
        form: 'Enter at least one customer response to calculate CES.',
      },
      result: null,
    };
  }

  const total = Object.values(responses).reduce((sum, n) => sum + n, 0);
  if (total === 0) {
    return {
      isValid: false,
      errors: {
        form: 'Enter at least one customer response to calculate CES.',
      },
      result: null,
    };
  }

  const breakdown = calculateCES(scale, responses);
  if (!breakdown) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate CES with the current inputs.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: toCESResult(breakdown),
  };
}
