/**
 * Fiber Calculator — UI stub validation (ADR-019 commit 1).
 */

import { calculateFiber, parseNumber } from './calculation';
import type { FiberFieldErrors, FiberInput, FiberResult } from './types';

export interface FiberValidation {
  errors: FiberFieldErrors;
  result: FiberResult | null;
}

export function validateFiberInput(input: FiberInput): FiberValidation {
  const errors: FiberFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age.';
    else if (!(age > 0)) errors.ageYearsText = 'Age must be positive.';
  }

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be positive.';
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  if (input.caloriesText.trim() !== '') {
    const k = parseNumber(input.caloriesText);
    if (k === null) errors.caloriesText = 'Enter valid calories.';
    else if (!(k > 0)) errors.caloriesText = 'Calories must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: calculateFiber(input) };
  }

  return { errors: {}, result: calculateFiber(input) };
}
