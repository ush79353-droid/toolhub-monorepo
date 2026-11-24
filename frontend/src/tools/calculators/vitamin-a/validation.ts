import { calculateVitaminA, getSourceOption } from './calculation';
import {
  MAX_ABS_VALUE,
  SOURCE_IDS,
  type VitaminAFieldErrors,
  type VitaminAInput,
  type VitaminAPairSource,
  type VitaminAResult,
  type VitaminASourceId,
} from './types';

function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  );
}

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function quantityProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

function errorKey(id: VitaminASourceId, side: VitaminAPairSource): keyof VitaminAFieldErrors {
  if (side === 'iu') {
    if (id === 'retinol') return 'retinolIu';
    if (id === 'dietaryBetaCarotene') return 'dietaryBetaCaroteneIu';
    if (id === 'supplementalBetaCarotene') return 'supplementalBetaCaroteneIu';
    return 'dietaryOtherCarotenoidsIu';
  }
  if (id === 'retinol') return 'retinolRae';
  if (id === 'dietaryBetaCarotene') return 'dietaryBetaCaroteneRae';
  if (id === 'supplementalBetaCarotene') return 'supplementalBetaCaroteneRae';
  return 'dietaryOtherCarotenoidsRae';
}

export function validateVitaminA(input: VitaminAInput): {
  isValid: boolean;
  errors: VitaminAFieldErrors;
  result: VitaminAResult | null;
} {
  const errors: VitaminAFieldErrors = {};

  for (const id of SOURCE_IDS) {
    try {
      getSourceOption(id);
    } catch {
      errors.ageBand = 'Unsupported vitamin A source.';
      return { isValid: false, errors, result: null };
    }

    const draft = input.sources[id];
    const side = draft.lastEdited;
    const raw = side === 'iu' ? draft.iuText : draft.raeText;
    const parsed = parseOptionalNumber(raw);
    const state = quantityProblem(parsed);
    const key = errorKey(id, side);

    if (state === 'bad') {
      errors[key] = side === 'iu' ? 'Enter a valid IU amount.' : 'Enter a valid RAE amount.';
    } else if (state === 'negative') {
      errors[key] = side === 'iu' ? 'IU cannot be negative.' : 'RAE cannot be negative.';
    } else if (state === 'large') {
      errors[key] = 'Enter a smaller value.';
    }
    // blank/incomplete → treated as 0 in calculateVitaminA (screenshot defaults).
  }

  const isValid = Object.keys(errors).length === 0;
  return {
    isValid,
    errors,
    result: isValid ? calculateVitaminA(input) : null,
  };
}
