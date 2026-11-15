import {
  getCurrencyFractionDigits,
  isSupportedCurrency,
  type SupportedCurrency,
} from './currency';
import { isCurrencyRateUsable } from './currency-rates';
import { moneyAmountToInputString, parseMoneyInput } from './money-value';

export type ConvertCurrencyReason =
  | 'INVALID_AMOUNT'
  | 'INVALID_CURRENCY'
  | 'SAME_CURRENCY'
  | 'MISSING_RATE'
  | 'INVALID_RATE'
  | 'NON_FINITE_RESULT';

export type ConvertCurrencyResult =
  | { ok: true; amount: number; from: string; to: string }
  | { ok: false; reason: ConvertCurrencyReason; from: string; to: string };

/**
 * ADR-021 conversion on a stored base map (usually USD):
 * converted = amount × rates[target] / rates[source]
 *
 * Full IEEE precision — do not round here. Round only when formatting/displaying.
 */
export function convertCurrency(input: {
  amount: number;
  from: string;
  to: string;
  rates: Record<string, number>;
}): ConvertCurrencyResult {
  const from = input.from.trim().toUpperCase();
  const to = input.to.trim().toUpperCase();

  if (!Number.isFinite(input.amount)) {
    return { ok: false, reason: 'INVALID_AMOUNT', from, to };
  }
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
    return { ok: false, reason: 'INVALID_CURRENCY', from, to };
  }
  if (from === to) {
    return { ok: true, amount: input.amount, from, to };
  }
  if (!isCurrencyRateUsable(input.rates, from) || !isCurrencyRateUsable(input.rates, to)) {
    const missing =
      !Object.prototype.hasOwnProperty.call(input.rates, from) ||
      !Object.prototype.hasOwnProperty.call(input.rates, to);
    return {
      ok: false,
      reason: missing ? 'MISSING_RATE' : 'INVALID_RATE',
      from,
      to,
    };
  }

  const sourceRate = input.rates[from]!;
  const targetRate = input.rates[to]!;
  const converted = (input.amount * targetRate) / sourceRate;

  if (!Number.isFinite(converted)) {
    return { ok: false, reason: 'NON_FINITE_RESULT', from, to };
  }

  return { ok: true, amount: converted, from, to };
}

/** Round once for display / money output (half-up via toFixed). Does not mutate rates. */
export function roundMoneyAmount(amount: number, currency: string): number | null {
  if (!Number.isFinite(amount)) return null;
  const code = currency.trim().toUpperCase();
  const digits = isSupportedCurrency(code)
    ? getCurrencyFractionDigits(code)
    : 2;
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatConvertedMoney(
  amount: number,
  currency: SupportedCurrency,
  locale = 'en-US'
): string | null {
  const rounded = roundMoneyAmount(amount, currency);
  if (rounded === null) return null;
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(rounded);
}

/**
 * Normalize several money amounts into one currency for mixed-currency engines.
 * Returns null if any conversion is unavailable.
 */
export function normalizeAmountsToCurrency(
  values: readonly { amount: number; currency: string }[],
  targetCurrency: string,
  rates: Record<string, number>
): number[] | null {
  const out: number[] = [];
  for (const value of values) {
    if (!Number.isFinite(value.amount)) return null;
    const converted = convertCurrency({
      amount: value.amount,
      from: value.currency,
      to: targetCurrency,
      rates,
    });
    if (!converted.ok) return null;
    out.push(converted.amount);
  }
  return out;
}

/**
 * Convert selected draft money strings (blank stays blank). Fails closed if any
 * finite amount cannot convert. Percent/age/duration fields must not be passed in.
 */
export function convertDraftMoneyFields(
  draft: Record<string, string>,
  keys: readonly string[],
  from: string,
  to: string,
  rates: Record<string, number>
): { ok: true; values: Record<string, string> } | { ok: false } {
  const values: Record<string, string> = {};
  for (const key of keys) {
    const raw = draft[key] ?? '';
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) {
      values[key] = raw;
      continue;
    }
    const converted = convertCurrency({ amount, from, to, rates });
    if (!converted.ok) return { ok: false };
    values[key] = moneyAmountToInputString(converted.amount);
  }
  return { ok: true, values };
}

/** Convert every entry in a money string list (e.g. tenant incomes). */
export function convertDraftMoneyList(
  values: readonly string[],
  from: string,
  to: string,
  rates: Record<string, number>
): { ok: true; values: string[] } | { ok: false } {
  const out: string[] = [];
  for (const raw of values) {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) {
      out.push(raw);
      continue;
    }
    const converted = convertCurrency({ amount, from, to, rates });
    if (!converted.ok) return { ok: false };
    out.push(moneyAmountToInputString(converted.amount));
  }
  return { ok: true, values: out };
}
