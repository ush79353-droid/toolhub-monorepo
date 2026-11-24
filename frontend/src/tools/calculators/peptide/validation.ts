import { calculatePeptide, parseNumber } from './calculation';
import type { PeptideFieldErrors, PeptideInput, PeptideResult } from './types';

export interface PeptideValidation {
  isValid: boolean;
  errors: PeptideFieldErrors;
  result: PeptideResult | null;
}

export function validatePeptideInput(input: PeptideInput): PeptideValidation {
  const errors: PeptideFieldErrors = {};

  const vial = parseNumber(input.vialMassText);
  if (input.vialMassText.trim() !== '' && vial === null) {
    errors.vialMassText = 'Enter a valid vial mass.';
  } else if (vial !== null && !(vial > 0)) {
    errors.vialMassText = 'Vial mass must be greater than 0.';
  }

  const diluent = parseNumber(input.diluentMlText);
  if (input.diluentMlText.trim() !== '' && diluent === null) {
    errors.diluentMlText = 'Enter a valid diluent volume.';
  } else if (diluent !== null && !(diluent > 0)) {
    errors.diluentMlText = 'Diluent volume must be greater than 0.';
  }

  const dose = parseNumber(input.doseText);
  if (input.doseText.trim() !== '' && dose === null) {
    errors.doseText = 'Enter a valid dose.';
  } else if (dose !== null && !(dose > 0)) {
    errors.doseText = 'Dose must be greater than 0.';
  }

  const scale = parseNumber(input.syringeUnitsPerMlText);
  if (input.syringeUnitsPerMlText.trim() !== '' && scale === null) {
    errors.syringeUnitsPerMlText = 'Enter syringe marks per mL.';
  } else if (scale !== null && !(scale > 0)) {
    errors.syringeUnitsPerMlText = 'Syringe scale must be greater than 0.';
  }

  const result = calculatePeptide(input);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    result,
  };
}
