import { calculateRsbi } from './calculation';
import type { RsbiFieldErrors, RsbiInput, RsbiResult } from './types';

export interface RsbiValidation {
  isValid: boolean;
  errors: RsbiFieldErrors;
  result: RsbiResult | null;
}

function finite(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function validateRsbiInput(input: RsbiInput): RsbiValidation {
  const errors: RsbiFieldErrors = {};

  if (!finite(input.respiratoryRate)) errors.respiratoryRate = 'Required';
  else if (input.respiratoryRate < 0)
    errors.respiratoryRate = 'Respiratory rate cannot be negative.';
  else if (input.respiratoryRate === 0)
    errors.respiratoryRate = 'Respiratory rate must be greater than 0.';

  if (!finite(input.tidalVolumeMl)) errors.tidalVolumeMl = 'Required';
  else if (input.tidalVolumeMl < 0)
    errors.tidalVolumeMl = 'Tidal volume cannot be negative.';
  else if (input.tidalVolumeMl === 0)
    errors.tidalVolumeMl = 'Tidal volume must be greater than 0 (zero denominator).';

  if (errors.respiratoryRate || errors.tidalVolumeMl) {
    errors.form =
      'Enter respiratory rate and tidal volume (mL) to calculate RSBI.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateRsbi(input),
  };
}
