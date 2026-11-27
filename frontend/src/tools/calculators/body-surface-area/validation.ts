import {
  calculateBodySurfaceArea,
  parseNumber,
  resolveHeightCm,
} from './calculation';
import type {
  BodySurfaceAreaFieldErrors,
  BodySurfaceAreaInput,
  BodySurfaceAreaResult,
} from './types';

export interface BodySurfaceAreaValidation {
  errors: BodySurfaceAreaFieldErrors;
  result: BodySurfaceAreaResult | null;
}

export function validateBodySurfaceAreaInput(
  input: BodySurfaceAreaInput,
  opts: { requireComplete?: boolean } = {},
): BodySurfaceAreaValidation {
  const errors: BodySurfaceAreaFieldErrors = {};
  const requireComplete = opts.requireComplete ?? false;

  const weightFilled = input.weightText.trim() !== '';
  if (weightFilled || requireComplete) {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weight = 'Enter a valid body weight.';
    else if (!(w > 0)) errors.weight = 'Weight must be greater than zero.';
    else if (w > 1000) errors.weight = 'Enter a plausible body weight.';
  }

  const imperialFilled =
    input.heightFt.trim() !== '' || input.heightIn.trim() !== '';
  const metricFilled = input.heightCm.trim() !== '';
  const heightTouched =
    input.heightSource === 'metric' ? metricFilled : imperialFilled;

  if (heightTouched || requireComplete) {
    if (input.heightSource === 'metric') {
      const cm = parseNumber(input.heightCm);
      if (cm === null) errors.height = 'Enter a valid height in cm.';
      else if (!(cm > 0)) errors.height = 'Height must be greater than zero.';
      else if (cm < 30 || cm > 300)
        errors.height = 'Enter a height between 30 and 300 cm.';
    } else {
      const ft = parseNumber(input.heightFt);
      const inches = parseNumber(input.heightIn);
      if (
        (input.heightFt.trim() !== '' && ft === null) ||
        (input.heightIn.trim() !== '' && inches === null)
      ) {
        errors.height = 'Enter a valid height in feet and inches.';
      } else {
        const i = inches ?? 0;
        if (i < 0 || i >= 12) {
          errors.height = 'Inches must be from 0 up to (but not including) 12.';
        } else if (resolveHeightCm(input) === null) {
          errors.height = 'Enter a height greater than zero.';
        } else {
          const cm = resolveHeightCm(input)!;
          if (cm < 30 || cm > 300)
            errors.height = 'Enter a height in a plausible adult/child range.';
        }
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  if (!requireComplete && (parseNumber(input.weightText) === null || resolveHeightCm(input) === null)) {
    return { errors: {}, result: null };
  }

  return {
    errors: {},
    result: calculateBodySurfaceArea(input),
  };
}
