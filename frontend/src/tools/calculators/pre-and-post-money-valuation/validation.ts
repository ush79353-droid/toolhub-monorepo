import { solvePrePostMoney } from './calculation';
import type { PpmDraft, PpmField, PpmSolveResult, PpmValues } from './types';
import { PPM_FIELDS } from './types';

function parseOptional(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return Number.NaN;
  return num;
}

export function manualValuesFromDraft(draft: PpmDraft): PpmValues {
  const manual: PpmValues = {};
  for (const key of PPM_FIELDS) {
    if (!draft.manual[key]) continue;
    const parsed = parseOptional(draft[key]);
    if (parsed === undefined) continue;
    manual[key] = parsed;
  }
  return manual;
}

export function validateAndSolve(draft: PpmDraft): PpmSolveResult {
  const manual = manualValuesFromDraft(draft);
  for (const key of PPM_FIELDS) {
    if (!draft.manual[key]) continue;
    const parsed = parseOptional(draft[key]);
    if (parsed !== undefined && Number.isNaN(parsed)) {
      return {
        values: manual,
        errors: { [key]: 'Enter a valid number' } as PpmSolveResult['errors'],
        inconsistent: false,
      };
    }
  }
  return solvePrePostMoney(manual);
}

export function applySolvedDisplay(
  draft: PpmDraft,
  solved: PpmValues,
  format: (field: PpmField, value: number) => string
): PpmDraft {
  const next: PpmDraft = { ...draft, manual: { ...draft.manual } };
  for (const key of PPM_FIELDS) {
    if (draft.manual[key]) continue;
    const value = solved[key];
    next[key] = value !== undefined && Number.isFinite(value) ? format(key, value) : '';
  }
  return next;
}
