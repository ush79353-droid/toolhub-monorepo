import { calculateNpv } from './calculation';
import {
  INITIAL_YEARS,
  MAX_YEARS,
  type NpvFieldErrors,
  type NpvInput,
  type NpvResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

function isBlank(raw: string): boolean {
  return raw.trim() === '';
}

/** Keep at least INITIAL_YEARS fields; never exceed MAX_YEARS. Preserves values. */
export function normalizeYearCount(input: NpvInput, count: number): NpvInput {
  const target = Math.min(MAX_YEARS, Math.max(INITIAL_YEARS, count));
  const cashFlows = [...input.cashFlows];
  while (cashFlows.length < target) cashFlows.push('0');
  while (cashFlows.length > target) cashFlows.pop();
  return { ...input, cashFlows };
}

/**
 * Use all visible years through the current array length.
 * Blank year cells inside the horizon count as 0.
 */
export function collectCashFlows(cashFlows: string[]): {
  values: number[] | null;
  errors: NpvFieldErrors;
} {
  const errors: NpvFieldErrors = {};
  const values: number[] = [];

  for (let i = 0; i < cashFlows.length; i += 1) {
    const raw = cashFlows[i]!;
    if (isBlank(raw)) {
      values.push(0);
      continue;
    }
    const n = parseField(raw);
    if (n === null || Number.isNaN(n)) {
      errors[`year${i + 1}`] = `Enter a valid Year ${i + 1} cash flow.`;
      return { values: null, errors };
    }
    values.push(n);
  }

  return { values, errors };
}

export function validateNpvInput(input: NpvInput): {
  isValid: boolean;
  errors: NpvFieldErrors;
  result: NpvResult | null;
} {
  const errors: NpvFieldErrors = {};

  const rate = parseField(input.discountRatePercent);
  const initial = parseField(input.initialCosts);
  const collected = collectCashFlows(input.cashFlows);

  if (rate === null) {
    // blank — wait
  } else if (Number.isNaN(rate)) {
    errors.discountRatePercent = 'Enter a valid discount rate.';
  } else if (!(1 + rate / 100 > 0)) {
    errors.discountRatePercent = 'Discount rate must be greater than −100%.';
  }

  if (initial === null) {
    // blank — wait
  } else if (Number.isNaN(initial) || initial < 0) {
    errors.initialCosts = 'Enter a valid non-negative initial cost.';
  }

  Object.assign(errors, collected.errors);

  if (
    rate === null ||
    initial === null ||
    Number.isNaN(rate as number) ||
    Object.keys(errors).length > 0 ||
    !collected.values
  ) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateNpv({
    discountRatePercent: rate!,
    initialCosts: initial!,
    cashFlows: collected.values,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite NPV.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
