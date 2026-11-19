import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateNetProfitMargin,
  formatNetProfitMarginPercent,
} from './calculation';
import type {
  NetProfitMarginFieldErrors,
  NetProfitMarginInput,
  NetProfitMarginResult,
} from './types';

export interface NetProfitMarginValidation {
  isValid: boolean;
  errors: NetProfitMarginFieldErrors;
  result: NetProfitMarginResult | null;
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
 * Normalize net profit into the total-revenues currency, then compute margin at
 * full precision. The margin percent is never currency-converted.
 */
export function validateNetProfitMarginInput(
  input: NetProfitMarginInput,
  rates?: CurrencyRatesSnapshot | null
): NetProfitMarginValidation {
  const errors: NetProfitMarginFieldErrors = {};

  const profit = parseNumber(input.netProfit);
  const revenues = parseNumber(input.totalRevenues);

  if (!profit.blank && (profit.invalid || profit.value === null)) {
    errors.netProfit = 'Enter a valid net profit amount.';
  }

  if (!revenues.blank && (revenues.invalid || revenues.value === null)) {
    errors.totalRevenues = 'Enter a valid total revenues amount.';
  } else if (!revenues.blank && revenues.value !== null && !(revenues.value > 0)) {
    errors.totalRevenues =
      revenues.value < 0
        ? 'Total revenues cannot be negative.'
        : 'Total revenues must be greater than zero.';
  }

  const incomplete =
    profit.blank || revenues.blank || Object.keys(errors).length > 0;
  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.totalRevenuesCurrency;
  const totalRevenuesNormalized = revenues.value!;

  const profitNormalized = convertMoney(
    profit.value!,
    input.netProfitCurrency,
    calcCurrency,
    rates
  );
  if (!profitNormalized.ok) {
    errors.form = profitNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateNetProfitMargin({
    netProfit: profitNormalized.amount,
    totalRevenues: totalRevenuesNormalized,
  });
  if (!computed) {
    errors.form = 'This combination does not produce a finite net profit margin.';
    return { isValid: false, errors, result: null };
  }

  const result: NetProfitMarginResult = {
    netProfitNormalized: profitNormalized.amount,
    totalRevenuesNormalized,
    marginPercent: computed.marginPercent,
    calcCurrency,
    formattedMarginPercent: formatNetProfitMarginPercent(computed.marginPercent),
  };

  return { isValid: true, errors: {}, result };
}
