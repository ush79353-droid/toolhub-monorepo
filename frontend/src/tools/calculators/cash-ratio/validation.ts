import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateCashRatio, formatCashRatioMultiple } from './calculation';
import type {
  CashRatioFieldErrors,
  CashRatioInput,
  CashRatioResult,
} from './types';

export interface CashRatioValidation {
  isValid: boolean;
  errors: CashRatioFieldErrors;
  result: CashRatioResult | null;
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
 * Normalize cash into the current-liabilities currency, then divide.
 * The dimensionless cash ratio is never FX-converted.
 */
export function validateCashRatioInput(
  input: CashRatioInput,
  rates?: CurrencyRatesSnapshot | null
): CashRatioValidation {
  const errors: CashRatioFieldErrors = {};
  const cash = parseNumber(input.cashAndEquivalents);
  const liabilities = parseNumber(input.currentLiabilities);

  if (!cash.blank && (cash.invalid || cash.value === null)) {
    errors.cashAndEquivalents = 'Enter a valid cash and cash equivalents amount.';
  } else if (!cash.blank && cash.value !== null && cash.value < 0) {
    errors.cashAndEquivalents = 'Cash and cash equivalents cannot be negative.';
  }

  if (!liabilities.blank && (liabilities.invalid || liabilities.value === null)) {
    errors.currentLiabilities = 'Enter a valid current liabilities amount.';
  } else if (!liabilities.blank && liabilities.value !== null && !(liabilities.value > 0)) {
    errors.currentLiabilities = 'Current liabilities must be greater than zero.';
  }

  const incomplete =
    cash.blank || liabilities.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.liabilitiesCurrency;
  const cashInCalc = convertMoney(
    cash.value!,
    input.cashCurrency,
    calcCurrency,
    rates
  );
  if (!cashInCalc.ok) {
    errors.form = cashInCalc.message;
    return { isValid: false, errors, result: null };
  }

  const ratio = calculateCashRatio(cashInCalc.amount, liabilities.value!);
  if (ratio === null) {
    errors.form = 'This combination does not produce a finite cash ratio.';
    return { isValid: false, errors, result: null };
  }

  const formattedCashRatio = formatCashRatioMultiple(ratio);
  const result: CashRatioResult = {
    cashNormalized: cashInCalc.amount,
    liabilitiesNormalized: liabilities.value!,
    cashRatio: ratio,
    calcCurrency,
    formattedCashRatio,
    summaryText: `Cash ratio = ${formattedCashRatio}x (cash ÷ current liabilities).`,
  };

  return { isValid: true, errors: {}, result };
}
