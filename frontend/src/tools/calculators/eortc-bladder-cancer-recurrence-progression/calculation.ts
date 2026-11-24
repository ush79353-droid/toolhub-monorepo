/**
 * EORTC NMIBC recurrence / progression scores — Sylvester et al., Eur Urol 2006.
 * Separate weights and Table 6 probability bins. WHO 1973 G1–G3.
 */

import { DISCLAIMER, SOURCE_LABEL } from './content';
import type { EortcBladderInput, EortcBladderResult } from './types';
import { isCompleteInput } from './types';

export { DISCLAIMER, SOURCE_LABEL };

const RECURRENCE_WEIGHTS = {
  tumorCount: { single: 0, twoToSeven: 3, eightPlus: 6 },
  tumorDiameter: { under3cm: 0, ge3cm: 3 },
  priorRecurrenceRate: { primary: 0, leOnePerYear: 2, gtOnePerYear: 4 },
  stage: { ta: 0, t1: 1 },
  concomitantCis: { no: 0, yes: 1 },
  grade: { g1: 0, g2: 1, g3: 2 },
} as const;

const PROGRESSION_WEIGHTS = {
  tumorCount: { single: 0, twoToSeven: 3, eightPlus: 3 },
  tumorDiameter: { under3cm: 0, ge3cm: 3 },
  priorRecurrenceRate: { primary: 0, leOnePerYear: 2, gtOnePerYear: 2 },
  stage: { ta: 0, t1: 4 },
  concomitantCis: { no: 0, yes: 6 },
  grade: { g1: 0, g2: 0, g3: 5 },
} as const;

/** Table 6 recurrence bins (point estimate %). */
export function recurrenceProbabilities(score: number): {
  at1Year: number;
  at5Years: number;
} {
  if (score <= 0) return { at1Year: 15, at5Years: 31 };
  if (score <= 4) return { at1Year: 24, at5Years: 46 };
  if (score <= 9) return { at1Year: 38, at5Years: 62 };
  return { at1Year: 61, at5Years: 78 };
}

/** Table 6 progression bins (point estimate %). Score 1 is not produced by weights. */
export function progressionProbabilities(score: number): {
  at1Year: number;
  at5Years: number;
} {
  if (score <= 0) return { at1Year: 0.2, at5Years: 0.8 };
  if (score <= 6) return { at1Year: 1, at5Years: 6 };
  if (score <= 13) return { at1Year: 5, at5Years: 17 };
  return { at1Year: 17, at5Years: 45 };
}

export function formatPercent(value: number): string {
  if (Number.isInteger(value)) return `${value}%`;
  return `${value}%`;
}

export function calculateEortcBladder(
  input: EortcBladderInput,
): EortcBladderResult {
  if (!isCompleteInput(input)) {
    throw new Error('EORTC input incomplete');
  }

  const recurrencePoints =
    RECURRENCE_WEIGHTS.tumorCount[input.tumorCount!] +
    RECURRENCE_WEIGHTS.tumorDiameter[input.tumorDiameter!] +
    RECURRENCE_WEIGHTS.priorRecurrenceRate[input.priorRecurrenceRate!] +
    RECURRENCE_WEIGHTS.stage[input.stage!] +
    RECURRENCE_WEIGHTS.concomitantCis[input.concomitantCis!] +
    RECURRENCE_WEIGHTS.grade[input.grade!];

  const progressionPoints =
    PROGRESSION_WEIGHTS.tumorCount[input.tumorCount!] +
    PROGRESSION_WEIGHTS.tumorDiameter[input.tumorDiameter!] +
    PROGRESSION_WEIGHTS.priorRecurrenceRate[input.priorRecurrenceRate!] +
    PROGRESSION_WEIGHTS.stage[input.stage!] +
    PROGRESSION_WEIGHTS.concomitantCis[input.concomitantCis!] +
    PROGRESSION_WEIGHTS.grade[input.grade!];

  const recurrence = recurrenceProbabilities(recurrencePoints);
  const progression = progressionProbabilities(progressionPoints);

  return {
    recurrencePoints,
    progressionPoints,
    recurrenceProb1YearPct: recurrence.at1Year,
    recurrenceProb5YearPct: recurrence.at5Years,
    progressionProb1YearPct: progression.at1Year,
    progressionProb5YearPct: progression.at5Years,
    formattedRecurrencePoints: String(recurrencePoints),
    formattedProgressionPoints: String(progressionPoints),
    formattedRecurrence1Year: formatPercent(recurrence.at1Year),
    formattedRecurrence5Year: formatPercent(recurrence.at5Years),
    formattedProgression1Year: formatPercent(progression.at1Year),
    formattedProgression5Year: formatPercent(progression.at5Years),
    explanation: `Recurrence score ${recurrencePoints}/17 → ~${formatPercent(recurrence.at1Year)} at 1 year and ~${formatPercent(recurrence.at5Years)} at 5 years. Progression score ${progressionPoints}/23 → ~${formatPercent(progression.at1Year)} at 1 year and ~${formatPercent(progression.at5Years)} at 5 years (Sylvester 2006 Table 6 point estimates).`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
