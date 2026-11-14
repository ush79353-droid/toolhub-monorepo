import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  buildGmroiResult,
  calculateAverageInventory,
} from './calculation';
import type { GmroiDraft, GmroiFieldErrors, GmroiResult } from './types';

function parseOptional(
  raw: string,
  label: string,
  opts?: { allowNegative?: boolean }
): { value: number | null; blank: boolean; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, error: `${label} must be a number.` };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (!opts?.allowNegative && value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  return { value, blank: false };
}

/** Fill average from starting/final when average is not manually owned. */
export function withAutoAverage(draft: GmroiDraft): GmroiDraft {
  if (draft.averageManual) return draft;
  const start = parseOptional(draft.startingInventory, 'Starting inventory');
  const final = parseOptional(draft.finalInventory, 'Final inventory');
  if (
    start.blank ||
    final.blank ||
    start.value === null ||
    final.value === null ||
    start.error ||
    final.error
  ) {
    return { ...draft, averageInventory: '' };
  }
  const average = calculateAverageInventory(start.value, final.value);
  if (!Number.isFinite(average)) {
    return { ...draft, averageInventory: '' };
  }
  return { ...draft, averageInventory: String(average) };
}

export function validateGmroiDraft(draft: GmroiDraft): {
  isValid: boolean;
  incomplete: boolean;
  errors: GmroiFieldErrors;
  result: GmroiResult | null;
  displayDraft: GmroiDraft;
} {
  const displayDraft = withAutoAverage(draft);
  const errors: GmroiFieldErrors = {};

  if (!isSupportedCurrency(displayDraft.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const start = parseOptional(displayDraft.startingInventory, 'Starting inventory cost');
  const final = parseOptional(displayDraft.finalInventory, 'Final inventory cost');
  const average = parseOptional(displayDraft.averageInventory, 'Average inventory cost');
  const profit = parseOptional(displayDraft.grossProfit, 'Gross profit', {
    allowNegative: true,
  });

  if (!start.blank && start.error) errors.startingInventory = start.error;
  if (!final.blank && final.error) errors.finalInventory = final.error;
  if (!average.blank && average.error) errors.averageInventory = average.error;
  if (!profit.blank && profit.error) errors.grossProfit = profit.error;

  if (!average.blank && average.value !== null && average.value <= 0) {
    errors.averageInventory = 'Average inventory cost must be greater than zero.';
  }

  const anyBlank = average.blank || profit.blank;

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
      displayDraft,
    };
  }

  const result = buildGmroiResult({
    startingInventory: start.value,
    finalInventory: final.value,
    averageInventory: average.value!,
    grossProfit: profit.value!,
    currency: displayDraft.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite GMROI.';
    return {
      isValid: false,
      incomplete: false,
      errors,
      result: null,
      displayDraft,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result, displayDraft };
}
