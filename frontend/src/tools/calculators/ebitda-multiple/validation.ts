import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateValuation,
  formatMoneyAmount,
  formatMultiple,
  interpretMultiple,
} from './calculation';
import type {
  EbitdaMultipleFieldErrors,
  EbitdaMultipleInput,
  EbitdaMultipleResult,
} from './types';

export interface EbitdaMultipleValidation {
  isValid: boolean;
  errors: EbitdaMultipleFieldErrors;
  result: EbitdaMultipleResult | null;
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

export function validateEbitdaMultipleInput(
  input: EbitdaMultipleInput
): EbitdaMultipleValidation {
  const errors: EbitdaMultipleFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

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

  const marketCap = requireNonNegative(
    input.marketCap,
    'Enter market capitalization.',
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
    input.preferredEquity,
    'Enter preferred equity value (use 0 if none).',
    'Enter a valid preferred equity amount.',
    'Preferred equity cannot be negative.'
  );
  if (preferred.error) {
    errors.preferredEquity = preferred.error;
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

  const ebitda = parseNumber(input.ebitda);
  if (ebitda.blank) {
    errors.ebitda = 'Enter EBITDA for the selected period.';
    hasFieldError = true;
  } else if (ebitda.invalid || ebitda.value === null) {
    errors.ebitda = 'Enter a valid EBITDA amount.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    cash.value === null ||
    marketCap.value === null ||
    minority.value === null ||
    preferred.value === null ||
    debt.value === null ||
    ebitda.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateValuation({
    cashAndCashEquivalents: cash.value,
    marketCapitalization: marketCap.value,
    minorityInterest: minority.value,
    preferredEquity: preferred.value,
    debt: debt.value,
    ebitda: ebitda.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate EV/EBITDA with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(currency);
  const notes: string[] = [];
  if (math.warning) notes.push(math.warning);
  notes.push(
    'Use consistent currency and scale for EV components and EBITDA (no FX). A multiple is not a complete valuation.'
  );

  const result: EbitdaMultipleResult = {
    enterpriseValue: math.enterpriseValue,
    ebitdaMultiple: math.ebitdaMultiple,
    currency,
    formattedEv: `${symbol}${formatMoneyAmount(math.enterpriseValue, currency)}`,
    formattedMultiple:
      math.ebitdaMultiple == null
        ? null
        : `${formatMultiple(math.ebitdaMultiple)}×`,
    interpretation: interpretMultiple(
      math.enterpriseValue,
      math.ebitdaMultiple,
      symbol,
      currency
    ),
    warningMessage: notes.join(' '),
  };

  return { isValid: true, errors, result };
}
