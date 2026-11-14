import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  calculateSoftwareContractValue,
  contractMonthsFromDuration,
} from './calculation';
import {
  MAX_MONEY,
  MAX_MONTHS,
  MAX_SEATS,
  MAX_YEARS,
  type SoftwareContractValueFieldErrors,
  type SoftwareContractValueInput,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  if (/infinity|nan/i.test(cleaned)) return Number.NaN;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function moneyMessage(
  value: number | null,
  label: string,
  reportBlanks: boolean,
): string | undefined {
  if (value === null) {
    return reportBlanks ? `Enter ${label}.` : undefined;
  }
  if (!Number.isFinite(value)) return `Enter a number for ${label}.`;
  if (value < 0) return `${label} cannot be negative.`;
  if (value > MAX_MONEY) return `${label} is too large.`;
  return undefined;
}

export function validateSoftwareContractValue(
  input: SoftwareContractValueInput,
  options?: { reportBlanks?: boolean },
): { isValid: boolean; incomplete: boolean; errors: SoftwareContractValueFieldErrors } {
  const errors: SoftwareContractValueFieldErrors = {};
  const reportBlanks = options?.reportBlanks === true;
  let incomplete = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  if (input.retailPrice === null) {
    if (reportBlanks) errors.retailPrice = moneyMessage(null, 'retail price', true);
    else incomplete = true;
  } else {
    const message = moneyMessage(input.retailPrice, 'retail price', reportBlanks);
    if (message) errors.retailPrice = message;
  }

  if (input.seats === null) {
    if (reportBlanks) errors.seats = 'Enter seats.';
    else incomplete = true;
  } else if (!Number.isFinite(input.seats)) {
    errors.seats = 'Enter a number for seats.';
  } else if (input.seats <= 0) {
    errors.seats = 'Seats must be greater than zero.';
  } else if (input.seats > MAX_SEATS) {
    errors.seats = 'Seats is too large.';
  }

  if (input.discountPercent === null) {
    if (reportBlanks) errors.discountPercent = 'Enter discount.';
    else incomplete = true;
  } else if (!Number.isFinite(input.discountPercent)) {
    errors.discountPercent = 'Enter a number for discount.';
  } else if (input.discountPercent < 0) {
    errors.discountPercent = 'Discount cannot be negative.';
  } else if (input.discountPercent > 100) {
    errors.discountPercent = 'Discount cannot exceed 100%.';
  }

  if (input.durationYears === null) {
    if (reportBlanks) errors.durationYears = 'Enter contract years.';
    else incomplete = true;
  } else if (!Number.isFinite(input.durationYears)) {
    errors.durationYears = 'Enter a number for years.';
  } else if (input.durationYears < 0) {
    errors.durationYears = 'Years cannot be negative.';
  } else if (!Number.isInteger(input.durationYears)) {
    errors.durationYears = 'Years must be a whole number.';
  } else if (input.durationYears > MAX_YEARS) {
    errors.durationYears = `Years cannot exceed ${MAX_YEARS}.`;
  }

  if (input.durationMonths === null) {
    if (reportBlanks) errors.durationMonths = 'Enter contract months.';
    else incomplete = true;
  } else if (!Number.isFinite(input.durationMonths)) {
    errors.durationMonths = 'Enter a number for months.';
  } else if (input.durationMonths < 0) {
    errors.durationMonths = 'Months cannot be negative.';
  } else if (!Number.isInteger(input.durationMonths)) {
    errors.durationMonths = 'Months must be a whole number.';
  } else if (input.durationMonths > MAX_MONTHS) {
    errors.durationMonths = `Months cannot exceed ${MAX_MONTHS}.`;
  }

  if (
    !errors.durationYears &&
    !errors.durationMonths &&
    input.durationYears !== null &&
    input.durationMonths !== null &&
    Number.isFinite(input.durationYears) &&
    Number.isFinite(input.durationMonths)
  ) {
    const total = contractMonthsFromDuration(input.durationYears, input.durationMonths);
    if (!Number.isFinite(total) || total <= 0) {
      errors.durationYears = 'Contract duration must be greater than zero.';
    }
  }

  const canResolve =
    Object.keys(errors).length === 0 &&
    !incomplete &&
    input.retailPrice !== null &&
    input.seats !== null &&
    input.discountPercent !== null &&
    input.durationYears !== null &&
    input.durationMonths !== null;

  const isValid = canResolve && calculateSoftwareContractValue(input) !== null;

  return { isValid, incomplete: incomplete && Object.keys(errors).length === 0, errors };
}
