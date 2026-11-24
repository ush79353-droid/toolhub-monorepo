/**
 * Micronutrient Calculator — UI stub (ADR-019 commit 1).
 * NIH ODS / National Academies DRI element lookup lands in the engine commit.
 */

import { ELEMENT_OPTIONS, type MicronutrientInput, type MicronutrientResult } from './types';

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

function elementLabel(id: MicronutrientInput['elementId']): string {
  return ELEMENT_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function calculateMicronutrient(input: MicronutrientInput): MicronutrientResult {
  return {
    elementId: input.elementId,
    elementLabel: elementLabel(input.elementId),
    populationLabel: '',
    recommendationKind: null,
    recommendationAmount: null,
    recommendationDisplay: '',
    unit: '',
    ulAmount: null,
    ulDisplay: '',
    ulNote: null,
    statusHeadline: 'Enter age',
    statusDetail:
      'Provide age (and keep sex/element selected) to look up the age- and sex-specific RDA, AI, or CDRR and any published Tolerable Upper Intake Level for that element.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
