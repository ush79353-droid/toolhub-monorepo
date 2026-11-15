import { solveCpcCpm } from './calculation';
import type { CpcCpmDraft, CpcCpmField, CpcCpmSolveResult, CpcCpmValues } from './types';
import { CPC_CPM_FIELDS } from './types';

function parseOptional(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return Number.NaN;
  return num;
}

/** Build manual numeric map from draft flags + strings. */
export function manualValuesFromDraft(draft: CpcCpmDraft): CpcCpmValues {
  const manual: CpcCpmValues = {};
  for (const key of CPC_CPM_FIELDS) {
    if (!draft.manual[key]) continue;
    const parsed = parseOptional(draft[key]);
    if (parsed === undefined) continue;
    manual[key] = parsed;
  }
  return manual;
}

export function validateAndSolve(draft: CpcCpmDraft): CpcCpmSolveResult {
  const manual = manualValuesFromDraft(draft);
  for (const key of CPC_CPM_FIELDS) {
    if (!draft.manual[key]) continue;
    const parsed = parseOptional(draft[key]);
    if (parsed !== undefined && Number.isNaN(parsed)) {
      return {
        values: manual,
        errors: { [key]: 'Enter a valid number' } as CpcCpmSolveResult['errors'],
        inconsistent: false,
      };
    }
  }
  return solveCpcCpm(manual);
}

export function applySolvedDisplay(
  draft: CpcCpmDraft,
  solved: CpcCpmValues,
  format: (field: CpcCpmField, value: number) => string
): CpcCpmDraft {
  const next: CpcCpmDraft = { ...draft, manual: { ...draft.manual } };
  for (const key of CPC_CPM_FIELDS) {
    if (draft.manual[key]) continue;
    const value = solved[key];
    next[key] = value !== undefined && Number.isFinite(value) ? format(key, value) : '';
  }
  return next;
}
