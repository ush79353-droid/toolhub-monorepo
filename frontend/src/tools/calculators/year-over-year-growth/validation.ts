import { calculateYearOverYearGrowth } from './calculation';
import type {
  YearOverYearGrowthFieldErrors,
  YearOverYearGrowthInput,
  YearOverYearGrowthResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateYearOverYearGrowthInput(input: YearOverYearGrowthInput): {
  isValid: boolean;
  errors: YearOverYearGrowthFieldErrors;
  result: YearOverYearGrowthResult | null;
} {
  const errors: YearOverYearGrowthFieldErrors = {};

  const initialYearValue = parseField(input.initialYearValue);
  const finalYearValue = parseField(input.finalYearValue);
  const numberOfYearsRaw = parseField(input.numberOfYears);

  if (initialYearValue === null || finalYearValue === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(initialYearValue) || initialYearValue < 0) {
    errors.initialYearValue = 'Enter a valid initial year value (≥ 0).';
  } else if (initialYearValue === 0) {
    errors.initialYearValue = 'Initial year value must be greater than zero.';
  }

  if (Number.isNaN(finalYearValue)) {
    errors.finalYearValue = 'Enter a valid final year value.';
  }

  let numberOfYears: number | null = null;
  if (input.numberOfYears.trim() !== '') {
    if (numberOfYearsRaw === null || Number.isNaN(numberOfYearsRaw) || numberOfYearsRaw <= 0) {
      errors.numberOfYears = 'Enter a positive number of years for CAGR.';
    } else {
      numberOfYears = numberOfYearsRaw;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateYearOverYearGrowth({
    initialYearValue,
    finalYearValue,
    numberOfYears,
  });

  if (!result) {
    errors.form = 'Unable to calculate year-over-year growth for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
