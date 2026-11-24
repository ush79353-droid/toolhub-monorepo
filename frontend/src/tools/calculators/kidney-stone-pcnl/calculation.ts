/**
 * S.T.O.N.E. nephrolithometry for PCNL — Okhunov et al., Urology 2013.
 * Probability bands match common educational tables used with Omni/MDApp
 * (score 5 → ~94% stone-free after first PCNL). Not the emergency renal-colic STONE score.
 */

import type {
  CalycesBand,
  DensityBand,
  KidneyStonePcnlInput,
  KidneyStonePcnlResult,
  ObstructionBand,
  StoneSizeBand,
  TractLengthBand,
} from './types';

export const SOURCE_NOTE =
  'Okhunov Z et al. S.T.O.N.E. nephrolithometry. Urology. 2013;81(6):1154-9. Educational PCNL complexity score only.';

export const DISCLAIMER =
  'Not a surgical plan or guarantee of stone-free status — confirm with the treating urology team and imaging.';

const SIZE_POINTS: Record<StoneSizeBand, number> = {
  s0_399: 1,
  s400_799: 2,
  s800_1599: 3,
  s1600_plus: 4,
};

const TRACT_POINTS: Record<TractLengthBand, number> = {
  le100: 1,
  gt100: 2,
};

const OBSTRUCTION_POINTS: Record<ObstructionBand, number> = {
  none_mild: 1,
  moderate_severe: 2,
};

const CALYCES_POINTS: Record<CalycesBand, number> = {
  c1_2: 1,
  c3: 2,
  staghorn: 3,
};

const DENSITY_POINTS: Record<DensityBand, number> = {
  le950: 1,
  gt950: 2,
};

/** Approximate single-procedure stone-free % by total score (educational table). */
export function stoneFreePercentForScore(total: number): number {
  if (total <= 5) return 94;
  if (total === 6) return 92;
  if (total === 7) return 88;
  if (total === 8) return 83;
  if (total === 9) return 64;
  if (total === 10) return 42;
  return 27; // ≥11
}

export function scoreComponents(input: KidneyStonePcnlInput): {
  size: number;
  tract: number;
  obstruction: number;
  calyces: number;
  density: number;
  total: number;
} {
  const size = SIZE_POINTS[input.stoneSize];
  const tract = TRACT_POINTS[input.tractLength];
  const obstruction = OBSTRUCTION_POINTS[input.obstruction];
  const calyces = CALYCES_POINTS[input.calyces];
  const density = DENSITY_POINTS[input.density];
  return {
    size,
    tract,
    obstruction,
    calyces,
    density,
    total: size + tract + obstruction + calyces + density,
  };
}

export function calculateKidneyStonePcnl(
  input: KidneyStonePcnlInput,
): KidneyStonePcnlResult {
  const parts = scoreComponents(input);
  const pct = stoneFreePercentForScore(parts.total);
  return {
    totalScore: parts.total,
    stoneFreePercent: pct,
    explanation: `There is approximately a ${pct}% chance of a stone-free outcome after the first percutaneous nephrolithotomy.`,
    disclaimer: DISCLAIMER,
    sourceNote: SOURCE_NOTE,
  };
}
