/**
 * Vitamin Calculator — UI stub (engine commit replaces with NIH ODS / DRI lookup).
 */

import type { VitaminInput, VitaminResult } from './types';
import { VITAMIN_OPTIONS } from './types';

export const SOURCE_NOTE =
  'NIH ODS / National Academies DRI vitamin RDA/AI (shared dri-data) + Tolerable Upper Intake Levels — engine wiring pending.';

export const DISCLAIMER =
  'Educational nutrition reference only — not a clinical diet prescription, diagnosis, or substitute for a registered dietitian or physician.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function optionFor(id: VitaminInput['vitaminId']) {
  return VITAMIN_OPTIONS.find((o) => o.id === id);
}

function emptyResult(
  input: VitaminInput,
  partial?: Partial<VitaminResult>,
): VitaminResult {
  const opt = optionFor(input.vitaminId);
  return {
    vitaminId: input.vitaminId,
    vitaminLabel: opt?.label ?? input.vitaminId,
    vitaminShortLabel: opt?.shortLabel ?? input.vitaminId,
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
      'Provide age (and keep sex/vitamin selected) to look up the age- and sex-specific RDA or AI and any published Tolerable Upper Intake Level for that vitamin.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateVitamin(input: VitaminInput): VitaminResult {
  return emptyResult(input);
}
