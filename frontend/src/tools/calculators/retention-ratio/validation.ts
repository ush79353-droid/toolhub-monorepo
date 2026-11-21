import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateRetentionRatio,
  formatPercent,
  formatRetentionMoney,
  interpretRetentionRatio,
} from './calculation';
import type {
  RetentionRatioFieldErrors,
  RetentionRatioInput,
  RetentionRatioResult,
} from './types';

export interface RetentionRatioValidation {
  isValid: boolean;
  errors: RetentionRatioFieldErrors;
  result: RetentionRatioResult | null;
}

function parseFinite(raw: string): {
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

export function validateRetentionRatioInput(
  input: RetentionRatioInput
): RetentionRatioValidation {
  const errors: RetentionRatioFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const ni = parseFinite(input.netIncome);
  if (ni.blank) {
    errors.netIncome = 'Enter net income.';
    hasError = true;
  } else if (ni.invalid || ni.value === null) {
    errors.netIncome = 'Enter a valid net income.';
    hasError = true;
  }

  const div = parseFinite(input.dividendsPaid);
  if (div.blank) {
    errors.dividendsPaid = 'Enter dividends paid (use 0 if none).';
    hasError = true;
  } else if (div.invalid || div.value === null) {
    errors.dividendsPaid = 'Enter a valid dividends amount.';
    hasError = true;
  } else if (div.value < 0) {
    errors.dividendsPaid = 'Dividends paid cannot be negative.';
    hasError = true;
  }

  if (hasError || ni.value === null || div.value === null) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateRetentionRatio(ni.value, div.value);
  if (!math) {
    errors.form = 'Unable to calculate retention ratio with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const money = (n: number) =>
    `${symbol}${formatRetentionMoney(n, currency)}`;

  let unavailableReason: string | null = null;
  if (math.status === 'undefined') {
    unavailableReason =
      'The retention ratio is undefined when net income is zero (division by zero). Retained earnings for the period are still shown as net income minus dividends.';
  }

  const result: RetentionRatioResult = {
    retainedEarnings: math.retainedEarnings,
    retentionRatioPercent: math.retentionRatioPercent,
    dividendPayoutRatio: math.dividendPayoutRatio,
    status: math.status,
    currency,
    formattedRetainedEarnings: money(math.retainedEarnings),
    formattedRetentionRatio:
      math.retentionRatioPercent === null
        ? null
        : formatPercent(math.retentionRatioPercent),
    formattedPayoutRatio:
      math.dividendPayoutRatio === null
        ? null
        : formatPercent(math.dividendPayoutRatio * 100),
    interpretation:
      math.retentionRatioPercent !== null
        ? interpretRetentionRatio(math.retentionRatioPercent, ni.value)
        : null,
    unavailableReason,
    warningMessage:
      'Period retained earnings = net income − dividends (not the cumulative balance-sheet retained earnings). Retention % is not clamped to 0–100.',
  };

  const isValid =
    math.status === 'valid' || math.status === 'negative-income';

  return { isValid, errors, result };
}
