import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateProfit, formatProfitMoney } from './calculation';
import type { ProfitFieldErrors, ProfitInput, ProfitResult } from './types';

export interface ProfitValidation {
  isValid: boolean;
  errors: ProfitFieldErrors;
  result: ProfitResult | null;
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
 * Validates inputs, normalizes selling price into buying-cost currency with
 * Phase 2 FX, computes profit at full precision, then FX-converts each result
 * into its independent display currency. Unit counts and discount % never convert.
 */
export function validateProfitInput(
  input: ProfitInput,
  rates?: CurrencyRatesSnapshot | null
): ProfitValidation {
  const errors: ProfitFieldErrors = {};

  const cost = parseNumber(input.cost);
  const costPer = parseNumber(input.costPer);
  const price = parseNumber(input.price);
  const pricePer = parseNumber(input.pricePer);
  const quantity = parseNumber(input.quantity);
  const discount = parseNumber(input.discountPercent);

  if (cost.blank) {
    errors.cost = 'Enter a buying cost.';
  } else if (cost.invalid || cost.value === null) {
    errors.cost = 'Enter a valid buying cost.';
  } else if (cost.value < 0) {
    errors.cost = 'Buying cost cannot be negative.';
  }

  if (costPer.blank) {
    errors.costPer = 'Enter cost units.';
  } else if (costPer.invalid || costPer.value === null) {
    errors.costPer = 'Enter a valid cost-per quantity.';
  } else if (!(costPer.value > 0)) {
    errors.costPer = 'Cost-per units must be greater than zero.';
  }

  if (price.blank) {
    errors.price = 'Enter a selling price.';
  } else if (price.invalid || price.value === null) {
    errors.price = 'Enter a valid selling price.';
  } else if (price.value < 0) {
    errors.price = 'Selling price cannot be negative.';
  }

  if (pricePer.blank) {
    errors.pricePer = 'Enter price units.';
  } else if (pricePer.invalid || pricePer.value === null) {
    errors.pricePer = 'Enter a valid price-per quantity.';
  } else if (!(pricePer.value > 0)) {
    errors.pricePer = 'Price-per units must be greater than zero.';
  }

  if (quantity.blank) {
    errors.quantity = 'Enter a quantity.';
  } else if (quantity.invalid || quantity.value === null) {
    errors.quantity = 'Enter a valid quantity.';
  } else if (quantity.value < 0) {
    errors.quantity = 'Quantity cannot be negative.';
  }

  if (discount.blank) {
    errors.discountPercent = 'Enter a discount percent (use 0 for none).';
  } else if (discount.invalid || discount.value === null) {
    errors.discountPercent = 'Enter a valid discount percent.';
  } else if (discount.value < 0 || discount.value > 100) {
    errors.discountPercent = 'Discount must be between 0% and 100%.';
  }

  if (
    Object.keys(errors).length > 0 ||
    cost.value === null ||
    costPer.value === null ||
    price.value === null ||
    pricePer.value === null ||
    quantity.value === null ||
    discount.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const baseCurrency = input.costCurrency;
  const priceFx = convertMoney(
    price.value,
    input.priceCurrency,
    baseCurrency,
    rates
  );
  if (!priceFx.ok) {
    errors.form = priceFx.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateProfit({
    cost: cost.value,
    costPer: costPer.value,
    price: priceFx.amount,
    pricePer: pricePer.value,
    quantity: quantity.value,
    discountPercent: discount.value,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite profit result.';
    return { isValid: false, errors, result: null };
  }

  const totalCostFx = convertMoney(
    computed.totalCost,
    baseCurrency,
    input.totalCostCurrency,
    rates
  );
  if (!totalCostFx.ok) {
    errors.form = totalCostFx.message;
    return { isValid: false, errors, result: null };
  }

  const revenueFx = convertMoney(
    computed.revenue,
    baseCurrency,
    input.revenueCurrency,
    rates
  );
  if (!revenueFx.ok) {
    errors.form = revenueFx.message;
    return { isValid: false, errors, result: null };
  }

  const profitFx = convertMoney(
    computed.totalProfit,
    baseCurrency,
    input.totalProfitCurrency,
    rates
  );
  if (!profitFx.ok) {
    errors.form = profitFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: ProfitResult = {
    unitCostCanonical: computed.unitCost,
    unitPriceCanonical: computed.unitPrice,
    totalCostCanonical: computed.totalCost,
    revenueCanonical: computed.revenue,
    totalProfitCanonical: computed.totalProfit,
    totalCost: totalCostFx.amount,
    revenue: revenueFx.amount,
    totalProfit: profitFx.amount,
    costCurrency: baseCurrency,
    totalCostCurrency: input.totalCostCurrency,
    revenueCurrency: input.revenueCurrency,
    totalProfitCurrency: input.totalProfitCurrency,
    formattedTotalCost: formatProfitMoney(
      totalCostFx.amount,
      input.totalCostCurrency
    ),
    formattedRevenue: formatProfitMoney(
      revenueFx.amount,
      input.revenueCurrency
    ),
    formattedTotalProfit: formatProfitMoney(
      profitFx.amount,
      input.totalProfitCurrency
    ),
    discountPercent: discount.value,
    quantity: quantity.value,
  };

  return { isValid: true, errors: {}, result };
}
