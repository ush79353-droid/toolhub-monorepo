/**
 * Duke Treadmill Score — screenshot UI + typed Mark DTS engine.
 *
 * Blank duration (min) + max ST deviation (mm); angina radios default none.
 * Score blank until both numeric fields are valid.
 */

export type AnginaIndex = 'none' | 'nonLimiting' | 'limiting';

export interface DukeTreadmillScoreInput {
  durationMinutesText: string;
  stDeviationMmText: string;
  angina: AnginaIndex;
}

export interface DukeTreadmillScoreResult {
  score: number | null;
  anginaIndexNumeric: 0 | 1 | 2;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type DukeTreadmillScoreFieldErrors = {
  durationMinutesText?: string;
  stDeviationMmText?: string;
};

/** Screenshot reload defaults: blank numerics, no angina. */
export function createDefaultInput(): DukeTreadmillScoreInput {
  return {
    durationMinutesText: '',
    stDeviationMmText: '',
    angina: 'none',
  };
}

export function createEmptyInput(): DukeTreadmillScoreInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: DukeTreadmillScoreInput,
  b: DukeTreadmillScoreInput,
): boolean {
  return (
    a.durationMinutesText === b.durationMinutesText &&
    a.stDeviationMmText === b.stDeviationMmText &&
    a.angina === b.angina
  );
}
