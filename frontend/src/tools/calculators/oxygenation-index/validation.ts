import { calculateOxygenationIndex, pao2ToMmHg } from './calculation';
import type {
  OxygenationIndexFieldErrors,
  OxygenationIndexInput,
  OxygenationIndexResult,
} from './types';

export interface OxygenationIndexValidation {
  isValid: boolean;
  errors: OxygenationIndexFieldErrors;
  result: OxygenationIndexResult | null;
}

function finite(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

export function validateOxygenationIndexInput(
  input: OxygenationIndexInput,
): OxygenationIndexValidation {
  const errors: OxygenationIndexFieldErrors = {};

  if (!finite(input.fio2Percent)) errors.fio2Percent = 'Required';
  else if (input.fio2Percent <= 0 || input.fio2Percent > 100)
    errors.fio2Percent = 'FiO₂ must be greater than 0 and at most 100%.';

  if (!finite(input.map)) errors.map = 'Required';
  else if (input.map <= 0)
    errors.map = 'Mean airway pressure must be greater than 0.';

  if (!finite(input.pao2)) errors.pao2 = 'Required';
  else if (input.pao2 <= 0)
    errors.pao2 = 'PaO₂ must be greater than 0 (zero denominator).';

  if (errors.fio2Percent || errors.map || errors.pao2) {
    errors.form =
      'Enter FiO₂ %, mean airway pressure, and PaO₂ to calculate P/F and OI.';
    return { isValid: false, errors, result: null };
  }

  const pao2MmHg = pao2ToMmHg(input.pao2 as number, input.pao2Unit);
  if (!(pao2MmHg > 0)) {
    errors.pao2 = 'PaO₂ must be greater than 0 after unit conversion.';
    errors.form = 'PaO₂ cannot be zero.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateOxygenationIndex(input),
  };
}
