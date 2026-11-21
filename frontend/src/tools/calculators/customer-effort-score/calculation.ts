import type {
  CESInterpretationBand,
  CESResult,
  CESScale,
} from './types';

export interface CESBreakdown {
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
  distribution: { score: number; count: number }[];
  band: CESInterpretationBand;
  interpretation: string;
}

function scoresFor(scale: CESScale): number[] {
  return Array.from({ length: scale }, (_, i) => i + 1);
}

function effortGroups(scale: CESScale): {
  low: number[];
  neutral: number[];
  high: number[];
} {
  if (scale === 5) {
    return { low: [1, 2], neutral: [3], high: [4, 5] };
  }
  return { low: [1, 2, 3], neutral: [4], high: [5, 6, 7] };
}

/** Median from frequency distribution without expanding all responses. */
export function medianFromDistribution(
  distribution: readonly { score: number; count: number }[],
  total: number,
): number {
  if (total <= 0) return Number.NaN;
  const mid1 = Math.floor((total - 1) / 2);
  const mid2 = Math.floor(total / 2);
  let seen = 0;
  let v1 = Number.NaN;
  let v2 = Number.NaN;
  for (const row of distribution) {
    const next = seen + row.count;
    if (Number.isNaN(v1) && mid1 < next) v1 = row.score;
    if (Number.isNaN(v2) && mid2 < next) {
      v2 = row.score;
      break;
    }
    seen = next;
  }
  return (v1 + v2) / 2;
}

export function modesFromDistribution(
  distribution: readonly { score: number; count: number }[],
): number[] {
  let max = 0;
  for (const row of distribution) {
    if (row.count > max) max = row.count;
  }
  if (max <= 0) return [];
  return distribution.filter((row) => row.count === max).map((row) => row.score);
}

/**
 * Lower CES = less effort (1 = very easy, max = very difficult).
 * Illustrative bands only — not universal industry benchmarks.
 */
export function interpretCes(ces: number, scale: CESScale): {
  band: CESInterpretationBand;
  interpretation: string;
} {
  if (scale === 5) {
    if (ces < 2) {
      return {
        band: 'very-low',
        interpretation:
          'Customers generally report that the interaction requires very little effort.',
      };
    }
    if (ces < 3) {
      return {
        band: 'low',
        interpretation:
          'Customers report relatively low effort overall on this 1–5 scale.',
      };
    }
    if (Math.abs(ces - 3) < 1e-9) {
      return {
        band: 'neutral',
        interpretation:
          'Customer responses are centered around the neutral point of the effort scale.',
      };
    }
    if (ces <= 4) {
      return {
        band: 'elevated',
        interpretation:
          'Customers report elevated effort. Review journey steps that may create friction.',
      };
    }
    return {
      band: 'very-high',
      interpretation:
        'Customers report relatively high effort. Consider investigating friction in the customer journey.',
    };
  }

  // 1–7: bands relative to midpoint 4
  if (ces < 2.5) {
    return {
      band: 'very-low',
      interpretation:
        'Customers generally report that the interaction requires very little effort on this 1–7 scale.',
    };
  }
  if (ces < 3.5) {
    return {
      band: 'low',
      interpretation:
        'Customers report relatively low effort overall on this 1–7 scale.',
    };
  }
  if (Math.abs(ces - 4) < 1e-9 || (ces >= 3.5 && ces <= 4.5)) {
    if (Math.abs(ces - 4) < 1e-9) {
      return {
        band: 'neutral',
        interpretation:
          'Customer responses are centered around the neutral point of the 1–7 effort scale.',
      };
    }
    return {
      band: 'neutral',
      interpretation:
        'Customer responses are near the midpoint of the 1–7 effort scale.',
    };
  }
  if (ces <= 5.5) {
    return {
      band: 'elevated',
      interpretation:
        'Customers report elevated effort on this 1–7 scale. Review journey friction points.',
    };
  }
  return {
    band: 'very-high',
    interpretation:
      'Customers report relatively high effort. Consider investigating friction in the customer journey.',
  };
}

export function formatCes(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * CES = Σ(score × count) / Σ(count)
 * Response counts must be nonnegative safe integers.
 */
export function calculateCES(
  scale: CESScale,
  responses: Readonly<Record<number, number>>,
): CESBreakdown | null {
  if (scale !== 5 && scale !== 7) return null;

  const scores = scoresFor(scale);
  for (const score of scores) {
    const count = responses[score] ?? 0;
    if (!Number.isSafeInteger(count) || count < 0) return null;
  }

  const totalResponses = scores.reduce(
    (sum, score) => sum + (responses[score] ?? 0),
    0,
  );
  const weightedSum = scores.reduce(
    (sum, score) => sum + score * (responses[score] ?? 0),
    0,
  );

  if (!Number.isSafeInteger(totalResponses) || !Number.isSafeInteger(weightedSum)) {
    return null;
  }
  if (totalResponses === 0) return null;

  const ces = weightedSum / totalResponses;
  if (!Number.isFinite(ces)) return null;

  const groups = effortGroups(scale);
  const sumGroup = (group: number[]) =>
    group.reduce((sum, score) => sum + (responses[score] ?? 0), 0);

  const lowEffortCount = sumGroup(groups.low);
  const neutralCount = sumGroup(groups.neutral);
  const highEffortCount = sumGroup(groups.high);

  const lowEffortPercentage = (lowEffortCount / totalResponses) * 100;
  const neutralPercentage = (neutralCount / totalResponses) * 100;
  const highEffortPercentage = (highEffortCount / totalResponses) * 100;

  const distribution = scores.map((score) => ({
    score,
    count: responses[score] ?? 0,
  }));

  const { band, interpretation } = interpretCes(ces, scale);

  return {
    scale,
    totalResponses,
    weightedSum,
    ces,
    lowEffortCount,
    neutralCount,
    highEffortCount,
    lowEffortPercentage,
    neutralPercentage,
    highEffortPercentage,
    median: medianFromDistribution(distribution, totalResponses),
    modes: modesFromDistribution(distribution),
    distribution,
    band,
    interpretation,
  };
}

export function toCESResult(breakdown: CESBreakdown): CESResult {
  return {
    ...breakdown,
    formattedCes: formatCes(breakdown.ces),
    formattedLowEffortPercentage: formatPercent(breakdown.lowEffortPercentage),
    formattedNeutralPercentage: formatPercent(breakdown.neutralPercentage),
    formattedHighEffortPercentage: formatPercent(breakdown.highEffortPercentage),
  };
}

export function shareResultText(
  result: CESResult,
  path = '/tools/customer-effort-score-calculator',
): string {
  const dist = result.distribution
    .map((row) => `  ${row.score}: ${row.count}`)
    .join('\n');
  return [
    'Customer Effort Score Calculator | Omega Calculators',
    '',
    `Scale: 1–${result.scale} (1 = very easy, ${result.scale} = very difficult)`,
    `Your CES: ${result.formattedCes} / ${result.scale}`,
    `Total responses: ${result.totalResponses}`,
    `Weighted sum: ${result.weightedSum}`,
    `Low-effort %: ${result.formattedLowEffortPercentage}%`,
    `Neutral %: ${result.formattedNeutralPercentage}%`,
    `High-effort %: ${result.formattedHighEffortPercentage}%`,
    '',
    'Distribution:',
    dist,
    '',
    result.interpretation,
    path,
  ].join('\n');
}
