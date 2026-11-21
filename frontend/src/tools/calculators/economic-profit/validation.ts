import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateEconomicProfit,
  formatEconomicProfitMoney,
} from './calculation';
import type {
  EconomicProfitFieldErrors,
  EconomicProfitInput,
  EconomicProfitResult,
} from './types';

export interface EconomicProfitValidation {
  isValid: boolean;
  errors: EconomicProfitFieldErrors;
  result: EconomicProfitResult | null;
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
 * Normalize explicit and implicit costs into the total-revenue currency, compute
 * economic profit at full precision, then FX-convert the result into its display
 * currency. Zero costs and negative profit are allowed.
 */
export function validateEconomicProfitInput(
  input: EconomicProfitInput,
  rates?: CurrencyRatesSnapshot | null
): EconomicProfitValidation {
  const errors: EconomicProfitFieldErrors = {};

  const revenue = parseNumber(input.totalRevenue);
  const explicit = parseNumber(input.explicitCosts);
  const implicit = parseNumber(input.implicitCosts);

  if (revenue.blank) {
    errors.totalRevenue = 'Enter total revenue.';
  } else if (revenue.invalid || revenue.value === null) {
    errors.totalRevenue = 'Enter a valid total revenue.';
  } else if (revenue.value < 0) {
    errors.totalRevenue = 'Total revenue cannot be negative.';
  }

  if (explicit.blank) {
    errors.explicitCosts = 'Enter explicit costs (use 0 if none).';
  } else if (explicit.invalid || explicit.value === null) {
    errors.explicitCosts = 'Enter a valid explicit costs amount.';
  } else if (explicit.value < 0) {
    errors.explicitCosts = 'Explicit costs cannot be negative.';
  }

  if (implicit.blank) {
    errors.implicitCosts = 'Enter implicit costs (use 0 if none).';
  } else if (implicit.invalid || implicit.value === null) {
    errors.implicitCosts = 'Enter a valid implicit costs amount.';
  } else if (implicit.value < 0) {
    errors.implicitCosts = 'Implicit costs cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.totalRevenueCurrency;

  const explicitInCalc = convertMoney(
    explicit.value!,
    input.explicitCostsCurrency,
    calcCurrency,
    rates
  );
  if (!explicitInCalc.ok) {
    errors.form = explicitInCalc.message;
    return { isValid: false, errors, result: null };
  }

  const implicitInCalc = convertMoney(
    implicit.value!,
    input.implicitCostsCurrency,
    calcCurrency,
    rates
  );
  if (!implicitInCalc.ok) {
    errors.form = implicitInCalc.message;
    return { isValid: false, errors, result: null };
  }

  const profitCanonical = calculateEconomicProfit({
    totalRevenue: revenue.value!,
    explicitCosts: explicitInCalc.amount,
    implicitCosts: implicitInCalc.amount,
  });
  if (profitCanonical === null) {
    errors.form = 'This combination does not produce a finite economic profit.';
    return { isValid: false, errors, result: null };
  }

  const profitDisplay = convertMoney(
    profitCanonical,
    calcCurrency,
    input.economicProfitCurrency,
    rates
  );
  if (!profitDisplay.ok) {
    errors.form = profitDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const formattedEconomicProfit = formatEconomicProfitMoney(
    profitDisplay.amount,
    input.economicProfitCurrency
  );

  const result: EconomicProfitResult = {
    economicProfitCanonical: profitCanonical,
    economicProfit: profitDisplay.amount,
    calcCurrency,
    economicProfitCurrency: input.economicProfitCurrency,
    formattedEconomicProfit,
    summaryText: `Economic profit = total revenue − explicit costs − implicit costs = ${formattedEconomicProfit} ${input.economicProfitCurrency}.`,
  };

  return { isValid: true, errors: {}, result };
}
