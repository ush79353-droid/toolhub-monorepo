import type {
  FullTimeEquivalentFieldErrors,
  FullTimeEquivalentInput,
} from './types';

function parseOptionalNumber(value: string): number | null | typeof Number.NaN {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function isWholeNumber(value: number): boolean {
  return Number.isInteger(value);
}

export function validateFullTimeEquivalentInput(input: FullTimeEquivalentInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: FullTimeEquivalentFieldErrors;
  parsed: {
    fullTimeEmployees: number;
    fullTimeHours: number;
    partTimeEmployees: number;
    partTimeHours: number;
  } | null;
} {
  const errors: FullTimeEquivalentFieldErrors = {};

  const ftEmp = parseOptionalNumber(input.fullTimeEmployees);
  const ftHrs = parseOptionalNumber(input.fullTimeHours);
  const ptEmp = parseOptionalNumber(input.partTimeEmployees);
  const ptHrs = parseOptionalNumber(input.partTimeHours);

  if (ftEmp === null || ftHrs === null || ptEmp === null || ptHrs === null) {
    return { isValid: false, incomplete: true, errors, parsed: null };
  }

  if (Number.isNaN(ftEmp) || ftEmp < 0 || !isWholeNumber(ftEmp)) {
    errors.fullTimeEmployees = 'Enter a whole number of employees (0 or more)';
  }
  if (Number.isNaN(ptEmp) || ptEmp < 0 || !isWholeNumber(ptEmp)) {
    errors.partTimeEmployees = 'Enter a whole number of employees (0 or more)';
  }
  if (Number.isNaN(ftHrs) || ftHrs <= 0) {
    errors.fullTimeHours = 'Full-time working hours must be greater than zero';
  }
  if (Number.isNaN(ptHrs) || ptHrs < 0) {
    errors.partTimeHours = 'Enter a valid non-negative number of hours';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, parsed: null };
  }

  return {
    isValid: true,
    incomplete: false,
    errors: {},
    parsed: {
      fullTimeEmployees: ftEmp,
      fullTimeHours: ftHrs,
      partTimeEmployees: ptEmp,
      partTimeHours: ptHrs,
    },
  };
}
