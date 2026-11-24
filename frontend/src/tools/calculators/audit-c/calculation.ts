/**
 * AUDIT-C — Alcohol Use Disorders Identification Test – Consumption (ADR-018).
 *
 * Three WHO/VA items scored 0–4 each (total 0–12). Bush et al. Arch Intern Med
 * 1998; VA AUDIT-C Ver3. Educational screen only — does not diagnose alcohol
 * dependence ("alcoholic").
 *
 * Positive screen teaching thresholds: men ≥4, women ≥3.
 */

import type {
  AuditCBinge,
  AuditCFrequency,
  AuditCInput,
  AuditCQuantity,
  AuditCResult,
  AuditCSex,
} from './types';
import {
  BINGE_OPTIONS,
  FREQUENCY_OPTIONS,
  QUANTITY_OPTIONS,
} from './types';

export const SOURCE_NOTE =
  'AUDIT-C (WHO AUDIT consumption items 1–3): each item 0–4, total 0–12. Teaching positive screens ≥4 (men) and ≥3 (women) per Bush/Kivlahan VA AUDIT-C guidance. A standard drink is typically ~14 g ethanol (US). Not a diagnosis of alcohol use disorder.';

export const DISCLAIMER =
  'Educational screening worksheet only — not a diagnosis of alcoholism or alcohol use disorder, and not a substitute for clinical assessment.';

export function frequencyPoints(value: AuditCFrequency): number | null {
  if (value === '') return null;
  const hit = FREQUENCY_OPTIONS.find((o) => o.value === value);
  return hit ? hit.points : null;
}

export function quantityPoints(value: AuditCQuantity): number | null {
  if (value === '') return null;
  const hit = QUANTITY_OPTIONS.find((o) => o.value === value);
  return hit ? hit.points : null;
}

export function bingePoints(value: AuditCBinge): number | null {
  if (value === '') return null;
  const hit = BINGE_OPTIONS.find((o) => o.value === value);
  return hit ? hit.points : null;
}

export function positiveThreshold(sex: AuditCSex): number | null {
  if (sex === 'male') return 4;
  if (sex === 'female') return 3;
  return null;
}

export function computeAuditCScore(
  frequency: number,
  quantity: number,
  binge: number,
): number {
  if (
    !Number.isFinite(frequency) ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(binge)
  ) {
    throw new Error('AUDIT-C item points must be finite.');
  }
  if (
    frequency < 0 ||
    frequency > 4 ||
    quantity < 0 ||
    quantity > 4 ||
    binge < 0 ||
    binge > 4
  ) {
    throw new Error('AUDIT-C item points must be in 0–4.');
  }
  return frequency + quantity + binge;
}

export function calculateAuditC(input: AuditCInput): AuditCResult {
  const empty: AuditCResult = {
    score: null,
    frequencyPoints: null,
    quantityPoints: null,
    bingePoints: null,
    screenBand: null,
    threshold: null,
    statusHeadline: 'Select sex and all three items',
    statusDetail:
      'Sex starts unset and each question starts on Select. Unanswered items are not scored as zero.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const f = frequencyPoints(input.frequency);
  const q = quantityPoints(input.quantity);
  const b = bingePoints(input.binge);
  const threshold = positiveThreshold(input.sex);

  if (f === null || q === null || b === null || threshold === null) {
    return empty;
  }

  const score = computeAuditCScore(f, q, b);
  const positive = score >= threshold;
  const screenBand = positive ? 'positive' : 'negative';

  return {
    score,
    frequencyPoints: f,
    quantityPoints: q,
    bingePoints: b,
    screenBand,
    threshold,
    statusHeadline: `AUDIT-C score ${score} / 12`,
    statusDetail: positive
      ? `Score ≥${threshold} is a positive screen for this sex in VA/WHO teaching thresholds — higher scores suggest greater likelihood of hazardous drinking. This does not diagnose alcohol dependence.`
      : `Score <${threshold} is a negative screen for this sex at the common teaching cut-point. Patterns can still warrant clinician review.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatAuditCScore(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return String(value);
}
