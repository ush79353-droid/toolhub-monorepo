import { calculateHydroxychloroquineDose, doseToMg, parseNumber, weightToKg } from './calculation';
import type {
  HydroxychloroquineDoseFieldErrors,
  HydroxychloroquineDoseInput,
  HydroxychloroquineDoseResult,
} from './types';

export interface HydroxychloroquineDoseValidation {
  errors: HydroxychloroquineDoseFieldErrors;
  result: HydroxychloroquineDoseResult | null;
}

export function validateHydroxychloroquineDoseInput(
  input: HydroxychloroquineDoseInput,
): HydroxychloroquineDoseValidation {
  const errors: HydroxychloroquineDoseFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) {
      errors.weightText = 'Enter a valid weight.';
    } else if (!(w > 0)) {
      errors.weightText = 'Weight must be greater than zero.';
    } else {
      const kg = weightToKg(w, input.weightUnit);
      if (!(kg < 500)) {
        errors.weightText = 'Weight looks out of range.';
      }
    }
  }

  if (input.dailyDoseText.trim() !== '') {
    const d = parseNumber(input.dailyDoseText);
    if (d === null) {
      errors.dailyDoseText = 'Enter a valid daily dose.';
    } else if (!(d > 0)) {
      errors.dailyDoseText = 'Daily dose must be greater than zero.';
    } else {
      const mg = doseToMg(d, input.doseUnit);
      if (!(mg <= 10000)) {
        errors.dailyDoseText = 'Daily dose looks out of range.';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  try {
    return { errors: {}, result: calculateHydroxychloroquineDose(input) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid input.';
    return {
      errors: { dailyDoseText: msg },
      result: null,
    };
  }
}
