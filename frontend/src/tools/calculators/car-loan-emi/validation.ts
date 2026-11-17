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
  calculateSalesTaxAmount,
  calculateTotalInterest,
  formatCarLoanEmiMoney,
} from './calculation';
import type {
  CarLoanEmiFieldErrors,
  CarLoanEmiInput,
  CarLoanEmiResult,
} from './types';

export interface CarLoanEmiValidation {
  isValid: boolean;
  errors: CarLoanEmiFieldErrors;
  result: CarLoanEmiResult | null;
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
 * Canonical calc currency = loan amount currency.
 * Mixed money inputs normalize into that currency before EMI math.
 * Result currencies only re-express calculated amounts.
 * Percentages and term lengths are never converted.
 */
export function validateCarLoanEmiInput(
  input: CarLoanEmiInput,
  rates?: CurrencyRatesSnapshot | null
): CarLoanEmiValidation {
  const errors: CarLoanEmiFieldErrors = {};

  const price = parseNumber(input.carPrice);
  const money = parseNumber(input.moneyYouHave);
  const tradeIn = parseNumber(input.tradeInValue);
  const tax = parseNumber(input.salesTaxPercent);
  const rate = parseNumber(input.interestRatePercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);

  if (price.blank) {
    errors.carPrice = 'Enter the price of the car.';
  } else if (price.invalid || price.value === null) {
    errors.carPrice = 'Enter a valid car price.';
  } else if (!(price.value > 0)) {
    errors.carPrice = 'Car price must be greater than zero.';
  }

  if (money.blank) {
    errors.moneyYouHave = 'Enter the money you have.';
  } else if (money.invalid || money.value === null) {
    errors.moneyYouHave = 'Enter a valid amount.';
  } else if (money.value < 0) {
    errors.moneyYouHave = 'Money you have cannot be negative.';
  }

  if (tradeIn.blank) {
    errors.tradeInValue = 'Enter a trade-in value.';
  } else if (tradeIn.invalid || tradeIn.value === null) {
    errors.tradeInValue = 'Enter a valid trade-in value.';
  } else if (tradeIn.value < 0) {
    errors.tradeInValue = 'Trade-in value cannot be negative.';
  }

  if (tax.blank) {
    errors.salesTaxPercent = 'Enter a sales tax percentage.';
  } else if (tax.invalid || tax.value === null) {
    errors.salesTaxPercent = 'Enter a valid sales tax percentage.';
  } else if (tax.value < 0) {
    errors.salesTaxPercent = 'Sales tax cannot be negative.';
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

  const moneyInLoan = convertMoney(
    money.value!,
    input.moneyYouHaveCurrency,
    calcCurrency,
    rates
  );
  if (!moneyInLoan.ok) {
    errors.form = moneyInLoan.message;
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

  const salesTaxAmount = calculateSalesTaxAmount(priceInLoan.amount, tax.value!);
  if (salesTaxAmount === null) {
    errors.form = 'This combination does not produce a finite sales tax amount.';
    return { isValid: false, errors, result: null };
  }

  const loanAmount = calculateLoanAmount({
    carPrice: priceInLoan.amount,
    salesTaxAmount,
    moneyYouHave: moneyInLoan.amount,
    tradeInValue: tradeInInLoan.amount,
  });
  if (loanAmount === null) {
    errors.form = 'This combination does not produce a finite loan amount.';
    return { isValid: false, errors, result: null };
  }
  if (loanAmount < 0) {
    errors.form =
      'Loan amount cannot be negative. Reduce cash or trade-in, or raise the car price.';
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

  const result: CarLoanEmiResult = {
    salesTaxAmountCalc: salesTaxAmount,
    loanAmountCalc: loanAmount,
    loanAmountDisplay: loanAmount,
    paymentCount,
    monthlyPaymentCalc: monthlyInLoan,
    monthlyPaymentDisplay: paymentDisplay.amount,
    totalInterestCalc: interestInLoan,
    totalInterestDisplay: interestDisplay.amount,
    calcCurrency,
    formattedLoanAmount: formatCarLoanEmiMoney(loanAmount, calcCurrency),
    formattedMonthlyPayment: formatCarLoanEmiMoney(
      paymentDisplay.amount,
      input.monthlyPaymentCurrency
    ),
    formattedTotalInterest: formatCarLoanEmiMoney(
      interestDisplay.amount,
      input.totalInterestCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
