import { calculateMoneyTotal } from './calculation';
import {
  getDenominationSet,
  isMoneyCounterCurrency,
  type MoneyCounterCurrency,
} from './denominations';
import type {
  MoneyCounterFieldErrors,
  MoneyCounterInput,
  MoneyCounterResult,
} from './types';

export interface MoneyCounterValidation {
  isValid: boolean;
  errors: MoneyCounterFieldErrors;
  result: MoneyCounterResult | null;
}

function parseCount(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: 0, blank: true, invalid: false };
  if (/[.]/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  if (!/^\d+$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    return { value: null, blank: false, invalid: true };
  }
  // Guard absurdly large piece counts that would overflow safe integers when × face.
  if (value > 1_000_000_000) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateMoneyCounterInput(
  input: MoneyCounterInput
): MoneyCounterValidation {
  const errors: MoneyCounterFieldErrors = {};

  if (!isMoneyCounterCurrency(input.currency)) {
    errors.currency = 'Select a supported currency.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.currency as MoneyCounterCurrency;
  const set = getDenominationSet(currency);
  const denoms = input.includeCoins
    ? [...set.notes, ...set.coins]
    : [...set.notes];

  const parsed: Record<string, number> = {};
  for (const d of denoms) {
    const raw = input.counts[d.id] ?? '';
    const p = parseCount(raw);
    if (p.invalid || p.value == null) {
      errors[d.id] = 'Enter a whole number ≥ 0.';
    } else {
      parsed[d.id] = p.value;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  try {
    const result = calculateMoneyTotal({
      currency,
      includeCoins: input.includeCoins,
      counts: parsed,
    });
    return { isValid: true, errors: {}, result };
  } catch (err) {
    errors.form =
      err instanceof Error ? err.message : 'Unable to total the cash count.';
    return { isValid: false, errors, result: null };
  }
}
