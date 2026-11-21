import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateCreditCardPayoff,
  formatPayoffMoney,
} from './calculation';
import type {
  CreditCardPayoffFieldErrors,
  CreditCardPayoffInput,
  CreditCardPayoffResult,
} from './types';

export interface CreditCardPayoffValidation {
  isValid: boolean;
  errors: CreditCardPayoffFieldErrors;
  result: CreditCardPayoffResult | null;
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

/**
 * Validates balance / APR / payment, normalizes payment into the balance
 * currency, runs the payoff engine, then FX-converts total paid into its
 * display currency. APR and duration units are never converted.
 */
export function validateCreditCardPayoffInput(
  input: CreditCardPayoffInput,
  rates?: CurrencyRatesSnapshot | null
): CreditCardPayoffValidation {
  const errors: CreditCardPayoffFieldErrors = {};

  const balance = parseNumber(input.balance);
  const apr = parseNumber(input.aprPercent);
  const payment = parseNumber(input.monthlyPayment);

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.balance = 'Enter a valid credit card balance.';
  } else if (balance.value !== null && !(balance.value > 0)) {
    errors.balance = 'Balance must be greater than zero.';
  }

  if (!apr.blank && (apr.invalid || apr.value === null)) {
    errors.aprPercent = 'Enter a valid APR.';
  } else if (apr.value !== null && apr.value < 0) {
    errors.aprPercent = 'APR cannot be negative.';
  } else if (apr.value !== null && apr.value > 1000) {
    errors.aprPercent = 'APR looks unrealistically high.';
  }

  if (!payment.blank && (payment.invalid || payment.value === null)) {
    errors.monthlyPayment = 'Enter a valid monthly payment.';
  } else if (payment.value !== null && !(payment.value > 0)) {
    errors.monthlyPayment = 'Monthly payment must be greater than zero.';
  }

  const incomplete =
    balance.blank ||
    apr.blank ||
    payment.blank ||
    Boolean(errors.balance) ||
    Boolean(errors.aprPercent) ||
    Boolean(errors.monthlyPayment);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const balanceCurrency = input.balanceCurrency;
  const paymentFx = convertMoney(
    payment.value!,
    input.monthlyPaymentCurrency,
    balanceCurrency,
    rates
  );
  if (!paymentFx.ok) {
    errors.form = paymentFx.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCreditCardPayoff({
    balance: balance.value!,
    aprPercent: apr.value!,
    monthlyPayment: paymentFx.amount,
    currency: balanceCurrency,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  // Never-pays-off is a valid informative result (fields cleared in UI).
  if (computed.neverPaysOff) {
    const result: CreditCardPayoffResult = {
      years: 0,
      months: 0,
      days: 0,
      totalPaidCanonical: 0,
      totalPaid: 0,
      currency: balanceCurrency,
      totalPaidCurrency: input.totalPaidCurrency,
      formattedYears: '—',
      formattedMonths: '—',
      formattedDays: '—',
      formattedTotalPaid: '',
      summary: computed.summary,
      breakdown: computed.breakdown,
      neverPaysOff: true,
    };
    return { isValid: true, errors, result };
  }

  const totalPaidFx = convertMoney(
    computed.totalPaid,
    balanceCurrency,
    input.totalPaidCurrency,
    rates
  );
  if (!totalPaidFx.ok) {
    errors.form = totalPaidFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: CreditCardPayoffResult = {
    years: computed.years,
    months: computed.months,
    days: computed.days,
    totalPaidCanonical: computed.totalPaid,
    totalPaid: totalPaidFx.amount,
    currency: balanceCurrency,
    totalPaidCurrency: input.totalPaidCurrency,
    formattedYears: String(computed.years),
    formattedMonths: String(computed.months),
    formattedDays: String(computed.days),
    formattedTotalPaid: formatPayoffMoney(
      totalPaidFx.amount,
      input.totalPaidCurrency
    ),
    summary: computed.summary,
    breakdown: computed.breakdown,
    neverPaysOff: false,
  };

  return { isValid: true, errors, result };
}
