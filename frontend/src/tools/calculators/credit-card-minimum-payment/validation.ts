import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateCreditCardMinimumPayment } from './calculation';
import {
  COMPOUNDING_OPTIONS,
  DEFAULT_COMPOUNDING,
  MINIMUM_METHOD_OPTIONS,
  type CompoundingMethod,
  type CreditCardMinimumPaymentFieldErrors,
  type CreditCardMinimumPaymentInput,
  type CreditCardMinimumPaymentResult,
  type MinimumPaymentMethod,
} from './types';

export interface CreditCardMinimumPaymentValidation {
  isValid: boolean;
  errors: CreditCardMinimumPaymentFieldErrors;
  result: CreditCardMinimumPaymentResult | null;
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
 * Validates inputs, normalizes money into the statement-balance currency,
 * and runs the payoff loop. APR %, percentages, and dates are never
 * FX-converted. When capitalization is unchanged, compounding is Daily (360).
 */
export function validateCreditCardMinimumPaymentInput(
  input: CreditCardMinimumPaymentInput,
  rates?: CurrencyRatesSnapshot | null
): CreditCardMinimumPaymentValidation {
  const errors: CreditCardMinimumPaymentFieldErrors = {};

  const balance = parseNumber(input.statementBalance);
  const apr = parseNumber(input.aprPercent);
  const floor = parseNumber(input.minPaymentFloor);
  const minPct = parseNumber(input.minPaymentPercent);
  const fix = parseNumber(input.monthlyFixPayment);

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.statementBalance = 'Enter a valid statement balance.';
  } else if (!balance.blank && balance.value !== null && !(balance.value > 0)) {
    errors.statementBalance = 'Statement balance must be greater than zero.';
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

  if (!fix.blank && (fix.invalid || fix.value === null)) {
    errors.monthlyFixPayment = 'Enter a valid monthly fixed payment.';
  } else if (!fix.blank && fix.value !== null && fix.value < 0) {
    errors.monthlyFixPayment = 'Monthly fixed payment cannot be negative.';
  }

  if (!isMinMethod(input.minPaymentMethod)) {
    errors.form = 'Select a valid calculation method.';
  }

  const compounding = input.changeCapitalization
    ? input.compounding
    : DEFAULT_COMPOUNDING;
  if (!isCompounding(compounding)) {
    errors.form = 'Select a valid capitalization frequency.';
  }

  const incomplete =
    balance.blank ||
    apr.blank ||
    floor.blank ||
    minPct.blank ||
    fix.blank ||
    Boolean(errors.statementBalance) ||
    Boolean(errors.dueDate) ||
    Boolean(errors.aprPercent) ||
    Boolean(errors.minPaymentFloor) ||
    Boolean(errors.minPaymentPercent) ||
    Boolean(errors.monthlyFixPayment) ||
    Boolean(errors.form);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const to = input.statementBalanceCurrency;

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

  const fixInBal = convertMoney(
    fix.value!,
    input.monthlyFixPaymentCurrency,
    to,
    rates
  );
  if (!fixInBal.ok) {
    errors.form = fixInBal.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCreditCardMinimumPayment({
    balance: balance.value!,
    annualRate: apr.value! / 100,
    dueDate: input.dueDate.trim(),
    minPaymentFloor: floorInBal.amount,
    minPaymentPercent: minPct.value!,
    minPaymentMethod: input.minPaymentMethod,
    monthlyFixPayment: fixInBal.amount,
    compounding,
    currency: to,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite payoff estimate.';
    return { isValid: false, errors, result: null };
  }

  const result: CreditCardMinimumPaymentResult = {
    months: computed.months,
    years: computed.years,
    remainingMonths: computed.remainingMonths,
    payoffDateIso: computed.payoffDateIso,
    payoffDateDisplay: computed.payoffDateDisplay,
    totalPaid: computed.totalPaid,
    totalInterest: computed.totalInterest,
    currency: computed.currency,
    compounding: computed.compounding,
    formattedTotalPaid: computed.formattedTotalPaid,
    formattedTotalInterest: computed.formattedTotalInterest,
    summary: computed.summary,
    breakdown: computed.breakdown,
    neverPaysOff: computed.neverPaysOff,
  };

  return { isValid: true, errors, result };
}
