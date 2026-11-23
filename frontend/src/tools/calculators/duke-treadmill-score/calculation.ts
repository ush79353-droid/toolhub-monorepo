/**
 * Duke Treadmill Score (Mark et al.) educational arithmetic (ADR-018).
 *
 * DTS = Bruce exercise duration (min) − 5 × |max ST deviation| (mm)
 *       − 4 × angina index
 * Angina index: 0 = none, 1 = non-limiting, 2 = exercise-limiting.
 *
 * Sources: Mark DB et al. Ann Intern Med. 1987;106:793–800;
 * Mark DB et al. N Engl J Med. 1991;325:849–853 (prognostic validation).
 * Protocol assumed: standard Bruce treadmill (exercise time in minutes).
 * ST: maximum net ST-segment deviation during exercise (mm); engine uses
 * absolute value so either depression or elevation magnitude is accepted.
 *
 * Educational score only — not a revascularization or discharge decision.
 */

import type {
  AnginaIndex,
  DukeTreadmillScoreInput,
  DukeTreadmillScoreResult,
} from './types';

export const SOURCE_NOTE =
  'Duke treadmill score as described by Mark et al. (Ann Intern Med 1987; N Engl J Med 1991): exercise minutes on Bruce protocol − 5×max ST deviation (mm) − 4×angina index (0/1/2). Educational only.';

export const DISCLAIMER =
  'Educational treadmill score arithmetic — not a diagnosis, ischemia confirmation, or substitute for clinical ECG interpretation and cardiology judgment.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function anginaIndexPoints(angina: AnginaIndex): 0 | 1 | 2 {
  switch (angina) {
    case 'none':
      return 0;
    case 'nonLimiting':
      return 1;
    case 'limiting':
      return 2;
  }
}

/**
 * Classic Duke treadmill score. Preserves fractional minutes; may be negative.
 * ST deviation uses absolute millimeters (prompt: maximal ST-segment deviation).
 */
export function dukeTreadmillScore(
  durationMinutes: number,
  stDeviationMm: number,
  angina: AnginaIndex,
): number {
  if (!(durationMinutes >= 0) || !Number.isFinite(durationMinutes)) {
    throw new Error('Duration must be a non-negative finite number.');
  }
  if (!(stDeviationMm >= 0) || !Number.isFinite(stDeviationMm)) {
    throw new Error('ST deviation must be a non-negative finite number.');
  }
  const ai = anginaIndexPoints(angina);
  return durationMinutes - 5 * stDeviationMm - 4 * ai;
}

export function calculateDukeTreadmillScore(
  input: DukeTreadmillScoreInput,
): DukeTreadmillScoreResult {
  const ai = anginaIndexPoints(input.angina);
  const duration = parseNumber(input.durationMinutesText);
  const st = parseNumber(input.stDeviationMmText);

  if (duration === null || st === null) {
    return {
      score: null,
      anginaIndexNumeric: ai,
      statusHeadline: 'Enter duration and ST deviation',
      statusDetail:
        'The Duke treadmill score stays blank until both exercise duration (min) and maximal ST-segment deviation (mm) are entered.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (!(duration >= 0)) {
    return {
      score: null,
      anginaIndexNumeric: ai,
      statusHeadline: 'Invalid duration',
      statusDetail: 'Exercise duration cannot be negative.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }
  if (!(st >= 0)) {
    return {
      score: null,
      anginaIndexNumeric: ai,
      statusHeadline: 'Invalid ST deviation',
      statusDetail: 'Enter maximal ST-segment deviation as a non-negative mm magnitude.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const score = dukeTreadmillScore(duration, st, input.angina);
  return {
    score,
    anginaIndexNumeric: ai,
    statusHeadline: 'Duke treadmill score',
    statusDetail: `DTS = ${duration} − 5×${st} − 4×${ai} (Bruce minutes, ST mm, angina index). Negative scores are allowed.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatDukeScore(score: number | null): string {
  if (score == null || !Number.isFinite(score)) return '';
  // Preserve fractional minutes without forced integer rounding.
  const rounded = Math.round(score * 1000) / 1000;
  return String(rounded);
}
