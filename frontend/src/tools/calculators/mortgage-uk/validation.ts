import { calculateMortgageUk } from './calculation';
import type {
  MortgageUkFieldErrors,
  MortgageUkInput,
  MortgageUkResult,
} from './types';

export interface MortgageUkValidation {
  isValid: boolean;
  errors: MortgageUkFieldErrors;
  result: MortgageUkResult | null;
}

function parseNumber(raw: string): {
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateMortgageUkInput(input: MortgageUkInput): MortgageUkValidation {
  const errors: MortgageUkFieldErrors = {};

  const home = parseNumber(input.homePrice);
  const deposit = parseNumber(input.depositPercent);
  const term = parseNumber(input.loanTermYears);
  const rate = parseNumber(input.interestRatePercent);
  const taxes = parseNumber(input.taxesPercent);
  const homeIns = parseNumber(input.homeInsuranceAnnual);
  const mortIns = parseNumber(input.mortgageInsuranceAnnual);
  const other = parseNumber(input.otherCostsAnnual);
  const startMonth = parseNumber(input.startMonth);
  const startYear = parseNumber(input.startYear);

  if (home.blank || home.invalid || home.value === null) {
    errors.homePrice = 'Enter a valid home price.';
  } else if (!(home.value > 0)) {
    errors.homePrice = 'Home price must be greater than zero.';
  }

  if (deposit.blank || deposit.invalid || deposit.value === null) {
    errors.depositPercent = 'Enter a valid deposit percent.';
  } else if (deposit.value < 0 || deposit.value >= 100) {
    errors.depositPercent = 'Deposit must be at least 0% and less than 100%.';
  }

  if (term.blank || term.invalid || term.value === null) {
    errors.loanTermYears = 'Enter a valid loan term in years.';
  } else if (!(term.value > 0) || !Number.isInteger(term.value)) {
    errors.loanTermYears = 'Loan term must be a whole number of years greater than zero.';
  }

  if (rate.blank || rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (input.includeOptionals) {
    if (taxes.blank || taxes.invalid || taxes.value === null) {
      errors.taxesPercent = 'Enter a valid taxes percent.';
    } else if (taxes.value < 0) {
      errors.taxesPercent = 'Taxes percent cannot be negative.';
    }

    if (homeIns.blank || homeIns.invalid || homeIns.value === null) {
      errors.homeInsuranceAnnual = 'Enter a valid home insurance amount.';
    } else if (homeIns.value < 0) {
      errors.homeInsuranceAnnual = 'Home insurance cannot be negative.';
    }

    if (mortIns.blank || mortIns.invalid || mortIns.value === null) {
      errors.mortgageInsuranceAnnual = 'Enter a valid mortgage insurance amount.';
    } else if (mortIns.value < 0) {
      errors.mortgageInsuranceAnnual = 'Mortgage insurance cannot be negative.';
    }

    if (other.blank || other.invalid || other.value === null) {
      errors.otherCostsAnnual = 'Enter a valid other-costs amount.';
    } else if (other.value < 0) {
      errors.otherCostsAnnual = 'Other costs cannot be negative.';
    }
  }

  if (
    startMonth.blank ||
    startMonth.invalid ||
    startMonth.value === null ||
    !Number.isInteger(startMonth.value) ||
    startMonth.value < 1 ||
    startMonth.value > 12
  ) {
    errors.startMonth = 'Select a valid start month.';
  }

  if (
    startYear.blank ||
    startYear.invalid ||
    startYear.value === null ||
    !Number.isInteger(startYear.value) ||
    startYear.value < 1 ||
    startYear.value > 9999
  ) {
    errors.startYear = 'Enter a valid start year.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMortgageUk({
    homePrice: home.value!,
    depositPercent: deposit.value!,
    termYears: term.value!,
    annualRatePercent: rate.value!,
    includeOptionals: input.includeOptionals,
    taxesPercent: input.includeOptionals ? taxes.value! : 0,
    homeInsuranceAnnual: input.includeOptionals ? homeIns.value! : 0,
    mortgageInsuranceAnnual: input.includeOptionals ? mortIns.value! : 0,
    otherCostsAnnual: input.includeOptionals ? other.value! : 0,
    startMonth: startMonth.value!,
    startYear: startYear.value!,
  });

  if (!result) {
    errors.form = 'Unable to calculate a finite mortgage result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
