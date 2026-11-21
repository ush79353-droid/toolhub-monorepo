import { calculateCellPhonePlan } from './calculation';
import type {
  CellPhonePlanFieldErrors,
  CellPhonePlanInput,
  CellPhonePlanResult,
} from './types';

function parseRequiredNonNeg(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parsePositiveInt(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return Number.NaN;
  return num;
}

export function validateCellPhonePlanInput(input: CellPhonePlanInput): {
  isValid: boolean;
  errors: CellPhonePlanFieldErrors;
  result: CellPhonePlanResult | null;
} {
  const errors: CellPhonePlanFieldErrors = {};

  const duration = parsePositiveInt(input.contractDuration);
  if (duration === null) {
    errors.contractDuration = 'Enter contract duration in months';
  } else if (Number.isNaN(duration) || (duration as number) <= 0) {
    errors.contractDuration = 'Contract duration must be a whole number of months greater than zero';
  } else if ((duration as number) > 120) {
    errors.contractDuration = 'Contract duration must be 120 months or less';
  }

  const rate = parseRequiredNonNeg(input.annualInterestRate);
  if (rate === null) {
    errors.annualInterestRate = 'Enter the annual savings interest rate (0 allowed)';
  } else if (Number.isNaN(rate) || (rate as number) < 0) {
    errors.annualInterestRate = 'Enter a valid nonnegative interest rate';
  } else if ((rate as number) > 100) {
    errors.annualInterestRate = 'Interest rate must be 100% or less';
  }

  const phone = parseRequiredNonNeg(input.phonePrice);
  if (phone === null) {
    errors.phonePrice = 'Enter the phone price (use 0 if none)';
  } else if (Number.isNaN(phone) || (phone as number) < 0) {
    errors.phonePrice = 'Enter a valid nonnegative phone price';
  }

  const outrightBill = parseRequiredNonNeg(input.outrightMonthlyBill);
  if (outrightBill === null) {
    errors.outrightMonthlyBill = 'Enter the monthly bill when owning the phone';
  } else if (Number.isNaN(outrightBill) || (outrightBill as number) < 0) {
    errors.outrightMonthlyBill = 'Enter a valid nonnegative monthly bill';
  }

  const carrierBill = parseRequiredNonNeg(input.carrierMonthlyBill);
  if (carrierBill === null) {
    errors.carrierMonthlyBill = 'Enter the carrier phone-plan monthly bill';
  } else if (Number.isNaN(carrierBill) || (carrierBill as number) < 0) {
    errors.carrierMonthlyBill = 'Enter a valid nonnegative monthly bill';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCellPhonePlan({
    contractDuration: duration as number,
    annualInterestRate: rate as number,
    phonePrice: phone as number,
    outrightMonthlyBill: outrightBill as number,
    carrierMonthlyBill: carrierBill as number,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate cell phone plan costs with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
