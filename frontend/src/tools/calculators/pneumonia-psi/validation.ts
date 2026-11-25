import { calculatePsi, parseAgeYears } from './calculation';
import type { PsiFieldErrors, PsiInput, PsiResult } from './types';

export interface PsiValidation {
  errors: PsiFieldErrors;
  result: PsiResult | null;
}

export function validatePsiInput(input: PsiInput): PsiValidation {
  const errors: PsiFieldErrors = {};

  if (input.sex === '') {
    errors.sex = 'Select Female or Male.';
  }

  if (input.ageText.trim() !== '') {
    const age = parseAgeYears(input.ageText);
    if (age === null) errors.ageText = 'Enter a valid age in years.';
    else if (age < 0) errors.ageText = 'Age must be non-negative.';
    else if (age > 130) errors.ageText = 'Age must be 130 years or less.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculatePsi(input);
  const hasNumericResult = result.totalPoints !== null && input.ageText.trim() !== '';

  return {
    errors: {},
    result: hasNumericResult ? result : null,
  };
}