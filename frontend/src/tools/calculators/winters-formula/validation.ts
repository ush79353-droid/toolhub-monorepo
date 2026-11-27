import { calculateWintersFormula, parseNumber } from './calculation';
import type {
  WintersFormulaFieldErrors,
  WintersFormulaInput,
  WintersFormulaResult,
} from './types';

export interface WintersFormulaValidation {
  errors: WintersFormulaFieldErrors;
  result: WintersFormulaResult | null;
}

export function validateWintersFormulaInput(
  input: WintersFormulaInput,
): WintersFormulaValidation {
  const errors: WintersFormulaFieldErrors = {};

  if (input.bicarbonateText.trim() !== '') {
    const b = parseNumber(input.bicarbonateText);
    if (b === null) errors.bicarbonateText = 'Enter a valid HCO₃ value.';
    else if (!(b > 0))
      errors.bicarbonateText = 'HCO₃ must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateWintersFormula(input),
  };
}
