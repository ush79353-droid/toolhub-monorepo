import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateSavingsWithdrawal,
  formatSavingsWithdrawalMoney,
  formatWithdrawalDate,
  parseIsoDate,
} from './calculation';
import {
  SAVINGS_WITHDRAWAL_MODE_OPTIONS,
  type SavingsWithdrawalFieldErrors,
  type SavingsWithdrawalInput,
  type SavingsWithdrawalMode,
  type SavingsWithdrawalResult,
} from './types';

export interface SavingsWithdrawalValidation {
  isValid: boolean;
  errors: SavingsWithdrawalFieldErrors;
  result: SavingsWithdrawalResult | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function isMode(value: string): value is SavingsWithdrawalMode {
  return SAVINGS_WITHDRAWAL_MODE_OPTIONS.some((o) => o.value === value);
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates inputs, normalizes withdrawal into balance currency, runs the
 * interest-first monthly simulation at full precision, then formats money for
 * display. Dates, durations, counts, and rates are never FX-converted.
 */
export function validateSavingsWithdrawalInput(
  input: SavingsWithdrawalInput,
  rates?: CurrencyRatesSnapshot | null
): SavingsWithdrawalValidation {
  const errors: SavingsWithdrawalFieldErrors = {};

  if (!isMode(input.mode)) {
    errors.mode = 'Select a valid calculation mode.';
  }

  const balance = parseNumber(input.balance);
  const withdrawal = parseNumber(input.withdrawalAmount);
  const rate = parseNumber(input.annualInterestRatePercent);
  const firstDate = parseIsoDate(input.firstWithdrawalDate);

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.balance = 'Enter a valid savings balance.';
  } else if (!balance.blank && balance.value !== null && !(balance.value > 0)) {
    errors.balance = 'Savings balance must be greater than zero.';
  }

  if (!withdrawal.blank && (withdrawal.invalid || withdrawal.value === null)) {
    errors.withdrawalAmount = 'Enter a valid withdrawal amount.';
  } else if (
    !withdrawal.blank &&
    withdrawal.value !== null &&
    !(withdrawal.value > 0)
  ) {
    errors.withdrawalAmount = 'Withdrawal amount must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualInterestRatePercent = 'Enter a valid annual interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualInterestRatePercent = 'Annual interest rate cannot be negative.';
  }

  if (!input.firstWithdrawalDate.trim()) {
    errors.firstWithdrawalDate = 'Enter the first withdrawal date.';
  } else if (!firstDate) {
    errors.firstWithdrawalDate = 'Enter a valid first withdrawal date.';
  }

  const incomplete =
    balance.blank ||
    withdrawal.blank ||
    rate.blank ||
    !firstDate ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const withdrawalInBalance = convertMoney(
    withdrawal.value!,
    input.withdrawalCurrency,
    input.balanceCurrency,
    rates
  );
  if (!withdrawalInBalance.ok) {
    errors.form = withdrawalInBalance.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateSavingsWithdrawal({
    balance: balance.value!,
    withdrawalAmount: withdrawalInBalance.amount,
    annualInterestRatePercent: rate.value!,
    firstWithdrawalDate: firstDate!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.balanceCurrency;
  const result: SavingsWithdrawalResult = {
    years: computed.years,
    months: computed.months,
    withdrawalCount: computed.withdrawalCount,
    monthlyWithdrawal: computed.monthlyWithdrawal,
    totalWithdrawal: computed.totalWithdrawal,
    interestEarned: computed.interestEarned,
    balanceAtFirstWithdrawal: computed.balanceAtFirstWithdrawal,
    balanceAfterLastWithdrawal: computed.balanceAfterLastWithdrawal,
    lastWithdrawalDate: computed.lastWithdrawalDate,
    neverDepletes: computed.neverDepletes,
    currency,
    formattedMonthlyWithdrawal: formatSavingsWithdrawalMoney(
      computed.monthlyWithdrawal,
      currency
    ),
    formattedTotalWithdrawal: formatSavingsWithdrawalMoney(
      computed.totalWithdrawal,
      currency
    ),
    formattedInterestEarned: formatSavingsWithdrawalMoney(
      computed.interestEarned,
      currency
    ),
    formattedBalanceAtFirstWithdrawal: formatSavingsWithdrawalMoney(
      computed.balanceAtFirstWithdrawal,
      currency
    ),
    formattedBalanceAfterLastWithdrawal: formatSavingsWithdrawalMoney(
      computed.balanceAfterLastWithdrawal,
      currency
    ),
    formattedLastWithdrawalDate: formatWithdrawalDate(computed.lastWithdrawalDate),
    timelineSummary: computed.timelineSummary,
  };

  return { isValid: true, errors: {}, result };
}
