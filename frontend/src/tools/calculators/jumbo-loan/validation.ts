import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateJumboLoan,
  formatDisplayDate,
  formatJumboLoanMoney,
} from './calculation';
import type {
  JumboLoanFieldErrors,
  JumboLoanInput,
  JumboLoanResult,
} from './types';

export interface JumboLoanValidation {
  isValid: boolean;
  errors: JumboLoanFieldErrors;
  result: JumboLoanResult | null;
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
 * Canonical calc currency = property price currency.
 * Mixed money inputs normalize into that currency before amortization.
 * Result currencies only re-express calculated amounts.
 */
export function validateJumboLoanInput(
  input: JumboLoanInput,
  rates?: CurrencyRatesSnapshot | null
): JumboLoanValidation {
  const errors: JumboLoanFieldErrors = {};

  const price = parseNumber(input.propertyPrice);
  const percent = parseNumber(input.downPaymentPercent);
  const downAmt = parseNumber(input.downPayment);
  const rate = parseNumber(input.interestRatePercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.propertyPrice = 'Enter a valid property price.';
  } else if (!price.blank && price.value !== null && !(price.value > 0)) {
    errors.propertyPrice = 'Property price must be greater than zero.';
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
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
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

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.firstDay.trim())) {
    errors.firstDay = 'Enter a valid first payment date.';
  }

  const incomplete =
    price.blank ||
    percent.blank ||
    rate.blank ||
    (years.blank && (months.blank || months.value === 0)) ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.propertyPriceCurrency;
  let downPaymentPercent = percent.value!;

  if (input.downPaymentSource === 'amount' && !downAmt.blank && downAmt.value !== null) {
    const downInProperty = convertMoney(
      downAmt.value,
      input.downPaymentCurrency,
      calcCurrency,
      rates
    );
    if (!downInProperty.ok) {
      errors.form = downInProperty.message;
      return { isValid: false, errors, result: null };
    }
    if (downInProperty.amount > price.value!) {
      errors.downPayment = 'Down payment cannot exceed property price.';
      return { isValid: false, errors, result: null };
    }
    downPaymentPercent = (downInProperty.amount / price.value!) * 100;
  }

  const termYears = years.blank ? 0 : years.value!;
  const termMonths = months.blank ? 0 : months.value!;

  const computed = calculateJumboLoan({
    propertyPrice: price.value!,
    downPaymentPercent,
    annualRatePercent: rate.value!,
    termYears,
    termMonths,
    firstDay: input.firstDay.trim(),
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
    computed.jumboLoanAmount,
    calcCurrency,
    input.jumboLoanAmountCurrency,
    rates
  );
  if (!loanDisplay.ok) {
    errors.form = loanDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const paymentDisplay = convertMoney(
    computed.monthlyPayment,
    calcCurrency,
    input.monthlyPaymentCurrency,
    rates
  );
  if (!paymentDisplay.ok) {
    errors.form = paymentDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: JumboLoanResult = {
    downPaymentCalc: computed.downPayment,
    downPaymentDisplay: downDisplay.amount,
    jumboLoanAmountCalc: computed.jumboLoanAmount,
    jumboLoanAmountDisplay: loanDisplay.amount,
    paymentCount: computed.paymentCount,
    monthlyPaymentCalc: computed.monthlyPayment,
    monthlyPaymentDisplay: paymentDisplay.amount,
    payoffDate: computed.payoffDate,
    calcCurrency,
    formattedDownPayment: formatJumboLoanMoney(
      downDisplay.amount,
      input.downPaymentCurrency
    ),
    formattedJumboLoanAmount: formatJumboLoanMoney(
      loanDisplay.amount,
      input.jumboLoanAmountCurrency
    ),
    formattedMonthlyPayment: formatJumboLoanMoney(
      paymentDisplay.amount,
      input.monthlyPaymentCurrency
    ),
    formattedPayoffDate: formatDisplayDate(computed.payoffDate),
  };

  return { isValid: true, errors: {}, result };
}
