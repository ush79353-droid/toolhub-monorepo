import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateEnterpriseValue,
  formatEvMoney,
  interpretEv,
} from './calculation';
import type {
  EnterpriseValueFieldErrors,
  EnterpriseValueInput,
  EnterpriseValueResult,
} from './types';

export interface EnterpriseValueValidation {
  isValid: boolean;
  errors: EnterpriseValueFieldErrors;
  result: EnterpriseValueResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function requireNonNegative(
  raw: string,
  blankMsg: string,
  invalidMsg: string,
  negativeMsg: string
): { value: number | null; error?: string } {
  const parsed = parseNumber(raw);
  if (parsed.blank) return { value: null, error: blankMsg };
  if (parsed.invalid || parsed.value === null) {
    return { value: null, error: invalidMsg };
  }
  if (parsed.value < 0) return { value: null, error: negativeMsg };
  return { value: parsed.value };
}

export function validateEnterpriseValueInput(
  input: EnterpriseValueInput
): EnterpriseValueValidation {
  const errors: EnterpriseValueFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

  const marketCap = requireNonNegative(
    input.marketCap,
    'Enter market capitalization (use 0 if none).',
    'Enter a valid market capitalization.',
    'Market capitalization cannot be negative.'
  );
  if (marketCap.error) {
    errors.marketCap = marketCap.error;
    hasFieldError = true;
  }

  const minority = requireNonNegative(
    input.minorityInterest,
    'Enter minority interest (use 0 if none).',
    'Enter a valid minority interest amount.',
    'Minority interest cannot be negative.'
  );
  if (minority.error) {
    errors.minorityInterest = minority.error;
    hasFieldError = true;
  }

  const preferred = requireNonNegative(
    input.preferredShares,
    'Enter preferred shares value (use 0 if none).',
    'Enter a valid preferred shares amount.',
    'Preferred shares cannot be negative.'
  );
  if (preferred.error) {
    errors.preferredShares = preferred.error;
    hasFieldError = true;
  }

  const debt = requireNonNegative(
    input.debt,
    'Enter value of debt (use 0 if none).',
    'Enter a valid debt amount.',
    'Value of debt cannot be negative.'
  );
  if (debt.error) {
    errors.debt = debt.error;
    hasFieldError = true;
  }

  const cash = requireNonNegative(
    input.cash,
    'Enter cash and cash equivalents (use 0 if none).',
    'Enter a valid cash amount.',
    'Cash and cash equivalents cannot be negative.'
  );
  if (cash.error) {
    errors.cash = cash.error;
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    marketCap.value === null ||
    minority.value === null ||
    preferred.value === null ||
    debt.value === null ||
    cash.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateEnterpriseValue({
    marketCapitalization: marketCap.value,
    minorityInterest: minority.value,
    preferredShares: preferred.value,
    debt: debt.value,
    cashAndCashEquivalents: cash.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate enterprise value with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(currency);
  const notes: string[] = [];
  if (math.enterpriseValue < 0) {
    notes.push(
      'Enterprise value is negative because cash exceeds combined financing claims under this simplified formula.'
    );
  }
  notes.push(
    'Use consistent currency and scale for all components (no FX). Ordinary trade payables are not automatically treated as financial debt.'
  );

  const result: EnterpriseValueResult = {
    ...math,
    currency,
    formattedEv: `${symbol}${formatEvMoney(math.enterpriseValue, currency)}`,
    formattedTotalClaims: `${symbol}${formatEvMoney(math.totalClaims, currency)}`,
    formattedNetDebt: `${symbol}${formatEvMoney(math.netDebt, currency)}`,
    interpretation: interpretEv(math.enterpriseValue, symbol, currency),
    warningMessage: notes.join(' '),
  };

  return { isValid: true, errors, result };
}
