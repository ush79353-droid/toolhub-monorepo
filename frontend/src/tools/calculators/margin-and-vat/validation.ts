import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMarginVatCanonical,
  formatMarginVatMoney,
  formatMarginVatPercent,
  type MarginVatSolveError,
} from './calculation';
import type { MarginVatFieldErrors, MarginVatInput, MarginVatResult } from './types';

export interface MarginVatValidation {
  isValid: boolean;
  errors: MarginVatFieldErrors;
  result: MarginVatResult | null;
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

function errorMessage(code: MarginVatSolveError): string {
  switch (code) {
    case 'invalid_vat':
      return 'VAT must be zero or a positive percentage.';
    case 'negative_cost':
      return 'Cost cannot be negative.';
    case 'negative_price':
      return 'Selling price cannot be negative.';
    case 'margin_ge_100':
      return 'Margin must be below 100% when solving selling price from cost.';
    case 'zero_denominator':
      return 'This combination divides by zero or an invalid rate.';
    case 'inconsistent':
      return 'This combination does not produce a valid margin/VAT result.';
    default:
      return 'Enter enough values to calculate.';
  }
}

function displayMoney(
  canonical: number | null,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number | null; formatted: string } | { ok: false; message: string } {
  if (canonical === null) return { ok: true, amount: null, formatted: '' };
  const converted = convertMoney(canonical, from, to, rates);
  if (!converted.ok) return converted;
  return {
    ok: true,
    amount: converted.amount,
    formatted: formatMarginVatMoney(converted.amount, to),
  };
}

export function validateMarginVatInput(
  input: MarginVatInput,
  rates?: CurrencyRatesSnapshot | null
): MarginVatValidation {
  const errors: MarginVatFieldErrors = {};
  const home = input.netCostCurrency;

  const vat = parseNumber(input.vatPercent);
  const netCost = parseNumber(input.netCost);
  const grossCost = parseNumber(input.grossCost);
  const margin = parseNumber(input.marginPercent);
  const markup = parseNumber(input.markupPercent);
  const netPrice = parseNumber(input.netPrice);
  const grossPrice = parseNumber(input.grossPrice);
  const profit = parseNumber(input.profit);

  if (!vat.blank && (vat.invalid || vat.value === null || vat.value < 0)) {
    errors.vatPercent = 'Enter a valid VAT percentage (0 or greater).';
  }

  const moneyChecks: Array<{
    parsed: ReturnType<typeof parseNumber>;
    key: keyof MarginVatFieldErrors;
    label: string;
    allowNegative?: boolean;
  }> = [
    { parsed: netCost, key: 'netCost', label: 'net cost' },
    { parsed: grossCost, key: 'grossCost', label: 'gross cost' },
    { parsed: netPrice, key: 'netPrice', label: 'net price' },
    { parsed: grossPrice, key: 'grossPrice', label: 'gross price' },
    { parsed: profit, key: 'profit', label: 'profit', allowNegative: true },
  ];

  for (const check of moneyChecks) {
    if (check.parsed.blank) continue;
    if (check.parsed.invalid || check.parsed.value === null) {
      errors[check.key] = `Enter a valid ${check.label}.`;
    } else if (!check.allowNegative && check.parsed.value < 0) {
      errors[check.key] = `${check.label[0].toUpperCase()}${check.label.slice(1)} cannot be negative.`;
    }
  }

  if (!margin.blank && (margin.invalid || margin.value === null)) {
    errors.marginPercent = 'Enter a valid margin percentage.';
  }
  if (!markup.blank && (markup.invalid || markup.value === null)) {
    errors.markupPercent = 'Enter a valid markup percentage.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const toHome = (
    amount: number | null,
    from: SupportedCurrency,
    field: keyof MarginVatFieldErrors
  ): number | null => {
    if (amount === null) return null;
    const converted = convertMoney(amount, from, home, rates);
    if (!converted.ok) {
      errors.form = converted.message;
      return null;
    }
    return converted.amount;
  };

  const netCostHome = netCost.blank
    ? null
    : toHome(netCost.value, input.netCostCurrency, 'netCost');
  if (errors.form) return { isValid: false, errors, result: null };

  const grossCostHome = grossCost.blank
    ? null
    : toHome(grossCost.value, input.grossCostCurrency, 'grossCost');
  if (errors.form) return { isValid: false, errors, result: null };

  const netPriceHome = netPrice.blank
    ? null
    : toHome(netPrice.value, input.netPriceCurrency, 'netPrice');
  if (errors.form) return { isValid: false, errors, result: null };

  const grossPriceHome = grossPrice.blank
    ? null
    : toHome(grossPrice.value, input.grossPriceCurrency, 'grossPrice');
  if (errors.form) return { isValid: false, errors, result: null };

  const profitHome = profit.blank
    ? null
    : toHome(profit.value, input.profitCurrency, 'profit');
  if (errors.form) return { isValid: false, errors, result: null };

  const solved = calculateMarginVatCanonical({
    vatPercent: vat.blank ? null : vat.value,
    netCost: netCostHome,
    grossCost: grossCostHome,
    marginPercent: margin.blank ? null : margin.value,
    markupPercent: markup.blank ? null : markup.value,
    netPrice: netPriceHome,
    grossPrice: grossPriceHome,
    profit: profitHome,
    driver: input.driver,
    pricingPin: input.pricingPin,
  });

  if (!solved.ok) {
    if (solved.error === 'insufficient') {
      return { isValid: false, errors: {}, result: null };
    }
    errors.form = errorMessage(solved.error);
    if (solved.error === 'margin_ge_100') {
      errors.marginPercent = errorMessage(solved.error);
    }
    return { isValid: false, errors, result: null };
  }

  const v = solved.value;
  const grossCostDisp = displayMoney(
    v.grossCost,
    home,
    input.grossCostCurrency,
    rates
  );
  if (!grossCostDisp.ok) {
    errors.form = grossCostDisp.message;
    return { isValid: false, errors, result: null };
  }
  const netPriceDisp = displayMoney(v.netPrice, home, input.netPriceCurrency, rates);
  if (!netPriceDisp.ok) {
    errors.form = netPriceDisp.message;
    return { isValid: false, errors, result: null };
  }
  const grossPriceDisp = displayMoney(
    v.grossPrice,
    home,
    input.grossPriceCurrency,
    rates
  );
  if (!grossPriceDisp.ok) {
    errors.form = grossPriceDisp.message;
    return { isValid: false, errors, result: null };
  }
  const profitDisp = displayMoney(v.profit, home, input.profitCurrency, rates);
  if (!profitDisp.ok) {
    errors.form = profitDisp.message;
    return { isValid: false, errors, result: null };
  }
  const netCostDisp = displayMoney(v.netCost, home, input.netCostCurrency, rates);
  if (!netCostDisp.ok) {
    errors.form = netCostDisp.message;
    return { isValid: false, errors, result: null };
  }

  const result: MarginVatResult = {
    vatPercent: v.vatPercent,
    formattedVatPercent: formatMarginVatPercent(v.vatPercent),
    netCost: netCostDisp.amount,
    netCostCurrency: input.netCostCurrency,
    formattedNetCost: netCostDisp.formatted,
    grossCost: grossCostDisp.amount,
    grossCostCurrency: input.grossCostCurrency,
    formattedGrossCost: grossCostDisp.formatted,
    marginPercent: v.marginPercent,
    formattedMarginPercent:
      v.marginPercent === null ? '' : formatMarginVatPercent(v.marginPercent),
    markupPercent: v.markupPercent,
    formattedMarkupPercent:
      v.markupPercent === null ? '' : formatMarginVatPercent(v.markupPercent),
    netPrice: netPriceDisp.amount,
    netPriceCurrency: input.netPriceCurrency,
    formattedNetPrice: netPriceDisp.formatted,
    grossPrice: grossPriceDisp.amount,
    grossPriceCurrency: input.grossPriceCurrency,
    formattedGrossPrice: grossPriceDisp.formatted,
    profit: profitDisp.amount,
    profitCurrency: input.profitCurrency,
    formattedProfit: profitDisp.formatted,
  };

  return { isValid: true, errors: {}, result };
}
