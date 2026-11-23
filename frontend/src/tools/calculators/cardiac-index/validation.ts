import { calculateCardiacIndex, parseNumber } from './calculation';
import type {
  CardiacIndexFieldErrors,
  CardiacIndexInput,
  CardiacIndexResult,
} from './types';

export interface CardiacIndexValidation {
  errors: CardiacIndexFieldErrors;
  result: CardiacIndexResult | null;
}

function checkPositiveField(
  raw: string,
  key: keyof CardiacIndexFieldErrors,
  label: string,
  errors: CardiacIndexFieldErrors,
  opts?: { allowZero?: boolean; max?: number },
): void {
  if (raw.trim() === '') return;
  const n = parseNumber(raw);
  if (n === null) {
    errors[key] = `Enter a valid ${label}.`;
    return;
  }
  if (opts?.max != null && n > opts.max) {
    errors[key] = `${label} must be ≤ ${opts.max}.`;
    return;
  }
  if (opts?.allowZero ? !(n >= 0) : !(n > 0)) {
    errors[key] = opts?.allowZero
      ? `${label} cannot be negative.`
      : `${label} must be positive.`;
  }
}

export function validateCardiacIndexInput(
  input: CardiacIndexInput,
): CardiacIndexValidation {
  const errors: CardiacIndexFieldErrors = {};

  checkPositiveField(input.heightText, 'heightText', 'height', errors);
  checkPositiveField(input.weightText, 'weightText', 'weight', errors);

  if (input.knowsCardiacOutput === 'yes') {
    checkPositiveField(
      input.cardiacOutputText,
      'cardiacOutputText',
      'cardiac output',
      errors,
    );
  } else {
    checkPositiveField(
      input.hemoglobinText,
      'hemoglobinText',
      'hemoglobin',
      errors,
    );
    checkPositiveField(
      input.oxygenConsumptionText,
      'oxygenConsumptionText',
      'O₂ consumption',
      errors,
    );
    checkPositiveField(
      input.arterialSaturationText,
      'arterialSaturationText',
      'arterial saturation',
      errors,
      { allowZero: true, max: 100 },
    );
    checkPositiveField(
      input.arterialTensionText,
      'arterialTensionText',
      'arterial tension',
      errors,
      { allowZero: true },
    );
    checkPositiveField(
      input.venousSaturationText,
      'venousSaturationText',
      'venous saturation',
      errors,
      { allowZero: true, max: 100 },
    );
    checkPositiveField(
      input.venousTensionText,
      'venousTensionText',
      'venous tension',
      errors,
      { allowZero: true },
    );
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateCardiacIndex(input) };
}
