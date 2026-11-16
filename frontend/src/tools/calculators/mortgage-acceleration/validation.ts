import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMortgageAcceleration,
  formatDisplayDate,
  formatMortgageAccelerationMoney,
  formatSignedMoney,
  formatTermYearsMonths,
  termToMonths,
} from './calculation';
import type {
  DifferenceColumn,
  MortgageAccelerationFieldErrors,
  MortgageAccelerationInput,
  MortgageAccelerationResult,
  ScheduleColumn,
} from './types';

export interface MortgageAccelerationValidation {
  isValid: boolean;
  errors: MortgageAccelerationFieldErrors;
  result: MortgageAccelerationResult | null;
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

function buildScheduleColumn(params: {
  label: string;
  schedule: {
    periodicPayment: number;
    paymentCount: number;
    totalInterest: number;
    totalOfPayments: number;
    termYears: number;
    termMonths: number;
    payoffDate: string;
  };
  paymentSuffix: '/mo' | ' bi-weekly';
  closingCosts: number;
  currency: SupportedCurrency;
  symbol: string;
}): ScheduleColumn {
  const {
    label,
    schedule,
    paymentSuffix,
    closingCosts,
    currency,
    symbol,
  } = params;
  const grandTotal = schedule.totalOfPayments + closingCosts;
  const money = (n: number) => formatMortgageAccelerationMoney(n, currency);
  return {
    label,
    periodicPayment: schedule.periodicPayment,
    paymentSuffix,
    paymentCount: schedule.paymentCount,
    termYears: schedule.termYears,
    termMonths: schedule.termMonths,
    payoffDate: schedule.payoffDate,
    totalInterest: schedule.totalInterest,
    totalPayments: schedule.totalOfPayments,
    additionalCosts: closingCosts,
    grandTotal,
    formattedPeriodicPayment: `${symbol}${money(schedule.periodicPayment)}${paymentSuffix}`,
    formattedTerm: formatTermYearsMonths(schedule.termYears, schedule.termMonths),
    formattedPayoffDate: formatDisplayDate(schedule.payoffDate),
    formattedTotalInterest: `${symbol}${money(schedule.totalInterest)}`,
    formattedTotalPayments: `${symbol}${money(schedule.totalOfPayments)}`,
    formattedAdditionalCosts: `${symbol}${money(closingCosts)}`,
    formattedGrandTotal: `${symbol}${money(grandTotal)}`,
  };
}

export function validateMortgageAccelerationInput(
  input: MortgageAccelerationInput,
  rates?: CurrencyRatesSnapshot | null
): MortgageAccelerationValidation {
  const errors: MortgageAccelerationFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const term = parseNumber(input.mortgageTerm);
  const rate = parseNumber(input.interestRatePercent);
  const points = parseNumber(
    input.adjustFeesAndCompounding ? input.mortgagePointsPercent : '0'
  );
  const fee = parseNumber(input.adjustFeesAndCompounding ? input.upfrontFee : '0');
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

  if (input.adjustFeesAndCompounding) {
    if (!points.blank && (points.invalid || points.value === null)) {
      errors.mortgagePointsPercent = 'Enter a valid points percentage.';
    } else if (!points.blank && points.value !== null && points.value < 0) {
      errors.mortgagePointsPercent = 'Points cannot be negative.';
    }

    if (!fee.blank && (fee.invalid || fee.value === null)) {
      errors.upfrontFee = 'Enter a valid upfront fee.';
    } else if (!fee.blank && fee.value !== null && fee.value < 0) {
      errors.upfrontFee = 'Upfront fee cannot be negative.';
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate.trim())) {
    errors.dueDate = 'Enter a valid due date.';
  }

  if (!extra.blank && (extra.invalid || extra.value === null)) {
    errors.extraPayment = 'Enter a valid extra payment.';
  } else if (!extra.blank && extra.value !== null && extra.value < 0) {
    errors.extraPayment = 'Extra payment cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const termMonths = termToMonths(term.value!, input.termUnit);
  if (termMonths === null) {
    errors.mortgageTerm = 'Enter a valid mortgage term.';
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.loanCurrency;
  const loanAmount = loan.value!;

  const feeAmountRaw = fee.blank || fee.value === null ? 0 : fee.value;
  const feeConverted = convertMoney(
    feeAmountRaw,
    input.adjustFeesAndCompounding ? input.upfrontFeeCurrency : calcCurrency,
    calcCurrency,
    rates
  );
  if (!feeConverted.ok) {
    errors.form = feeConverted.message;
    return { isValid: false, errors, result: null };
  }

  const extraRaw = extra.blank || extra.value === null ? 0 : extra.value;
  const extraConverted = convertMoney(
    extraRaw,
    input.extraPaymentCurrency,
    calcCurrency,
    rates
  );
  if (!extraConverted.ok) {
    errors.form = extraConverted.message;
    return { isValid: false, errors, result: null };
  }

  const compounding = input.adjustFeesAndCompounding
    ? input.compounding
    : 'monthly_uk_us';
  const pointsPercent =
    input.adjustFeesAndCompounding && points.value !== null && !points.blank
      ? points.value
      : 0;

  const computed = calculateMortgageAcceleration({
    loanAmount,
    termMonths,
    annualRatePercent: rate.value!,
    accelerationType: input.accelerationType,
    compounding,
    mortgagePointsPercent: pointsPercent,
    upfrontFee: feeConverted.amount,
    dueDate: input.dueDate.trim(),
    extraPayment: extraConverted.amount,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite amortization schedule.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(calcCurrency);
  const withoutAcceleration = buildScheduleColumn({
    label: 'Payments w/o acceleration',
    schedule: computed.without,
    paymentSuffix: '/mo',
    closingCosts: computed.closingCosts,
    currency: calcCurrency,
    symbol,
  });

  const accelerated = buildScheduleColumn({
    label: 'Accelerated payment',
    schedule: computed.accelerated,
    paymentSuffix: computed.accelerated.paymentSuffix,
    closingCosts: computed.closingCosts,
    currency: calcCurrency,
    symbol,
  });

  const difference: DifferenceColumn = {
    paymentMonthlyEquivalent: computed.paymentDifferenceMonthly,
    termYears: computed.termSavedYears,
    termMonths: computed.termSavedMonths,
    payoffSpanLabel: formatTermYearsMonths(
      computed.termSavedYears,
      computed.termSavedMonths
    ),
    totalInterest: computed.interestDifference,
    totalPayments: computed.totalPaymentDifference,
    additionalCosts: 0,
    grandTotal: computed.totalPaymentDifference,
    formattedPayment: `${symbol}${formatSignedMoney(computed.paymentDifferenceMonthly, calcCurrency)}/mo`,
    formattedTerm: formatTermYearsMonths(
      computed.termSavedYears,
      computed.termSavedMonths
    ),
    formattedPayoff: formatTermYearsMonths(
      computed.termSavedYears,
      computed.termSavedMonths
    ),
    formattedTotalInterest: `${symbol}${formatSignedMoney(computed.interestDifference, calcCurrency)}`,
    formattedTotalPayments: `${symbol}${formatSignedMoney(computed.totalPaymentDifference, calcCurrency)}`,
    formattedAdditionalCosts: `${symbol}${formatMortgageAccelerationMoney(0, calcCurrency)}`,
    formattedGrandTotal: `${symbol}${formatSignedMoney(computed.totalPaymentDifference, calcCurrency)}`,
  };

  return {
    isValid: true,
    errors: {},
    result: {
      calcCurrency,
      withoutAcceleration,
      accelerated,
      difference,
    },
  };
}
