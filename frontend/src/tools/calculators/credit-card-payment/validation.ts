import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateCreditCardPayment } from './calculation';
import {
  COMPOUNDING_OPTIONS,
  DEFAULT_COMPOUNDING,
  MINIMUM_METHOD_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  type CompoundingMethod,
  type CreditCardPaymentFieldErrors,
  type CreditCardPaymentInput,
  type CreditCardPaymentResult,
  type MinimumPaymentMethod,
  type PaymentMode,
} from './types';

export interface CreditCardPaymentValidation {
  isValid: boolean;
  errors: CreditCardPaymentFieldErrors;
  result: CreditCardPaymentResult | null;
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

function isPaymentMode(value: string): value is PaymentMode {
  return PAYMENT_MODE_OPTIONS.some((o) => o.value === value);
}

function isMinMethod(value: string): value is MinimumPaymentMethod {
  return MINIMUM_METHOD_OPTIONS.some((o) => o.value === value);
}

function isCompounding(value: string): value is CompoundingMethod {
  return COMPOUNDING_OPTIONS.some((o) => o.value === value);
}

function isValidIsoDate(raw: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const utc = new Date(Date.UTC(y, mo - 1, d));
  return (
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() === mo - 1 &&
    utc.getUTCDate() === d &&
    y >= 1 &&
    y <= 9999
  );
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
 * Validates inputs, normalizes the minimum floor into the balance currency,
 * and solves for the required monthly payment. APR %, %, and dates never FX-convert.
 */
export function validateCreditCardPaymentInput(
  input: CreditCardPaymentInput,
  rates?: CurrencyRatesSnapshot | null
): CreditCardPaymentValidation {
  const errors: CreditCardPaymentFieldErrors = {};

  const balance = parseNumber(input.balance);
  const apr = parseNumber(input.aprPercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);
  const floor = parseNumber(input.minPaymentFloor);
  const minPct = parseNumber(input.minPaymentPercent);

  if (!isPaymentMode(input.paymentMode)) {
    errors.form = 'Select a valid payment mode.';
  }

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.balance = 'Enter a valid credit card balance.';
  } else if (!balance.blank && balance.value !== null && !(balance.value > 0)) {
    errors.balance = 'Credit card balance must be greater than zero.';
  }

  if (!isValidIsoDate(input.dueDate)) {
    errors.dueDate = 'Enter a valid due date.';
  }

  if (!apr.blank && (apr.invalid || apr.value === null)) {
    errors.aprPercent = 'Enter a valid APR.';
  } else if (!apr.blank && apr.value !== null && apr.value < 0) {
    errors.aprPercent = 'APR cannot be negative.';
  } else if (!apr.blank && apr.value !== null && apr.value > 100) {
    errors.aprPercent = 'APR looks unrealistically high.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (
    !years.blank &&
    years.value !== null &&
    (!Number.isInteger(years.value) || years.value < 0)
  ) {
    errors.termYears = 'Years must be a whole number of 0 or more.';
  }

  if (!months.blank && (months.invalid || months.value === null)) {
    errors.termMonths = 'Enter a valid number of months.';
  } else if (
    !months.blank &&
    months.value !== null &&
    (!Number.isInteger(months.value) ||
      months.value < 0 ||
      months.value > 11)
  ) {
    errors.termMonths = 'Months must be a whole number from 0 to 11.';
  }

  if (
    !years.blank &&
    !months.blank &&
    years.value !== null &&
    months.value !== null &&
    years.value * 12 + months.value <= 0
  ) {
    errors.termYears = 'Payback term must be greater than zero.';
  }

  if (!floor.blank && (floor.invalid || floor.value === null)) {
    errors.minPaymentFloor = 'Enter a valid minimum payment.';
  } else if (!floor.blank && floor.value !== null && floor.value < 0) {
    errors.minPaymentFloor = 'Minimum payment cannot be negative.';
  }

  if (!minPct.blank && (minPct.invalid || minPct.value === null)) {
    errors.minPaymentPercent = 'Enter a valid minimum payment percentage.';
  } else if (!minPct.blank && minPct.value !== null && minPct.value < 0) {
    errors.minPaymentPercent = 'Minimum payment percentage cannot be negative.';
  } else if (!minPct.blank && minPct.value !== null && minPct.value > 100) {
    errors.minPaymentPercent = 'Minimum payment percentage cannot exceed 100%.';
  }

  if (!isMinMethod(input.minPaymentMethod)) {
    errors.form = 'Select a valid calculation method.';
  }

  const compounding = input.compounding || DEFAULT_COMPOUNDING;
  if (!isCompounding(compounding)) {
    errors.form = 'Select a valid compounding method.';
  }

  const incomplete =
    balance.blank ||
    apr.blank ||
    years.blank ||
    months.blank ||
    floor.blank ||
    minPct.blank ||
    Boolean(errors.balance) ||
    Boolean(errors.dueDate) ||
    Boolean(errors.aprPercent) ||
    Boolean(errors.termYears) ||
    Boolean(errors.termMonths) ||
    Boolean(errors.minPaymentFloor) ||
    Boolean(errors.minPaymentPercent) ||
    Boolean(errors.form);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const to = input.balanceCurrency;
  const floorInBal = convertMoney(
    floor.value!,
    input.minPaymentFloorCurrency,
    to,
    rates
  );
  if (!floorInBal.ok) {
    errors.form = floorInBal.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCreditCardPayment({
    balance: balance.value!,
    annualRate: apr.value! / 100,
    dueDate: input.dueDate.trim(),
    termYears: years.value!,
    termMonths: months.value!,
    minPaymentFloor: floorInBal.amount,
    minPaymentPercent: minPct.value!,
    minPaymentMethod: input.minPaymentMethod,
    compounding,
    currency: to,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite payment estimate.';
    return { isValid: false, errors, result: null };
  }

  const result: CreditCardPaymentResult = {
    monthlyPayment: computed.monthlyPayment,
    months: computed.months,
    years: computed.years,
    remainingMonths: computed.remainingMonths,
    payoffDateIso: computed.payoffDateIso,
    payoffDateDisplay: computed.payoffDateDisplay,
    totalPaid: computed.totalPaid,
    totalInterest: computed.totalInterest,
    currency: computed.currency,
    compounding: computed.compounding,
    formattedMonthlyPayment: computed.formattedMonthlyPayment,
    formattedTotalPaid: computed.formattedTotalPaid,
    formattedTotalInterest: computed.formattedTotalInterest,
    summary: computed.summary,
    breakdown: computed.breakdown,
    paymentRaisedToMinimum: computed.paymentRaisedToMinimum,
    belowMinimumWithoutRaise: computed.belowMinimumWithoutRaise,
  };

  return { isValid: true, errors, result };
}
