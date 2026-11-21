import type { NPSCategory, NPSResult, SurveyScore } from './types';
import { classifyScore } from './types';

export interface NPSBreakdown {
  promoters: number;
  passives: number;
  detractors: number;
  totalResponses: number;
  promoterPercentage: number;
  passivePercentage: number;
  detractorPercentage: number;
  netPromoterScore: number;
  averageScore: number;
  distribution: { score: SurveyScore; count: number; category: NPSCategory }[];
  interpretation: string;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatAverageScore(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Whole numbers without trailing decimals; otherwise up to 2 dp. Signed + for positives. */
export function formatNps(value: number): string {
  const rounded =
    Math.abs(value - Math.round(value)) < 1e-9
      ? Math.round(value)
      : Math.round(value * 100) / 100;
  if (rounded > 0) return `+${rounded}`;
  return String(rounded);
}

export function interpretNps(nps: number): string {
  if (Math.abs(nps) < 1e-9) {
    return 'Promoters and detractors are equal as a share of total responses (NPS = 0). Passives are included in the denominator only.';
  }
  if (nps > 0) {
    return `More promoters than detractors; NPS is ${formatNps(nps)}. A positive score is not automatically “excellent”; compare against your industry and historical baselines.`;
  }
  return `More detractors than promoters; NPS is ${formatNps(nps)}. A negative score is not automatically “poor” without industry and sample context.`;
}

/**
 * NPS = % Promoters − % Detractors
 *     = ((Promoters − Detractors) / Total Responses) × 100
 * Promoters: 9–10 · Passives: 7–8 · Detractors: 0–6
 */
export function calculateNPS(
  responses: Readonly<Record<number, number>>,
): NPSBreakdown | null {
  for (let score = 0; score <= 10; score += 1) {
    const count = responses[score] ?? 0;
    if (!Number.isSafeInteger(count) || count < 0) return null;
  }

  const promoters = (responses[9] ?? 0) + (responses[10] ?? 0);
  const passives = (responses[7] ?? 0) + (responses[8] ?? 0);
  const detractors =
    (responses[0] ?? 0) +
    (responses[1] ?? 0) +
    (responses[2] ?? 0) +
    (responses[3] ?? 0) +
    (responses[4] ?? 0) +
    (responses[5] ?? 0) +
    (responses[6] ?? 0);

  const totalResponses = promoters + passives + detractors;
  if (!Number.isSafeInteger(totalResponses) || totalResponses === 0) return null;

  const promoterPercentage = (promoters / totalResponses) * 100;
  const passivePercentage = (passives / totalResponses) * 100;
  const detractorPercentage = (detractors / totalResponses) * 100;
  const netPromoterScore = promoterPercentage - detractorPercentage;

  let weightedScore = 0;
  for (let score = 0; score <= 10; score += 1) {
    const count = responses[score] ?? 0;
    const product = score * count;
    if (!Number.isSafeInteger(product)) return null;
    weightedScore += product;
  }
  if (!Number.isSafeInteger(weightedScore)) return null;

  const averageScore = weightedScore / totalResponses;
  if (
    ![
      promoterPercentage,
      passivePercentage,
      detractorPercentage,
      netPromoterScore,
      averageScore,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  if (netPromoterScore < -100 - 1e-9 || netPromoterScore > 100 + 1e-9) {
    return null;
  }

  const distribution: NPSBreakdown['distribution'] = [];
  for (let score = 10; score >= 0; score -= 1) {
    const s = score as SurveyScore;
    distribution.push({
      score: s,
      count: responses[s] ?? 0,
      category: classifyScore(s),
    });
  }

  return {
    promoters,
    passives,
    detractors,
    totalResponses,
    promoterPercentage,
    passivePercentage,
    detractorPercentage,
    netPromoterScore,
    averageScore,
    distribution,
    interpretation: interpretNps(netPromoterScore),
  };
}

export function toNPSResult(breakdown: NPSBreakdown): NPSResult {
  return {
    ...breakdown,
    formattedNps: formatNps(breakdown.netPromoterScore),
    formattedPromoterPercentage: formatPercent(breakdown.promoterPercentage),
    formattedPassivePercentage: formatPercent(breakdown.passivePercentage),
    formattedDetractorPercentage: formatPercent(breakdown.detractorPercentage),
    formattedAverageScore: formatAverageScore(breakdown.averageScore),
  };
}

export function shareResultText(
  result: NPSResult,
  path = '/tools/nps-calculator',
): string {
  const scores = [...result.distribution]
    .sort((a, b) => b.score - a.score)
    .map((row) => `Score ${row.score}: ${row.count}`)
    .join('\n');

  return [
    'NPS Calculator | Omega Calculators',
    '',
    scores,
    '',
    `Promoters (9–10): ${result.promoters} (${result.formattedPromoterPercentage}%)`,
    `Passives (7–8): ${result.passives} (${result.formattedPassivePercentage}%)`,
    `Detractors (0–6): ${result.detractors} (${result.formattedDetractorPercentage}%)`,
    `Total responses: ${result.totalResponses}`,
    `Average survey score: ${result.formattedAverageScore} (not NPS)`,
    '',
    `Net Promoter Score: ${result.formattedNps}`,
    '',
    result.interpretation,
    path,
  ].join('\n');
}
