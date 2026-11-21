import { calculateNationalInsurance } from './calculation';
import type {
  NationalInsuranceFieldErrors,
  NationalInsuranceInput,
  NationalInsuranceResult,
} from './types';
import { NI_YEAR_PARAMS } from './ni-parameters';

export interface NationalInsuranceValidation {
  isValid: boolean;
  errors: NationalInsuranceFieldErrors;
  result: NationalInsuranceResult | null;
}

function parseMoney(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateNationalInsuranceInput(
  input: NationalInsuranceInput
): NationalInsuranceValidation {
  const errors: NationalInsuranceFieldErrors = {};
  let hasFieldError = false;

  if (!NI_YEAR_PARAMS[input.taxYear]) {
    errors.form = 'Select a supported UK tax year.';
    hasFieldError = true;
  }

  const employment = parseMoney(input.employmentIncome);
  if (employment.blank) {
    errors.employmentIncome = 'Enter employment income (use 0 if none).';
    hasFieldError = true;
  } else if (employment.invalid || employment.value === null) {
    errors.employmentIncome = 'Enter a valid employment income amount.';
    hasFieldError = true;
  } else if (employment.value < 0) {
    errors.employmentIncome = 'Employment income cannot be negative.';
    hasFieldError = true;
  }

  const selfEmp = parseMoney(input.selfEmploymentIncome);
  if (selfEmp.blank) {
    errors.selfEmploymentIncome =
      'Enter self-employment net income (use 0 if none).';
    hasFieldError = true;
  } else if (selfEmp.invalid || selfEmp.value === null) {
    errors.selfEmploymentIncome =
      'Enter a valid self-employment net income amount.';
    hasFieldError = true;
  } else if (selfEmp.value < 0) {
    errors.selfEmploymentIncome =
      'Self-employment net income cannot be negative.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (employment.value === null || selfEmp.value === null) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateNationalInsurance({
    employmentIncome: employment.value,
    selfEmploymentIncome: selfEmp.value,
    taxYear: input.taxYear,
  });

  if (!result) {
    errors.form = 'Unable to calculate National Insurance with these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
