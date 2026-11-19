import {
  calculateLongTermCareResults,
  isLongTermCareInputBlank,
  normalizeAnnualCareCost,
  parseOptionalNumber,
} from './calculation';
import type {
  LongTermCareFieldErrors,
  LongTermCareInput,
  LongTermCareResult,
} from './types';

export interface LongTermCareValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: LongTermCareFieldErrors;
  result: LongTermCareResult | null;
}

const MAX_YEARS = 100;
const MAX_COST = 1e12;
const MAX_INFLATION = 1000;

export function validateLongTermCareInput(
  input: LongTermCareInput,
): LongTermCareValidation {
  const errors: LongTermCareFieldErrors = {};

  if (isLongTermCareInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const careCost = parseOptionalNumber(input.careCost);
  const presentYear = parseOptionalNumber(input.presentYearCost);
  const years = parseOptionalNumber(input.years);
  const inflation = parseOptionalNumber(input.inflationRate);

  if (careCost === null || !(careCost > 0) || careCost > MAX_COST) {
    errors.careCost = 'Enter a care cost greater than zero.';
  }
  if (presentYear === null || !(presentYear > 0) || presentYear > MAX_COST) {
    errors.presentYearCost =
      'Enter a positive annual cost for the present year.';
  }
  if (
    years === null ||
    !Number.isInteger(years) ||
    !(years > 0) ||
    years > MAX_YEARS
  ) {
    errors.years = `Enter a whole number of years from 1 to ${MAX_YEARS}.`;
  }
  if (inflation === null || inflation < 0 || inflation > MAX_INFLATION) {
    errors.inflationRate = 'Enter an inflation rate of 0% or more.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  // Present-year annual baseline is the single expense used for inflation (not added to care cost).
  const annualCareCost = presentYear!;

  const result = calculateLongTermCareResults({
    frequency: input.frequency,
    careCost: careCost!,
    annualCareCost,
    years: years!,
    inflationRatePercent: inflation!,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Unable to calculate with the provided values.' },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}

export function derivedAnnualFromCare(input: LongTermCareInput): number | null {
  const care = parseOptionalNumber(input.careCost);
  if (care === null || !(care > 0)) return null;
  return normalizeAnnualCareCost(care, input.frequency);
}
