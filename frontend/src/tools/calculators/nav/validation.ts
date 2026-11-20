import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateNav,
  formatNavMoney,
  roundMoneyAmount,
} from './calculation';
import type { NavFieldErrors, NavInput, NavResult } from './types';

export interface NavValidation {
  isValid: boolean;
  errors: NavFieldErrors;
  result: NavResult | null;
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

function parseMoneyField(
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

export function validateNavInput(input: NavInput): NavValidation {
  const errors: NavFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let moneyOk = true;

  const iv = parseMoneyField(
    input.totalInvestmentValue,
    'Enter total investment value.',
    'Enter a valid investment value.',
    'Investment value cannot be negative.'
  );
  if (iv.error) {
    errors.totalInvestmentValue = iv.error;
    moneyOk = false;
  }

  const cash = parseMoneyField(
    input.cashAndCashEquivalents,
    'Enter cash and cash equivalents.',
    'Enter a valid cash amount.',
    'Cash and cash equivalents cannot be negative.'
  );
  if (cash.error) {
    errors.cashAndCashEquivalents = cash.error;
    moneyOk = false;
  }

  const ar = parseMoneyField(
    input.accountsReceivable,
    'Enter accounts receivable.',
    'Enter a valid receivables amount.',
    'Accounts receivable cannot be negative.'
  );
  if (ar.error) {
    errors.accountsReceivable = ar.error;
    moneyOk = false;
  }

  const stl = parseMoneyField(
    input.shortTermLiabilities,
    'Enter short-term liabilities.',
    'Enter a valid short-term liability amount.',
    'Short-term liabilities cannot be negative.'
  );
  if (stl.error) {
    errors.shortTermLiabilities = stl.error;
    moneyOk = false;
  }

  const ltl = parseMoneyField(
    input.longTermLiabilities,
    'Enter long-term liabilities.',
    'Enter a valid long-term liability amount.',
    'Long-term liabilities cannot be negative.'
  );
  if (ltl.error) {
    errors.longTermLiabilities = ltl.error;
    moneyOk = false;
  }

  const sharesParsed = parseNumber(input.outstandingShares);
  let sharesForMath: number | null = null;
  let sharesWarning: string | null = null;

  if (sharesParsed.blank) {
    sharesForMath = null;
  } else if (sharesParsed.invalid || sharesParsed.value === null) {
    errors.outstandingShares = 'Enter a valid number of outstanding shares.';
  } else if (sharesParsed.value < 0) {
    errors.outstandingShares = 'Outstanding shares cannot be negative.';
  } else if (sharesParsed.value === 0) {
    errors.outstandingShares =
      'Outstanding shares must be greater than zero to calculate NAV per share.';
    sharesWarning =
      'NAV per share is undefined when outstanding shares are zero.';
  } else if (!Number.isSafeInteger(sharesParsed.value)) {
    errors.outstandingShares =
      'Outstanding shares must be a whole number within the safe numeric range.';
  } else if (!Number.isInteger(sharesParsed.value)) {
    errors.outstandingShares =
      'Outstanding shares must be a whole number (no fractions).';
  } else {
    sharesForMath = sharesParsed.value;
  }

  if (
    !moneyOk ||
    iv.value === null ||
    cash.value === null ||
    ar.value === null ||
    stl.value === null ||
    ltl.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateNav({
    totalInvestmentValue: iv.value,
    cashAndCashEquivalents: cash.value,
    accountsReceivable: ar.value,
    shortTermLiabilities: stl.value,
    longTermLiabilities: ltl.value,
    outstandingShares: sharesForMath,
  });

  if (math === null) {
    errors.form = 'Unable to calculate NAV with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const fundAssets = roundMoneyAmount(math.fundAssets, currency);
  const fundLiabilities = roundMoneyAmount(math.fundLiabilities, currency);
  const netAssetValue = roundMoneyAmount(math.netAssetValue, currency);
  const navPerShare =
    math.navPerShare === null
      ? null
      : roundMoneyAmount(math.navPerShare, currency);

  const moneyLabel = (n: number) =>
    `${symbol}${formatNavMoney(n, currency)}`;

  const result: NavResult = {
    fundAssets,
    fundLiabilities,
    netAssetValue,
    navPerShare,
    currency,
    formattedFundAssets: moneyLabel(fundAssets),
    formattedFundLiabilities: moneyLabel(fundLiabilities),
    formattedNetAssetValue: moneyLabel(netAssetValue),
    formattedNavPerShare:
      navPerShare === null ? null : moneyLabel(navPerShare),
    sharesWarning,
    warningMessage:
      'NAV = fund assets − fund liabilities. NAV per share divides by outstanding shares. Simplified fund model — not a full fund accounting statement.',
  };

  const sharesBlocking = Boolean(errors.outstandingShares);
  return {
    isValid: !sharesBlocking,
    errors,
    result,
  };
}
