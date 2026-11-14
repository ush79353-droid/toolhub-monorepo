import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateSaasLifetimeValue, resolveArpa } from './calculation';
import {
  MAX_ACCOUNTS,
  MAX_MONEY,
  type SaasLifetimeValueFieldErrors,
  type SaasLifetimeValueInput,
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

function percentMessage(
  value: number | null,
  label: string,
  reportBlanks: boolean,
  options?: { allowZero?: boolean; requirePositive?: boolean },
): string | undefined {
  if (value === null) {
    return reportBlanks ? `Enter ${label}.` : undefined;
  }
  if (!Number.isFinite(value)) return `Enter a number for ${label}.`;
  if (options?.requirePositive && value <= 0) {
    return `${label} must be greater than 0.`;
  }
  if (!options?.requirePositive && value < 0) {
    return `${label} cannot be negative.`;
  }
  if (value > 100) return `${label} cannot exceed 100.`;
  if (options?.allowZero === false && value === 0) {
    return `${label} must be greater than 0.`;
  }
  return undefined;
}

export function validateSaasLifetimeValue(
  input: SaasLifetimeValueInput,
  options?: { reportBlanks?: boolean },
): { isValid: boolean; incomplete: boolean; errors: SaasLifetimeValueFieldErrors } {
  const errors: SaasLifetimeValueFieldErrors = {};
  const reportBlanks = options?.reportBlanks === true;
  let incomplete = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  if (input.dontKnowArpa) {
    if (input.recurringRevenue === null) {
      if (reportBlanks) errors.recurringRevenue = moneyMessage(null, 'recurring revenue', true);
      else incomplete = true;
    } else {
      const message = moneyMessage(input.recurringRevenue, 'recurring revenue', reportBlanks);
      if (message) errors.recurringRevenue = message;
    }

    if (input.numberOfAccounts === null) {
      if (reportBlanks) errors.numberOfAccounts = 'Enter number of accounts.';
      else incomplete = true;
    } else if (!Number.isFinite(input.numberOfAccounts)) {
      errors.numberOfAccounts = 'Enter a number for accounts.';
    } else if (input.numberOfAccounts <= 0) {
      errors.numberOfAccounts = 'Number of accounts must be greater than zero.';
    } else if (input.numberOfAccounts > MAX_ACCOUNTS) {
      errors.numberOfAccounts = 'Number of accounts is too large.';
    }
  } else if (input.arpa === null) {
    if (reportBlanks) errors.arpa = moneyMessage(null, 'ARPA', true);
    else incomplete = true;
  } else {
    const message = moneyMessage(input.arpa, 'ARPA', reportBlanks);
    if (message) errors.arpa = message;
  }

  if (input.grossMarginPercent === null) {
    if (reportBlanks) errors.grossMarginPercent = percentMessage(null, 'gross margin', true);
    else incomplete = true;
  } else {
    const message = percentMessage(input.grossMarginPercent, 'gross margin', reportBlanks, {
      allowZero: true,
    });
    if (message) errors.grossMarginPercent = message;
  }

  if (input.churnPercent === null) {
    if (reportBlanks) errors.churnPercent = percentMessage(null, 'churn', true);
    else incomplete = true;
  } else {
    // Zero churn is allowed as input but yields no finite LTV (handled in calculation).
    const message = percentMessage(input.churnPercent, 'churn', reportBlanks, {
      allowZero: true,
    });
    if (message) errors.churnPercent = message;
  }

  if (input.accountExpansion === null) {
    if (reportBlanks) errors.accountExpansion = moneyMessage(null, 'account expansion', true);
    else incomplete = true;
  } else {
    const message = moneyMessage(input.accountExpansion, 'account expansion', reportBlanks);
    if (message) errors.accountExpansion = message;
  }

  const canResolve =
    Object.keys(errors).length === 0 &&
    !incomplete &&
    resolveArpa(input) !== null &&
    input.grossMarginPercent !== null &&
    input.churnPercent !== null &&
    input.accountExpansion !== null;

  const isValid = canResolve && calculateSaasLifetimeValue(input) !== null;

  return { isValid, incomplete: incomplete && Object.keys(errors).length === 0, errors };
}
