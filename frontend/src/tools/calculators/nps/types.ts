export type SurveyScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const SURVEY_SCORES: readonly SurveyScore[] = [
  10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
];

export type NPSCategory = 'promoter' | 'passive' | 'detractor';

export interface NPSInput {
  /** Response count strings keyed by score 0..10 */
  counts: Record<string, string>;
}

export interface NPSResult {
  promoters: number;
  passives: number;
  detractors: number;
  totalResponses: number;
  promoterPercentage: number;
  passivePercentage: number;
  detractorPercentage: number;
  netPromoterScore: number;
  averageScore: number;
  distribution: readonly { score: SurveyScore; count: number; category: NPSCategory }[];
  interpretation: string;
  formattedNps: string;
  formattedPromoterPercentage: string;
  formattedPassivePercentage: string;
  formattedDetractorPercentage: string;
  formattedAverageScore: string;
}

export type NPSFieldErrors = {
  form?: string;
} & Partial<Record<`score${SurveyScore}`, string>>;

export function emptyCounts(): Record<string, string> {
  const counts: Record<string, string> = {};
  for (let score = 0; score <= 10; score += 1) {
    counts[String(score)] = '';
  }
  return counts;
}

export function createDefaultInput(): NPSInput {
  return { counts: emptyCounts() };
}

/** Spec Example A → NPS +25 */
export function createExampleInput(): NPSInput {
  return {
    counts: {
      '10': '30',
      '9': '20',
      '8': '15',
      '7': '10',
      '6': '10',
      '5': '5',
      '4': '3',
      '3': '2',
      '2': '2',
      '1': '1',
      '0': '2',
    },
  };
}

export function classifyScore(score: SurveyScore): NPSCategory {
  if (score >= 9) return 'promoter';
  if (score >= 7) return 'passive';
  return 'detractor';
}

export function scoreLabel(score: SurveyScore): string {
  const category = classifyScore(score);
  if (category === 'promoter') return 'Promoter';
  if (category === 'passive') return 'Passive';
  return 'Detractor';
}
