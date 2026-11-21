import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateRevenue,
  formatRevenueMoney,
  formatRevenueQuantity,
} from './calculation';
import type {
  RevenueDraft,
  RevenueFieldErrors,
  RevenueResult,
  RevenueSolveTarget,
} from './types';

export interface RevenueValidation {
  isValid: boolean;
  errors: RevenueFieldErrors;
  result: RevenueResult | null;
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

function resolveSolveFor(input: RevenueDraft): {
  solveFor: RevenueSolveTarget | null;
  error?: string;
} {
  const price = parseNumber(input.price);
  const quantity = parseNumber(input.quantity);
  const revenue = parseNumber(input.totalRevenue);
  const blanks: RevenueSolveTarget[] = [];
  if (price.blank) blanks.push('price');
  if (quantity.blank) blanks.push('quantity');
  if (revenue.blank) blanks.push('totalRevenue');

  if (blanks.length === 1) return { solveFor: blanks[0]! };
  if (blanks.length === 0) return { solveFor: input.lastEdited };
  if (blanks.length === 3) {
    return { solveFor: null, error: 'Enter any two values to solve for the third.' };
  }
  return {
    solveFor: null,
    error: 'Enter exactly two values (leave one blank), or fill all three to refresh the last-edited field.',
  };
}

/**
 * Validates bidirectional revenue inputs, normalizes money into price currency,
 * solves for the blank (or last-edited) field, then converts total revenue for display.
 */
export function validateRevenueInput(
  input: RevenueDraft,
  rates?: CurrencyRatesSnapshot | null
): RevenueValidation {
  const errors: RevenueFieldErrors = {};
  const priceParsed = parseNumber(input.price);
  const quantityParsed = parseNumber(input.quantity);
  const revenueParsed = parseNumber(input.totalRevenue);

  if (!priceParsed.blank && (priceParsed.invalid || priceParsed.value === null)) {
    errors.price = 'Enter a valid price.';
  } else if (!priceParsed.blank && priceParsed.value! < 0) {
    errors.price = 'Price cannot be negative.';
  }

  if (
    !quantityParsed.blank &&
    (quantityParsed.invalid || quantityParsed.value === null)
  ) {
    errors.quantity = 'Enter a valid quantity.';
  } else if (!quantityParsed.blank && quantityParsed.value! < 0) {
    errors.quantity = 'Quantity cannot be negative.';
  }

  if (
    !revenueParsed.blank &&
    (revenueParsed.invalid || revenueParsed.value === null)
  ) {
    errors.totalRevenue = 'Enter a valid total revenue.';
  } else if (!revenueParsed.blank && revenueParsed.value! < 0) {
    errors.totalRevenue = 'Total revenue cannot be negative.';
  }

  const resolved = resolveSolveFor(input);
  if (resolved.error) {
    errors.form = resolved.error;
  }

  if (Object.keys(errors).length > 0 || !resolved.solveFor) {
    return { isValid: false, errors, result: null };
  }

  const solveFor = resolved.solveFor;
  let priceCanonical: number | null = priceParsed.blank ? null : priceParsed.value;
  let quantityCanonical: number | null = quantityParsed.blank
    ? null
    : quantityParsed.value;
  let revenueCanonical: number | null = revenueParsed.blank
    ? null
    : revenueParsed.value;

  if (revenueCanonical !== null) {
    const converted = convertMoney(
      revenueCanonical,
      input.totalRevenueCurrency,
      input.priceCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    revenueCanonical = converted.amount;
  }

  // When all three filled, clear the solved field so engine recomputes it.
  if (
    !priceParsed.blank &&
    !quantityParsed.blank &&
    !revenueParsed.blank
  ) {
    if (solveFor === 'price') priceCanonical = null;
    if (solveFor === 'quantity') quantityCanonical = null;
    if (solveFor === 'totalRevenue') revenueCanonical = null;
  }

  const computed = calculateRevenue({
    solveFor,
    price: priceCanonical,
    quantity: quantityCanonical,
    totalRevenue: revenueCanonical,
  });

  if (!computed) {
    if (solveFor === 'price' && quantityCanonical === 0) {
      errors.quantity = 'Quantity must be greater than zero to solve for price.';
    } else if (solveFor === 'quantity' && priceCanonical === 0) {
      errors.price = 'Price must be greater than zero to solve for quantity.';
    } else {
      errors.form = 'This combination does not produce a finite result.';
    }
    return { isValid: false, errors, result: null };
  }

  const revenueDisplay = convertMoney(
    computed.totalRevenue,
    input.priceCurrency,
    input.totalRevenueCurrency,
    rates
  );
  if (!revenueDisplay.ok) {
    errors.form = revenueDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: RevenueResult = {
    solvedField: computed.solvedField,
    price: computed.price,
    quantity: computed.quantity,
    totalRevenue: revenueDisplay.amount,
    calcCurrency: input.priceCurrency,
    totalRevenueCurrency: input.totalRevenueCurrency,
    formattedPrice: formatRevenueMoney(computed.price, input.priceCurrency),
    formattedQuantity: formatRevenueQuantity(computed.quantity),
    formattedTotalRevenue: formatRevenueMoney(
      revenueDisplay.amount,
      input.totalRevenueCurrency
    ),
    summaryText: `Solved ${computed.solvedField}: price ${formatRevenueMoney(computed.price, input.priceCurrency)} ${input.priceCurrency} · qty ${formatRevenueQuantity(computed.quantity)} · revenue ${formatRevenueMoney(revenueDisplay.amount, input.totalRevenueCurrency)} ${input.totalRevenueCurrency}`,
  };

  return { isValid: true, errors: {}, result };
}
