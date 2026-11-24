/**
 * CAGE questionnaire (Ewing 1984) — educational alcohol screen.
 *
 * Each Yes = 1 point (0–4). Teaching cutoff ≥2 suggests possible alcohol
 * problems and further assessment — does not diagnose alcoholism.
 * Screenshot: unchecked boxes are No; defaults score 0 with low-risk copy.
 */

import type { CageBand, CageInput, CageResult } from './types';

export const SOURCE_NOTE =
  'CAGE (Cut down, Annoyed, Guilty, Eye-opener) per Ewing JA. Detecting alcoholism: the CAGE questionnaire. JAMA. 1984;252(14):1905–1907. Each Yes = 1; total 0–4. Common teaching cutoff ≥2 warrants further assessment. A low score cannot exclude a disorder.';

export const DISCLAIMER =
  'Educational screening worksheet only — not a diagnosis of alcoholism or alcohol use disorder.';

export function computeCageScore(input: CageInput): number {
  return (
    (input.cutDown ? 1 : 0) +
    (input.annoyed ? 1 : 0) +
    (input.guilty ? 1 : 0) +
    (input.eyeOpener ? 1 : 0)
  );
}

export function bandForScore(score: number): CageBand {
  return score >= 2 ? 'positive' : 'low';
}

export function calculateCage(input: CageInput): CageResult {
  const score = computeCageScore(input);
  const screenBand = bandForScore(score);

  if (screenBand === 'low') {
    return {
      score,
      screenBand,
      statusHeadline: `Your result is ${score} point${score === 1 ? '' : 's'}.`,
      statusDetail:
        score === 0
          ? 'You probably do not have an alcohol problem.'
          : 'Score below the common ≥2 teaching cutoff. A low score cannot exclude a disorder — seek clinical advice if concerned.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  return {
    score,
    screenBand,
    statusHeadline: `Your result is ${score} points.`,
    statusDetail:
      'Score ≥2 is a positive CAGE screen in common teaching use and suggests further clinical assessment — not a diagnosis of alcoholism.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
