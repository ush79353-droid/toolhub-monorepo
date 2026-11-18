import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateEbitdaMargin, formatEbitdaMarginPercent } from './calculation';
import type {
  EbitdaMarginFieldErrors,
  EbitdaMarginInput,
  EbitdaMarginResult,
} from './types';

export interface EbitdaMarginValidation {
  isValid: boolean;
  errors: EbitdaMarginFieldErrors;
  result: EbitdaMarginResult | null;
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
 * Validates inputs, normalizes EBITDA into the total-revenues currency at full
 * precision, then computes margin %. Currency-only switches that convert amounts
 * leave the margin economically unchanged.
 */
export function validateEbitdaMarginInput(
  input: EbitdaMarginInput,
  rates?: CurrencyRatesSnapshot | null
): EbitdaMarginValidation {
  const errors: EbitdaMarginFieldErrors = {};

  const revenues = parseNumber(input.totalRevenues);
  const ebitda = parseNumber(input.ebitda);

  if (!revenues.blank && (revenues.invalid || revenues.value === null)) {
    errors.totalRevenues = 'Enter a valid total revenues amount.';
  } else if (
    !revenues.blank &&
    revenues.value !== null &&
    !(revenues.value !== 0)
  ) {
    errors.totalRevenues = 'Total revenues must be nonzero.';
  }

  if (!ebitda.blank && (ebitda.invalid || ebitda.value === null)) {
    errors.ebitda = 'Enter a valid EBITDA amount.';
  }

  const incomplete =
    revenues.blank || ebitda.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.totalRevenuesCurrency;
  const revenuesNormalized = revenues.value!;

  const ebitdaNormalized = convertMoney(
    ebitda.value!,
    input.ebitdaCurrency,
    calcCurrency,
    rates
  );
  if (!ebitdaNormalized.ok) {
    errors.form = ebitdaNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const marginPercent = calculateEbitdaMargin({
    ebitda: ebitdaNormalized.amount,
    totalRevenues: revenuesNormalized,
  });

  if (marginPercent === null) {
    errors.form = 'This combination does not produce a finite EBITDA margin.';
    return { isValid: false, errors, result: null };
  }

  const result: EbitdaMarginResult = {
    marginPercent,
    ebitdaNormalized: ebitdaNormalized.amount,
    revenuesNormalized,
    calcCurrency,
    formattedMarginPercent: formatEbitdaMarginPercent(marginPercent),
  };

  return { isValid: true, errors: {}, result };
}
