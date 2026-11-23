import { calculateMeanSacDiameter, dimToMm } from './calculation';
import type {
  MeanSacDiameterFieldErrors,
  MeanSacDiameterInput,
  MeanSacDiameterResult,
} from './types';

export interface MeanSacDiameterValidation {
  isValid: boolean;
  errors: MeanSacDiameterFieldErrors;
  result: MeanSacDiameterResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function validateDim(
  raw: string,
  unit: MeanSacDiameterInput['lengthUnit'],
  label: string
): { mm: number | null; error?: string; blank: boolean } {
  const parsed = parseNumber(raw);
  if (parsed.blank) return { mm: null, blank: true };
  if (parsed.invalid || parsed.value === null || parsed.value < 0) {
    return {
      mm: null,
      blank: false,
      error: `Enter a valid non-negative ${label}.`,
    };
  }
  const mm = dimToMm(parsed.value, unit);
  if (mm == null) {
    return { mm: null, blank: false, error: `Enter a valid ${label}.` };
  }
  return { mm, blank: false };
}

/**
 * Results require all three orthogonal diameters. Partial entries stay blank
 * (no invented zeros).
 */
export function validateMeanSacDiameterInput(
  input: MeanSacDiameterInput
): MeanSacDiameterValidation {
  const errors: MeanSacDiameterFieldErrors = {};
  const length = validateDim(input.lengthValue, input.lengthUnit, 'length');
  const width = validateDim(input.widthValue, input.widthUnit, 'width');
  const height = validateDim(input.heightValue, input.heightUnit, 'height');

  if (length.blank || width.blank || height.blank) {
    if (!length.blank && length.error) errors.lengthValue = length.error;
    if (!width.blank && width.error) errors.widthValue = width.error;
    if (!height.blank && height.error) errors.heightValue = height.error;
    return { isValid: false, errors, result: null };
  }

  if (length.error) errors.lengthValue = length.error;
  if (width.error) errors.widthValue = width.error;
  if (height.error) errors.heightValue = height.error;
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMeanSacDiameter(
    input,
    length.mm!,
    width.mm!,
    height.mm!
  );
  if (!result) {
    errors.form = 'Unable to compute mean sac diameter.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
