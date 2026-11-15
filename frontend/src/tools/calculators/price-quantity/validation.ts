import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculatePriceQuantity } from './calculation';
import {
  MAX_MONEY,
  MAX_QUANTITY,
  type PriceQuantityFieldErrors,
  type PriceQuantityInput,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  if (/infinity|nan/i.test(cleaned)) return Number.NaN;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function quantityMessage(
  value: number | null,
  label: string,
  reportBlanks: boolean,
): string | undefined {
  if (value === null) {
    return reportBlanks ? `Enter ${label}.` : undefined;
  }
  if (!Number.isFinite(value)) return `Enter a number for ${label}.`;
  if (value <= 0) return `${label} must be greater than zero.`;
  if (value > MAX_QUANTITY) return `${label} is too large.`;
  return undefined;
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

export function validatePriceQuantity(
  input: PriceQuantityInput,
  options?: { reportBlanks?: boolean },
): { isValid: boolean; incomplete: boolean; errors: PriceQuantityFieldErrors } {
  const errors: PriceQuantityFieldErrors = {};
  const reportBlanks = options?.reportBlanks === true;
  let incomplete = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  const quantityFields: Array<
    [keyof Pick<PriceQuantityInput, 'smallerQuantity' | 'largerQuantity'>, string]
  > = [
    ['smallerQuantity', 'smaller quantity'],
    ['largerQuantity', 'larger quantity'],
  ];

  for (const [key, label] of quantityFields) {
    const value = input[key];
    if (value === null) {
      if (reportBlanks) errors[key] = quantityMessage(value, label, true);
      else incomplete = true;
      continue;
    }
    const message = quantityMessage(value, label, reportBlanks);
    if (message) errors[key] = message;
  }

  const moneyFields: Array<
    [keyof Pick<PriceQuantityInput, 'smallerPrice' | 'largerPrice'>, string]
  > = [
    ['smallerPrice', 'smaller price'],
    ['largerPrice', 'larger price'],
  ];

  for (const [key, label] of moneyFields) {
    const value = input[key];
    if (value === null) {
      if (reportBlanks) errors[key] = moneyMessage(value, label, true);
      else incomplete = true;
      continue;
    }
    const message = moneyMessage(value, label, reportBlanks);
    if (message) errors[key] = message;
  }

  const isValid =
    Object.keys(errors).length === 0 &&
    !incomplete &&
    calculatePriceQuantity(input) !== null;

  return { isValid, incomplete: incomplete && Object.keys(errors).length === 0, errors };
}
