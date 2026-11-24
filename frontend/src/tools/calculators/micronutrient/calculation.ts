/**
 * Micronutrient Calculator — pure engine (ADR-018).
 *
 * Maps chronological age + sex + element → National Academies / NIH ODS
 * RDA, AI, or sodium CDRR, plus Tolerable Upper Intake Level when published.
 * No FX. Educational lookup only.
 */

import {
  getElementSpec,
  recommendationKindFor,
  resolveLifeStage,
} from './micronutrient-data';
import type {
  MicronutrientInput,
  MicronutrientResult,
  RecommendationKind,
} from './types';

export const SOURCE_NOTE =
  'Food and Nutrition Board, National Academies / NIH Office of Dietary Supplements Dietary Reference Intakes (RDA, AI, CDRR) and Tolerable Upper Intake Levels for elements. Educational lookup only.';

export const DISCLAIMER =
  'Educational nutrition reference only — not a clinical diet prescription, diagnosis, or substitute for a registered dietitian or physician.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Convert age field to years (months ÷ 12). */
export function ageToYears(value: number, unit: MicronutrientInput['ageUnit']): number {
  return unit === 'years' ? value : value / 12;
}

export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  if (value >= 10) {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
  }
  // Small AI values (e.g. fluoride 0.01, manganese 0.003).
  const decimals = value < 0.01 ? 3 : value < 1 ? 2 : 1;
  return value.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function kindPhrase(kind: RecommendationKind): string {
  if (kind === 'rda') return 'Recommended Dietary Allowance (RDA)';
  if (kind === 'ai') return 'Adequate Intake (AI)';
  return 'Chronic Disease Risk Reduction (CDRR) intake';
}

function emptyResult(
  input: MicronutrientInput,
  partial?: Partial<MicronutrientResult>,
): MicronutrientResult {
  const spec = getElementSpec(input.elementId);
  return {
    elementId: input.elementId,
    elementLabel: spec?.label ?? input.elementId,
    populationLabel: '',
    recommendationKind: null,
    recommendationAmount: null,
    recommendationDisplay: '',
    unit: spec?.unit ?? '',
    ulAmount: null,
    ulDisplay: '',
    ulNote: null,
    statusHeadline: 'Enter age',
    statusDetail:
      'Provide age (and keep sex/element selected) to look up the age- and sex-specific RDA, AI, or CDRR and any published Tolerable Upper Intake Level for that element.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateMicronutrient(input: MicronutrientInput): MicronutrientResult {
  const spec = getElementSpec(input.elementId);
  if (!spec) {
    return emptyResult(input, {
      statusHeadline: 'Unknown element',
      statusDetail: 'Select a published mineral element from the list.',
    });
  }

  const ageRaw = parseNumber(input.ageText);
  if (ageRaw === null) {
    return emptyResult(input);
  }
  if (!(ageRaw > 0)) {
    return emptyResult(input, {
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be a positive number.',
    });
  }

  const ageYears = ageToYears(ageRaw, input.ageUnit);
  if (!(ageYears >= 0) || ageYears > 120) {
    return emptyResult(input, {
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be between birth and 120 years.',
    });
  }

  const stage = resolveLifeStage(ageYears);
  if (!stage) {
    return emptyResult(input, {
      statusHeadline: 'Age out of range',
      statusDetail: 'No DRI life-stage band matches that age.',
    });
  }

  const amount = spec.values[input.sex][stage.id];
  const kind = recommendationKindFor(spec, stage.id);
  const populationLabel =
    input.sex === 'male' ? stage.labelMale : stage.labelFemale;
  const ulAmount = spec.ul[stage.id];

  let ulDisplay = 'Not established';
  let ulNote = spec.ulNote;
  if (ulAmount != null) {
    ulDisplay = formatAmount(ulAmount);
    if (spec.ulKind === 'supplement' && !ulNote) {
      ulNote =
        'UL applies to supplemental / pharmacological intake in addition to food.';
    }
  } else if (spec.ulKind === 'nd') {
    ulDisplay = 'Not determinable (ND)';
  }

  return {
    elementId: spec.id,
    elementLabel: spec.label,
    populationLabel,
    recommendationKind: kind,
    recommendationAmount: amount,
    recommendationDisplay: formatAmount(amount),
    unit: spec.unit,
    ulAmount,
    ulDisplay,
    ulNote,
    statusHeadline: `${spec.label} ${kind.toUpperCase()}`,
    statusDetail: `${kindPhrase(kind)} for ${populationLabel}. UL is shown separately as a safety ceiling, not a target.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
