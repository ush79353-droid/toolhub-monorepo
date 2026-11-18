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
  solveScenario,
  syncPercentsOnly,
} from './calculation';
import type {
  MarginAndMarkupFieldErrors,
  MarginAndMarkupInput,
  MarginAndMarkupResult,
  MarginMarkupDriver,
  ScenarioAmounts,
} from './types';

export interface MarginAndMarkupValidation {
  isValid: boolean;
  errors: MarginAndMarkupFieldErrors;
  result: MarginAndMarkupResult | null;
  /** Derived field strings to write back (bidirectional sync). */
  synced: Partial<MarginAndMarkupInput> | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/%/g, '');
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

function toScenarioAmounts(
  solved: {
    marginPercent: number;
    markupPercent: number;
    revenue: number;
    profit: number;
  },
  revenueCurrency: SupportedCurrency,
  profitCurrency: SupportedCurrency,
  costCurrency: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amounts: ScenarioAmounts } | { ok: false; message: string } {
  const revenueDisplay = convertMoney(
    solved.revenue,
    costCurrency,
    revenueCurrency,
    rates
  );
  if (!revenueDisplay.ok) return revenueDisplay;
  const profitDisplay = convertMoney(
    solved.profit,
    costCurrency,
    profitCurrency,
    rates
  );
  if (!profitDisplay.ok) return profitDisplay;

  return {
    ok: true,
    amounts: {
      marginPercent: solved.marginPercent,
      markupPercent: solved.markupPercent,
      revenueInCost: solved.revenue,
      profitInCost: solved.profit,
      revenue: revenueDisplay.amount,
      profit: profitDisplay.amount,
      formattedMargin: formatPercentValue(solved.marginPercent),
      formattedMarkup: formatPercentValue(solved.markupPercent),
      formattedRevenue: formatMoneyAmount(revenueDisplay.amount, revenueCurrency),
      formattedProfit: formatMoneyAmount(profitDisplay.amount, profitCurrency),
    },
  };
}

function resolveScenario(args: {
  costInCost: number | null;
  marginRaw: string;
  markupRaw: string;
  revenueRaw: string;
  profitRaw: string;
  driver: MarginMarkupDriver;
  revenueCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
  costCurrency: SupportedCurrency;
  rates: CurrencyRatesSnapshot | null | undefined;
  errorKeys: {
    margin: keyof MarginAndMarkupFieldErrors;
    markup: keyof MarginAndMarkupFieldErrors;
    revenue: keyof MarginAndMarkupFieldErrors;
    profit: keyof MarginAndMarkupFieldErrors;
  };
}): {
  errors: MarginAndMarkupFieldErrors;
  amounts: ScenarioAmounts | null;
  synced: {
    margin: string;
    markup: string;
    revenue: string;
    profit: string;
  } | null;
} {
  const errors: MarginAndMarkupFieldErrors = {};
  const margin = parseNumber(args.marginRaw);
  const markup = parseNumber(args.markupRaw);
  const revenue = parseNumber(args.revenueRaw);
  const profit = parseNumber(args.profitRaw);

  if (!margin.blank && (margin.invalid || margin.value === null)) {
    errors[args.errorKeys.margin] = 'Enter a valid margin percentage.';
  } else if (!margin.blank && margin.value !== null && margin.value >= 100) {
    errors[args.errorKeys.margin] =
      'Margin must be less than 100% to derive revenue.';
  }

  if (!markup.blank && (markup.invalid || markup.value === null)) {
    errors[args.errorKeys.markup] = 'Enter a valid markup percentage.';
  }

  if (!revenue.blank && (revenue.invalid || revenue.value === null)) {
    errors[args.errorKeys.revenue] = 'Enter a valid revenue amount.';
  }

  if (!profit.blank && (profit.invalid || profit.value === null)) {
    errors[args.errorKeys.profit] = 'Enter a valid profit amount.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, amounts: null, synced: null };
  }

  // No cost yet: allow margin ↔ markup sync only.
  if (args.costInCost === null) {
    if (
      (args.driver === 'margin' || args.driver === 'markup') &&
      ((args.driver === 'margin' && !margin.blank) ||
        (args.driver === 'markup' && !markup.blank))
    ) {
      const syncedPct = syncPercentsOnly(
        args.driver,
        margin.blank ? null : margin.value,
        markup.blank ? null : markup.value
      );
      if (!syncedPct) {
        errors[args.errorKeys.margin] =
          errors[args.errorKeys.margin] ??
          'Cannot convert this margin/markup (check values under 100%).';
        return { errors, amounts: null, synced: null };
      }
      return {
        errors: {},
        amounts: null,
        synced: {
          margin: formatPercentValue(syncedPct.marginPercent),
          markup: formatPercentValue(syncedPct.markupPercent),
          revenue: args.revenueRaw,
          profit: args.profitRaw,
        },
      };
    }
    return { errors: {}, amounts: null, synced: null };
  }

  let revenueInCost: number | null = null;
  let profitInCost: number | null = null;

  if (!revenue.blank && revenue.value !== null) {
    const converted = convertMoney(
      revenue.value,
      args.revenueCurrency,
      args.costCurrency,
      args.rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { errors, amounts: null, synced: null };
    }
    revenueInCost = converted.amount;
  }

  if (!profit.blank && profit.value !== null) {
    const converted = convertMoney(
      profit.value,
      args.profitCurrency,
      args.costCurrency,
      args.rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { errors, amounts: null, synced: null };
    }
    profitInCost = converted.amount;
  }

  const driver = args.driver;
  const hasDriverValue =
    (driver === 'margin' && !margin.blank) ||
    (driver === 'markup' && !markup.blank) ||
    (driver === 'revenue' && !revenue.blank) ||
    (driver === 'profit' && !profit.blank) ||
    driver === 'cost';

  if (!hasDriverValue) {
    return { errors: {}, amounts: null, synced: null };
  }

  const solved = solveScenario({
    cost: args.costInCost,
    marginPercent: margin.blank ? null : margin.value,
    markupPercent: markup.blank ? null : markup.value,
    revenue: revenueInCost,
    profit: profitInCost,
    driver,
  });

  if (!solved) {
    errors.form = 'This combination does not produce a finite margin/markup result.';
    return { errors, amounts: null, synced: null };
  }

  const amountsResult = toScenarioAmounts(
    solved,
    args.revenueCurrency,
    args.profitCurrency,
    args.costCurrency,
    args.rates
  );
  if (!amountsResult.ok) {
    errors.form = amountsResult.message;
    return { errors, amounts: null, synced: null };
  }

  return {
    errors: {},
    amounts: amountsResult.amounts,
    synced: {
      margin: formatPercentValue(solved.marginPercent),
      markup: formatPercentValue(solved.markupPercent),
      revenue: moneyAmountToInputString(amountsResult.amounts.revenue),
      profit: moneyAmountToInputString(amountsResult.amounts.profit),
    },
  };
}

/**
 * Validate + solve. Money amounts normalize into cost currency; percentages never convert.
 * Returns `synced` strings so the form can write derived values without circular loops
 * (driver field is owned by the user edit).
 */
export function validateMarginAndMarkupInput(
  input: MarginAndMarkupInput,
  rates?: CurrencyRatesSnapshot | null
): MarginAndMarkupValidation {
  const errors: MarginAndMarkupFieldErrors = {};
  const cost = parseNumber(input.cost);

  if (!cost.blank && (cost.invalid || cost.value === null)) {
    errors.cost = 'Enter a valid cost.';
  } else if (!cost.blank && cost.value !== null && cost.value < 0) {
    errors.cost = 'Cost cannot be negative.';
  }

  const costInCost = cost.blank || cost.value === null ? null : cost.value;

  const scenario1 = resolveScenario({
    costInCost,
    marginRaw: input.margin,
    markupRaw: input.markup,
    revenueRaw: input.revenue,
    profitRaw: input.profit,
    driver: input.driver,
    revenueCurrency: input.revenueCurrency,
    profitCurrency: input.profitCurrency,
    costCurrency: input.costCurrency,
    rates,
    errorKeys: {
      margin: 'margin',
      markup: 'markup',
      revenue: 'revenue',
      profit: 'profit',
    },
  });

  Object.assign(errors, scenario1.errors);

  let scenario2Amounts: ScenarioAmounts | null = null;
  let synced2: {
    margin: string;
    markup: string;
    revenue: string;
    profit: string;
  } | null = null;

  if (input.compareTwo) {
    const scenario2 = resolveScenario({
      costInCost,
      marginRaw: input.margin2,
      markupRaw: input.markup2,
      revenueRaw: input.revenue2,
      profitRaw: input.profit2,
      driver: input.driver2,
      revenueCurrency: input.revenueCurrency,
      profitCurrency: input.profitCurrency,
      costCurrency: input.costCurrency,
      rates,
      errorKeys: {
        margin: 'margin2',
        markup: 'markup2',
        revenue: 'revenue2',
        profit: 'profit2',
      },
    });
    Object.assign(errors, scenario2.errors);
    scenario2Amounts = scenario2.amounts;
    synced2 = scenario2.synced;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, synced: null };
  }

  const synced: Partial<MarginAndMarkupInput> = {};
  if (scenario1.synced) {
    synced.margin = scenario1.synced.margin;
    synced.markup = scenario1.synced.markup;
    synced.revenue = scenario1.synced.revenue;
    synced.profit = scenario1.synced.profit;
  }
  if (synced2) {
    synced.margin2 = synced2.margin;
    synced.markup2 = synced2.markup;
    synced.revenue2 = synced2.revenue;
    synced.profit2 = synced2.profit;
  }

  if (!scenario1.amounts && !scenario2Amounts) {
    return {
      isValid: Object.keys(synced).length > 0,
      errors: {},
      result: null,
      synced: Object.keys(synced).length > 0 ? synced : null,
    };
  }

  if (!scenario1.amounts && costInCost === null) {
    return {
      isValid: true,
      errors: {},
      result: null,
      synced: Object.keys(synced).length > 0 ? synced : null,
    };
  }

  if (!scenario1.amounts) {
    return { isValid: false, errors: {}, result: null, synced: null };
  }

  const result: MarginAndMarkupResult = {
    scenario1: scenario1.amounts,
    scenario2: input.compareTwo ? scenario2Amounts : null,
    costInCostCurrency: costInCost ?? 0,
    costCurrency: input.costCurrency,
    revenueCurrency: input.revenueCurrency,
    profitCurrency: input.profitCurrency,
  };

  return {
    isValid: true,
    errors: {},
    result,
    synced: Object.keys(synced).length > 0 ? synced : null,
  };
}
