import {
  calculateBrexitCost,
  formatGbp,
  weeklyFromUnit,
} from './calculation';
import type {
  BrexitFieldErrors,
  BrexitInput,
  BrexitResult,
} from './types';
import { spendingDetailsSum } from './types';

export interface BrexitValidation {
  isValid: boolean;
  errors: BrexitFieldErrors;
  result: BrexitResult | null;
}

function parseMoney(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw
    .trim()
    .replace(/,/g, '')
    .replace(/^£/, '')
    .replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

/** Parse datetime-local value as local wall time → epoch ms. */
export function parseLocalDateTime(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  // datetime-local: YYYY-MM-DDTHH:mm or with seconds
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(s);
  if (!m) {
    const fallback = Date.parse(s);
    return Number.isFinite(fallback) ? fallback : null;
  }
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hour = Number(m[4]);
  const minute = Number(m[5]);
  const second = m[6] ? Number(m[6]) : 0;
  const dt = new Date(year, month - 1, day, hour, minute, second);
  const ms = dt.getTime();
  return Number.isFinite(ms) ? ms : null;
}

export function validateBrexitInput(
  input: BrexitInput,
  opts: { nowMs: number }
): BrexitValidation {
  const errors: BrexitFieldErrors = {};

  const sinceMs = parseLocalDateTime(input.sinceIsoLocal);
  if (!input.sinceIsoLocal.trim()) {
    errors.sinceIsoLocal = 'Enter the start date and time.';
  } else if (sinceMs == null) {
    errors.sinceIsoLocal = 'Enter a valid start date and time.';
  }

  let tillMs: number | null = null;
  if (input.tillFollowsNow) {
    tillMs = opts.nowMs;
  } else if (!input.tillIsoLocal.trim()) {
    errors.tillIsoLocal = 'Enter the end date and time.';
  } else {
    tillMs = parseLocalDateTime(input.tillIsoLocal);
    if (tillMs == null) {
      errors.tillIsoLocal = 'Enter a valid end date and time.';
    }
  }

  const costParsed = parseMoney(input.currentCost);
  if (costParsed.blank) {
    errors.currentCost = 'Enter the current cost rate.';
  } else if (costParsed.invalid || costParsed.value == null) {
    errors.currentCost = 'Enter a valid cost rate.';
  } else if (costParsed.value < 0) {
    errors.currentCost = 'Cost rate cannot be negative.';
  }

  let governmentSpending = parseMoney(input.governmentSpending);
  if (input.showCostDetails) {
    const detailSum = spendingDetailsSum(input.spendingDetails);
    if (detailSum == null) {
      errors.spendingDetails =
        'Spending detail lines must be blank or nonnegative numbers.';
    } else {
      governmentSpending = { value: detailSum, blank: false, invalid: false };
    }
  } else if (governmentSpending.blank) {
    errors.governmentSpending = 'Enter total government spending.';
  } else if (governmentSpending.invalid || governmentSpending.value == null) {
    errors.governmentSpending = 'Enter a valid government spending amount.';
  } else if (governmentSpending.value < 0) {
    errors.governmentSpending = 'Government spending cannot be negative.';
  }

  if (
    sinceMs != null &&
    tillMs != null &&
    tillMs < sinceMs &&
    !errors.tillIsoLocal
  ) {
    errors.tillIsoLocal = 'End time must be on or after the start time.';
  }

  const hasErrors = Object.keys(errors).length > 0;
  if (
    hasErrors ||
    sinceMs == null ||
    tillMs == null ||
    costParsed.value == null ||
    governmentSpending.value == null
  ) {
    return { isValid: false, errors, result: null };
  }

  const currentWeeklyLossGbp = weeklyFromUnit(
    costParsed.value,
    input.currentCostUnit
  );
  if (!Number.isFinite(currentWeeklyLossGbp) || currentWeeklyLossGbp < 0) {
    errors.currentCost = 'Enter a valid cost rate.';
    return { isValid: false, errors, result: null };
  }

  try {
    const calc = calculateBrexitCost({
      sinceMs,
      tillMs,
      currentWeeklyLossGbp,
      governmentSpendingGbp: governmentSpending.value,
    });

    const result: BrexitResult = {
      sinceMs,
      tillMs,
      currentWeeklyLossGbp,
      governmentSpendingGbp: governmentSpending.value,
      pre2020LossGbp: calc.pre2020LossGbp,
      post2020LossGbp: calc.post2020LossGbp,
      costSoFarGbp: calc.costSoFarGbp,
      franceRubbishEquiv: calc.franceRubbishEquiv,
      opportunities: calc.opportunities,
      formattedCostSoFar: formatGbp(calc.costSoFarGbp),
      formattedCurrentWeekly: formatGbp(currentWeeklyLossGbp),
      formattedGovernmentSpending: formatGbp(governmentSpending.value),
      explanation: calc.explanation,
      sourceSummary: calc.sourceSummary,
    };

    return { isValid: true, errors: {}, result };
  } catch (err) {
    errors.form =
      err instanceof Error ? err.message : 'Unable to calculate Brexit cost.';
    return { isValid: false, errors, result: null };
  }
}
