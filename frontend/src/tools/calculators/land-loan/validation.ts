import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateLandLoanAmortization,
  calculateNumberOfPayments,
  formatLandLoanMoney,
  formatLandLoanPercent,
} from './calculation';
import type {
  LandLoanFieldErrors,
  LandLoanInput,
  LandLoanResult,
} from './types';

export interface LandLoanValidation {
  isValid: boolean;
  errors: LandLoanFieldErrors;
  result: LandLoanResult | null;
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
 * Canonical calc currency = land value currency.
 * Down payment % drives principal when source is percent; amount edits convert
 * into land currency before deriving %. Results convert for display only.
 */
export function validateLandLoanInput(
  input: LandLoanInput,
  rates?: CurrencyRatesSnapshot | null
): LandLoanValidation {
  const errors: LandLoanFieldErrors = {};

  const land = parseNumber(input.landValue);
  const percent = parseNumber(input.downPaymentPercent);
  const downAmt = parseNumber(input.downPayment);
  const rate = parseNumber(input.annualInterestRatePercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);

  if (!land.blank && (land.invalid || land.value === null)) {
    errors.landValue = 'Enter a valid land value.';
  } else if (!land.blank && land.value !== null && !(land.value > 0)) {
    errors.landValue = 'Land value must be greater than zero.';
  }

  if (!percent.blank && (percent.invalid || percent.value === null)) {
    errors.downPaymentPercent = 'Enter a valid down payment percentage.';
  } else if (
    !percent.blank &&
    percent.value !== null &&
    (percent.value < 0 || percent.value > 100)
  ) {
    errors.downPaymentPercent = 'Down payment percentage must be between 0 and 100.';
  }

  if (!downAmt.blank && (downAmt.invalid || downAmt.value === null)) {
    errors.downPayment = 'Enter a valid down payment.';
  } else if (!downAmt.blank && downAmt.value !== null && downAmt.value < 0) {
    errors.downPayment = 'Down payment cannot be negative.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualInterestRatePercent = 'Enter a valid annual interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualInterestRatePercent = 'Annual interest rate cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (!years.blank && years.value !== null && years.value < 0) {
    errors.termYears = 'Loan term years cannot be negative.';
  } else if (
    !years.blank &&
    years.value !== null &&
    !Number.isInteger(years.value)
  ) {
    errors.termYears = 'Loan term years must be a whole number.';
  }

  if (!months.blank && (months.invalid || months.value === null)) {
    errors.termMonths = 'Enter a valid number of months.';
  } else if (
    !months.blank &&
    months.value !== null &&
    (!Number.isInteger(months.value) || months.value < 0 || months.value > 11)
  ) {
    errors.termMonths = 'Loan term months must be a whole number from 0 to 11.';
  }

  const incomplete =
    land.blank ||
    percent.blank ||
    rate.blank ||
    (years.blank && (months.blank || months.value === 0)) ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.landValueCurrency;
  let downPaymentPercent = percent.value!;

  if (input.downPaymentSource === 'amount' && !downAmt.blank && downAmt.value !== null) {
    const downInLand = convertMoney(
      downAmt.value,
      input.downPaymentCurrency,
      calcCurrency,
      rates
    );
    if (!downInLand.ok) {
      errors.form = downInLand.message;
      return { isValid: false, errors, result: null };
    }
    if (downInLand.amount > land.value!) {
      errors.downPayment = 'Down payment cannot exceed land value.';
      return { isValid: false, errors, result: null };
    }
    downPaymentPercent = (downInLand.amount / land.value!) * 100;
  }

  const termYears = years.blank ? 0 : years.value!;
  const termMonths = months.blank ? 0 : months.value!;

  const paymentCount = calculateNumberOfPayments({
    termYears,
    termMonths,
    paymentFrequency: input.paymentFrequency,
  });
  if (paymentCount === null) {
    errors.form =
      'Loan term and payment frequency must produce a whole number of payments.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateLandLoanAmortization({
    landValue: land.value!,
    downPaymentPercent,
    annualRatePercent: rate.value!,
    termYears,
    termMonths,
    paymentFrequency: input.paymentFrequency,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const downDisplay = convertMoney(
    computed.downPayment,
    calcCurrency,
    input.downPaymentCurrency,
    rates
  );
  if (!downDisplay.ok) {
    errors.form = downDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const loanDisplay = convertMoney(
    computed.loanValue,
    calcCurrency,
    input.loanValueCurrency,
    rates
  );
  if (!loanDisplay.ok) {
    errors.form = loanDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const paymentDisplay = convertMoney(
    computed.periodicPayment,
    calcCurrency,
    input.periodicPaymentCurrency,
    rates
  );
  if (!paymentDisplay.ok) {
    errors.form = paymentDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const totalDisplay = convertMoney(
    computed.totalPayment,
    calcCurrency,
    input.totalPaymentCurrency,
    rates
  );
  if (!totalDisplay.ok) {
    errors.form = totalDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const interestDisplay = convertMoney(
    computed.totalInterest,
    calcCurrency,
    input.totalInterestCurrency,
    rates
  );
  if (!interestDisplay.ok) {
    errors.form = interestDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: LandLoanResult = {
    downPaymentCalc: computed.downPayment,
    downPaymentDisplay: downDisplay.amount,
    loanValueCalc: computed.loanValue,
    loanValueDisplay: loanDisplay.amount,
    numberOfPayments: computed.numberOfPayments,
    periodicRatePercent: computed.periodicRatePercent,
    periodicPaymentCalc: computed.periodicPayment,
    periodicPaymentDisplay: paymentDisplay.amount,
    totalPaymentCalc: computed.totalPayment,
    totalPaymentDisplay: totalDisplay.amount,
    totalInterestCalc: computed.totalInterest,
    totalInterestDisplay: interestDisplay.amount,
    calcCurrency,
    formattedDownPayment: formatLandLoanMoney(
      downDisplay.amount,
      input.downPaymentCurrency
    ),
    formattedLoanValue: formatLandLoanMoney(
      loanDisplay.amount,
      input.loanValueCurrency
    ),
    formattedNumberOfPayments: String(computed.numberOfPayments),
    formattedPeriodicRate: formatLandLoanPercent(computed.periodicRatePercent),
    formattedPeriodicPayment: formatLandLoanMoney(
      paymentDisplay.amount,
      input.periodicPaymentCurrency
    ),
    formattedTotalPayment: formatLandLoanMoney(
      totalDisplay.amount,
      input.totalPaymentCurrency
    ),
    formattedTotalInterest: formatLandLoanMoney(
      interestDisplay.amount,
      input.totalInterestCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
