import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateHomeImprovementLoan,
  formatAprPercent,
  formatHomeImprovementMoney,
  formatLoanTermLabel,
} from './calculation';
import type {
  HomeImprovementLoanFieldErrors,
  HomeImprovementLoanInput,
  HomeImprovementLoanResult,
} from './types';

export interface HomeImprovementLoanValidation {
  isValid: boolean;
  errors: HomeImprovementLoanFieldErrors;
  result: HomeImprovementLoanResult | null;
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
 * Validates inputs, normalizes mixed-currency fees into loan currency,
 * runs the engine at full precision, and formats results in loan currency.
 * Percentages and durations are never converted.
 */
export function validateHomeImprovementLoanInput(
  input: HomeImprovementLoanInput,
  rates?: CurrencyRatesSnapshot | null
): HomeImprovementLoanValidation {
  const errors: HomeImprovementLoanFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);
  const rate = parseNumber(input.interestRatePercent);
  const feePct = parseNumber(input.applicationFeePercent);
  const feeAmt = parseNumber(input.applicationFee);
  const homeFees = parseNumber(input.homeLoanFees);

  if (loan.blank) {
    errors.loanAmount = 'Enter a loan amount.';
  } else if (loan.invalid || loan.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!(loan.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
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

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (feePct.blank) {
    errors.applicationFeePercent = 'Enter an application fee %.';
  } else if (feePct.invalid || feePct.value === null) {
    errors.applicationFeePercent = 'Enter a valid application fee %.';
  } else if (feePct.value < 0) {
    errors.applicationFeePercent = 'Application fee % cannot be negative.';
  }

  if (feeAmt.blank) {
    errors.applicationFee = 'Enter an application fee.';
  } else if (feeAmt.invalid || feeAmt.value === null) {
    errors.applicationFee = 'Enter a valid application fee.';
  } else if (feeAmt.value < 0) {
    errors.applicationFee = 'Application fee cannot be negative.';
  }

  if (homeFees.blank) {
    errors.homeLoanFees = 'Enter home loan fees.';
  } else if (homeFees.invalid || homeFees.value === null) {
    errors.homeLoanFees = 'Enter a valid home loan fees amount.';
  } else if (homeFees.value < 0) {
    errors.homeLoanFees = 'Home loan fees cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const appFeeInLoan = convertMoney(
    feeAmt.value!,
    input.applicationFeeCurrency,
    input.loanCurrency,
    rates
  );
  if (!appFeeInLoan.ok) {
    errors.form = appFeeInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const homeFeesInLoan = convertMoney(
    homeFees.value!,
    input.homeLoanFeesCurrency,
    input.loanCurrency,
    rates
  );
  if (!homeFeesInLoan.ok) {
    errors.form = homeFeesInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateHomeImprovementLoan({
    principal: loan.value!,
    termYears: termYears!,
    termMonths: termMonths!,
    annualRatePercent: rate.value!,
    applicationFee: appFeeInLoan.amount,
    homeLoanFees: homeFeesInLoan.amount,
  });

  if (computed === null) {
    errors.form =
      'This combination does not produce a finite result. Fees must be less than the loan amount.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.loanCurrency;
  const result: HomeImprovementLoanResult = {
    monthlyPayment: computed.monthlyPayment,
    aprPercent: computed.aprPercent,
    paymentCount: computed.paymentCount,
    termYears: computed.termYears,
    termMonths: computed.termMonths,
    loanPrincipal: computed.loanPrincipal,
    totalInterest: computed.totalInterest,
    loanFees: computed.loanFees,
    applicationFeeInLoan: computed.applicationFee,
    homeLoanFeesInLoan: computed.homeLoanFees,
    totalPayments: computed.totalPayments,
    chartPoints: computed.chartPoints,
    currency,
    formattedMonthlyPayment: formatHomeImprovementMoney(
      computed.monthlyPayment,
      currency
    ),
    formattedApr: formatAprPercent(computed.aprPercent),
    formattedLoanTerm: formatLoanTermLabel(computed.termYears, computed.termMonths),
    formattedLoanPrincipal: formatHomeImprovementMoney(
      computed.loanPrincipal,
      currency
    ),
    formattedTotalInterest: formatHomeImprovementMoney(
      computed.totalInterest,
      currency
    ),
    formattedLoanFees: formatHomeImprovementMoney(computed.loanFees, currency),
    formattedTotalPayments: formatHomeImprovementMoney(
      computed.totalPayments,
      currency
    ),
  };

  return { isValid: true, errors: {}, result };
}
