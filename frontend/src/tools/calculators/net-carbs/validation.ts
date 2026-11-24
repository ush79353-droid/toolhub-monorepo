/**
 * Net Carbs Calculator — pure input validation (ADR-018).
 */

import { calculateNetCarbs, parseNumber } from './calculation';
import type { NetCarbsFieldErrors, NetCarbsInput, NetCarbsResult } from './types';

export interface NetCarbsValidation {
  errors: NetCarbsFieldErrors;
  result: NetCarbsResult | null;
}

function validateNonNegativeGrams(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label} value.`;
  if (n < 0) return `${label} must be non-negative.`;
  return undefined;
}

export function validateNetCarbsInput(input: NetCarbsInput): NetCarbsValidation {
  const errors: NetCarbsFieldErrors = {};

  const totalErr = validateNonNegativeGrams(
    input.totalCarbsText,
    'total carbohydrates',
  );
  if (totalErr) errors.totalCarbsText = totalErr;

  const fiberErr = validateNonNegativeGrams(input.fiberText, 'fiber');
  if (fiberErr) errors.fiberText = fiberErr;

  const sugarErr = validateNonNegativeGrams(
    input.sugarAlcoholText,
    'sugar alcohol',
  );
  if (sugarErr) errors.sugarAlcoholText = sugarErr;

  if (input.servingsText.trim() !== '') {
    const s = parseNumber(input.servingsText);
    if (s === null) errors.servingsText = 'Enter a valid servings value.';
    else if (!(s > 0)) errors.servingsText = 'Servings must be positive.';
  }

  // Soft consistency: fiber / sugar alcohol should not exceed total when both present (US path).
  const total = parseNumber(input.totalCarbsText);
  const fiber = parseNumber(input.fiberText);
  const sugar = parseNumber(input.sugarAlcoholText);
  if (
    total !== null &&
    fiber !== null &&
    !errors.totalCarbsText &&
    !errors.fiberText &&
    input.usaCanada === 'yes' &&
    fiber > total
  ) {
    errors.fiberText = 'Fiber cannot exceed total carbohydrates on a US/Canada label.';
  }
  if (
    total !== null &&
    sugar !== null &&
    !errors.totalCarbsText &&
    !errors.sugarAlcoholText &&
    sugar > total
  ) {
    errors.sugarAlcoholText =
      'Sugar alcohol cannot exceed total carbohydrates.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateNetCarbs(input) };
}
