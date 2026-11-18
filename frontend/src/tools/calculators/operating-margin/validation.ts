import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateOperatingMargin,
  formatOperatingMarginMoney,
  formatOperatingMarginPercent,
} from './calculation';
import type {
  OperatingMarginFieldErrors,
  OperatingMarginInput,
  OperatingMarginResult,
} from './types';

export interface OperatingMarginValidation {
  isValid: boolean;
  errors: OperatingMarginFieldErrors;
  result: OperatingMarginResult | null;
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
 * Normalize COGS and operating expenses into the revenue currency, compute
 * operating income and margin at full precision, then convert income into the
 * independent display currency. Currency-only switches that convert amounts
 * leave the margin percent unchanged.
 */
export function validateOperatingMarginInput(
  input: OperatingMarginInput,
  rates?: CurrencyRatesSnapshot | null
): OperatingMarginValidation {
  const errors: OperatingMarginFieldErrors = {};

  const revenue = parseNumber(input.revenue);
  const cogs = parseNumber(input.cogs);
  const opex = parseNumber(input.operatingExpenses);

  if (!revenue.blank && (revenue.invalid || revenue.value === null)) {
    errors.revenue = 'Enter a valid revenue amount.';
  } else if (!revenue.blank && revenue.value !== null && !(revenue.value !== 0)) {
    errors.revenue = 'Revenue must be nonzero.';
  }

  if (!cogs.blank && (cogs.invalid || cogs.value === null)) {
    errors.cogs = 'Enter a valid cost of goods sold.';
  }

  if (!opex.blank && (opex.invalid || opex.value === null)) {
    errors.operatingExpenses = 'Enter a valid operating expenses amount.';
  }

  const incomplete =
    revenue.blank || cogs.blank || opex.blank || Object.keys(errors).length > 0;
  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.revenueCurrency;
  const revenueNormalized = revenue.value!;

  const cogsNormalized = convertMoney(
    cogs.value!,
    input.cogsCurrency,
    calcCurrency,
    rates
  );
  if (!cogsNormalized.ok) {
    errors.form = cogsNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const opexNormalized = convertMoney(
    opex.value!,
    input.operatingExpensesCurrency,
    calcCurrency,
    rates
  );
  if (!opexNormalized.ok) {
    errors.form = opexNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateOperatingMargin({
    revenue: revenueNormalized,
    cogs: cogsNormalized.amount,
    operatingExpenses: opexNormalized.amount,
  });
  if (!computed) {
    errors.form = 'This combination does not produce a finite operating margin.';
    return { isValid: false, errors, result: null };
  }

  const incomeDisplay = convertMoney(
    computed.operatingIncome,
    calcCurrency,
    input.operatingIncomeCurrency,
    rates
  );
  if (!incomeDisplay.ok) {
    errors.form = incomeDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: OperatingMarginResult = {
    operatingIncome: computed.operatingIncome,
    operatingIncomeDisplay: incomeDisplay.amount,
    marginPercent: computed.marginPercent,
    revenueNormalized,
    cogsNormalized: cogsNormalized.amount,
    operatingExpensesNormalized: opexNormalized.amount,
    calcCurrency,
    operatingIncomeCurrency: input.operatingIncomeCurrency,
    formattedOperatingIncome: formatOperatingMarginMoney(
      incomeDisplay.amount,
      input.operatingIncomeCurrency
    ),
    formattedMarginPercent: formatOperatingMarginPercent(computed.marginPercent),
  };

  return { isValid: true, errors: {}, result };
}
