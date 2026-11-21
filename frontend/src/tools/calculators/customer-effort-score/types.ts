export type CESScale = 5 | 7;

export type CESScore = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type CESInterpretationBand =
  | 'very-low'
  | 'low'
  | 'neutral'
  | 'elevated'
  | 'very-high';

export interface CESInput {
  scale: CESScale;
  /** Response count strings keyed by score 1..scale */
  counts: Record<string, string>;
  analysisOpen: boolean;
}

export interface CESResult {
  scale: CESScale;
  totalResponses: number;
  weightedSum: number;
  ces: number;
  lowEffortCount: number;
  neutralCount: number;
  highEffortCount: number;
  lowEffortPercentage: number;
  neutralPercentage: number;
  highEffortPercentage: number;
  median: number;
  modes: number[];
  distribution: readonly { score: number; count: number }[];
  band: CESInterpretationBand;
  interpretation: string;
  formattedCes: string;
  formattedLowEffortPercentage: string;
  formattedNeutralPercentage: string;
  formattedHighEffortPercentage: string;
}

export type CESFieldErrors = {
  form?: string;
} & Partial<Record<`score${CESScore}`, string>>;

export const SCALE_5_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Very easy',
  2: 'Easy',
  3: 'Neutral',
  4: 'Difficult',
  5: 'Very difficult',
};

export const SCALE_7_LABELS: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string> = {
  1: 'Very easy',
  2: 'Easy',
  3: 'Somewhat easy',
  4: 'Neutral',
  5: 'Somewhat difficult',
  6: 'Difficult',
  7: 'Very difficult',
};

export function emptyCounts(scale: CESScale): Record<string, string> {
  const counts: Record<string, string> = {};
  for (let score = 1; score <= scale; score += 1) {
    counts[String(score)] = '';
  }
  return counts;
}

export function createDefaultInput(): CESInput {
  return {
    scale: 5,
    counts: emptyCounts(5),
    analysisOpen: false,
  };
}

/** Worked example from the spec: CES ≈ 2.64 / 5 */
export function createExampleInput(): CESInput {
  return {
    scale: 5,
    counts: {
      '1': '10',
      '2': '5',
      '3': '3',
      '4': '5',
      '5': '5',
    },
    analysisOpen: true,
  };
}

export function scoreLabels(scale: CESScale): ReadonlyArray<{ score: number; label: string }> {
  if (scale === 5) {
    return ([1, 2, 3, 4, 5] as const).map((score) => ({
      score,
      label: SCALE_5_LABELS[score],
    }));
  }
  return ([1, 2, 3, 4, 5, 6, 7] as const).map((score) => ({
    score,
    label: SCALE_7_LABELS[score],
  }));
}
