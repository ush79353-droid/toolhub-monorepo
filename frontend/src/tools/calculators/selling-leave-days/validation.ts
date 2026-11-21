import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  WORKING_DAYS_PER_YEAR,
  calculateLeavePayout,
  formatLeaveMoney,
} from './calculation';
import type {
  SellingLeaveDaysFieldErrors,
  SellingLeaveDaysInput,
  SellingLeaveDaysResult,
} from './types';

export interface SellingLeaveDaysValidation {
  isValid: boolean;
  errors: SellingLeaveDaysFieldErrors;
  result: SellingLeaveDaysResult | null;
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

export function validateSellingLeaveDaysInput(
  input: SellingLeaveDaysInput,
  rates?: CurrencyRatesSnapshot | null
): SellingLeaveDaysValidation {
  const errors: SellingLeaveDaysFieldErrors = {};
  const pay = parseNumber(input.basePay);
  const days = parseNumber(input.leaveDays);

  if (!pay.blank && (pay.invalid || pay.value === null)) {
    errors.basePay = 'Enter a valid base pay amount.';
  } else if (pay.value !== null && pay.value < 0) {
    errors.basePay = 'Base pay must be zero or greater.';
  }

  if (!days.blank && (days.invalid || days.value === null)) {
    errors.leaveDays = 'Enter a valid number of leave days.';
  } else if (days.value !== null && days.value < 0) {
    errors.leaveDays = 'Leave days must be zero or greater.';
  }

  if (pay.blank || days.blank || errors.basePay || errors.leaveDays) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateLeavePayout({
    frequency: input.frequency,
    basePay: pay.value!,
    leaveDays: days.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const fx = convertMoney(
    computed.payout,
    input.basePayCurrency,
    input.resultCurrency,
    rates
  );
  if (!fx.ok) {
    errors.form = fx.message;
    return { isValid: false, errors, result: null };
  }

  const result: SellingLeaveDaysResult = {
    dailyPayCanonical: computed.dailyPay,
    payoutCanonical: computed.payout,
    payout: fx.amount,
    basePayCurrency: input.basePayCurrency,
    resultCurrency: input.resultCurrency,
    frequency: input.frequency,
    formattedPayout: formatLeaveMoney(fx.amount, input.resultCurrency),
    workingDaysPerYear: WORKING_DAYS_PER_YEAR,
  };

  return { isValid: true, errors, result };
}
