import { resolveConcentrationMcgPerMl, resolveDensityGPerMl } from './calculation';
import { MAX_ABS_VALUE, type McgToMlFieldErrors, type McgToMlInput } from './types';

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
  opts: { requirePositive?: boolean } = {},
): 'blank' | 'bad' | 'negative' | 'zero' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (opts.requirePositive && value === 0) return 'zero';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMcgToMl(input: McgToMlInput): {
  isValid: boolean;
  errors: McgToMlFieldErrors;
} {
  const errors: McgToMlFieldErrors = {};
  let blank = false;

  if (input.mode === 'medication') {
    if (input.medicationPreset === 'custom') {
      const c = numProblem(input.concentrationValue, { requirePositive: true });
      if (c === 'blank') blank = true;
      else if (c === 'bad') errors.concentrationValue = 'Enter a valid concentration.';
      else if (c === 'negative' || c === 'zero') {
        errors.concentrationValue = 'Concentration must be greater than zero.';
      } else if (c === 'large') errors.concentrationValue = 'Enter a smaller concentration.';
    }
    if (!blank && Object.keys(errors).length === 0) {
      const factor = resolveConcentrationMcgPerMl(input);
      if (factor === null || !(factor > 0)) {
        errors.concentrationValue =
          'Enter a valid concentration or density to calculate the volume.';
      }
    }
  } else {
    const d = numProblem(input.densityValue, { requirePositive: true });
    if (d === 'blank') blank = true;
    else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
    else if (d === 'negative' || d === 'zero') {
      errors.densityValue = 'Density must be greater than zero.';
    } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

    if (!blank && Object.keys(errors).length === 0) {
      const density = resolveDensityGPerMl(input);
      if (density === null || !(density > 0)) {
        errors.densityValue = 'Enter a valid concentration or density to calculate the volume.';
      }
    }
  }

  if (input.source === 'mass') {
    const m = numProblem(input.massMcg);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massMcg = 'Enter a valid medication dosage.';
    else if (m === 'negative') errors.massMcg = 'Dosage cannot be negative.';
    else if (m === 'large') errors.massMcg = 'Enter a smaller dosage.';
  } else {
    const v = numProblem(input.volumeMl);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volumeMl = 'Enter a valid liquid dosage.';
    else if (v === 'negative') errors.volumeMl = 'Volume cannot be negative.';
    else if (v === 'large') errors.volumeMl = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
