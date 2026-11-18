import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateRvLoanAmortization,
  formatRvLoanMoney,
  termToPaymentCount,
} from './calculation';
import type { RvLoanFieldErrors, RvLoanInput, RvLoanResult } from './types';

export interface RvLoanValidation {
  isValid: boolean;
  errors: RvLoanFieldErrors;
  result: RvLoanResult | null;
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
 * Canonical calc currency = RV price currency.
 * Down payment is normalized into that currency before P = V − D.
 * Result selectors convert display only from full-precision canonical values.
 */
export function validateRvLoanInput(
  input: RvLoanInput,
  rates?: CurrencyRatesSnapshot | null
): RvLoanValidation {
  const errors: RvLoanFieldErrors = {};

  const price = parseNumber(input.rvPrice);
  const down = parseNumber(input.downPayment);
  const rate = parseNumber(input.annualInterestRatePercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);

  if (price.blank) {
    errors.rvPrice = 'Enter an RV price.';
  } else if (price.invalid || price.value === null) {
    errors.rvPrice = 'Enter a valid RV price.';
  } else if (!(price.value > 0)) {
    errors.rvPrice = 'RV price must be greater than zero.';
  }

  if (down.blank) {
    errors.downPayment = 'Enter a down payment (0 allowed).';
  } else if (down.invalid || down.value === null) {
    errors.downPayment = 'Enter a valid down payment.';
  } else if (down.value < 0) {
    errors.downPayment = 'Down payment cannot be negative.';
  }

  if (rate.blank) {
    errors.annualInterestRatePercent = 'Enter an annual interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRatePercent = 'Enter a valid annual interest rate.';
  } else if (rate.value < 0) {
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

  const termYears = years.blank ? 0 : years.value!;
  const termMonths = months.blank ? 0 : months.value!;
  if (years.blank && (months.blank || termMonths === 0)) {
    errors.termYears = errors.termYears ?? 'Enter a loan term.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const paymentCount = termToPaymentCount(termYears, termMonths);
  if (paymentCount === null) {
    errors.termYears = 'Loan term must produce a positive number of monthly payments.';
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.rvPriceCurrency;
  const downInCalc = convertMoney(
    down.value!,
    input.downPaymentCurrency,
    calcCurrency,
    rates
  );
  if (!downInCalc.ok) {
    errors.form = downInCalc.message;
    return { isValid: false, errors, result: null };
  }

  if (downInCalc.amount > price.value!) {
    errors.downPayment = 'Down payment cannot exceed RV price.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateRvLoanAmortization({
    rvPrice: price.value!,
    downPayment: downInCalc.amount,
    annualRatePercent: rate.value!,
    paymentCount,
  });
  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const loanDisplay = convertMoney(
    computed.loanAmount,
    calcCurrency,
    input.loanAmountCurrency,
    rates
  );
  if (!loanDisplay.ok) {
    errors.form = loanDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const paymentDisplay = convertMoney(
    computed.monthlyPayment,
    calcCurrency,
    input.paymentCurrency,
    rates
  );
  if (!paymentDisplay.ok) {
    errors.form = paymentDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const totalPaidDisplay = convertMoney(
    computed.totalPaid,
    calcCurrency,
    input.totalPaidCurrency,
    rates
  );
  if (!totalPaidDisplay.ok) {
    errors.form = totalPaidDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const costDisplay = convertMoney(
    computed.costOfLoan,
    calcCurrency,
    input.costOfLoanCurrency,
    rates
  );
  if (!costDisplay.ok) {
    errors.form = costDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: RvLoanResult = {
    loanAmountCalc: computed.loanAmount,
    loanAmountDisplay: loanDisplay.amount,
    paymentCalc: computed.monthlyPayment,
    paymentDisplay: paymentDisplay.amount,
    totalPaidCalc: computed.totalPaid,
    totalPaidDisplay: totalPaidDisplay.amount,
    costOfLoanCalc: computed.costOfLoan,
    costOfLoanDisplay: costDisplay.amount,
    paymentCount,
    calcCurrency,
    formattedLoanAmount: formatRvLoanMoney(
      loanDisplay.amount,
      input.loanAmountCurrency
    ),
    formattedPayment: formatRvLoanMoney(
      paymentDisplay.amount,
      input.paymentCurrency
    ),
    formattedTotalPaid: formatRvLoanMoney(
      totalPaidDisplay.amount,
      input.totalPaidCurrency
    ),
    formattedCostOfLoan: formatRvLoanMoney(
      costDisplay.amount,
      input.costOfLoanCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
