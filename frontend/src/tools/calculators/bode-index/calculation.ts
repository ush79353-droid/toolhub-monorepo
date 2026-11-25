/**
 * BODE Index (Celli BR et al., N Engl J Med 2004;350:1005-12) — pure engine.
 *
 * Points (original COPD cohort weights), total 0–10:
 *   B — BMI ≤ 21 → 1; BMI > 21 → 0
 *   O — FEV1 % predicted: ≥65 → 0; 50–64 → 1; 36–49 → 2; ≤35 → 3
 *   D — mMRC: 0–1 → 0; 2 → 1; 3 → 2; 4 → 3
 *   E — 6-min walk (m): ≥350 → 0; 250–349 → 1; 150–249 → 2; ≤149 → 3
 *
 * Equality thresholds follow the published table (≤ / ≥ as listed).
 */

import { DISCLAIMER, SOURCE_NOTE } from './content';
import type {
  BodeIndexInput,
  BodeIndexPoints,
  BodeIndexResult,
  Fev1Band,
  MmrcBand,
  WalkBand,
} from './types';

export { DISCLAIMER, SOURCE_NOTE };

export function fev1Points(band: Exclude<Fev1Band, ''>): number {
  switch (band) {
    case 'ge65':
      return 0;
    case '50to64':
      return 1;
    case '36to49':
      return 2;
    case 'le35':
      return 3;
  }
}

export function walkPoints(band: Exclude<WalkBand, ''>): number {
  switch (band) {
    case 'ge350':
      return 0;
    case '250to349':
      return 1;
    case '150to249':
      return 2;
    case 'le149':
      return 3;
  }
}

export function mmrcPoints(band: Exclude<MmrcBand, ''>): number {
  switch (band) {
    case '0or1':
      return 0;
    case '2':
      return 1;
    case '3':
      return 2;
    case '4':
      return 3;
  }
}

/** Numeric walk meters → band using Celli equality thresholds. */
export function walkBandFromMeters(meters: number): Exclude<WalkBand, ''> {
  if (meters >= 350) return 'ge350';
  if (meters >= 250) return '250to349';
  if (meters >= 150) return '150to249';
  return 'le149';
}

export function calculateBodeIndex(input: BodeIndexInput): BodeIndexResult {
  const empty = {
    score: null as number | null,
    points: null as BodeIndexPoints | null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (input.bmiOver21 === null) {
    return {
      ...empty,
      statusHeadline: 'Answer BMI over 21',
      statusDetail:
        'Check the box if BMI is over 21 (0 points). Leave it unchecked only after confirming BMI ≤ 21 (1 point). Unanswered BMI is not scored as low BMI.',
    };
  }

  if (input.fev1 === '' || input.walk === '' || input.mmrc === '') {
    return {
      ...empty,
      statusHeadline: 'Select FEV1, walk distance, and mMRC',
      statusDetail:
        'Choose one option in each radio group. Score stays blank until BMI and all three components are answered.',
    };
  }

  const points: BodeIndexPoints = {
    bmi: input.bmiOver21 ? 0 : 1,
    fev1: fev1Points(input.fev1),
    walk: walkPoints(input.walk),
    mmrc: mmrcPoints(input.mmrc),
  };

  const score = points.bmi + points.fev1 + points.walk + points.mmrc;

  return {
    score,
    points,
    statusHeadline: 'BODE Index score',
    statusDetail: `Score ${score}/10 (B${points.bmi} O${points.fev1} D${points.mmrc} E${points.walk}). Educational only — not individual survival prediction.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatScore(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return String(value);
}
