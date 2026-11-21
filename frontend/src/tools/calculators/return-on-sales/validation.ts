import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateReturnOnSales,
  formatReturnOnSalesPercent,
} from './calculation';
import type {
  ReturnOnSalesFieldErrors,
  ReturnOnSalesInput,
  ReturnOnSalesResult,
} from './types';

export interface ReturnOnSalesValidation {
  isValid: boolean;
  errors: ReturnOnSalesFieldErrors;
  result: ReturnOnSalesResult | null;
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
 * Normalize operating profit into the net-sales currency, then compute ROS at
 * full precision. The ROS percent is never currency-converted.
 */
export function validateReturnOnSalesInput(
  input: ReturnOnSalesInput,
  rates?: CurrencyRatesSnapshot | null
): ReturnOnSalesValidation {
  const errors: ReturnOnSalesFieldErrors = {};

  const profit = parseNumber(input.operatingProfit);
  const sales = parseNumber(input.netSales);

  if (!profit.blank && (profit.invalid || profit.value === null)) {
    errors.operatingProfit = 'Enter a valid operating profit amount.';
  }

  if (!sales.blank && (sales.invalid || sales.value === null)) {
    errors.netSales = 'Enter a valid net sales amount.';
  } else if (!sales.blank && sales.value !== null && !(sales.value > 0)) {
    errors.netSales =
      sales.value < 0
        ? 'Net sales cannot be negative.'
        : 'Net sales must be greater than zero.';
  }

  const incomplete =
    profit.blank || sales.blank || Object.keys(errors).length > 0;
  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.netSalesCurrency;
  const netSalesNormalized = sales.value!;

  const profitNormalized = convertMoney(
    profit.value!,
    input.operatingProfitCurrency,
    calcCurrency,
    rates
  );
  if (!profitNormalized.ok) {
    errors.form = profitNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateReturnOnSales({
    operatingProfit: profitNormalized.amount,
    netSales: netSalesNormalized,
  });
  if (!computed) {
    errors.form = 'This combination does not produce a finite return on sales.';
    return { isValid: false, errors, result: null };
  }

  const result: ReturnOnSalesResult = {
    operatingProfitNormalized: profitNormalized.amount,
    netSalesNormalized,
    rosPercent: computed.rosPercent,
    calcCurrency,
    formattedRosPercent: formatReturnOnSalesPercent(computed.rosPercent),
  };

  return { isValid: true, errors: {}, result };
}
