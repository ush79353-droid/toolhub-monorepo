import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateBiweeklyMortgage,
  formatBiweeklyMortgageMoney,
  formatSignedBiweeklyMortgageMoney,
  formatTermYearsMonths,
  termToMonths,
} from './calculation';
import type {
  BiweeklyMortgageFieldErrors,
  BiweeklyMortgageInput,
  BiweeklyMortgageResult,
  ScheduleSummary,
} from './types';

export interface BiweeklyMortgageValidation {
  isValid: boolean;
  errors: BiweeklyMortgageFieldErrors;
  result: BiweeklyMortgageResult | null;
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

function toSummary(
  schedule: {
    periodicPayment: number;
    paymentCount: number;
    totalInterest: number;
    totalOfPayments: number;
    termYears: number;
    termMonths: number;
  },
  closingCosts: number,
  currency: SupportedCurrency
): ScheduleSummary {
  const totalPayment = schedule.totalOfPayments + closingCosts;
  return {
    periodicPayment: schedule.periodicPayment,
    paymentCount: schedule.paymentCount,
    totalInterest: schedule.totalInterest,
    totalPayment,
    termYears: schedule.termYears,
    termMonths: schedule.termMonths,
    formattedPeriodicPayment: formatBiweeklyMortgageMoney(
      schedule.periodicPayment,
      currency
    ),
    formattedTotalInterest: formatBiweeklyMortgageMoney(
      schedule.totalInterest,
      currency
    ),
    formattedTotalPayment: formatBiweeklyMortgageMoney(totalPayment, currency),
    formattedTerm: formatTermYearsMonths(schedule.termYears, schedule.termMonths),
  };
}

/**
 * Validates inputs, normalizes independent money fields into loan currency,
 * then compares monthly vs accelerated biweekly schedules at full precision.
 */
export function validateBiweeklyMortgageInput(
  input: BiweeklyMortgageInput,
  rates?: CurrencyRatesSnapshot | null
): BiweeklyMortgageValidation {
  const errors: BiweeklyMortgageFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const term = parseNumber(input.mortgageTerm);
  const rate = parseNumber(input.interestRatePercent);
  const points = parseNumber(input.mortgagePointsPercent);
  const fee = parseNumber(input.upfrontFee);
  const extra = parseNumber(input.extraPayment);

  if (loan.blank) {
    errors.loanAmount = 'Enter a loan amount.';
  } else if (loan.invalid || loan.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!(loan.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (term.blank) {
    errors.mortgageTerm = 'Enter a mortgage term.';
  } else if (term.invalid || term.value === null) {
    errors.mortgageTerm = 'Enter a valid mortgage term.';
  } else if (!(term.value > 0)) {
    errors.mortgageTerm = 'Mortgage term must be greater than zero.';
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (points.blank) {
    errors.mortgagePointsPercent = 'Enter mortgage points.';
  } else if (points.invalid || points.value === null) {
    errors.mortgagePointsPercent = 'Enter valid mortgage points.';
  } else if (points.value < 0) {
    errors.mortgagePointsPercent = 'Mortgage points cannot be negative.';
  }

  if (fee.blank) {
    errors.upfrontFee = 'Enter an upfront fee.';
  } else if (fee.invalid || fee.value === null) {
    errors.upfrontFee = 'Enter a valid upfront fee.';
  } else if (fee.value < 0) {
    errors.upfrontFee = 'Upfront fee cannot be negative.';
  }

  if (extra.blank) {
    errors.extraPayment = 'Enter an extra payment.';
  } else if (extra.invalid || extra.value === null) {
    errors.extraPayment = 'Enter a valid extra payment.';
  } else if (extra.value < 0) {
    errors.extraPayment = 'Extra payment cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const termMonths = termToMonths(term.value!, input.termUnit);
  if (termMonths === null) {
    errors.mortgageTerm = 'Mortgage term must produce a positive number of months.';
    return { isValid: false, errors, result: null };
  }

  const feeCanonical = convertMoney(
    fee.value!,
    input.upfrontFeeCurrency,
    input.loanCurrency,
    rates
  );
  if (!feeCanonical.ok) {
    errors.form = feeCanonical.message;
    return { isValid: false, errors, result: null };
  }

  const extraCanonical = convertMoney(
    extra.value!,
    input.extraPaymentCurrency,
    input.loanCurrency,
    rates
  );
  if (!extraCanonical.ok) {
    errors.form = extraCanonical.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateBiweeklyMortgage({
    loanAmount: loan.value!,
    termMonths,
    annualRatePercent: rate.value!,
    compounding: input.compounding,
    mortgagePointsPercent: points.value!,
    upfrontFee: feeCanonical.amount,
    extraPayment: extraCanonical.amount,
  });

  if (!computed) {
    errors.form =
      'This combination does not produce a finite amortization. Check rate, term, and extra payment.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.loanCurrency;
  const withoutAcceleration = toSummary(
    computed.withoutAcceleration,
    computed.closingCosts,
    currency
  );
  const biweekly = toSummary(computed.biweekly, computed.closingCosts, currency);

  const result: BiweeklyMortgageResult = {
    currency,
    closingCosts: computed.closingCosts,
    withoutAcceleration,
    biweekly,
    paymentDifference: computed.paymentDifference,
    termSavedYears: computed.termSavedYears,
    termSavedMonths: computed.termSavedMonths,
    interestSaved: computed.interestDifference,
    totalPaymentSaved: computed.totalPaymentDifference,
    formattedPaymentDifference: formatBiweeklyMortgageMoney(
      computed.paymentDifference,
      currency
    ),
    formattedTermSaved: formatTermYearsMonths(
      computed.termSavedYears,
      computed.termSavedMonths
    ),
    formattedInterestSaved: formatSignedBiweeklyMortgageMoney(
      computed.interestDifference,
      currency
    ),
    formattedTotalPaymentSaved: formatSignedBiweeklyMortgageMoney(
      computed.totalPaymentDifference,
      currency
    ),
  };

  return { isValid: true, errors: {}, result };
}
