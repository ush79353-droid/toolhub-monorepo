import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateBiWeeklyMortgagePayment,
  formatBiWeeklyMoney,
  formatPayoffDateMdY,
  formatTermYearsMonths,
  termToMonths,
} from './calculation';
import type {
  BiWeeklyMortgagePaymentFieldErrors,
  BiWeeklyMortgagePaymentInput,
  BiWeeklyMortgagePaymentResult,
  ScheduleColumn,
} from './types';

export interface BiWeeklyMortgagePaymentValidation {
  isValid: boolean;
  errors: BiWeeklyMortgagePaymentFieldErrors;
  result: BiWeeklyMortgagePaymentResult | null;
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

function buildColumn(params: {
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
  closingCosts: number;
  currency: SupportedCurrency;
  symbol: string;
}): ScheduleColumn {
  const { label, schedule, closingCosts, currency, symbol } = params;
  const totalPayments = schedule.totalOfPayments + closingCosts;
  const money = (n: number) => formatBiWeeklyMoney(n, currency);
  return {
    label,
    periodicPayment: schedule.periodicPayment,
    paymentCount: schedule.paymentCount,
    termYears: schedule.termYears,
    termMonths: schedule.termMonths,
    payoffDate: schedule.payoffDate,
    totalInterest: schedule.totalInterest,
    totalPayments,
    formattedPayment: `${symbol}${money(schedule.periodicPayment)}`,
    formattedTerm: formatTermYearsMonths(schedule.termYears, schedule.termMonths),
    formattedPayoffDate: formatPayoffDateMdY(schedule.payoffDate),
    formattedTotalInterest: `${symbol}${money(schedule.totalInterest)}`,
    formattedTotalPayments: `${symbol}${money(totalPayments)}`,
  };
}

export function validateBiWeeklyMortgagePaymentInput(
  input: BiWeeklyMortgagePaymentInput,
  rates?: CurrencyRatesSnapshot | null
): BiWeeklyMortgagePaymentValidation {
  const errors: BiWeeklyMortgagePaymentFieldErrors = {};

  const amount = parseNumber(input.mortgageAmount);
  const term = parseNumber(input.mortgageTerm);
  const rate = parseNumber(input.interestRatePercent);
  const points = parseNumber(
    input.changePointsFeesCompounding ? input.mortgagePointsPercent : '0'
  );
  const fee = parseNumber(
    input.changePointsFeesCompounding ? input.upfrontFee : '0'
  );
  const extra = parseNumber(input.extraPayment);

  if (amount.blank) {
    errors.mortgageAmount = 'Enter a mortgage amount.';
  } else if (amount.invalid || amount.value === null) {
    errors.mortgageAmount = 'Enter a valid mortgage amount.';
  } else if (!(amount.value > 0)) {
    errors.mortgageAmount = 'Mortgage amount must be greater than zero.';
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

  if (input.changePointsFeesCompounding) {
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

  const calcCurrency = input.mortgageCurrency;
  const mortgageAmount = amount.value!;

  const feeAmountRaw = fee.blank || fee.value === null ? 0 : fee.value;
  const feeConverted = convertMoney(
    feeAmountRaw,
    input.changePointsFeesCompounding ? input.upfrontFeeCurrency : calcCurrency,
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

  const compounding = input.changePointsFeesCompounding
    ? input.compounding
    : 'monthly_uk_us';
  const pointsPercent =
    input.changePointsFeesCompounding && points.value !== null && !points.blank
      ? points.value
      : 0;

  const computed = calculateBiWeeklyMortgagePayment({
    mortgageAmount,
    termMonths,
    annualRatePercent: rate.value!,
    compounding,
    mortgagePointsPercent: pointsPercent,
    upfrontFee: feeConverted.amount,
    extraPayment: extraConverted.amount,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite amortization schedule.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(calcCurrency);
  const monthly = buildColumn({
    label: 'Monthly payments',
    schedule: computed.monthly,
    closingCosts: computed.closingCosts,
    currency: calcCurrency,
    symbol,
  });
  const biweekly = buildColumn({
    label: 'Bi-weekly',
    schedule: computed.biweekly,
    closingCosts: computed.closingCosts,
    currency: calcCurrency,
    symbol,
  });

  return {
    isValid: true,
    errors: {},
    result: {
      calcCurrency,
      monthly,
      biweekly,
    },
  };
}
