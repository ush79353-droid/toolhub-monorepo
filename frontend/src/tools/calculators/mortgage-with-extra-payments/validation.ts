import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  calculateMortgageWithExtraPayments,
  formatDisplayDate,
  formatMoneyAmount,
  formatSignedMoneyAmount,
  formatTermYearsMonths,
  termToMonths,
} from './calculation';
import type {
  DifferenceColumn,
  MortgageWithExtraPaymentsFieldErrors,
  MortgageWithExtraPaymentsInput,
  MortgageWithExtraPaymentsResult,
  ScheduleColumn,
} from './types';

export interface MortgageWithExtraPaymentsValidation {
  isValid: boolean;
  errors: MortgageWithExtraPaymentsFieldErrors;
  result: MortgageWithExtraPaymentsResult | null;
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

function isValidIsoDate(raw: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return false;
  const [y, m, d] = raw.trim().split('-').map(Number);
  const utc = new Date(Date.UTC(y!, m! - 1, d!));
  return (
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() === m! - 1 &&
    utc.getUTCDate() === d
  );
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

function buildColumn(
  label: string,
  schedule: {
    payoffDate: string;
    periodicPayment: number;
    freqLabel: string;
    paymentCount: number;
    termYears: number;
    termMonths: number;
    totalInterest: number;
    totalOfPayments: number;
  },
  currency: SupportedCurrency,
  symbol: string
): ScheduleColumn {
  return {
    label,
    payoffDate: schedule.payoffDate,
    formattedPayoffDate: formatDisplayDate(schedule.payoffDate),
    periodicPayment: schedule.periodicPayment,
    formattedPayment: `${symbol}${formatMoneyAmount(schedule.periodicPayment, currency)}`,
    freqLabel: schedule.freqLabel,
    paymentCount: schedule.paymentCount,
    termYears: schedule.termYears,
    termMonths: schedule.termMonths,
    formattedTerm: formatTermYearsMonths(schedule.termYears, schedule.termMonths),
    totalInterest: schedule.totalInterest,
    formattedInterest: `${symbol}${formatMoneyAmount(schedule.totalInterest, currency)}`,
    totalPayment: schedule.totalOfPayments,
    formattedTotalPayment: `${symbol}${formatMoneyAmount(schedule.totalOfPayments, currency)}`,
  };
}

/**
 * Validates inputs, converts periodic/lump money into the mortgage currency,
 * then compares original monthly vs accelerated/extra schedule.
 */
export function validateMortgageWithExtraPaymentsInput(
  input: MortgageWithExtraPaymentsInput,
  rates?: CurrencyRatesSnapshot | null
): MortgageWithExtraPaymentsValidation {
  const errors: MortgageWithExtraPaymentsFieldErrors = {};

  const amount = parseNumber(input.mortgageAmount);
  const rate = parseNumber(input.interestRatePercent);
  const term = parseNumber(input.loanTerm);
  const periodic = parseNumber(input.periodicExtra);
  const lump = parseNumber(input.lumpSum);

  if (amount.blank || amount.invalid || amount.value === null) {
    errors.mortgageAmount = 'Enter a valid mortgage amount.';
  } else if (!(amount.value > 0)) {
    errors.mortgageAmount = 'Mortgage amount must be greater than zero.';
  }

  if (rate.blank || rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (term.blank || term.invalid || term.value === null) {
    errors.loanTerm = 'Enter a valid loan term.';
  } else if (!(term.value > 0)) {
    errors.loanTerm = 'Loan term must be greater than zero.';
  }

  if (!isValidIsoDate(input.dueDate)) {
    errors.dueDate = 'Enter a valid due date.';
  }
  if (!isValidIsoDate(input.periodicStartDate)) {
    errors.periodicStartDate = 'Enter a valid start date.';
  }
  if (!isValidIsoDate(input.lumpSumDate)) {
    errors.lumpSumDate = 'Enter a valid payment date.';
  }

  if (periodic.blank) {
    // treat as 0
  } else if (periodic.invalid || periodic.value === null) {
    errors.periodicExtra = 'Enter a valid periodic extra payment.';
  } else if (periodic.value < 0) {
    errors.periodicExtra = 'Periodic extra payment cannot be negative.';
  }

  if (lump.blank) {
    // treat as 0
  } else if (lump.invalid || lump.value === null) {
    errors.lumpSum = 'Enter a valid lump-sum prepayment.';
  } else if (lump.value < 0) {
    errors.lumpSum = 'Lump-sum prepayment cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const termMonths = termToMonths(term.value!, input.termUnit);
  if (termMonths === null) {
    errors.loanTerm = 'Loan term must produce at least one payment period.';
    return { isValid: false, errors, result: null };
  }

  const periodicRaw =
    periodic.blank || periodic.value === null ? 0 : periodic.value;
  const lumpRaw = lump.blank || lump.value === null ? 0 : lump.value;

  const periodicConverted = convertMoney(
    periodicRaw,
    input.periodicCurrency,
    input.mortgageCurrency,
    rates
  );
  if (!periodicConverted.ok) {
    errors.form = periodicConverted.message;
    return { isValid: false, errors, result: null };
  }

  const lumpConverted = convertMoney(
    lumpRaw,
    input.lumpSumCurrency,
    input.mortgageCurrency,
    rates
  );
  if (!lumpConverted.ok) {
    errors.form = lumpConverted.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateMortgageWithExtraPayments({
    mortgageAmount: amount.value!,
    annualRatePercent: rate.value!,
    termMonths,
    interestMethod: input.interestMethod,
    paymentFrequency: input.paymentFrequency,
    dueDate: input.dueDate.trim(),
    periodicExtra: periodicConverted.amount,
    periodicStartDate: input.periodicStartDate.trim(),
    lumpSum: lumpConverted.amount,
    lumpSumDate: input.lumpSumDate.trim(),
    currency: input.mortgageCurrency,
  });

  if (!computed) {
    errors.form =
      'Unable to build a finite amortization schedule for these inputs.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(computed.currency);
  const original = buildColumn(
    'Original',
    computed.original,
    computed.currency,
    symbol
  );
  const withExtra = buildColumn(
    'With extra',
    computed.withExtra,
    computed.currency,
    symbol
  );

  const difference: DifferenceColumn = {
    formattedPayoff: formatTermYearsMonths(
      computed.termSavedYears,
      computed.termSavedMonths
    ),
    formattedPayment: `${symbol}${formatSignedMoneyAmount(computed.paymentDifference, computed.currency)}`,
    formattedFreq: '—',
    formattedTerm: formatTermYearsMonths(
      computed.termSavedYears,
      computed.termSavedMonths
    ),
    formattedInterest: `${symbol}${formatSignedMoneyAmount(computed.interestDifference, computed.currency)}`,
    formattedTotalPayment: `${symbol}${formatSignedMoneyAmount(computed.totalPaymentDifference, computed.currency)}`,
  };

  const result: MortgageWithExtraPaymentsResult = {
    currency: computed.currency,
    original,
    withExtra,
    difference,
  };

  return { isValid: true, errors: {}, result };
}
