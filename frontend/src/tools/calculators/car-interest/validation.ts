import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateLoanAmount,
  calculateMonthlyPayment,
  calculatePaymentCount,
  calculateTotalInterest,
  formatCarInterestMoney,
} from './calculation';
import type {
  CarInterestFieldErrors,
  CarInterestInput,
  CarInterestResult,
} from './types';

export interface CarInterestValidation {
  isValid: boolean;
  errors: CarInterestFieldErrors;
  result: CarInterestResult | null;
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
 * Validates inputs, normalizes car price / down payment / trade-in into
 * loanAmountCurrency, amortizes at full precision, then converts loan amount,
 * monthly payment, and total interest into their display currencies.
 * Percentages and durations are never converted.
 */
export function validateCarInterestInput(
  input: CarInterestInput,
  rates?: CurrencyRatesSnapshot | null
): CarInterestValidation {
  const errors: CarInterestFieldErrors = {};

  const price = parseNumber(input.carPrice);
  const down = parseNumber(input.downPayment);
  const tradeIn = parseNumber(input.tradeInValue);
  const rate = parseNumber(input.interestRatePercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);

  if (price.blank) {
    errors.carPrice = 'Enter the price of the car.';
  } else if (price.invalid || price.value === null) {
    errors.carPrice = 'Enter a valid car price.';
  } else if (price.value < 0) {
    errors.carPrice = 'Car price cannot be negative.';
  }

  if (down.blank) {
    errors.downPayment = 'Enter a down payment.';
  } else if (down.invalid || down.value === null) {
    errors.downPayment = 'Enter a valid down payment.';
  } else if (down.value < 0) {
    errors.downPayment = 'Down payment cannot be negative.';
  }

  if (tradeIn.blank) {
    errors.tradeInValue = 'Enter a trade-in value.';
  } else if (tradeIn.invalid || tradeIn.value === null) {
    errors.tradeInValue = 'Enter a valid trade-in value.';
  } else if (tradeIn.value < 0) {
    errors.tradeInValue = 'Trade-in value cannot be negative.';
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  const termYears = years.blank ? 0 : years.value;
  const termMonths = months.blank ? 0 : months.value;

  if (years.invalid || (years.value !== null && years.value < 0)) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (termYears !== null && !Number.isInteger(termYears)) {
    errors.termYears = 'Loan term years must be a whole number.';
  }

  if (months.invalid || (months.value !== null && months.value < 0)) {
    errors.termMonths = 'Enter a valid number of months.';
  } else if (termMonths !== null && !Number.isInteger(termMonths)) {
    errors.termMonths = 'Loan term months must be a whole number.';
  } else if (termMonths !== null && termMonths > 11) {
    errors.termMonths = 'Months must be between 0 and 11.';
  }

  if (
    !errors.termYears &&
    !errors.termMonths &&
    (years.blank && months.blank
      ? true
      : (termYears ?? 0) === 0 && (termMonths ?? 0) === 0)
  ) {
    errors.termYears = 'Enter a loan term greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.loanAmountCurrency;

  const priceInLoan = convertMoney(
    price.value!,
    input.carPriceCurrency,
    calcCurrency,
    rates
  );
  if (!priceInLoan.ok) {
    errors.form = priceInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const downInLoan = convertMoney(
    down.value!,
    input.downPaymentCurrency,
    calcCurrency,
    rates
  );
  if (!downInLoan.ok) {
    errors.form = downInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const tradeInInLoan = convertMoney(
    tradeIn.value!,
    input.tradeInCurrency,
    calcCurrency,
    rates
  );
  if (!tradeInInLoan.ok) {
    errors.form = tradeInInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const loanAmount = calculateLoanAmount(
    priceInLoan.amount,
    downInLoan.amount,
    tradeInInLoan.amount
  );
  if (loanAmount === null) {
    errors.form = 'This combination does not produce a finite loan amount.';
    return { isValid: false, errors, result: null };
  }
  if (loanAmount < 0) {
    errors.form =
      'Loan amount cannot be negative. Reduce down payment and trade-in, or raise the car price.';
    return { isValid: false, errors, result: null };
  }

  const paymentCount = calculatePaymentCount(termYears!, termMonths!);
  if (paymentCount === null) {
    errors.termYears = 'Enter a loan term greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const monthlyInLoan = calculateMonthlyPayment({
    principal: loanAmount,
    annualRatePercent: rate.value!,
    paymentCount,
  });
  if (monthlyInLoan === null) {
    errors.form = 'This combination does not produce a finite monthly payment.';
    return { isValid: false, errors, result: null };
  }

  const interestInLoan = calculateTotalInterest({
    principal: loanAmount,
    monthlyPayment: monthlyInLoan,
    paymentCount,
  });
  if (interestInLoan === null) {
    errors.form = 'This combination does not produce a finite total interest.';
    return { isValid: false, errors, result: null };
  }

  const paymentDisplay = convertMoney(
    monthlyInLoan,
    calcCurrency,
    input.monthlyPaymentCurrency,
    rates
  );
  if (!paymentDisplay.ok) {
    errors.form = paymentDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const interestDisplay = convertMoney(
    interestInLoan,
    calcCurrency,
    input.totalInterestCurrency,
    rates
  );
  if (!interestDisplay.ok) {
    errors.form = interestDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: CarInterestResult = {
    loanAmountCalc: loanAmount,
    loanAmountDisplay: loanAmount,
    paymentCount,
    monthlyPaymentCalc: monthlyInLoan,
    monthlyPaymentDisplay: paymentDisplay.amount,
    totalInterestCalc: interestInLoan,
    totalInterestDisplay: interestDisplay.amount,
    calcCurrency,
    formattedLoanAmount: formatCarInterestMoney(loanAmount, calcCurrency),
    formattedMonthlyPayment: formatCarInterestMoney(
      paymentDisplay.amount,
      input.monthlyPaymentCurrency
    ),
    formattedTotalInterest: formatCarInterestMoney(
      interestDisplay.amount,
      input.totalInterestCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
