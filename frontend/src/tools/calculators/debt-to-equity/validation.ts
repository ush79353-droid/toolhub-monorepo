import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateDebtToEquityRatio, formatDebtToEquityRatio } from './calculation';
import type {
  DebtToEquityFieldErrors,
  DebtToEquityInput,
  DebtToEquityResult,
} from './types';

export interface DebtToEquityValidation {
  isValid: boolean;
  errors: DebtToEquityFieldErrors;
  result: DebtToEquityResult | null;
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
 * Validates inputs, normalizes equity into the liabilities currency at full
 * precision, then divides. Currency-only switches that convert amounts leave the
 * D/E ratio economically unchanged.
 */
export function validateDebtToEquityInput(
  input: DebtToEquityInput,
  rates?: CurrencyRatesSnapshot | null
): DebtToEquityValidation {
  const errors: DebtToEquityFieldErrors = {};

  const liabilities = parseNumber(input.totalLiabilities);
  const equity = parseNumber(input.stockholdersEquity);

  if (!liabilities.blank && (liabilities.invalid || liabilities.value === null)) {
    errors.totalLiabilities = 'Enter a valid total liabilities amount.';
  }

  if (!equity.blank && (equity.invalid || equity.value === null)) {
    errors.stockholdersEquity = "Enter a valid stockholders' equity amount.";
  } else if (!equity.blank && equity.value !== null && equity.value === 0) {
    errors.stockholdersEquity = "Stockholders' equity must be nonzero.";
  }

  const incomplete =
    liabilities.blank || equity.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.totalLiabilitiesCurrency;
  const liabilitiesNormalized = liabilities.value!;

  const equityNormalized = convertMoney(
    equity.value!,
    input.stockholdersEquityCurrency,
    calcCurrency,
    rates
  );
  if (!equityNormalized.ok) {
    errors.form = equityNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const debtToEquityRatio = calculateDebtToEquityRatio({
    totalLiabilities: liabilitiesNormalized,
    stockholdersEquity: equityNormalized.amount,
  });

  if (debtToEquityRatio === null) {
    errors.form = 'This combination does not produce a finite debt-to-equity ratio.';
    return { isValid: false, errors, result: null };
  }

  const result: DebtToEquityResult = {
    debtToEquityRatio,
    liabilitiesNormalized,
    equityNormalized: equityNormalized.amount,
    calcCurrency,
    formattedRatio: formatDebtToEquityRatio(debtToEquityRatio),
  };

  return { isValid: true, errors: {}, result };
}
