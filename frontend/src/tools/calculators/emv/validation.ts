import { isSupportedCurrency } from '@/tools/shared/currency';
import { buildEmvResult, calculateRiskEmv } from './calculation';
import {
  MAX_RISKS,
  MIN_RISKS,
  emptyRisk,
  type EmvDraft,
  type EmvFieldErrors,
  type EmvResult,
  type EmvRiskValues,
} from './types';

function parseSignedNumber(raw: string, label: string): {
  value: number | null;
  blank: boolean;
  error?: string;
} {
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

function parseProbability(raw: string): {
  value: number | null;
  blank: boolean;
  error?: string;
} {
  const parsed = parseSignedNumber(raw, 'Probability');
  if (parsed.blank || parsed.error || parsed.value === null) return parsed;
  if (parsed.value < 0 || parsed.value > 100) {
    return {
      value: null,
      blank: false,
      error: 'Probability must be between 0 and 100%.',
    };
  }
  return parsed;
}

/** Resize risk list when the dropdown changes; keep prior entries. */
export function resizeRisks(draft: EmvDraft, nextCount: number): EmvDraft {
  const count = Math.min(MAX_RISKS, Math.max(MIN_RISKS, Math.trunc(nextCount)));
  const risks = draft.risks.slice(0, count);
  while (risks.length < count) risks.push(emptyRisk());
  return { ...draft, riskCount: count, risks };
}

export function validateEmvDraft(draft: EmvDraft): {
  isValid: boolean;
  incomplete: boolean;
  errors: EmvFieldErrors;
  result: EmvResult | null;
} {
  const errors: EmvFieldErrors = {};
  let anyBlank = false;

  if (!isSupportedCurrency(draft.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  if (
    !Number.isInteger(draft.riskCount) ||
    draft.riskCount < MIN_RISKS ||
    draft.riskCount > MAX_RISKS
  ) {
    errors.riskCount = `Choose between ${MIN_RISKS} and ${MAX_RISKS} risks.`;
  }

  const activeRisks = draft.risks.slice(0, draft.riskCount);
  const parsedRisks: EmvRiskValues[] = [];

  activeRisks.forEach((risk, index) => {
    const n = index + 1;
    const impact = parseSignedNumber(risk.impact, `Risk ${n} impact`);
    const probability = parseProbability(risk.probability);

    if (impact.blank || probability.blank) anyBlank = true;
    if (!impact.blank && impact.error) errors[`risk${n}Impact`] = impact.error;
    if (!probability.blank && probability.error) {
      errors[`risk${n}Probability`] = probability.error;
    }

    if (
      !impact.blank &&
      !probability.blank &&
      impact.value !== null &&
      probability.value !== null &&
      !impact.error &&
      !probability.error
    ) {
      const riskEmv = calculateRiskEmv(impact.value, probability.value);
      if (!Number.isFinite(riskEmv)) {
        errors[`risk${n}`] = `Risk ${n} does not produce a finite EMV.`;
      } else {
        parsedRisks.push({
          impact: impact.value,
          probability: probability.value,
          riskEmv,
        });
      }
    }
  });

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  if (parsedRisks.length !== draft.riskCount) {
    errors.form = 'Complete every risk to calculate EMV.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = buildEmvResult(parsedRisks, draft.currency);
  if (!result) {
    errors.form = 'This combination does not produce a finite EMV.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
