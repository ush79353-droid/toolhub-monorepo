import { calculateFromInput, medianDisplayForInput } from './calculation';
import type { McaFieldErrors, McaInput, McaResult } from './types';

export interface McaValidation {
  isValid: boolean;
  errors: McaFieldErrors;
  result: McaResult | null;
  medianDisplay: ReturnType<typeof medianDisplayForInput>;
}

export function validateMcaInput(input: McaInput): McaValidation {
  const errors: McaFieldErrors = {};
  const medianDisplay = medianDisplayForInput(input);

  if (medianDisplay.medianPsvCm == null) {
    errors.gaWeeks =
      input.plurality === 'twin'
        ? 'No published MCDA twin median for this gestational week.'
        : 'Gestational week is outside the singleton reference table.';
  }

  const cleaned = input.psvText.trim().replace(/,/g, '');
  if (cleaned === '') {
    return { isValid: false, errors, result: null, medianDisplay };
  }

  if (/infinity|nan/i.test(cleaned) || !Number.isFinite(Number(cleaned))) {
    errors.psvText = 'Enter a valid positive MCA peak systolic velocity.';
    return { isValid: false, errors, result: null, medianDisplay };
  }

  const numeric = Number(cleaned);
  if (!(numeric > 0)) {
    errors.psvText = 'Enter a positive MCA peak systolic velocity.';
    return { isValid: false, errors, result: null, medianDisplay };
  }

  if (medianDisplay.medianPsvCm == null) {
    return { isValid: false, errors, result: null, medianDisplay };
  }

  const result = calculateFromInput(input);
  if (!result) {
    errors.form = 'Unable to compute MoM for these inputs.';
    return { isValid: false, errors, result: null, medianDisplay };
  }

  return { isValid: true, errors, result, medianDisplay };
}