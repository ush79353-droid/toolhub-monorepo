/**
 * Brock / PanCan full model with spiculation (McWilliams NEJM 2013, Table 2 model 2b).
 *
 * Size transform (mm): (size/10)^(-0.5) − 1.58113883 (centers at 4 mm).
 * Probability (%) = 100 / (1 + exp(−logOdds)).
 */

import { DISCLAIMER, SOURCE_NOTE } from './content';
import type {
  LungNoduleGrowthRateInput,
  LungNoduleGrowthRateResult,
  NoduleType,
} from './types';

export { DISCLAIMER, SOURCE_NOTE };

export const MIN_AGE = 18;

/** Model 2b betas (McWilliams et al. 2013). */
export const BROCK_2B = {
  intercept: -6.7892,
  agePerYearCentered: 0.0287,
  ageCenter: 62,
  female: 0.6011,
  familyHistory: 0.2961,
  emphysema: 0.2953,
  sizeTransform: -5.3854,
  sizeCenterRoot: 1.58113883,
  nonsolid: -0.1276,
  partSolid: 0.377,
  upperLobe: 0.6581,
  countPerNoduleCentered: -0.0824,
  countCenter: 4,
  spiculation: 0.7729,
} as const;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function sizeTransformMm(sizeMm: number): number {
  return Math.pow(sizeMm / 10, -0.5) - BROCK_2B.sizeCenterRoot;
}

export function noduleTypeBeta(type: Exclude<NoduleType, ''>): number {
  switch (type) {
    case 'nonsolid':
      return BROCK_2B.nonsolid;
    case 'partSolid':
      return BROCK_2B.partSolid;
    case 'solid':
      return 0;
  }
}

export function brockLogOdds(input: {
  age: number;
  female: boolean;
  familyHistory: boolean;
  emphysema: boolean;
  spiculation: boolean;
  upperLobe: boolean;
  count: number;
  sizeMm: number;
  noduleType: Exclude<NoduleType, ''>;
}): number {
  const t = sizeTransformMm(input.sizeMm);
  return (
    BROCK_2B.intercept +
    BROCK_2B.agePerYearCentered * (input.age - BROCK_2B.ageCenter) +
    (input.female ? BROCK_2B.female : 0) +
    (input.familyHistory ? BROCK_2B.familyHistory : 0) +
    (input.emphysema ? BROCK_2B.emphysema : 0) +
    BROCK_2B.sizeTransform * t +
    noduleTypeBeta(input.noduleType) +
    (input.upperLobe ? BROCK_2B.upperLobe : 0) +
    BROCK_2B.countPerNoduleCentered * (input.count - BROCK_2B.countCenter) +
    (input.spiculation ? BROCK_2B.spiculation : 0)
  );
}

export function probabilityFromLogOdds(logOdds: number): number {
  return 100 / (1 + Math.exp(-logOdds));
}

export function calculateLungNoduleGrowthRate(
  input: LungNoduleGrowthRateInput,
): LungNoduleGrowthRateResult {
  const empty = {
    logOdds: null as number | null,
    probabilityPercent: null as number | null,
    formattedLogOdds: '',
    formattedProbability: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (
    input.sex === '' ||
    input.emphysema === '' ||
    input.familyHistory === '' ||
    input.spiculation === '' ||
    input.upperLobe === '' ||
    input.noduleType === ''
  ) {
    return {
      ...empty,
      statusHeadline: 'Complete categorical answers',
      statusDetail:
        'Sex, emphysema, family history, spiculation, upper lobe, and nodule type are required.',
    };
  }

  const age = parseNumber(input.ageText);
  const count = parseNumber(input.countText);
  const size = parseNumber(input.sizeText);

  if (age === null || count === null || size === null) {
    return {
      ...empty,
      statusHeadline: 'Enter age, nodule count, and size',
      statusDetail:
        'Age (≥18), nodule count, and nodule size (mm) are required for Brock model 2b.',
    };
  }

  if (age < MIN_AGE) {
    return {
      ...empty,
      statusHeadline: 'Age below model range',
      statusDetail: 'Brock screening models are for adults (age ≥ 18).',
    };
  }

  if (count < 1 || size <= 0) {
    return {
      ...empty,
      statusHeadline: 'Invalid nodule inputs',
      statusDetail: 'Nodule count must be ≥ 1 and size must be > 0 mm.',
    };
  }

  const logOdds = brockLogOdds({
    age,
    female: input.sex === 'female',
    familyHistory: input.familyHistory === 'yes',
    emphysema: input.emphysema === 'yes',
    spiculation: input.spiculation === 'yes',
    upperLobe: input.upperLobe === 'yes',
    count,
    sizeMm: size,
    noduleType: input.noduleType,
  });

  const probabilityPercent = probabilityFromLogOdds(logOdds);
  const formattedLogOdds = (Math.round(logOdds * 10000) / 10000).toString();
  const formattedProbability = (
    Math.round(probabilityPercent * 100) / 100
  ).toString();

  return {
    logOdds,
    probabilityPercent,
    formattedLogOdds,
    formattedProbability,
    statusHeadline: 'Brock malignancy probability',
    statusDetail: `Educational PanCan/Brock model 2b estimate (${formattedProbability}%). Not a measured growth rate or diagnosis.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
