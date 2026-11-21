import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateFreeCashFlow,
  formatFcfMoney,
  formatFcfPercent,
} from './calculation';
import type {
  FreeCashFlowFieldErrors,
  FreeCashFlowInput,
  FreeCashFlowResult,
} from './types';

export interface FreeCashFlowValidation {
  isValid: boolean;
  errors: FreeCashFlowFieldErrors;
  result: FreeCashFlowResult | null;
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
 * Validates inputs, normalizes money into the FCF currency with stored FX rates,
 * then computes FCF, optional per-share / yield / margin. Shares and % never
 * convert. Yield uses market cap only — stock price alone does not invent
 * market cap. Soft consistency note when price × shares ≠ market cap.
 */
export function validateFreeCashFlowInput(
  input: FreeCashFlowInput,
  rates?: CurrencyRatesSnapshot | null
): FreeCashFlowValidation {
  const errors: FreeCashFlowFieldErrors = {};

  const ocf = parseNumber(input.operatingCashFlow);
  const capex = parseNumber(input.capex);
  const shares = parseNumber(input.sharesOutstanding);
  const stockPrice = parseNumber(input.stockPrice);
  const marketCap = parseNumber(input.marketCap);
  const revenue = parseNumber(input.revenue);

  if (ocf.blank || ocf.invalid || ocf.value === null) {
    errors.operatingCashFlow = 'Enter a valid operating cash flow.';
  }

  if (capex.blank || capex.invalid || capex.value === null) {
    errors.capex = 'Enter a valid capital expenditures amount.';
  }

  if (!shares.blank && (shares.invalid || shares.value === null)) {
    errors.sharesOutstanding = 'Enter a valid shares outstanding count.';
  } else if (!shares.blank && shares.value !== null && !(shares.value > 0)) {
    errors.sharesOutstanding = 'Shares outstanding must be greater than zero.';
  }

  if (!stockPrice.blank && (stockPrice.invalid || stockPrice.value === null)) {
    errors.stockPrice = 'Enter a valid stock price.';
  } else if (
    !stockPrice.blank &&
    stockPrice.value !== null &&
    !(stockPrice.value > 0)
  ) {
    errors.stockPrice = 'Stock price must be greater than zero.';
  }

  if (!marketCap.blank && (marketCap.invalid || marketCap.value === null)) {
    errors.marketCap = 'Enter a valid market capitalization.';
  } else if (
    !marketCap.blank &&
    marketCap.value !== null &&
    !(marketCap.value > 0)
  ) {
    errors.marketCap = 'Market capitalization must be greater than zero.';
  }

  if (!revenue.blank && (revenue.invalid || revenue.value === null)) {
    errors.revenue = 'Enter a valid revenue amount.';
  } else if (!revenue.blank && revenue.value !== null && !(revenue.value > 0)) {
    errors.revenue = 'Revenue must be greater than zero.';
  }

  if (
    Boolean(errors.operatingCashFlow) ||
    Boolean(errors.capex)
  ) {
    return { isValid: false, errors, result: null };
  }

  const target = input.fcfCurrency;

  const ocfNorm = convertMoney(
    ocf.value!,
    input.operatingCashFlowCurrency,
    target,
    rates
  );
  if (!ocfNorm.ok) {
    errors.form = ocfNorm.message;
    return { isValid: false, errors, result: null };
  }

  const capexNorm = convertMoney(
    capex.value!,
    input.capexCurrency,
    target,
    rates
  );
  if (!capexNorm.ok) {
    errors.form = capexNorm.message;
    return { isValid: false, errors, result: null };
  }

  let marketCapInFcf: number | null = null;
  if (!marketCap.blank && !errors.marketCap && marketCap.value !== null) {
    const mcNorm = convertMoney(
      marketCap.value,
      input.marketCapCurrency,
      target,
      rates
    );
    if (!mcNorm.ok) {
      errors.form = mcNorm.message;
      return { isValid: false, errors, result: null };
    }
    marketCapInFcf = mcNorm.amount;
  }

  let revenueInFcf: number | null = null;
  if (!revenue.blank && !errors.revenue && revenue.value !== null) {
    const revNorm = convertMoney(
      revenue.value,
      input.revenueCurrency,
      target,
      rates
    );
    if (!revNorm.ok) {
      errors.form = revNorm.message;
      return { isValid: false, errors, result: null };
    }
    revenueInFcf = revNorm.amount;
  }

  let stockPriceInFcf: number | null = null;
  if (!stockPrice.blank && !errors.stockPrice && stockPrice.value !== null) {
    const spNorm = convertMoney(
      stockPrice.value,
      input.stockPriceCurrency,
      target,
      rates
    );
    if (!spNorm.ok) {
      errors.form = spNorm.message;
      return { isValid: false, errors, result: null };
    }
    stockPriceInFcf = spNorm.amount;
  }

  const sharesValue =
    !shares.blank && !errors.sharesOutstanding && shares.value !== null
      ? shares.value
      : null;

  const computed = calculateFreeCashFlow({
    operatingCashFlow: ocfNorm.amount,
    capex: capexNorm.amount,
    sharesOutstanding: sharesValue,
    marketCap: marketCapInFcf,
    revenue: revenueInFcf,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  // Soft consistency: price × shares vs market cap (never invents market cap).
  let consistencyNote: string | null = null;
  if (
    stockPriceInFcf !== null &&
    sharesValue !== null &&
    marketCapInFcf !== null &&
    stockPriceInFcf > 0 &&
    sharesValue > 0 &&
    marketCapInFcf > 0
  ) {
    const implied = stockPriceInFcf * sharesValue;
    const denom = Math.max(Math.abs(marketCapInFcf), Math.abs(implied), 1);
    const relativeDiff = Math.abs(implied - marketCapInFcf) / denom;
    if (relativeDiff > 0.02) {
      consistencyNote =
        'Stock price × shares differs from market capitalization. Yield still uses market cap; price alone does not replace it.';
    }
  }

  const result: FreeCashFlowResult = {
    fcf: computed.fcf,
    currency: target,
    formattedFcf: formatFcfMoney(computed.fcf, target),
    fcfPerShare: computed.fcfPerShare,
    formattedFcfPerShare:
      computed.fcfPerShare !== null
        ? formatFcfMoney(computed.fcfPerShare, target)
        : null,
    fcfYieldPercent: computed.fcfYieldPercent,
    formattedFcfYieldPercent:
      computed.fcfYieldPercent !== null
        ? formatFcfPercent(computed.fcfYieldPercent)
        : null,
    fcfMarginPercent: computed.fcfMarginPercent,
    formattedFcfMarginPercent:
      computed.fcfMarginPercent !== null
        ? formatFcfPercent(computed.fcfMarginPercent)
        : null,
    consistencyNote,
  };

  return { isValid: true, errors, result };
}
