import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePeriodicInterestOnlyPayment,
  calculateTotalInterestOnlyPaid,
  formatInterestOnlyMoney,
  parseInterestOnlyPeriodYears,
  paymentLabelFor,
} from './calculation';
import type {
  InterestOnlyMortgageFieldErrors,
  InterestOnlyMortgageInput,
  InterestOnlyMortgageResult,
} from './types';

export interface InterestOnlyMortgageValidation {
  isValid: boolean;
  errors: InterestOnlyMortgageFieldErrors;
  result: InterestOnlyMortgageResult | null;
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

function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; note: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, note: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, note: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates inputs, computes periodic IO payment in the loan currency at full
 * precision, optionally computes total IO interest, then converts money results
 * into their display currencies before formatting.
 */
export function validateInterestOnlyMortgageInput(
  input: InterestOnlyMortgageInput,
  rates?: CurrencyRatesSnapshot | null
): InterestOnlyMortgageValidation {
  const errors: InterestOnlyMortgageFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const rate = parseNumber(input.annualInterestRatePercent);

  if (!loan.blank && (loan.invalid || loan.value === null)) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!loan.blank && loan.value !== null && loan.value < 0) {
    errors.loanAmount = 'Loan amount cannot be negative.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualInterestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualInterestRatePercent = 'Interest rate cannot be negative.';
  }

  const yearsText = input.periodYears.trim();
  const monthsText = input.periodMonths.trim();
  const periodProvided = Boolean(yearsText || monthsText);
  let periodYearsTotal: number | null = null;

  if (periodProvided) {
    periodYearsTotal = parseInterestOnlyPeriodYears(input.periodYears, input.periodMonths);
    if (periodYearsTotal === null) {
      const yearsNum = yearsText === '' ? 0 : Number(yearsText.replace(/,/g, ''));
      const monthsNum = monthsText === '' ? 0 : Number(monthsText.replace(/,/g, ''));
      if (yearsText !== '' && !Number.isFinite(yearsNum)) {
        errors.periodYears = 'Enter a valid number of years.';
      } else if (monthsText !== '' && !Number.isFinite(monthsNum)) {
        errors.periodMonths = 'Enter a valid number of months.';
      } else if (
        (Number.isFinite(yearsNum) && yearsNum < 0) ||
        (Number.isFinite(monthsNum) && monthsNum < 0)
      ) {
        errors.periodYears = 'Interest-only period cannot be negative.';
      } else {
        errors.periodYears = 'Enter a period greater than zero.';
      }
    }
  }

  const incomplete =
    loan.blank ||
    rate.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const paymentInLoan = calculatePeriodicInterestOnlyPayment({
    loanAmount: loan.value!,
    annualInterestRatePercent: rate.value!,
    paymentFrequency: input.paymentFrequency,
  });

  if (paymentInLoan === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const paymentConverted = convertAmount(
    paymentInLoan,
    input.currency,
    input.resultCurrency,
    rates
  );
  if (!paymentConverted.ok) {
    errors.form = paymentConverted.note;
    return { isValid: false, errors, result: null };
  }

  let totalInterestInLoan: number | null = null;
  let totalInterest: number | null = null;
  let formattedTotalInterest: string | null = null;

  if (periodYearsTotal !== null) {
    totalInterestInLoan = calculateTotalInterestOnlyPaid({
      loanAmount: loan.value!,
      annualInterestRatePercent: rate.value!,
      periodYears: periodYearsTotal,
    });
    if (totalInterestInLoan === null) {
      errors.form = 'Unable to calculate total interest for this period.';
      return { isValid: false, errors, result: null };
    }
    const totalConverted = convertAmount(
      totalInterestInLoan,
      input.currency,
      input.totalCurrency,
      rates
    );
    if (!totalConverted.ok) {
      errors.form = totalConverted.note;
      return { isValid: false, errors, result: null };
    }
    totalInterest = totalConverted.amount;
    formattedTotalInterest = formatInterestOnlyMoney(
      totalInterest,
      input.totalCurrency
    );
  }

  const result: InterestOnlyMortgageResult = {
    periodicPaymentInLoan: paymentInLoan,
    periodicPayment: paymentConverted.amount,
    paymentLabel: paymentLabelFor(input.paymentFrequency),
    formattedPeriodicPayment: formatInterestOnlyMoney(
      paymentConverted.amount,
      input.resultCurrency
    ),
    totalInterestInLoan,
    totalInterest,
    formattedTotalInterest,
    periodYearsTotal,
    remainingPrincipal: loan.value!,
    currency: input.resultCurrency,
    loanCurrency: input.currency,
    totalCurrency: input.totalCurrency,
  };

  return { isValid: true, errors: {}, result };
}
