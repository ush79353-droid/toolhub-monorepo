import {
  WHO_WFA_AGE_MONTHS_MAX,
  WHO_WFA_AGE_MONTHS_MIN,
} from './datasets';
import {
  ageToMonths,
  calculateWeightPercentile,
  weightToKg,
} from './calculation';
import type {
  AgeUnit,
  WeightPercentileFieldErrors,
  WeightPercentileInput,
  WeightPercentileResult,
  WeightUnit,
} from './types';

const AGE_UNITS: readonly AgeUnit[] = ['mos', 'yrs'];
const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb'];

export interface WeightPercentileValidation {
  isValid: boolean;
  errors: WeightPercentileFieldErrors;
  result: WeightPercentileResult | null;
}

function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function collectFieldErrors(
  input: WeightPercentileInput,
): WeightPercentileFieldErrors {
  const errors: WeightPercentileFieldErrors = {};

  if (!AGE_UNITS.includes(input.ageUnit)) {
    errors.age = 'Select an age unit.';
  }
  if (!WEIGHT_UNITS.includes(input.weightUnit)) {
    errors.weight = 'Select a weight unit.';
  }

  if (input.age.trim() !== '') {
    const age = parseNumber(input.age);
    if (age == null || age < 0) {
      errors.age = 'Enter a valid age.';
    } else {
      const months = ageToMonths(age, input.ageUnit);
      if (months < WHO_WFA_AGE_MONTHS_MIN || months > WHO_WFA_AGE_MONTHS_MAX) {
        errors.age = `WHO weight-for-age covers ${WHO_WFA_AGE_MONTHS_MIN}–${WHO_WFA_AGE_MONTHS_MAX} months (birth to 5 years).`;
      }
    }
  }

  if (input.weight.trim() !== '') {
    const w = parseNumber(input.weight);
    if (w == null || !(w > 0)) {
      errors.weight = 'Enter a valid weight.';
    } else {
      const kg = weightToKg(w, input.weightUnit);
      if (!(kg > 0) || kg > 80) {
        errors.weight = 'Weight is out of a realistic child range.';
      }
    }
  }

  const any =
    input.age.trim() !== '' || input.weight.trim() !== '';
  if (any) {
    if (input.age.trim() === '') errors.age = errors.age ?? 'Enter age.';
    if (input.weight.trim() === '') {
      errors.weight = errors.weight ?? 'Enter weight.';
    }
  }

  return errors;
}

export function hasFieldErrors(errors: WeightPercentileFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateWeightPercentileInput(
  input: WeightPercentileInput,
): WeightPercentileValidation {
  if (input.age.trim() === '' && input.weight.trim() === '') {
    return { isValid: true, errors: {}, result: null };
  }
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  try {
    const age = parseNumber(input.age)!;
    const w = parseNumber(input.weight)!;
    const result = calculateWeightPercentile({
      ageMonths: ageToMonths(age, input.ageUnit),
      sex: input.sex,
      weightKg: weightToKg(w, input.weightUnit),
    });
    return { isValid: true, errors: {}, result };
  } catch {
    return {
      isValid: false,
      errors: { form: 'Unable to compute percentile with these inputs.' },
      result: null,
    };
  }
}
