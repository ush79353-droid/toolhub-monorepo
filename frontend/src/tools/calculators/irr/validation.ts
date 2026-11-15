import { calculateIrr, countSignChanges } from './calculation';
import {
  INITIAL_YEARS,
  MAX_YEARS,
  emptyCashFlow,
  type IrrFieldErrors,
  type IrrInput,
  type IrrResult,
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

/** Keep ≥3 year fields; append a blank year when the last one has data (cap 30). */
export function ensureTrailingYears(input: IrrInput): IrrInput {
  const cashFlows = [...input.cashFlows];
  while (cashFlows.length < INITIAL_YEARS) cashFlows.push(emptyCashFlow());

  const last = cashFlows[cashFlows.length - 1] ?? '';
  if (!isBlank(last) && cashFlows.length < MAX_YEARS) {
    cashFlows.push(emptyCashFlow());
  }

  while (
    cashFlows.length > INITIAL_YEARS &&
    isBlank(cashFlows[cashFlows.length - 1]!) &&
    isBlank(cashFlows[cashFlows.length - 2]!)
  ) {
    cashFlows.pop();
  }

  return { ...input, cashFlows };
}

/** Contiguous cash flows from year 1 through last entered year (blanks in between = 0). */
export function collectCashFlows(cashFlows: string[]): {
  values: number[] | null;
  errors: IrrFieldErrors;
  incomplete: boolean;
} {
  const errors: IrrFieldErrors = {};
  let lastFilled = -1;
  for (let i = 0; i < cashFlows.length; i += 1) {
    if (!isBlank(cashFlows[i]!)) lastFilled = i;
  }
  if (lastFilled < 0) {
    return { values: null, errors, incomplete: true };
  }

  const values: number[] = [];
  for (let i = 0; i <= lastFilled; i += 1) {
    const raw = cashFlows[i]!;
    if (isBlank(raw)) {
      values.push(0);
      continue;
    }
    const n = parseField(raw);
    if (n === null || Number.isNaN(n)) {
      errors[`year${i + 1}`] = `Enter a valid Year ${i + 1} cash flow.`;
    } else {
      values.push(n);
    }
  }

  if (Object.keys(errors).length > 0) {
    return { values: null, errors, incomplete: false };
  }
  return { values, errors, incomplete: false };
}

export function validateIrrInput(input: IrrInput): {
  isValid: boolean;
  errors: IrrFieldErrors;
  result: IrrResult | null;
} {
  const errors: IrrFieldErrors = {};
  const initial = parseField(input.initialInvestment);
  const collected = collectCashFlows(input.cashFlows);

  if (initial === null || collected.incomplete) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(initial) || initial < 0) {
    errors.initialInvestment = 'Enter a valid initial investment (≥ 0).';
  } else if (initial === 0) {
    errors.initialInvestment = 'Initial investment must be greater than zero.';
  }

  Object.assign(errors, collected.errors);

  if (Object.keys(errors).length > 0 || !collected.values) {
    return { isValid: false, errors, result: null };
  }

  const series = [-initial, ...collected.values];
  if (countSignChanges(series) !== 1) {
    errors.form =
      'No unique IRR for these cash flows (need one sign change from investment to returns).';
    return { isValid: false, errors, result: null };
  }

  const result = calculateIrr(initial, collected.values);
  if (!result) {
    errors.form = 'No valid IRR found for these cash flows.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
