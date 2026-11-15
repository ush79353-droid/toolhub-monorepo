import { calculateRateOfReturn } from './calculation';
import type {
  RateOfReturnFieldErrors,
  RateOfReturnInput,
  RateOfReturnResult,
} from './types';

export interface RateOfReturnValidation {
  isValid: boolean;
  errors: RateOfReturnFieldErrors;
  result: RateOfReturnResult | null;
}

function parseNumber(raw: string): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateRateOfReturnInput(input: RateOfReturnInput): RateOfReturnValidation {
  const errors: RateOfReturnFieldErrors = {};

  const initial = parseNumber(input.initialInvestment);
  const finalAmount = parseNumber(input.finalAmount);
  const term = parseNumber(input.term);
  const cashFlow = parseNumber(input.periodicCashFlow);

  if (initial.blank) {
    errors.initialInvestment = 'Enter an initial investment.';
  } else if (initial.invalid || initial.value === null) {
    errors.initialInvestment = 'Enter a valid initial investment.';
  } else if (!(initial.value > 0)) {
    errors.initialInvestment = 'Initial investment must be greater than zero.';
  }

  if (finalAmount.blank) {
    errors.finalAmount = 'Enter a final amount.';
  } else if (finalAmount.invalid || finalAmount.value === null) {
    errors.finalAmount = 'Enter a valid final amount.';
  } else if (finalAmount.value < 0) {
    errors.finalAmount = 'Final amount cannot be negative.';
  }

  if (term.blank) {
    errors.term = 'Enter an investment length.';
  } else if (term.invalid || term.value === null) {
    errors.term = 'Enter a valid investment length.';
  } else if (!(term.value > 0)) {
    errors.term = 'Investment length must be greater than zero.';
  }

  if (cashFlow.blank) {
    // Treat blank as 0 for convenience once other fields are filled.
  } else if (cashFlow.invalid || cashFlow.value === null) {
    errors.periodicCashFlow = 'Enter a valid deposit or withdrawal amount.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateRateOfReturn(
    initial.value!,
    finalAmount.value!,
    term.value!,
    input.termUnit,
    input.compounding,
    cashFlow.blank || cashFlow.value === null ? 0 : cashFlow.value,
    input.cashFlowFrequency,
    input.paymentTiming,
    input.currency
  );

  if (!result) {
    errors.form =
      'No valid rate of return exists for these inputs. Check amounts, duration, and cash flows.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
