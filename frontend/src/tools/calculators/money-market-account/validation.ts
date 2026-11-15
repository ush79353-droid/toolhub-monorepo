import { calculateMoneyMarketAccount, normalizeTerm } from './calculation';
import type {
  MoneyMarketAccountFieldErrors,
  MoneyMarketAccountInput,
  MoneyMarketAccountResult,
} from './types';

function parseOptionalNumber(raw: string): number | null {
  const text = raw.trim();
  if (text === '') return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function validateMoneyMarketAccount(input: MoneyMarketAccountInput): {
  isValid: boolean;
  errors: MoneyMarketAccountFieldErrors;
  result: MoneyMarketAccountResult | null;
} {
  const errors: MoneyMarketAccountFieldErrors = {};

  const startingBalance = parseOptionalNumber(input.startingBalance);
  const recurringInvestment = parseOptionalNumber(input.recurringInvestment);
  const annualReturnPercent = parseOptionalNumber(input.annualReturnPercent);
  const yearsRaw = parseOptionalNumber(input.years);
  const monthsRaw = parseOptionalNumber(input.months);

  if (startingBalance === null) {
    // blank allowed until enough inputs exist
  } else if (Number.isNaN(startingBalance) || startingBalance < 0) {
    errors.startingBalance = 'Enter a valid non-negative starting balance';
  }

  if (input.mode === 'sip') {
    if (recurringInvestment === null) {
      // blank ok
    } else if (Number.isNaN(recurringInvestment) || recurringInvestment < 0) {
      errors.recurringInvestment = 'Enter a valid non-negative recurring investment';
    }
  }

  if (annualReturnPercent === null) {
    // blank ok
  } else if (Number.isNaN(annualReturnPercent) || annualReturnPercent < 0) {
    errors.annualReturnPercent = 'Enter a valid non-negative annual return';
  }

  const years = yearsRaw === null ? 0 : yearsRaw;
  const months = monthsRaw === null ? 0 : monthsRaw;
  const hasPeriodInput = yearsRaw !== null || monthsRaw !== null;

  if (yearsRaw !== null && (Number.isNaN(years) || years < 0 || !Number.isInteger(years))) {
    errors.years = 'Enter whole non-negative years';
  }
  if (
    monthsRaw !== null &&
    (Number.isNaN(months) || months < 0 || !Number.isInteger(months))
  ) {
    errors.months = 'Enter whole non-negative months';
  }

  if (hasPeriodInput && !errors.years && !errors.months) {
    const term = normalizeTerm(years, months);
    if (!term || term.totalMonths <= 0) {
      errors.form = 'Enter an investment period greater than zero';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    startingBalance === null ||
    annualReturnPercent === null ||
    (yearsRaw === null && monthsRaw === null)
  ) {
    return { isValid: false, errors, result: null };
  }

  if (input.mode === 'sip' && recurringInvestment === null) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMoneyMarketAccount({
    mode: input.mode,
    startingBalance,
    recurringInvestment: input.mode === 'sip' ? (recurringInvestment as number) : 0,
    contributionFrequency: input.contributionFrequency,
    annualReturnPercent,
    years,
    months,
    currency: input.currency,
  });

  return {
    isValid: result !== null,
    errors,
    result,
  };
}
