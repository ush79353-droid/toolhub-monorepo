import { isValidIsoDate } from '../edd/calculation';
import {
  calculatePrescriptionRefill,
  MAX_DAYS_SUPPLIED,
  MIN_DAYS_SUPPLIED,
  parsePositiveNumber,
  wholeDaysSupplied,
} from './calculation';
import type {
  PrescriptionRefillFieldErrors,
  PrescriptionRefillInput,
  PrescriptionRefillResult,
} from './types';

export interface PrescriptionRefillValidation {
  isValid: boolean;
  errors: PrescriptionRefillFieldErrors;
  result: PrescriptionRefillResult | null;
}

export function validatePrescriptionRefillInput(
  input: PrescriptionRefillInput,
): PrescriptionRefillValidation {
  const errors: PrescriptionRefillFieldErrors = {};
  const fill = input.fillDate.trim();
  const qtyRaw = input.quantityText.trim();
  const updRaw = input.unitsPerDayText.trim();

  if (fill && !isValidIsoDate(fill)) {
    errors.fillDate = 'Enter a valid fill / start date.';
  }

  let quantity: number | null = null;
  if (qtyRaw) {
    quantity = parsePositiveNumber(input.quantityText);
    if (quantity == null) {
      errors.quantityText = 'Enter a positive dispensed quantity.';
    }
  }

  let unitsPerDay: number | null = null;
  if (updRaw) {
    unitsPerDay = parsePositiveNumber(input.unitsPerDayText);
    if (unitsPerDay == null) {
      errors.unitsPerDayText = 'Enter a positive fixed units-per-day amount.';
    }
  }

  if (!fill || !qtyRaw || !updRaw) {
    return { isValid: false, errors, result: null };
  }

  if (errors.fillDate || errors.quantityText || errors.unitsPerDayText) {
    return { isValid: false, errors, result: null };
  }

  if (quantity == null || unitsPerDay == null) {
    return { isValid: false, errors, result: null };
  }

  const days = wholeDaysSupplied(quantity, unitsPerDay);
  if (days == null) {
    const exact = quantity / unitsPerDay;
    if (Number.isFinite(exact) && Math.abs(exact - Math.round(exact)) > 1e-9) {
      errors.form =
        'Partial days are not supported — quantity must divide evenly by units per day for a whole-day supply.';
    } else if (
      Number.isFinite(exact) &&
      (exact < MIN_DAYS_SUPPLIED || exact > MAX_DAYS_SUPPLIED)
    ) {
      errors.form = `Days supplied must be between ${MIN_DAYS_SUPPLIED} and ${MAX_DAYS_SUPPLIED}.`;
    } else {
      errors.form = 'Unable to derive a whole-day supply from the values entered.';
    }
    return { isValid: false, errors, result: null };
  }

  const result = calculatePrescriptionRefill(input);
  if (!result) {
    errors.form = 'Unable to calculate refill dates from the values entered.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
