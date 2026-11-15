import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateContributionMargin } from './calculation';
import {
  MAX_MONEY,
  MAX_UNITS,
  type ContributionMarginFieldErrors,
  type ContributionMarginInput,
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
  if (Math.abs(value) > MAX_MONEY) return `${label} is too large.`;
  return undefined;
}

function unitsMessage(
  value: number | null,
  reportBlanks: boolean,
): string | undefined {
  if (value === null) {
    return reportBlanks ? 'Enter number of units.' : undefined;
  }
  if (!Number.isFinite(value)) return 'Enter a number for units.';
  if (value < 0) return 'Number of units cannot be negative.';
  if (value > MAX_UNITS) return 'Number of units is too large.';
  return undefined;
}

export function validateContributionMargin(
  input: ContributionMarginInput,
  options?: { reportBlanks?: boolean },
): { isValid: boolean; incomplete: boolean; errors: ContributionMarginFieldErrors } {
  const errors: ContributionMarginFieldErrors = {};
  const reportBlanks = options?.reportBlanks === true;
  let incomplete = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  const moneyFields: Array<
    [keyof Pick<
      ContributionMarginInput,
      'sellingPricePerUnit' | 'variableCostPerUnit' | 'fixedCosts'
    >, string]
  > = [
    ['sellingPricePerUnit', 'selling price per unit'],
    ['variableCostPerUnit', 'variable cost per unit'],
    ['fixedCosts', 'fixed costs'],
  ];

  for (const [key, label] of moneyFields) {
    const value = input[key];
    if (value === null) {
      if (reportBlanks) {
        errors[key] = moneyMessage(value, label, true);
      } else {
        incomplete = true;
      }
      continue;
    }
    const message = moneyMessage(value, label, reportBlanks);
    if (message) errors[key] = message;
  }

  if (input.numberOfUnits === null) {
    if (reportBlanks) {
      errors.numberOfUnits = unitsMessage(null, true);
    } else {
      incomplete = true;
    }
  } else {
    const message = unitsMessage(input.numberOfUnits, reportBlanks);
    if (message) errors.numberOfUnits = message;
  }

  const isValid =
    Object.keys(errors).length === 0 &&
    !incomplete &&
    calculateContributionMargin(input) !== null;

  return { isValid, incomplete: incomplete && Object.keys(errors).length === 0, errors };
}
