import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateCreditCardPayoff } from './calculation';
import {
  COMPOUNDING_OPTIONS,
  MINIMUM_METHOD_OPTIONS,
  REPAYMENT_MODE_OPTIONS,
  type CompoundingMethod,
  type CreditCardFieldErrors,
  type CreditCardInput,
  type CreditCardResult,
  type MinimumPaymentMethod,
  type RepaymentMode,
} from './types';

export interface CreditCardValidation {
  isValid: boolean;
  errors: CreditCardFieldErrors;
  result: CreditCardResult | null;
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

function isRepaymentMode(value: string): value is RepaymentMode {
  return REPAYMENT_MODE_OPTIONS.some((o) => o.value === value);
}

function isMinMethod(value: string): value is MinimumPaymentMethod {
  return MINIMUM_METHOD_OPTIONS.some((o) => o.value === value);
}

function isCompounding(value: string): value is CompoundingMethod {
  return COMPOUNDING_OPTIONS.some((o) => o.value === value);
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
 * Validates inputs, normalizes all money fields into the balance currency,
 * and runs the payoff loop. APR %, percentages, and durations are never
 * FX-converted.
 */
export function validateCreditCardInput(
  input: CreditCardInput,
  rates?: CurrencyRatesSnapshot | null
): CreditCardValidation {
  const errors: CreditCardFieldErrors = {};

  const balance = parseNumber(input.balance);
  const apr = parseNumber(input.aprPercent);
  const fixed = parseNumber(input.fixedPayment);
  const additional = parseNumber(input.additionalPayment);
  const floor = parseNumber(input.minPaymentFloor);
  const minPct = parseNumber(input.minPaymentPercent);

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.balance = 'Enter a valid unpaid balance.';
  } else if (!balance.blank && balance.value !== null && !(balance.value > 0)) {
    errors.balance = 'Unpaid balance must be greater than zero.';
  }

  if (!apr.blank && (apr.invalid || apr.value === null)) {
    errors.aprPercent = 'Enter a valid APR.';
  } else if (!apr.blank && apr.value !== null && apr.value < 0) {
    errors.aprPercent = 'APR cannot be negative.';
  } else if (!apr.blank && apr.value !== null && apr.value > 100) {
    errors.aprPercent = 'APR looks unrealistically high.';
  }

  if (!isRepaymentMode(input.repaymentMode)) {
    errors.form = 'Select fixed or minimum payments.';
  }

  if (input.repaymentMode === 'fixed') {
    if (!fixed.blank && (fixed.invalid || fixed.value === null)) {
      errors.fixedPayment = 'Enter a valid monthly fixed payment.';
    } else if (!fixed.blank && fixed.value !== null && !(fixed.value > 0)) {
      errors.fixedPayment = 'Monthly fixed payment must be greater than zero.';
    }
  }

  if (!additional.blank && (additional.invalid || additional.value === null)) {
    errors.additionalPayment = 'Enter a valid additional payment.';
  } else if (
    !additional.blank &&
    additional.value !== null &&
    additional.value < 0
  ) {
    errors.additionalPayment = 'Additional payment cannot be negative.';
  }

  if (!floor.blank && (floor.invalid || floor.value === null)) {
    errors.minPaymentFloor = 'Enter a valid minimum payment floor.';
  } else if (!floor.blank && floor.value !== null && floor.value < 0) {
    errors.minPaymentFloor = 'Minimum payment floor cannot be negative.';
  }

  if (!minPct.blank && (minPct.invalid || minPct.value === null)) {
    errors.minPaymentPercent = 'Enter a valid minimum payment percentage.';
  } else if (!minPct.blank && minPct.value !== null && minPct.value < 0) {
    errors.minPaymentPercent = 'Minimum payment percentage cannot be negative.';
  } else if (!minPct.blank && minPct.value !== null && minPct.value > 100) {
    errors.minPaymentPercent = 'Minimum payment percentage cannot exceed 100%.';
  }

  if (!isMinMethod(input.minPaymentMethod)) {
    errors.form = 'Select a valid minimum payment method.';
  }
  if (!isCompounding(input.compounding)) {
    errors.form = 'Select a valid compounding method.';
  }

  const incomplete =
    balance.blank ||
    apr.blank ||
    additional.blank ||
    floor.blank ||
    minPct.blank ||
    (input.repaymentMode === 'fixed' && fixed.blank) ||
    Boolean(errors.balance) ||
    Boolean(errors.aprPercent) ||
    Boolean(errors.fixedPayment) ||
    Boolean(errors.additionalPayment) ||
    Boolean(errors.minPaymentFloor) ||
    Boolean(errors.minPaymentPercent) ||
    Boolean(errors.form);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const to = input.balanceCurrency;

  const fixedInBal =
    input.repaymentMode === 'fixed'
      ? convertMoney(
          fixed.value!,
          input.fixedPaymentCurrency,
          to,
          rates
        )
      : { ok: true as const, amount: 0 };
  if (!fixedInBal.ok) {
    errors.form = fixedInBal.message;
    return { isValid: false, errors, result: null };
  }

  const addInBal = convertMoney(
    additional.value!,
    input.additionalPaymentCurrency,
    to,
    rates
  );
  if (!addInBal.ok) {
    errors.form = addInBal.message;
    return { isValid: false, errors, result: null };
  }

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

  if (
    input.repaymentMode === 'fixed' &&
    !(fixedInBal.amount > 0) &&
    !(addInBal.amount > 0)
  ) {
    errors.fixedPayment =
      'Fixed payment plus additional payment must be greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCreditCardPayoff({
    balance: balance.value!,
    annualRate: apr.value! / 100,
    repaymentMode: input.repaymentMode,
    fixedPayment: fixedInBal.amount,
    additionalPayment: addInBal.amount,
    minPaymentFloor: floorInBal.amount,
    minPaymentPercent: minPct.value!,
    minPaymentMethod: input.minPaymentMethod,
    compounding: input.compounding,
    currency: to,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite payoff estimate.';
    return { isValid: false, errors, result: null };
  }

  const result: CreditCardResult = {
    months: computed.months,
    years: computed.years,
    remainingMonths: computed.remainingMonths,
    totalPaid: computed.totalPaid,
    totalInterest: computed.totalInterest,
    firstPayment: computed.firstPayment,
    currency: computed.currency,
    repaymentMode: computed.repaymentMode,
    compounding: computed.compounding,
    formattedFirstPayment: computed.formattedFirstPayment,
    formattedTotalPaid: computed.formattedTotalPaid,
    formattedTotalInterest: computed.formattedTotalInterest,
    summary: computed.summary,
    breakdown: computed.breakdown,
    neverPaysOff: computed.neverPaysOff,
  };

  return { isValid: true, errors, result };
}
