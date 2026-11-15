import { solveCagrSystem } from './calculation';
import type { CagrDraft, CagrField, CagrFieldErrors, CagrResult } from './types';

export interface CagrValidation {
  incomplete: boolean;
  errors: CagrFieldErrors;
  result: CagrResult | null;
  /** Draft displays after applying a safe auto-fill (only non-user-owned). */
  nextDraft: CagrDraft | null;
}

function parseNumber(
  raw: string,
  label: string
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
  return { value, blank: false };
}

export function validateCagrDraft(draft: CagrDraft): CagrValidation {
  const errors: CagrFieldErrors = {};

  const cagr = parseNumber(draft.cagrPercent, 'CAGR');
  const periods = parseNumber(draft.periods, 'Number of periods');
  const initial = parseNumber(draft.initialValue, 'Initial value');
  const final = parseNumber(draft.finalValue, 'Final value');

  if (!cagr.blank && cagr.error) errors.cagrPercent = cagr.error;
  if (!periods.blank && periods.error) errors.periods = periods.error;
  if (!initial.blank && initial.error) errors.initialValue = initial.error;
  if (!final.blank && final.error) errors.finalValue = final.error;

  if (!periods.blank && periods.value !== null && periods.value <= 0) {
    errors.periods = 'Number of periods must be greater than zero.';
  }
  if (!initial.blank && initial.value !== null && initial.value <= 0) {
    errors.initialValue = 'Initial value must be greater than zero.';
  }
  if (!final.blank && final.value !== null && final.value < 0) {
    errors.finalValue = 'Final value cannot be negative.';
  }
  if (!cagr.blank && cagr.value !== null && cagr.value < -100) {
    errors.cagrPercent = 'CAGR cannot be below −100%.';
  }

  const filledCount = [cagr, periods, initial, final].filter((p) => !p.blank && !p.error).length;
  const incomplete = filledCount < 3;

  if (Object.keys(errors).length > 0) {
    return { incomplete: incomplete && Object.keys(errors).length === 0, errors, result: null, nextDraft: null };
  }

  if (incomplete) {
    return { incomplete: true, errors: {}, result: null, nextDraft: null };
  }

  // Prefer solving an empty field; else refresh prior solved field if not user-owned
  const emptyField = (['cagrPercent', 'periods', 'initialValue', 'finalValue'] as const).find(
    (f) => draft[f].trim() === ''
  );

  let target: CagrField | null = emptyField ?? null;
  if (
    !target &&
    draft.solvedField &&
    !draft.userOwned[draft.solvedField]
  ) {
    target = draft.solvedField;
  }

  const result = solveCagrSystem({
    cagrPercent: cagr.blank ? null : cagr.value,
    periods: periods.blank ? null : periods.value,
    initialValue: initial.blank ? null : initial.value,
    finalValue: final.blank ? null : final.value,
    target,
  });

  if (!result) {
    errors.form =
      'Could not solve a finite CAGR from these values (check for ambiguous or impossible inputs).';
    return { incomplete: false, errors, result: null, nextDraft: null };
  }

  // Apply solved display only into non-user-owned fields
  const nextDraft: CagrDraft = { ...draft, solvedField: result.solvedField };
  if (result.solvedField && !draft.userOwned[result.solvedField]) {
    nextDraft[result.solvedField] = result.displays[result.solvedField];
  }

  return { incomplete: false, errors: {}, result, nextDraft };
}
