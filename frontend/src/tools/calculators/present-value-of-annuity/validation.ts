import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePresentValueOfAnnuity,
  formatPvaMoney,
  formatPvaRate,
} from './calculation';
import type {
  CompoundingFrequency,
  PresentValueOfAnnuityFieldErrors,
  PresentValueOfAnnuityInput,
  PresentValueOfAnnuityResult,
  PaymentFrequency,
} from './types';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
} from './types';

export interface PresentValueOfAnnuityValidation {
  isValid: boolean;
  errors: PresentValueOfAnnuityFieldErrors;
  result: PresentValueOfAnnuityResult | null;
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

function isPaymentFrequency(value: string): value is PaymentFrequency {
  return PAYMENT_FREQUENCY_OPTIONS.some((o) => o.value === value);
}

function isCompoundingFrequency(value: string): value is CompoundingFrequency {
  return COMPOUNDING_FREQUENCY_OPTIONS.some((o) => o.value === value);
}

/**
 * Validate, compute PV in payment currency at full precision, then convert
 * the result into `resultCurrency` before display rounding.
 */
export function validatePresentValueOfAnnuityInput(
  input: PresentValueOfAnnuityInput,
  rates?: CurrencyRatesSnapshot | null
): PresentValueOfAnnuityValidation {
  const errors: PresentValueOfAnnuityFieldErrors = {};

  const payment = parseNumber(input.paymentAmount);
  const rate = parseNumber(input.interestRatePercent);
  const term = parseNumber(input.termLength);
  const growth = parseNumber(input.growthRatePercent);

  if (payment.blank) errors.paymentAmount = 'Enter a payment amount.';
  else if (payment.invalid || payment.value === null) {
    errors.paymentAmount = 'Enter a valid payment amount.';
  }

  if (rate.blank) errors.interestRatePercent = 'Enter an interest rate.';
  else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (term.blank) errors.termLength = 'Enter an annuity term.';
  else if (term.invalid || term.value === null) {
    errors.termLength = 'Enter a valid annuity term.';
  } else if (!(term.value > 0)) {
    errors.termLength = 'Annuity term must be greater than zero.';
  }

  if (growth.blank) errors.growthRatePercent = 'Enter a growth rate (0 allowed).';
  else if (growth.invalid || growth.value === null) {
    errors.growthRatePercent = 'Enter a valid growth rate.';
  }

  if (!isPaymentFrequency(input.paymentFrequency)) {
    errors.form = 'Choose a supported payment frequency.';
  }
  if (!isCompoundingFrequency(input.compoundingFrequency)) {
    errors.form = 'Choose a supported compounding frequency.';
  }

  if (
    errors.paymentAmount ||
    errors.interestRatePercent ||
    errors.termLength ||
    errors.growthRatePercent ||
    errors.form
  ) {
    return { isValid: false, errors, result: null };
  }

  const canonical = calculatePresentValueOfAnnuity({
    paymentAmount: payment.value!,
    interestRatePercent: rate.value!,
    termLength: term.value!,
    termUnit: input.termUnit,
    compoundingFrequency: input.compoundingFrequency,
    paymentFrequency: input.paymentFrequency,
    annuityKind: input.annuityKind,
    growthRatePercent: growth.value!,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a finite present value.';
    return { isValid: false, errors, result: null };
  }

  let presentValue = canonical.presentValue;
  if (input.resultCurrency !== input.paymentCurrency) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const converted = convertCurrency({
      amount: canonical.presentValue,
      from: input.paymentCurrency,
      to: input.resultCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    presentValue = converted.amount;
  }

  const result: PresentValueOfAnnuityResult = {
    presentValue,
    presentValueInPayment: canonical.presentValue,
    paymentCurrency: input.paymentCurrency,
    resultCurrency: input.resultCurrency,
    numberOfPeriods: canonical.numberOfPeriods,
    termYears: canonical.termYears,
    periodicRatePercent: canonical.periodicRatePercent,
    equivalentInterestRatePercent: canonical.equivalentInterestRatePercent,
    formattedPresentValue: formatPvaMoney(presentValue, input.resultCurrency),
    formattedNumberOfPeriods: String(canonical.numberOfPeriods),
    formattedTermYears: formatPvaRate(canonical.termYears),
    formattedPeriodicRate: formatPvaRate(canonical.periodicRatePercent),
    formattedEquivalentRate: formatPvaRate(canonical.equivalentInterestRatePercent),
  };

  return { isValid: true, errors: {}, result };
}
