import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  buildLoanBalanceResult,
  calculateLoanBalanceInLoanCurrency,
} from './calculation';
import type {
  LoanBalanceFieldErrors,
  LoanBalanceInput,
  LoanBalanceResult,
} from './types';

export interface LoanBalanceValidation {
  isValid: boolean;
  errors: LoanBalanceFieldErrors;
  result: LoanBalanceResult | null;
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

/** Blank duration part → 0 when the sibling part is filled. */
function resolveDurationPart(
  part: ReturnType<typeof parseNumber>,
  sibling: ReturnType<typeof parseNumber>
): { value: number | null; blank: boolean; invalid: boolean; error?: string } {
  if (part.blank && sibling.blank) {
    return { value: null, blank: true, invalid: false };
  }
  if (part.blank) {
    return { value: 0, blank: false, invalid: false };
  }
  if (part.invalid || part.value === null) {
    return { value: null, blank: false, invalid: true };
  }
  return { value: part.value, blank: false, invalid: false };
}

/**
 * Validates inputs, computes remaining balance in the loan currency at full
 * precision, then converts into `resultCurrency` before display rounding.
 */
export function validateLoanBalanceInput(
  input: LoanBalanceInput,
  rates?: CurrencyRatesSnapshot | null
): LoanBalanceValidation {
  const errors: LoanBalanceFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const rate = parseNumber(input.interestRatePercent);
  const termYRaw = parseNumber(input.termYears);
  const termMRaw = parseNumber(input.termMonths);
  const periodYRaw = parseNumber(input.periodYears);
  const periodMRaw = parseNumber(input.periodMonths);

  if (!loan.blank && (loan.invalid || loan.value === null)) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!loan.blank && loan.value !== null && !(loan.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  const termY = resolveDurationPart(termYRaw, termMRaw);
  const termM = resolveDurationPart(termMRaw, termYRaw);
  const periodY = resolveDurationPart(periodYRaw, periodMRaw);
  const periodM = resolveDurationPart(periodMRaw, periodYRaw);

  if (termY.invalid) errors.termYears = 'Enter a valid number of years.';
  else if (termY.value !== null && termY.value < 0) {
    errors.termYears = 'Years cannot be negative.';
  }

  if (termM.invalid) errors.termMonths = 'Enter a valid number of months.';
  else if (termM.value !== null && termM.value < 0) {
    errors.termMonths = 'Months cannot be negative.';
  } else if (termM.value !== null && termM.value > 11) {
    errors.termMonths = 'Months must be between 0 and 11.';
  }

  if (
    !termY.blank &&
    !termM.blank &&
    !errors.termYears &&
    !errors.termMonths &&
    termY.value !== null &&
    termM.value !== null &&
    termY.value * 12 + termM.value <= 0
  ) {
    errors.termYears = 'Loan term must be greater than zero.';
  }

  if (periodY.invalid) errors.periodYears = 'Enter a valid number of years.';
  else if (periodY.value !== null && periodY.value < 0) {
    errors.periodYears = 'Years cannot be negative.';
  }

  if (periodM.invalid) errors.periodMonths = 'Enter a valid number of months.';
  else if (periodM.value !== null && periodM.value < 0) {
    errors.periodMonths = 'Months cannot be negative.';
  } else if (periodM.value !== null && periodM.value > 11) {
    errors.periodMonths = 'Months must be between 0 and 11.';
  }

  const incomplete =
    loan.blank ||
    rate.blank ||
    termY.blank ||
    termM.blank ||
    periodY.blank ||
    periodM.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const termMonthsTotal = termY.value! * 12 + termM.value!;
  const elapsedMonths = periodY.value! * 12 + periodM.value!;
  if (elapsedMonths > termMonthsTotal) {
    errors.periodYears = 'Period cannot exceed the loan term.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateLoanBalanceInLoanCurrency({
    loanAmount: loan.value!,
    interestRatePercent: rate.value!,
    termYears: termY.value!,
    termMonths: termM.value!,
    periodYears: periodY.value!,
    periodMonths: periodM.value!,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite remaining balance.';
    return { isValid: false, errors, result: null };
  }

  let remainingInResult = computed.loanRemaining;
  if (input.resultCurrency !== input.currency) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const converted = convertCurrency({
      amount: computed.loanRemaining,
      from: input.currency,
      to: input.resultCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    remainingInResult = converted.amount;
  }

  const result = buildLoanBalanceResult({
    loanRemainingInLoanCurrency: computed.loanRemaining,
    loanRemainingInResultCurrency: remainingInResult,
    monthlyPayment: computed.monthlyPayment,
    termMonthsTotal: computed.termMonthsTotal,
    elapsedMonths: computed.elapsedMonths,
    loanCurrency: input.currency,
    resultCurrency: input.resultCurrency,
  });

  return { isValid: true, errors: {}, result };
}
