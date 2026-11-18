import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMortgagePrepayment,
  termToPeriods,
} from './calculation';
import {
  PAYMENT_FREQUENCY_OPTIONS,
  type MortgagePrepaymentFieldErrors,
  type MortgagePrepaymentInput,
  type MortgagePrepaymentResult,
} from './types';

export interface MortgagePrepaymentValidation {
  isValid: boolean;
  errors: MortgagePrepaymentFieldErrors;
  result: MortgagePrepaymentResult | null;
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

/**
 * Validates inputs, normalizes independent money fields into the mortgage
 * currency at full precision, then compares baseline vs prepaid schedules.
 */
export function validateMortgagePrepaymentInput(
  input: MortgagePrepaymentInput,
  rates?: CurrencyRatesSnapshot | null
): MortgagePrepaymentValidation {
  const errors: MortgagePrepaymentFieldErrors = {};

  const amount = parseNumber(input.mortgageAmount);
  const rate = parseNumber(input.interestRatePercent);
  const term = parseNumber(input.loanTerm);
  const periodic = parseNumber(input.periodicPrepayment);
  const lump = parseNumber(input.lumpSumPrepayment);

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
    errors.periodicPrepayment = 'Enter a valid periodic prepayment.';
  } else if (periodic.value < 0) {
    errors.periodicPrepayment = 'Periodic prepayment cannot be negative.';
  }

  if (lump.blank) {
    // treat as 0
  } else if (lump.invalid || lump.value === null) {
    errors.lumpSumPrepayment = 'Enter a valid lump-sum prepayment.';
  } else if (lump.value < 0) {
    errors.lumpSumPrepayment = 'Lump-sum prepayment cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const periodsPerYear =
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === input.paymentFrequency)
      ?.periodsPerYear ?? 12;
  const termPeriods = termToPeriods(term.value!, input.termUnit, periodsPerYear);
  if (termPeriods === null) {
    errors.loanTerm = 'Loan term must produce at least one payment period.';
    return { isValid: false, errors, result: null };
  }

  const periodicRaw = periodic.blank || periodic.value === null ? 0 : periodic.value;
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

  const computed = calculateMortgagePrepayment({
    mortgageAmount: amount.value!,
    annualRatePercent: rate.value!,
    termPeriods,
    interestMethod: input.interestMethod,
    paymentFrequency: input.paymentFrequency,
    dueDate: input.dueDate.trim(),
    periodicPrepayment: periodicConverted.amount,
    periodicStartDate: input.periodicStartDate.trim(),
    lumpSumPrepayment: lumpConverted.amount,
    lumpSumDate: input.lumpSumDate.trim(),
    currency: input.mortgageCurrency,
  });

  if (!computed) {
    errors.form =
      'Unable to build a finite amortization schedule for these inputs.';
    return { isValid: false, errors, result: null };
  }

  const result: MortgagePrepaymentResult = {
    currency: computed.currency,
    hasPrepayments: computed.hasPrepayments,
    baseline: computed.baseline,
    prepaid: computed.prepaid,
    chart: computed.chart,
  };

  return { isValid: true, errors: {}, result };
}
