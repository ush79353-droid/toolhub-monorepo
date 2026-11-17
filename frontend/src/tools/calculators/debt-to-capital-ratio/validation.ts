import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateDebtToCapitalRatio,
  formatDebtToCapitalRatio,
} from './calculation';
import type {
  DebtToCapitalRatioFieldErrors,
  DebtToCapitalRatioInput,
  DebtToCapitalRatioResult,
} from './types';

export interface DebtToCapitalRatioValidation {
  isValid: boolean;
  errors: DebtToCapitalRatioFieldErrors;
  result: DebtToCapitalRatioResult | null;
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
 * Validates inputs, normalizes both money fields into the debt currency at full
 * precision, then applies Debt / (Debt + Equity). Currency-only switches that
 * convert amounts leave the ratio economically unchanged.
 */
export function validateDebtToCapitalRatioInput(
  input: DebtToCapitalRatioInput,
  rates?: CurrencyRatesSnapshot | null
): DebtToCapitalRatioValidation {
  const errors: DebtToCapitalRatioFieldErrors = {};

  const debt = parseNumber(input.interestBearingDebt);
  const equity = parseNumber(input.shareholdersEquity);

  if (!debt.blank && (debt.invalid || debt.value === null)) {
    errors.interestBearingDebt = 'Enter a valid interest bearing debt.';
  }

  if (!equity.blank && (equity.invalid || equity.value === null)) {
    errors.shareholdersEquity = 'Enter a valid shareholder’s equity.';
  }

  const incomplete =
    debt.blank || equity.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.interestBearingDebtCurrency;
  const debtNormalized = debt.value!;

  const equityNormalized = convertMoney(
    equity.value!,
    input.shareholdersEquityCurrency,
    calcCurrency,
    rates
  );
  if (!equityNormalized.ok) {
    errors.form = equityNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const totalCapital = debtNormalized + equityNormalized.amount;
  if (!Number.isFinite(totalCapital) || totalCapital === 0) {
    errors.form =
      'Debt plus equity must not be zero (divide-by-zero is not allowed).';
    return { isValid: false, errors, result: null };
  }

  const debtToCapitalRatio = calculateDebtToCapitalRatio({
    interestBearingDebt: debtNormalized,
    shareholdersEquity: equityNormalized.amount,
  });

  if (debtToCapitalRatio === null) {
    errors.form = 'This combination does not produce a finite debt-to-capital ratio.';
    return { isValid: false, errors, result: null };
  }

  const result: DebtToCapitalRatioResult = {
    debtToCapitalRatio,
    interestBearingDebtNormalized: debtNormalized,
    shareholdersEquityNormalized: equityNormalized.amount,
    totalCapitalNormalized: totalCapital,
    calcCurrency,
    formattedDebtToCapitalRatio: formatDebtToCapitalRatio(debtToCapitalRatio),
  };

  return { isValid: true, errors: {}, result };
}
