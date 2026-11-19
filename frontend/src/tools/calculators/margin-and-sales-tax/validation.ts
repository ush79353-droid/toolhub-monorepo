import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateMarginAndSalesTax,
  formatMarginSalesTaxMoney,
  formatMarginSalesTaxPercent,
} from './calculation';
import type {
  MarginAndSalesTaxFieldErrors,
  MarginAndSalesTaxInput,
  MarginAndSalesTaxResult,
} from './types';

export interface MarginAndSalesTaxValidation {
  isValid: boolean;
  errors: MarginAndSalesTaxFieldErrors;
  result: MarginAndSalesTaxResult | null;
}

const MAX_MONEY = 1_000_000_000;
const MAX_PERCENT = 10_000;

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
 * Validates cost / markup / sales tax, computes in cost currency, then
 * FX-converts net / gross / profit into their display currencies.
 * Percentages never convert.
 */
export function validateMarginAndSalesTaxInput(
  input: MarginAndSalesTaxInput,
  rates?: CurrencyRatesSnapshot | null
): MarginAndSalesTaxValidation {
  const errors: MarginAndSalesTaxFieldErrors = {};
  const home = input.costCurrency;

  const cost = parseNumber(input.cost);
  const markup = parseNumber(input.markupPercent);
  const tax = parseNumber(input.salesTaxPercent);

  if (!cost.blank && (cost.invalid || cost.value === null)) {
    errors.cost = 'Enter a valid cost.';
  } else if (cost.value !== null && cost.value < 0) {
    errors.cost = 'Cost must be zero or greater.';
  } else if (cost.value !== null && cost.value > MAX_MONEY) {
    errors.cost = 'Cost is too large.';
  }

  if (!markup.blank && (markup.invalid || markup.value === null)) {
    errors.markupPercent = 'Enter a valid markup percent.';
  } else if (markup.value !== null && markup.value < -100) {
    errors.markupPercent = 'Markup cannot be less than −100%.';
  } else if (markup.value !== null && markup.value > MAX_PERCENT) {
    errors.markupPercent = 'Markup percent is too large.';
  }

  if (!tax.blank && (tax.invalid || tax.value === null)) {
    errors.salesTaxPercent = 'Enter a valid sales tax percent.';
  } else if (tax.value !== null && tax.value < 0) {
    errors.salesTaxPercent = 'Sales tax percent cannot be negative.';
  } else if (tax.value !== null && tax.value > MAX_PERCENT) {
    errors.salesTaxPercent = 'Sales tax percent is too large.';
  }

  const incomplete =
    cost.blank ||
    markup.blank ||
    tax.blank ||
    Boolean(errors.cost) ||
    Boolean(errors.markupPercent) ||
    Boolean(errors.salesTaxPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const solved = calculateMarginAndSalesTax({
    cost: cost.value!,
    markupPercent: markup.value!,
    salesTaxPercent: tax.value!,
  });

  if (!solved) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const netDisp = convertMoney(
    solved.netPrice,
    home,
    input.netPriceCurrency,
    rates
  );
  if (!netDisp.ok) {
    errors.form = netDisp.message;
    return { isValid: false, errors, result: null };
  }

  const grossDisp = convertMoney(
    solved.grossPrice,
    home,
    input.grossPriceCurrency,
    rates
  );
  if (!grossDisp.ok) {
    errors.form = grossDisp.message;
    return { isValid: false, errors, result: null };
  }

  const profitDisp = convertMoney(
    solved.profit,
    home,
    input.profitCurrency,
    rates
  );
  if (!profitDisp.ok) {
    errors.form = profitDisp.message;
    return { isValid: false, errors, result: null };
  }

  const result: MarginAndSalesTaxResult = {
    costCanonical: solved.cost,
    netPriceCanonical: solved.netPrice,
    marginPercent: solved.marginPercent,
    salesTaxPercent: solved.salesTaxPercent,
    grossPriceCanonical: solved.grossPrice,
    profitCanonical: solved.profit,
    salesTaxAmountCanonical: solved.salesTaxAmount,
    cost: solved.cost,
    netPrice: netDisp.amount,
    grossPrice: grossDisp.amount,
    profit: profitDisp.amount,
    costCurrency: input.costCurrency,
    netPriceCurrency: input.netPriceCurrency,
    grossPriceCurrency: input.grossPriceCurrency,
    profitCurrency: input.profitCurrency,
    formattedCost: formatMarginSalesTaxMoney(solved.cost, input.costCurrency),
    formattedNetPrice: formatMarginSalesTaxMoney(
      netDisp.amount,
      input.netPriceCurrency
    ),
    formattedMarginPercent:
      solved.marginPercent === null
        ? ''
        : formatMarginSalesTaxPercent(solved.marginPercent),
    formattedSalesTaxPercent: formatMarginSalesTaxPercent(
      solved.salesTaxPercent
    ),
    formattedGrossPrice: formatMarginSalesTaxMoney(
      grossDisp.amount,
      input.grossPriceCurrency
    ),
    formattedProfit: formatMarginSalesTaxMoney(
      profitDisp.amount,
      input.profitCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
