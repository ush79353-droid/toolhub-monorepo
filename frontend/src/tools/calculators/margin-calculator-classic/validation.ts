import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import {
  formatMoneyAmount,
  formatPercentValue,
  solveMarginClassic,
} from './calculation';
import type {
  MarginCalculatorClassicFieldErrors,
  MarginCalculatorClassicInput,
  MarginCalculatorClassicResult,
  MarginClassicSyncedFields,
} from './types';

export interface MarginCalculatorClassicValidation {
  isValid: boolean;
  errors: MarginCalculatorClassicFieldErrors;
  result: MarginCalculatorClassicResult | null;
  synced: MarginClassicSyncedFields;
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
 * Normalize revenue/profit into the cost currency, solve bidirectionally, then
 * re-express revenue/profit in their display currencies. Percentages are never FX-converted.
 */
export function validateMarginCalculatorClassicInput(
  input: MarginCalculatorClassicInput,
  rates?: CurrencyRatesSnapshot | null
): MarginCalculatorClassicValidation {
  const errors: MarginCalculatorClassicFieldErrors = {};
  const cost = parseNumber(input.cost);
  const margin = parseNumber(input.marginPercent);
  const revenue = parseNumber(input.revenue);
  const profit = parseNumber(input.profit);

  if (!cost.blank && (cost.invalid || cost.value === null)) {
    errors.cost = 'Enter a valid cost.';
  }
  if (!margin.blank && (margin.invalid || margin.value === null)) {
    errors.marginPercent = 'Enter a valid margin.';
  } else if (!margin.blank && margin.value !== null && !(margin.value < 100)) {
    errors.marginPercent =
      'Margin must be less than 100% when solving for revenue from cost.';
  }
  if (!revenue.blank && (revenue.invalid || revenue.value === null)) {
    errors.revenue = 'Enter a valid revenue.';
  } else if (!revenue.blank && revenue.value !== null && revenue.value === 0) {
    errors.revenue = 'Revenue must be nonzero.';
  }
  if (!profit.blank && (profit.invalid || profit.value === null)) {
    errors.profit = 'Enter a valid profit.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, synced: {} };
  }

  const calcCurrency = input.costCurrency;

  const costInCalc = cost.blank ? null : cost.value;
  let revenueInCalc: number | null = null;
  let profitInCalc: number | null = null;

  if (!revenue.blank && revenue.value !== null) {
    const converted = convertMoney(
      revenue.value,
      input.revenueCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null, synced: {} };
    }
    revenueInCalc = converted.amount;
  }

  if (!profit.blank && profit.value !== null) {
    const converted = convertMoney(
      profit.value,
      input.profitCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null, synced: {} };
    }
    profitInCalc = converted.amount;
  }

  const solved = solveMarginClassic({
    cost: costInCalc,
    marginPercent: margin.blank ? null : margin.value,
    revenue: revenueInCalc,
    profit: profitInCalc,
    driver: input.driver,
    marginPinned: input.marginPinned,
  });

  if (!solved) {
    return { isValid: false, errors, result: null, synced: {} };
  }

  const revenueDisplayed = convertMoney(
    solved.revenue,
    calcCurrency,
    input.revenueCurrency,
    rates
  );
  if (!revenueDisplayed.ok) {
    errors.form = revenueDisplayed.message;
    return { isValid: false, errors, result: null, synced: {} };
  }

  const profitDisplayed = convertMoney(
    solved.profit,
    calcCurrency,
    input.profitCurrency,
    rates
  );
  if (!profitDisplayed.ok) {
    errors.form = profitDisplayed.message;
    return { isValid: false, errors, result: null, synced: {} };
  }

  const result: MarginCalculatorClassicResult = {
    costInCalc: solved.cost,
    marginPercent: solved.marginPercent,
    revenueInCalc: solved.revenue,
    profitInCalc: solved.profit,
    revenueDisplayed: revenueDisplayed.amount,
    profitDisplayed: profitDisplayed.amount,
    calcCurrency,
    revenueCurrency: input.revenueCurrency,
    profitCurrency: input.profitCurrency,
    formattedMargin: formatPercentValue(solved.marginPercent),
    formattedRevenue: formatMoneyAmount(
      revenueDisplayed.amount,
      input.revenueCurrency
    ),
    formattedProfit: formatMoneyAmount(
      profitDisplayed.amount,
      input.profitCurrency
    ),
    formattedCost: formatMoneyAmount(solved.cost, calcCurrency),
  };

  // Sync non-driver fields with full-precision input strings (display rounding stays in result.*).
  const synced: MarginClassicSyncedFields = {};
  if (input.driver !== 'cost') {
    synced.cost = moneyAmountToInputString(solved.cost);
  }
  if (input.driver !== 'margin') {
    synced.marginPercent = formatPercentValue(solved.marginPercent);
  }
  if (input.driver !== 'revenue') {
    synced.revenue = moneyAmountToInputString(revenueDisplayed.amount);
  }
  if (input.driver !== 'profit') {
    synced.profit = moneyAmountToInputString(profitDisplayed.amount);
  }

  // When margin is pinned and revenue/profit drove a cost change, cost was not the driver.
  if (
    input.marginPinned &&
    (input.driver === 'revenue' || input.driver === 'profit')
  ) {
    synced.cost = moneyAmountToInputString(solved.cost);
  }

  return { isValid: true, errors: {}, result, synced };
}
