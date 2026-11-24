import { calculateMentzerIndex, parseNumber } from './calculation';
import type {
  MentzerIndexFieldErrors,
  MentzerIndexInput,
  MentzerIndexResult,
} from './types';

export interface MentzerIndexValidation {
  errors: MentzerIndexFieldErrors;
  result: MentzerIndexResult | null;
}

export function validateMentzerIndexInput(
  input: MentzerIndexInput,
): MentzerIndexValidation {
  const errors: MentzerIndexFieldErrors = {};

  if (input.mcvFlText.trim() !== '') {
    const mcv = parseNumber(input.mcvFlText);
    if (mcv === null) {
      errors.mcvFlText = 'Enter a valid MCV.';
    } else if (!(mcv > 0 && mcv <= 200)) {
      errors.mcvFlText = 'MCV must be greater than 0 and at most 200 fL.';
    }
  }

  if (input.rbcText.trim() !== '') {
    const rbc = parseNumber(input.rbcText);
    if (rbc === null) {
      errors.rbcText = 'Enter a valid RBC count.';
    } else if (!(rbc > 0 && rbc <= 15)) {
      errors.rbcText =
        'RBC must be greater than 0 and at most 15 (million-scale).';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateMentzerIndex(input),
  };
}
