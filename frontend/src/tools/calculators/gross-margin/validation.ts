import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateGrossMargin,
  formatGrossMarginMoney,
  formatGrossMarginPercent,
} from './calculation';
import type {
  GrossMarginFieldErrors,
  GrossMarginInput,
  GrossMarginResult,
} from './types';

export interface GrossMarginValidation {
  isValid: boolean;
  errors: GrossMarginFieldErrors;
  result: GrossMarginResult | null;
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
 * Normalize COGS into the revenue currency, compute profit and margin at full
 * precision, then convert profit into the independent display currency.
 * Currency-only switches that convert amounts leave the margin unchanged.
 */
export function validateGrossMarginInput(
  input: GrossMarginInput,
  rates?: CurrencyRatesSnapshot | null
): GrossMarginValidation {
  const errors: GrossMarginFieldErrors = {};

  const revenue = parseNumber(input.revenue);
  const cogs = parseNumber(input.cogs);

  if (!revenue.blank && (revenue.invalid || revenue.value === null)) {
    errors.revenue = 'Enter a valid revenue amount.';
  } else if (!revenue.blank && revenue.value !== null && !(revenue.value !== 0)) {
    errors.revenue = 'Revenue must be nonzero.';
  }

  if (!cogs.blank && (cogs.invalid || cogs.value === null)) {
    errors.cogs = 'Enter a valid cost of goods sold.';
  }

  const incomplete = revenue.blank || cogs.blank || Object.keys(errors).length > 0;
  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.revenueCurrency;
  const revenueNormalized = revenue.value!;

  const cogsNormalized = convertMoney(
    cogs.value!,
    input.cogsCurrency,
    calcCurrency,
    rates
  );
  if (!cogsNormalized.ok) {
    errors.form = cogsNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateGrossMargin({
    revenue: revenueNormalized,
    cogs: cogsNormalized.amount,
  });
  if (!computed) {
    errors.form = 'This combination does not produce a finite gross margin.';
    return { isValid: false, errors, result: null };
  }

  const profitDisplay = convertMoney(
    computed.grossProfit,
    calcCurrency,
    input.profitCurrency,
    rates
  );
  if (!profitDisplay.ok) {
    errors.form = profitDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: GrossMarginResult = {
    grossProfit: computed.grossProfit,
    grossProfitDisplay: profitDisplay.amount,
    marginPercent: computed.marginPercent,
    revenueNormalized,
    cogsNormalized: cogsNormalized.amount,
    calcCurrency,
    profitCurrency: input.profitCurrency,
    formattedGrossProfit: formatGrossMarginMoney(
      profitDisplay.amount,
      input.profitCurrency
    ),
    formattedMarginPercent: formatGrossMarginPercent(computed.marginPercent),
  };

  return { isValid: true, errors: {}, result };
}
