import { calculateAbsoluteLymphocyteCount, parseNumber } from './calculation';
import type {
  AbsoluteLymphocyteCountFieldErrors,
  AbsoluteLymphocyteCountInput,
  AbsoluteLymphocyteCountResult,
} from './types';

export interface AbsoluteLymphocyteCountValidation {
  errors: AbsoluteLymphocyteCountFieldErrors;
  result: AbsoluteLymphocyteCountResult | null;
}

export function validateAbsoluteLymphocyteCountInput(
  input: AbsoluteLymphocyteCountInput,
): AbsoluteLymphocyteCountValidation {
  const errors: AbsoluteLymphocyteCountFieldErrors = {};

  if (input.wbcText.trim() !== '') {
    const wbc = parseNumber(input.wbcText);
    if (wbc === null) errors.wbcText = 'Enter a valid WBC.';
    else if (!(wbc > 0)) errors.wbcText = 'WBC must be positive.';
  }

  if (input.lymphocytePercentText.trim() !== '') {
    const lymph = parseNumber(input.lymphocytePercentText);
    if (lymph === null) errors.lymphocytePercentText = 'Enter a valid percentage.';
    else if (!(lymph >= 0 && lymph <= 100)) {
      errors.lymphocytePercentText =
        'Lymphocyte percentage must be between 0 and 100.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAbsoluteLymphocyteCount(input),
  };
}