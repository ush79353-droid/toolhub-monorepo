import { PSI_PER_BAR, MAX_ABS_VALUE, type BarToPsigFieldErrors, type BarToPsigInput } from './types';

/** Half-typed values such as `1.` or `1e` stay incomplete. */
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
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function numProblem(
  value: number | null,
  opts: { allowNegative?: boolean; requireNonNegative?: boolean } = {},
): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (opts.requireNonNegative && value < 0) return 'negative';
  if (!opts.allowNegative && !opts.requireNonNegative && value < 0) return 'negative';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateBarToPsig(input: BarToPsigInput): {
  isValid: boolean;
  errors: BarToPsigFieldErrors;
} {
  const errors: BarToPsigFieldErrors = {};
  let blank = false;

  if (input.reference === 'absolute') {
    const atm = numProblem(input.atmosphericBar, { requireNonNegative: true });
    if (atm === 'blank') blank = true;
    else if (atm === 'bad') errors.atmosphericBar = 'Enter a valid atmospheric pressure.';
    else if (atm === 'negative') {
      errors.atmosphericBar = 'Atmospheric pressure cannot be negative.';
    } else if (atm === 'large') errors.atmosphericBar = 'Enter a smaller atmospheric pressure.';
  }

  if (input.source === 'bar') {
    const state = numProblem(input.bar, {
      requireNonNegative: input.reference === 'absolute',
      allowNegative: input.reference === 'gauge',
    });
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.bar = 'Enter a valid pressure in bar.';
    else if (state === 'negative') {
      errors.bar =
        input.reference === 'absolute'
          ? 'Absolute pressure cannot be negative.'
          : 'Enter a valid gauge pressure.';
    } else if (state === 'large') errors.bar = 'Enter a smaller value.';
  } else {
    const state = numProblem(input.psig, { allowNegative: true });
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.psig = 'Enter a valid pressure in PSIG.';
    else if (state === 'large') errors.psig = 'Enter a smaller value.';
    else if (
      input.reference === 'absolute' &&
      input.psig !== null &&
      Number.isFinite(input.psig) &&
      input.atmosphericBar !== null &&
      Number.isFinite(input.atmosphericBar) &&
      input.atmosphericBar >= 0
    ) {
      const absoluteBar = input.psig / PSI_PER_BAR + input.atmosphericBar;
      if (absoluteBar < 0) {
        errors.psig =
          'This PSIG would imply negative absolute pressure at the stated atmosphere.';
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
