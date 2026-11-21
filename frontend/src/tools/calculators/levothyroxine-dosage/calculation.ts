/**
 * Levothyroxine eligibility / education engine (ADR-018).
 *
 * References consulted (label context — not a published personal Rx algorithm):
 * - DailyMed SYNTHROID (levothyroxine sodium) tablet, updated 2024-02-20,
 *   setid 1e11ad30-1041-4520-10b0-8f9d30d30fcc — §2.2–2.3 adult dosing table:
 *   full replacement ≈ 1.6 mcg/kg/day; lower start if cardiac disease / geriatric;
 *   titrate on TSH or free-T4; dosing must be individualized.
 * - FDA label 021402s038 (same Table 1 teaching).
 *
 * This module NEVER returns doseMcgPerDay. Screenshot fields alone lack
 * indication confirmation, complete labs, pregnancy status, and specialist approval.
 */

import type {
  HeightUnit,
  LevothyroxineDosageInput,
  LevothyroxineDosageResult,
  WeightUnit,
} from './types';

export const KG_PER_POUND = 0.45359237;
export const CM_PER_INCH = 2.54;

/** FDA label teaching constant (adult full replacement) — not emitted as Rx. */
export const FDA_FULL_REPLACEMENT_MCG_PER_KG = 1.6;

export const SOURCE_NOTE =
  'Educational context from SYNTHROID DailyMed labeling (updated 2024-02-20, setid 1e11ad30-1041-4520-10b0-8f9d30d30fcc) and FDA label dosing table for adults. Not a prescription.';

export const DISCLAIMER =
  'Always confirm indication, labs, cardiac status, pregnancy, interactions, and product labeling with a clinician. This calculator does not prescribe levothyroxine.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_POUND : value;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'in' ? value * CM_PER_INCH : value;
}

/**
 * Label teaching arithmetic only — exported for tests / documentation.
 * Must not be written into doseMcgPerDay until clinical approval exists.
 */
export function educationalFullReplacementMcg(weightKg: number): number {
  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    throw new Error('Weight must be a positive finite number.');
  }
  return Math.round(FDA_FULL_REPLACEMENT_MCG_PER_KG * weightKg);
}

export function calculateLevothyroxineDosage(
  input: LevothyroxineDosageInput,
): LevothyroxineDosageResult {
  const weightRaw = parseNumber(input.weightText);
  const heightRaw = parseNumber(input.heightText);

  const educationalLines: string[] = [
    'FDA adult labeling: full replacement dose is about 1.6 mcg/kg/day for diagnosed hypothyroidism in adults; some patients need a lower start.',
    'Adults with underlying cardiac disease or geriatric patients: start at less than full replacement and titrate more slowly (often guided toward 12.5–25 mcg teaching starts in older product language) using TSH or free-T4.',
    'Peak therapeutic effect of a given dose may take 4–6 weeks. Doses >200 mcg/day are seldom required.',
  ];

  if (input.ft4 === 'normal') {
    return {
      outcome: 'cannot_determine',
      doseMcgPerDay: null,
      statusHeadline: 'Dose cannot be determined from these inputs',
      statusDetail:
        'A Normal FT4 selection alone does not authorize a levothyroxine replacement prescription. Diagnosis, TSH/free-T4 interpretation, and clinician review are required.',
      educationalLines,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (weightRaw === null) {
    return {
      outcome: 'awaiting_inputs',
      doseMcgPerDay: null,
      statusHeadline: 'Enter weight to continue the eligibility check',
      statusDetail:
        'Weight is collected for FDA label educational context (mcg/kg teaching). Height is optional and is not used to invent a dose here. No mcg/day value is published.',
      educationalLines,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (!(weightRaw > 0)) {
    return {
      outcome: 'cannot_determine',
      doseMcgPerDay: null,
      statusHeadline: 'Dose cannot be determined from these inputs',
      statusDetail: 'Weight must be a positive number.',
      educationalLines,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (heightRaw !== null && !(heightRaw > 0)) {
    return {
      outcome: 'cannot_determine',
      doseMcgPerDay: null,
      statusHeadline: 'Dose cannot be determined from these inputs',
      statusDetail: 'Height, when entered, must be a positive number.',
      educationalLines,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  let labelContext = '';
  try {
    const edu = educationalFullReplacementMcg(weightKg);
    labelContext = ` At the entered weight (${weightKg.toFixed(1)} kg), the FDA adult full-replacement teaching figure 1.6 mcg/kg/day corresponds to about ${edu} mcg/day — shown only as label arithmetic, not as this tool’s prescribed dose.`;
  } catch {
    labelContext = '';
  }

  const cardiacOrOlder =
    input.heartDisease === 'yes' || input.ageBand === 'over_50';

  return {
    outcome: 'clinician_review_required',
    doseMcgPerDay: null,
    statusHeadline: 'Clinician review required',
    statusDetail: cardiacOrOlder
      ? `Age band Over 50 and/or reported heart disease place the person in FDA lower-start / slower-titration populations. Screenshot fields still omit confirmed indication, full labs, pregnancy, and specialist approval — so mcg/day remains unpublished.${labelContext}`
      : `FT4 is marked Low and weight is present, but Omega has no specialist-approved prescribing package for these inputs alone (missing confirmed indication, TSH/panel interpretation, pregnancy status, and titration plan).${labelContext}`,
    educationalLines,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
