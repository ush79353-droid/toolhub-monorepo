import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateInterestCoverageRatio,
  formatCoverageRatio,
} from './calculation';
import type {
  InterestCoverageRatioFieldErrors,
  InterestCoverageRatioInput,
  InterestCoverageRatioResult,
} from './types';

export interface InterestCoverageRatioValidation {
  isValid: boolean;
  errors: InterestCoverageRatioFieldErrors;
  result: InterestCoverageRatioResult | null;
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
 * Validates inputs, normalizes both money fields into the EBIT currency at full
 * precision, then divides. Currency-only switches that convert amounts leave the
 * coverage ratio economically unchanged.
 */
export function validateInterestCoverageRatioInput(
  input: InterestCoverageRatioInput,
  rates?: CurrencyRatesSnapshot | null
): InterestCoverageRatioValidation {
  const errors: InterestCoverageRatioFieldErrors = {};

  const ebit = parseNumber(input.ebit);
  const interest = parseNumber(input.interestExpense);

  if (!ebit.blank && (ebit.invalid || ebit.value === null)) {
    errors.ebit = 'Enter a valid EBIT amount.';
  }

  if (!interest.blank && (interest.invalid || interest.value === null)) {
    errors.interestExpense = 'Enter a valid interest expense.';
  } else if (!interest.blank && interest.value !== null && !(interest.value > 0)) {
    errors.interestExpense = 'Interest expense must be greater than zero.';
  }

  const incomplete =
    ebit.blank || interest.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.ebitCurrency;
  const ebitNormalized = ebit.value!;

  const interestNormalized = convertMoney(
    interest.value!,
    input.interestExpenseCurrency,
    calcCurrency,
    rates
  );
  if (!interestNormalized.ok) {
    errors.form = interestNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const coverageRatio = calculateInterestCoverageRatio({
    ebit: ebitNormalized,
    interestExpense: interestNormalized.amount,
  });

  if (coverageRatio === null) {
    errors.form = 'This combination does not produce a finite coverage ratio.';
    return { isValid: false, errors, result: null };
  }

  const result: InterestCoverageRatioResult = {
    coverageRatio,
    ebitNormalized,
    interestExpenseNormalized: interestNormalized.amount,
    calcCurrency,
    formattedCoverageRatio: formatCoverageRatio(coverageRatio),
  };

  return { isValid: true, errors: {}, result };
}
