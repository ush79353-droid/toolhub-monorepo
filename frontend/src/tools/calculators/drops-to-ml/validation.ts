import {
  MAX_ABS_VALUE,
  type DropsToMlFieldErrors,
  type DropsToMlInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete. */
export function isIncompleteNumber(raw: string): boolean {
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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function numProblem(
  value: number | null,
  opts: { requirePositive?: boolean } = {}
): 'blank' | 'bad' | 'negative' | 'zero' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (opts.requirePositive && value === 0) return 'zero';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateDropsToMl(input: DropsToMlInput): {
  isValid: boolean;
  errors: DropsToMlFieldErrors;
} {
  const errors: DropsToMlFieldErrors = {};
  let blank = false;

  const f = numProblem(input.dropsPerMl, { requirePositive: true });
  if (f === 'blank') {
    blank = true;
    errors.dropsPerMl = 'Enter a drops-per-mL factor greater than zero.';
  } else if (f === 'bad') errors.dropsPerMl = 'Enter a valid drop factor.';
  else if (f === 'negative' || f === 'zero') {
    errors.dropsPerMl = 'Drop factor must be greater than zero.';
  } else if (f === 'large') errors.dropsPerMl = 'Enter a smaller drop factor.';

  if (input.source === 'drops') {
    const d = numProblem(input.drops);
    if (d === 'blank') blank = true;
    else if (d === 'bad') errors.drops = 'Enter a valid number of drops.';
    else if (d === 'negative') errors.drops = 'Drops cannot be negative.';
    else if (d === 'large') errors.drops = 'Enter a smaller number of drops.';
  } else {
    const m = numProblem(input.ml);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.ml = 'Enter a valid volume in milliliters.';
    else if (m === 'negative') errors.ml = 'Volume cannot be negative.';
    else if (m === 'large') errors.ml = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}

export function validateCalibration(
  observedDrops: number | null,
  measuredMl: number | null
): { isValid: boolean; error?: string } {
  const d = numProblem(observedDrops, { requirePositive: true });
  if (d === 'blank') return { isValid: false, error: 'Enter observed drops.' };
  if (d === 'bad') return { isValid: false, error: 'Enter a valid observed drop count.' };
  if (d === 'negative' || d === 'zero') {
    return { isValid: false, error: 'Observed drops must be greater than zero.' };
  }
  if (d === 'large') return { isValid: false, error: 'Enter a smaller observed drop count.' };

  const m = numProblem(measuredMl, { requirePositive: true });
  if (m === 'blank') return { isValid: false, error: 'Enter measured volume in mL.' };
  if (m === 'bad') return { isValid: false, error: 'Enter a valid measured volume.' };
  if (m === 'negative' || m === 'zero') {
    return { isValid: false, error: 'Measured volume must be greater than zero.' };
  }
  if (m === 'large') return { isValid: false, error: 'Enter a smaller measured volume.' };

  return { isValid: true };
}
