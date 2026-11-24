import { calculateIvigDose, parseNumber } from './calculation';
import type {
  IvigDoseFieldErrors,
  IvigDoseInput,
  IvigDoseResult,
} from './types';

export interface IvigDoseValidation {
  errors: IvigDoseFieldErrors;
  result: IvigDoseResult | null;
}

export function validateIvigDoseInput(
  input: IvigDoseInput,
): IvigDoseValidation {
  const errors: IvigDoseFieldErrors = {};
  const isGeneral = input.calculationType === 'general';

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be positive.';
  }

  if (isGeneral) {
    if (input.dosingText.trim() !== '') {
      const d = parseNumber(input.dosingText);
      if (d === null) errors.dosingText = 'Enter a valid dose.';
      else if (!(d > 0)) errors.dosingText = 'Dosing must be positive.';
    } else {
      errors.dosingText = 'Dosing (g/kg) is required.';
    }
  } else if (input.fetalCellsPercentText.trim() !== '') {
    const f = parseNumber(input.fetalCellsPercentText);
    if (f === null) errors.fetalCellsPercentText = 'Enter a valid percent.';
    else if (!(f >= 0) || f > 100) {
      errors.fetalCellsPercentText = 'Fetal cells must be 0–100%.';
    }
  }

  const hasBlocking =
    Boolean(errors.weightText) ||
    Boolean(errors.heightText) ||
    Boolean(errors.dosingText && input.dosingText.trim() !== '') ||
    Boolean(
      errors.fetalCellsPercentText &&
        input.fetalCellsPercentText.trim() !== '',
    );

  if (hasBlocking) {
    return { errors, result: null };
  }

  return { errors, result: calculateIvigDose(input) };
}
