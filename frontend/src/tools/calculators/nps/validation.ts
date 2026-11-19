import { calculateNPS, toNPSResult } from './calculation';
import type {
  NPSFieldErrors,
  NPSInput,
  NPSResult,
  SurveyScore,
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

export function validateNPSInput(input: NPSInput): {
  isValid: boolean;
  errors: NPSFieldErrors;
  result: NPSResult | null;
} {
  const errors: NPSFieldErrors = {};
  const responses: Record<number, number> = {};
  let anyEntered = false;

  for (let score = 0; score <= 10; score += 1) {
    const raw = input.counts[String(score)] ?? '';
    if (raw.trim() !== '') anyEntered = true;
    const parsed = parseCount(raw);
    if (!parsed.ok) {
      errors[`score${score as SurveyScore}`] = parsed.error;
      continue;
    }
    responses[score] = parsed.value;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (!anyEntered) {
    return { isValid: false, errors: {}, result: null };
  }

  const total = Object.values(responses).reduce((sum, n) => sum + n, 0);
  if (total === 0) {
    return {
      isValid: false,
      errors: {
        form: 'Enter at least one survey response to calculate NPS.',
      },
      result: null,
    };
  }

  const breakdown = calculateNPS(responses);
  if (!breakdown) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate NPS with the current inputs.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: toNPSResult(breakdown),
  };
}
