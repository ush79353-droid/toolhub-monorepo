import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateSales,
  convertBetweenPeriods,
  formatSalesMoney,
} from './calculation';
import type { SalesFieldErrors, SalesInput, SalesResult } from './types';

export interface SalesValidation {
  isValid: boolean;
  errors: SalesFieldErrors;
  result: SalesResult | null;
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

function parseNonNegMoney(
  raw: string,
  blankAsZero: boolean,
  label: string
): { value: number | null; error?: string } {
  const parsed = parseNumber(raw);
  if (parsed.blank) {
    return blankAsZero ? { value: 0 } : { value: null, error: `Enter ${label}.` };
  }
  if (parsed.invalid || parsed.value === null) {
    return { value: null, error: `Enter a valid ${label}.` };
  }
  if (parsed.value < 0) {
    return { value: null, error: `${label} cannot be negative.` };
  }
  return { value: parsed.value };
}

export function validateSalesInput(
  input: SalesInput,
  rates?: CurrencyRatesSnapshot | null
): SalesValidation {
  const errors: SalesFieldErrors = {};

  const price = parseNonNegMoney(input.productPrice, false, 'product price');
  const qty = parseNonNegMoney(input.quantity, false, 'quantity sold');
  const returns = parseNonNegMoney(input.salesReturns, true, 'sales returns');
  const allowances = parseNonNegMoney(input.salesAllowances, true, 'sales allowances');
  const discounts = parseNonNegMoney(input.salesDiscounts, true, 'sales discounts');

  if (price.error) errors.productPrice = price.error;
  if (qty.error) errors.quantity = qty.error;
  if (returns.error) errors.salesReturns = returns.error;
  if (allowances.error) errors.salesAllowances = allowances.error;
  if (discounts.error) errors.salesDiscounts = discounts.error;

  if (
    input.productPrice.trim() === '' &&
    input.quantity.trim() === '' &&
    input.salesReturns.trim() === '' &&
    input.salesAllowances.trim() === '' &&
    input.salesDiscounts.trim() === ''
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.productPriceCurrency;

  const returnsCanon = convertMoney(
    returns.value!,
    input.salesReturnsCurrency,
    calcCurrency,
    rates
  );
  if (!returnsCanon.ok) {
    errors.form = returnsCanon.message;
    return { isValid: false, errors, result: null };
  }
  const allowancesCanon = convertMoney(
    allowances.value!,
    input.salesAllowancesCurrency,
    calcCurrency,
    rates
  );
  if (!allowancesCanon.ok) {
    errors.form = allowancesCanon.message;
    return { isValid: false, errors, result: null };
  }
  const discountsCanon = convertMoney(
    discounts.value!,
    input.salesDiscountsCurrency,
    calcCurrency,
    rates
  );
  if (!discountsCanon.ok) {
    errors.form = discountsCanon.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateSales({
    productPrice: price.value!,
    quantity: qty.value!,
    quantityPeriod: input.quantityPeriod,
    salesReturns: returnsCanon.amount,
    salesAllowances: allowancesCanon.amount,
    salesDiscounts: discountsCanon.amount,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const revenueInPeriod = convertBetweenPeriods(
    computed.grossInPeriod,
    computed.quantityPeriod,
    input.revenuePeriod
  );
  const annualInPeriod = convertBetweenPeriods(
    computed.grossInPeriod,
    computed.quantityPeriod,
    input.annualRevenuePeriod
  );
  const netInDisplayPeriod = convertBetweenPeriods(
    computed.netInPeriod,
    computed.quantityPeriod,
    input.netSalesPeriod
  );

  const revenueFx = convertMoney(
    revenueInPeriod,
    calcCurrency,
    input.revenueCurrency,
    rates
  );
  if (!revenueFx.ok) {
    errors.form = revenueFx.message;
    return { isValid: false, errors, result: null };
  }
  const annualFx = convertMoney(
    annualInPeriod,
    calcCurrency,
    input.annualRevenueCurrency,
    rates
  );
  if (!annualFx.ok) {
    errors.form = annualFx.message;
    return { isValid: false, errors, result: null };
  }
  const netFx = convertMoney(
    netInDisplayPeriod,
    calcCurrency,
    input.netSalesCurrency,
    rates
  );
  if (!netFx.ok) {
    errors.form = netFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: SalesResult = {
    calcCurrency,
    quantityPeriod: computed.quantityPeriod,
    grossInPeriod: computed.grossInPeriod,
    deductionsInPeriod: computed.deductionsInPeriod,
    netInPeriod: computed.netInPeriod,
    monthlyGross: computed.monthlyGross,
    annualGross: computed.annualGross,
    revenueDisplay: revenueFx.amount,
    revenueCurrency: input.revenueCurrency,
    revenuePeriod: input.revenuePeriod,
    annualRevenueDisplay: annualFx.amount,
    annualRevenueCurrency: input.annualRevenueCurrency,
    annualRevenuePeriod: input.annualRevenuePeriod,
    netSalesDisplay: netFx.amount,
    netSalesCurrency: input.netSalesCurrency,
    netSalesPeriod: input.netSalesPeriod,
    formattedRevenue: formatSalesMoney(revenueFx.amount, input.revenueCurrency),
    formattedAnnualRevenue: formatSalesMoney(
      annualFx.amount,
      input.annualRevenueCurrency
    ),
    formattedNetSales: formatSalesMoney(netFx.amount, input.netSalesCurrency),
    summaryText:
      'Net sales = gross sales − sales returns − allowances − sales discounts (not operating expenses).',
  };

  return { isValid: true, errors, result };
}
