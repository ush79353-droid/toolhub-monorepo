import { calculateMme, parseNumber } from './calculation';
import type { MmeFieldErrors, MmeInput, MmeResult } from './types';
import { opioidOption } from './types';

export interface MmeValidation {
  errors: MmeFieldErrors;
  result: MmeResult | null;
}

export function validateMmeInput(input: MmeInput): MmeValidation {
  const errors: MmeFieldErrors = {};

  try {
    opioidOption(input.opioidId);
  } catch {
    errors.opioidId = 'Select an opioid from the CDC MME table.';
  }

  const basis = errors.opioidId
    ? null
    : opioidOption(input.opioidId).doseBasis;

  if (basis === 'mcg_per_hr' && input.doseUnit !== 'mcg_hr') {
    errors.doseUnit = 'Fentanyl transdermal uses mcg/hr (CDC table).';
  }
  if (basis === 'mg_per_day' && input.doseUnit === 'mcg_hr') {
    errors.doseUnit = 'Use mg or mcg per day for this opioid.';
  }

  const trimmed = input.doseText.trim();
  if (trimmed !== '') {
    const n = parseNumber(input.doseText);
    if (n === null) {
      errors.doseText = 'Enter a valid dose.';
    } else if (!(n >= 0)) {
      errors.doseText = 'Dose must be zero or greater.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      result: calculateMme({ ...input, doseText: '' }),
    };
  }

  return {
    errors,
    result: calculateMme(input),
  };
}
