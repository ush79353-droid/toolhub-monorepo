import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateCostOfEquity,
  calculateDdmStockValue,
  calculateExpectedDividend,
  calculateExpectedGrowthRate,
  formatDdmMoney,
  formatDdmPercent,
} from './calculation';
import type {
  DividendDiscountModelFieldErrors,
  DividendDiscountModelInput,
  DividendDiscountModelResult,
} from './types';

export interface DividendDiscountModelValidation {
  isValid: boolean;
  errors: DividendDiscountModelFieldErrors;
  result: DividendDiscountModelResult | null;
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
 * Validates inputs, computes DDM in dividend currency at full precision,
 * then converts D₁ and P₀ into their independent display currencies.
 */
export function validateDividendDiscountModelInput(
  input: DividendDiscountModelInput,
  rates?: CurrencyRatesSnapshot | null
): DividendDiscountModelValidation {
  const errors: DividendDiscountModelFieldErrors = {};

  const payout = parseNumber(input.dividendPayoutRatioPercent);
  const roe = parseNumber(input.returnOnEquityPercent);
  const dividend = parseNumber(input.dividendPerShare);
  const rf = parseNumber(input.riskFreeRatePercent);
  const mrp = parseNumber(input.marketRiskPremiumPercent);
  const beta = parseNumber(input.beta);

  if (!payout.blank && (payout.invalid || payout.value === null)) {
    errors.dividendPayoutRatioPercent = 'Enter a valid dividend payout ratio.';
  } else if (
    !payout.blank &&
    payout.value !== null &&
    (payout.value < 0 || payout.value > 100)
  ) {
    errors.dividendPayoutRatioPercent = 'Dividend payout ratio must be between 0% and 100%.';
  }

  if (!roe.blank && (roe.invalid || roe.value === null)) {
    errors.returnOnEquityPercent = 'Enter a valid return on equity.';
  }

  if (!dividend.blank && (dividend.invalid || dividend.value === null)) {
    errors.dividendPerShare = 'Enter a valid dividend per share.';
  } else if (!dividend.blank && dividend.value !== null && dividend.value < 0) {
    errors.dividendPerShare = 'Dividend per share cannot be negative.';
  }

  if (!rf.blank && (rf.invalid || rf.value === null)) {
    errors.riskFreeRatePercent = 'Enter a valid risk-free rate.';
  }

  if (!mrp.blank && (mrp.invalid || mrp.value === null)) {
    errors.marketRiskPremiumPercent = 'Enter a valid market risk premium.';
  }

  if (!beta.blank && (beta.invalid || beta.value === null)) {
    errors.beta = 'Enter a valid beta.';
  }

  const incomplete =
    payout.blank ||
    roe.blank ||
    dividend.blank ||
    rf.blank ||
    mrp.blank ||
    beta.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const payoutDecimal = payout.value! / 100;
  const roeDecimal = roe.value! / 100;
  const rfDecimal = rf.value! / 100;
  const mrpDecimal = mrp.value! / 100;

  const g = calculateExpectedGrowthRate({
    payoutRatioDecimal: payoutDecimal,
    roeDecimal,
  });
  if (g === null) {
    errors.form = 'This combination does not produce a finite growth rate.';
    return { isValid: false, errors, result: null };
  }

  const d1InDividend = calculateExpectedDividend({
    dividendPerShare: dividend.value!,
    growthRateDecimal: g,
  });
  if (d1InDividend === null) {
    errors.form = 'This combination does not produce a finite expected dividend.';
    return { isValid: false, errors, result: null };
  }

  const ke = calculateCostOfEquity({
    riskFreeRateDecimal: rfDecimal,
    marketRiskPremiumDecimal: mrpDecimal,
    beta: beta.value!,
  });
  if (ke === null) {
    errors.form = 'This combination does not produce a finite cost of equity.';
    return { isValid: false, errors, result: null };
  }

  if (!(ke > g)) {
    errors.form =
      'Cost of equity must be greater than the expected growth rate for a valid constant-growth DDM valuation.';
    return { isValid: false, errors, result: null };
  }

  const p0InDividend = calculateDdmStockValue({
    expectedDividend: d1InDividend,
    costOfEquityDecimal: ke,
    growthRateDecimal: g,
  });
  if (p0InDividend === null) {
    errors.form = 'This combination does not produce a finite stock value.';
    return { isValid: false, errors, result: null };
  }

  const d1Display = convertMoney(
    d1InDividend,
    input.dividendCurrency,
    input.expectedDividendCurrency,
    rates
  );
  if (!d1Display.ok) {
    errors.form = d1Display.message;
    return { isValid: false, errors, result: null };
  }

  const p0Display = convertMoney(
    p0InDividend,
    input.dividendCurrency,
    input.stockValueCurrency,
    rates
  );
  if (!p0Display.ok) {
    errors.form = p0Display.message;
    return { isValid: false, errors, result: null };
  }

  const growthRatePercent = g * 100;
  const costOfEquityPercent = ke * 100;

  const result: DividendDiscountModelResult = {
    growthRatePercent,
    formattedGrowthRatePercent: formatDdmPercent(growthRatePercent),
    expectedDividendInDividendCurrency: d1InDividend,
    expectedDividend: d1Display.amount,
    expectedDividendCurrency: input.expectedDividendCurrency,
    formattedExpectedDividend: formatDdmMoney(
      d1Display.amount,
      input.expectedDividendCurrency
    ),
    costOfEquityPercent,
    formattedCostOfEquityPercent: formatDdmPercent(costOfEquityPercent),
    stockValueInDividendCurrency: p0InDividend,
    stockValue: p0Display.amount,
    stockValueCurrency: input.stockValueCurrency,
    formattedStockValue: formatDdmMoney(p0Display.amount, input.stockValueCurrency),
  };

  return { isValid: true, errors: {}, result };
}
