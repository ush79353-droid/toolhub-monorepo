import { calculateHhi } from './calculation';
import {
  MAX_FIRMS,
  MIN_FIRMS,
  type HhiFieldErrors,
  type HhiInput,
  type HhiResult,
} from './types';

function parseOptionalNumber(value: string): number | null | typeof Number.NaN {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateHhiInput(input: HhiInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: HhiFieldErrors;
  result: HhiResult | null;
} {
  const errors: HhiFieldErrors = {};
  const count = input.shares.length;

  if (count < MIN_FIRMS || count > MAX_FIRMS) {
    errors.form = `Enter between ${MIN_FIRMS} and ${MAX_FIRMS} firms.`;
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const shareErrors: string[] = Array.from({ length: count }, () => '');
  const parsed: number[] = [];
  let anyBlank = false;
  let anyFilled = false;

  for (let i = 0; i < count; i += 1) {
    const value = parseOptionalNumber(input.shares[i] ?? '');
    if (value === null) {
      anyBlank = true;
      continue;
    }
    anyFilled = true;
    if (Number.isNaN(value) || value < 0) {
      shareErrors[i] = 'Enter a non-negative share';
    } else if (value > 100) {
      shareErrors[i] = 'Share cannot exceed 100%';
    } else {
      parsed.push(value);
    }
  }

  if (shareErrors.some(Boolean)) {
    errors.shares = shareErrors;
  }

  if (!anyFilled) {
    return { isValid: false, incomplete: true, errors, result: null };
  }

  // Blank rows are skipped; filled rows must all be valid.
  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  // If some rows are still blank but others are filled, still calculate from filled.
  // Reject only when the filled total exceeds 100%.
  const total = parsed.reduce((sum, s) => sum + s, 0);
  if (total > 100) {
    errors.form = 'Market shares cannot total more than 100%.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateHhi(parsed);
  if (!result) {
    errors.form = 'This combination does not produce a finite HHI.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  // Still valid when some visible rows are blank — HHI covers listed (filled) firms only.
  void anyBlank;

  return { isValid: true, incomplete: false, errors: {}, result };
}
