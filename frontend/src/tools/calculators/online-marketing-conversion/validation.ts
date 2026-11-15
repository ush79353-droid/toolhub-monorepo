import { solveOnlineMarketingConversion } from './calculation';
import {
  OMC_FIELDS,
  type OmcDraft,
  type OmcField,
  type OmcSolveResult,
  type OmcValues,
} from './types';

function parseOptional(raw: string): number | undefined {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return undefined;
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return Number.NaN;
  return num;
}

export function manualValuesFromDraft(draft: OmcDraft): OmcValues {
  const manual: OmcValues = {};
  for (const key of OMC_FIELDS) {
    if (!draft.manual[key]) continue;
    const parsed = parseOptional(draft[key]);
    if (parsed === undefined) continue;
    manual[key] = parsed;
  }
  return manual;
}

export function validateAndSolve(draft: OmcDraft): OmcSolveResult {
  const manual = manualValuesFromDraft(draft);
  for (const key of OMC_FIELDS) {
    if (!draft.manual[key]) continue;
    const parsed = parseOptional(draft[key]);
    if (parsed !== undefined && Number.isNaN(parsed)) {
      return {
        values: manual,
        errors: { [key]: 'Enter a valid number' },
      };
    }
  }
  return solveOnlineMarketingConversion(manual);
}

export function applySolvedDisplay(
  draft: OmcDraft,
  solved: OmcValues,
  format: (field: OmcField, value: number) => string
): OmcDraft {
  const next: OmcDraft = { ...draft, manual: { ...draft.manual } };
  for (const key of OMC_FIELDS) {
    if (draft.manual[key]) continue;
    const value = solved[key];
    next[key] = value !== undefined && Number.isFinite(value) ? format(key, value) : '';
  }
  return next;
}
