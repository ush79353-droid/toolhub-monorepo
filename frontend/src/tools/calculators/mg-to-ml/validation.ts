import { resolveFactorMgPerMl } from './calculation';
import { MAX_ABS_VALUE, type MgToMlFieldErrors, type MgToMlInput } from './types';

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
  opts: { allowZero: boolean; requirePositive?: boolean } = { allowZero: true }
): 'blank' | 'bad' | 'negative' | 'zero' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (opts.requirePositive && value === 0) return 'zero';
  if (!opts.allowZero && value === 0) return 'zero';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMgToMl(input: MgToMlInput): {
  isValid: boolean;
  errors: MgToMlFieldErrors;
} {
  const errors: MgToMlFieldErrors = {};
  let blank = false;

  if (input.mode === 'density') {
    if (input.substance === 'custom') {
      const d = numProblem(input.densityValue, { allowZero: false, requirePositive: true });
      if (d === 'blank') blank = true;
      else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
      else if (d === 'negative' || d === 'zero') {
        errors.densityValue = 'Density must be greater than zero.';
      } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';
    }
  } else if (input.concentrationFormat === 'mgPerMl') {
    const c = numProblem(input.concentrationMgPerMl, {
      allowZero: false,
      requirePositive: true,
    });
    if (c === 'blank') blank = true;
    else if (c === 'bad') errors.concentrationMgPerMl = 'Enter a valid concentration.';
    else if (c === 'negative' || c === 'zero') {
      errors.concentrationMgPerMl = 'Concentration must be greater than zero.';
    } else if (c === 'large') errors.concentrationMgPerMl = 'Enter a smaller concentration.';
  } else {
    const lm = numProblem(input.labelMassMg, { allowZero: true });
    const lv = numProblem(input.labelVolumeMl, { allowZero: false, requirePositive: true });
    if (lm === 'blank') blank = true;
    else if (lm === 'bad') errors.labelMassMg = 'Enter a valid labeled mass.';
    else if (lm === 'negative') errors.labelMassMg = 'Labeled mass cannot be negative.';
    else if (lm === 'large') errors.labelMassMg = 'Enter a smaller value.';

    if (lv === 'blank') blank = true;
    else if (lv === 'bad') errors.labelVolumeMl = 'Enter a valid labeled volume.';
    else if (lv === 'negative' || lv === 'zero') {
      errors.labelVolumeMl = 'Labeled volume must be greater than zero.';
    } else if (lv === 'large') errors.labelVolumeMl = 'Enter a smaller value.';
  }

  // Factor must resolve (guards against invented conversions).
  if (!blank && Object.keys(errors).length === 0) {
    const factor = resolveFactorMgPerMl(input);
    if (factor === null || !(factor > 0)) {
      if (input.mode === 'density') {
        errors.densityValue = 'Density is required to convert mg and mL.';
      } else if (input.concentrationFormat === 'mgPerMl') {
        errors.concentrationMgPerMl = 'Concentration is required to convert mg and mL.';
      } else {
        errors.labelVolumeMl = 'A valid labeled concentration is required.';
      }
    }
  }

  if (input.source === 'mass') {
    const m = numProblem(input.massMg, { allowZero: true });
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massMg = 'Enter a valid mass in milligrams.';
    else if (m === 'negative') errors.massMg = 'Mass cannot be negative.';
    else if (m === 'large') errors.massMg = 'Enter a smaller mass.';
  } else {
    const v = numProblem(input.volumeMl, { allowZero: true });
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volumeMl = 'Enter a valid volume in milliliters.';
    else if (v === 'negative') errors.volumeMl = 'Volume cannot be negative.';
    else if (v === 'large') errors.volumeMl = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
