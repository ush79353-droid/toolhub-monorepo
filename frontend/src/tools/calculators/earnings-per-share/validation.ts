import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateEps,
  formatEpsMoney,
  formatEpsPerShare,
  formatShareCount,
  interpretEps,
} from './calculation';
import type { EpsFieldErrors, EpsInput, EpsResult } from './types';

export interface EpsValidation {
  isValid: boolean;
  errors: EpsFieldErrors;
  result: EpsResult | null;
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

export function validateEpsInput(input: EpsInput): EpsValidation {
  const errors: EpsFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

  const netIncome = parseNumber(input.netIncome);
  if (netIncome.blank) {
    errors.netIncome = 'Enter net income (use 0 or a negative value for a loss).';
    hasFieldError = true;
  } else if (netIncome.invalid || netIncome.value === null) {
    errors.netIncome = 'Enter a valid net income.';
    hasFieldError = true;
  }

  const preferred = parseNumber(input.preferredDividends);
  if (preferred.blank) {
    errors.preferredDividends = 'Enter preferred dividends (use 0 if none).';
    hasFieldError = true;
  } else if (preferred.invalid || preferred.value === null) {
    errors.preferredDividends = 'Enter a valid preferred dividends amount.';
    hasFieldError = true;
  } else if (preferred.value < 0) {
    errors.preferredDividends = 'Preferred dividends cannot be negative.';
    hasFieldError = true;
  }

  const shares = parseNumber(input.commonShares);
  if (shares.blank) {
    errors.commonShares =
      'Enter weighted-average common shares outstanding.';
    hasFieldError = true;
  } else if (shares.invalid || shares.value === null) {
    errors.commonShares = 'Enter a valid share count.';
    hasFieldError = true;
  } else if (shares.value <= 0) {
    errors.commonShares =
      'Common shares outstanding must be greater than zero.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    netIncome.value === null ||
    preferred.value === null ||
    shares.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateEps({
    netIncome: netIncome.value,
    preferredDividends: preferred.value,
    commonShares: shares.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate EPS with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(currency);
  const warnings: string[] = [];
  if (preferred.value > netIncome.value) {
    warnings.push(
      'Preferred dividends exceed net income, so earnings available to common shareholders are negative.'
    );
  }
  warnings.push(
    'Basic EPS uses weighted-average common shares. Diluted EPS is not calculated here. Amounts share one currency label (no FX).'
  );

  const result: EpsResult = {
    ...math,
    currency,
    formattedEarningsAvailable: `${symbol}${formatEpsMoney(math.earningsAvailableToCommon, currency)}`,
    formattedEps: `${symbol}${formatEpsPerShare(math.earningsPerShare, currency)}`,
    formattedShares: formatShareCount(shares.value),
    interpretation: interpretEps(math.earningsPerShare, currency, symbol),
    warningMessage: warnings.join(' '),
  };

  return { isValid: true, errors, result };
}
