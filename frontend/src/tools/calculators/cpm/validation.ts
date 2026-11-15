import { solveCpm } from './calculation';
import type { CpmCampaignDraft, CpmField, CpmSolveResult, CpmValues } from './types';
import { CPM_FIELDS } from './types';

function parseOptional(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return Number.NaN;
  return num;
}

export function manualValuesFromCampaign(draft: CpmCampaignDraft): CpmValues {
  const manual: CpmValues = {};
  for (const key of CPM_FIELDS) {
    if (!draft.manual[key]) continue;
    const parsed = parseOptional(draft[key]);
    if (parsed === undefined) continue;
    manual[key] = parsed;
  }
  return manual;
}

export function validateAndSolveCampaign(draft: CpmCampaignDraft): CpmSolveResult {
  const manual = manualValuesFromCampaign(draft);
  for (const key of CPM_FIELDS) {
    if (!draft.manual[key]) continue;
    const parsed = parseOptional(draft[key]);
    if (parsed !== undefined && Number.isNaN(parsed)) {
      return {
        values: manual,
        errors: { [key]: 'Enter a valid number' } as CpmSolveResult['errors'],
        inconsistent: false,
      };
    }
  }
  return solveCpm(manual);
}

export function applySolvedDisplay(
  draft: CpmCampaignDraft,
  solved: CpmValues,
  format: (field: CpmField, value: number) => string
): CpmCampaignDraft {
  const next: CpmCampaignDraft = { ...draft, manual: { ...draft.manual } };
  for (const key of CPM_FIELDS) {
    if (draft.manual[key]) continue;
    const value = solved[key];
    next[key] = value !== undefined && Number.isFinite(value) ? format(key, value) : '';
  }
  return next;
}
