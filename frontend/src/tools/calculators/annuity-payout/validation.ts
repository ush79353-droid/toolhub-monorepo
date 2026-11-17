import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateAnnuityPayout } from './calculation';
import type {
  AnnuityPayoutFieldErrors,
  AnnuityPayoutInput,
  AnnuityPayoutResult,
} from './types';

export interface AnnuityPayoutValidation {
  isValid: boolean;
  errors: AnnuityPayoutFieldErrors;
  result: AnnuityPayoutResult | null;
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
): { ok: true; amount: number } | { ok: false; error: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, error: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, error: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates inputs, normalizes money into the initial-balance currency,
 * then runs the pure payout engine at full precision.
 */
export function validateAnnuityPayoutInput(
  input: AnnuityPayoutInput,
  rates?: CurrencyRatesSnapshot | null
): AnnuityPayoutValidation {
  const errors: AnnuityPayoutFieldErrors = {};

  const balance = parseNumber(input.initialBalance);
  const payment = parseNumber(input.paymentAmount);
  const years = parseNumber(input.lengthYears);
  const months = parseNumber(input.lengthMonths);
  const rate = parseNumber(input.annualRatePercent);
  const finalBal = parseNumber(input.finalBalance);
  const growth = parseNumber(input.annualGrowthPercent);

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.initialBalance = 'Enter a valid initial balance.';
  } else if (!balance.blank && balance.value !== null && balance.value < 0) {
    errors.initialBalance = 'Initial balance cannot be negative.';
  }

  if (input.mode === 'fixedPayment') {
    if (!payment.blank && (payment.invalid || payment.value === null)) {
      errors.paymentAmount = 'Enter a valid payment amount.';
    } else if (!payment.blank && payment.value !== null && !(payment.value > 0)) {
      errors.paymentAmount = 'Payment amount must be greater than zero.';
    }
  } else {
    if (!years.blank && (years.invalid || years.value === null)) {
      errors.lengthYears = 'Enter a valid number of years.';
    } else if (
      !years.blank &&
      years.value !== null &&
      (years.value < 0 || !Number.isInteger(years.value))
    ) {
      errors.lengthYears = 'Years must be a whole number ≥ 0.';
    }

    if (!months.blank && (months.invalid || months.value === null)) {
      errors.lengthMonths = 'Enter a valid number of months.';
    } else if (
      !months.blank &&
      months.value !== null &&
      (months.value < 0 ||
        months.value > 11 ||
        !Number.isInteger(months.value))
    ) {
      errors.lengthMonths = 'Months must be a whole number from 0 to 11.';
    } else if (
      !years.blank &&
      !months.blank &&
      years.value !== null &&
      months.value !== null &&
      years.value === 0 &&
      months.value === 0
    ) {
      errors.lengthYears = 'Length must be greater than zero.';
    }
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualRatePercent = 'Enter a valid annuity rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualRatePercent = 'Annuity rate cannot be negative.';
  }

  if (input.setAdvanced) {
    if (!finalBal.blank && (finalBal.invalid || finalBal.value === null)) {
      errors.finalBalance = 'Enter a valid final balance.';
    } else if (!finalBal.blank && finalBal.value !== null && finalBal.value < 0) {
      errors.finalBalance = 'Final balance cannot be negative.';
    }

    if (!growth.blank && (growth.invalid || growth.value === null)) {
      errors.annualGrowthPercent = 'Enter a valid annual growth rate.';
    } else if (!growth.blank && growth.value !== null && growth.value <= -100) {
      errors.annualGrowthPercent = 'Annual growth must be greater than −100%.';
    }
  }

  const lengthIncomplete =
    input.mode === 'fixedLength' && (years.blank || months.blank);
  const paymentIncomplete = input.mode === 'fixedPayment' && payment.blank;
  const advancedIncomplete =
    input.setAdvanced && (finalBal.blank || growth.blank);

  const incomplete =
    balance.blank ||
    rate.blank ||
    lengthIncomplete ||
    paymentIncomplete ||
    advancedIncomplete ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.initialBalanceCurrency;
  let paymentInCalc = payment.value ?? 0;
  if (input.mode === 'fixedPayment') {
    const converted = convertMoney(
      payment.value!,
      input.paymentAmountCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.error;
      return { isValid: false, errors, result: null };
    }
    paymentInCalc = converted.amount;
  }

  let finalInCalc = 0;
  if (input.setAdvanced) {
    const converted = convertMoney(
      finalBal.value!,
      input.finalBalanceCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.error;
      return { isValid: false, errors, result: null };
    }
    finalInCalc = converted.amount;
  }

  const engine = calculateAnnuityPayout({
    mode: input.mode,
    initialBalance: balance.value!,
    payoutFrequency: input.payoutFrequency,
    annuityType: input.annuityType,
    lengthYears: years.value ?? 0,
    lengthMonths: months.value ?? 0,
    paymentAmount: paymentInCalc,
    annualRatePercent: rate.value!,
    useAdvancedCompounding: input.setAdvanced,
    compoundingFrequency: input.compoundingFrequency,
    finalBalance: finalInCalc,
    annualGrowthPercent: input.setAdvanced ? growth.value! : 0,
    currency: calcCurrency,
  });

  if (engine === null) {
    errors.form =
      input.mode === 'fixedPayment'
        ? 'This payment cannot deplete the balance to the target final amount. Try a smaller withdrawal or a different rate.'
        : 'This combination does not produce a valid payout. Check length, rate, and final balance.';
    return { isValid: false, errors, result: null };
  }

  const result: AnnuityPayoutResult = { ...engine };
  return { isValid: true, errors: {}, result };
}
