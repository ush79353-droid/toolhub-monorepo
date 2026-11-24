import { calculateInr, parseNumber } from './calculation';
import type { InrFieldErrors, InrInput, InrResult } from './types';

export interface InrValidation {
  errors: InrFieldErrors;
  result: InrResult | null;
}

export function validateInrInput(input: InrInput): InrValidation {
  const errors: InrFieldErrors = {};

  if (input.patientPtText.trim() !== '') {
    const patient = parseNumber(input.patientPtText);
    if (patient === null) {
      errors.patientPtText = 'Enter a valid patient PT in seconds.';
    } else if (!(patient > 0)) {
      errors.patientPtText = 'Patient PT must be greater than zero.';
    }
  }

  if (input.controlPtText.trim() !== '') {
    const control = parseNumber(input.controlPtText);
    if (control === null) {
      errors.controlPtText = 'Enter a valid control (mean normal) PT in seconds.';
    } else if (!(control > 0)) {
      errors.controlPtText =
        'Control PT (mean normal PT) must be greater than zero.';
    }
  }

  if (input.isiText.trim() !== '') {
    const isi = parseNumber(input.isiText);
    if (isi === null) {
      errors.isiText = 'Enter a valid ISI.';
    } else if (!(isi > 0)) {
      errors.isiText = 'ISI must be greater than zero.';
    }
  } else {
    errors.isiText = 'Enter the reagent ISI.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateInr(input),
  };
}
