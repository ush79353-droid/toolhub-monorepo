import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateDebtToAssetsRatioPercent,
  calculateTotalDebt,
  formatDebtMoneyAmount,
  formatRatioPercent,
} from './calculation';
import type {
  DebtToAssetRatioFieldErrors,
  DebtToAssetRatioInput,
  DebtToAssetRatioResult,
} from './types';

export interface DebtToAssetRatioValidation {
  isValid: boolean;
  errors: DebtToAssetRatioFieldErrors;
  result: DebtToAssetRatioResult | null;
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
 * Normalizes long-term and short-term debt into the total-assets currency,
 * sums total debt, converts that sum into `totalDebtCurrency` for display,
 * then computes the ratio. Percentages are never FX-converted.
 */
export function validateDebtToAssetRatioInput(
  input: DebtToAssetRatioInput,
  rates?: CurrencyRatesSnapshot | null
): DebtToAssetRatioValidation {
  const errors: DebtToAssetRatioFieldErrors = {};
  const longTerm = parseNumber(input.longTermDebt);
  const shortTerm = parseNumber(input.shortTermDebt);
  const assets = parseNumber(input.totalAssets);

  if (!longTerm.blank && (longTerm.invalid || longTerm.value === null)) {
    errors.longTermDebt = 'Enter a valid long-term debt amount.';
  } else if (!longTerm.blank && longTerm.value !== null && longTerm.value < 0) {
    errors.longTermDebt = 'Long-term debt cannot be negative.';
  }

  if (!shortTerm.blank && (shortTerm.invalid || shortTerm.value === null)) {
    errors.shortTermDebt = 'Enter a valid short-term debt amount.';
  } else if (!shortTerm.blank && shortTerm.value !== null && shortTerm.value < 0) {
    errors.shortTermDebt = 'Short-term debt cannot be negative.';
  }

  if (!assets.blank && (assets.invalid || assets.value === null)) {
    errors.totalAssets = 'Enter a valid total assets amount.';
  } else if (!assets.blank && assets.value !== null && !(assets.value > 0)) {
    errors.totalAssets = 'Total assets must be greater than zero.';
  }

  const incomplete =
    longTerm.blank ||
    shortTerm.blank ||
    assets.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.totalAssetsCurrency;

  const longInCalc = convertMoney(
    longTerm.value!,
    input.longTermDebtCurrency,
    calcCurrency,
    rates
  );
  if (!longInCalc.ok) {
    errors.form = longInCalc.message;
    return { isValid: false, errors, result: null };
  }

  const shortInCalc = convertMoney(
    shortTerm.value!,
    input.shortTermDebtCurrency,
    calcCurrency,
    rates
  );
  if (!shortInCalc.ok) {
    errors.form = shortInCalc.message;
    return { isValid: false, errors, result: null };
  }

  const totalDebtInCalc = calculateTotalDebt(
    longInCalc.amount,
    shortInCalc.amount
  );
  if (totalDebtInCalc === null) {
    errors.form = 'This combination does not produce a finite total debt.';
    return { isValid: false, errors, result: null };
  }

  const totalDebtDisplayed = convertMoney(
    totalDebtInCalc,
    calcCurrency,
    input.totalDebtCurrency,
    rates
  );
  if (!totalDebtDisplayed.ok) {
    errors.form = totalDebtDisplayed.message;
    return { isValid: false, errors, result: null };
  }

  const ratio = calculateDebtToAssetsRatioPercent(
    totalDebtInCalc,
    assets.value!
  );
  if (ratio === null) {
    errors.form = 'This combination does not produce a finite debt-to-assets ratio.';
    return { isValid: false, errors, result: null };
  }

  const result: DebtToAssetRatioResult = {
    totalDebtInCalc,
    totalDebtDisplayed: totalDebtDisplayed.amount,
    totalAssetsNormalized: assets.value!,
    debtToAssetsRatioPercent: ratio,
    calcCurrency,
    totalDebtCurrency: input.totalDebtCurrency,
    formattedTotalDebt: formatDebtMoneyAmount(
      totalDebtDisplayed.amount,
      input.totalDebtCurrency
    ),
    formattedRatioPercent: formatRatioPercent(ratio),
  };

  return { isValid: true, errors: {}, result };
}
