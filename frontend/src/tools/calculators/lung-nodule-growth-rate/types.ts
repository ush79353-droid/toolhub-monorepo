/** Brock (PanCan) nodule malignancy probability — screenshot-first (ADR-023). */

export type Sex = 'female' | 'male' | '';
export type YesNo = 'yes' | 'no' | '';
export type NoduleType = 'nonsolid' | 'partSolid' | 'solid' | '';

export interface LungNoduleGrowthRateInput {
  ageText: string;
  sex: Sex;
  emphysema: YesNo;
  familyHistory: YesNo;
  spiculation: YesNo;
  upperLobe: YesNo;
  countText: string;
  sizeText: string;
  noduleType: NoduleType;
}

export interface LungNoduleGrowthRateResult {
  logOdds: number | null;
  probabilityPercent: number | null;
  formattedLogOdds: string;
  formattedProbability: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type LungNoduleGrowthRateFieldErrors = {
  ageText?: string;
  countText?: string;
  sizeText?: string;
  form?: string;
};

export function createDefaultInput(): LungNoduleGrowthRateInput {
  return {
    ageText: '',
    sex: 'male',
    emphysema: 'no',
    familyHistory: 'no',
    spiculation: 'no',
    upperLobe: 'no',
    countText: '',
    sizeText: '',
    noduleType: 'solid',
  };
}

export function createEmptyInput(): LungNoduleGrowthRateInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: LungNoduleGrowthRateInput,
  b: LungNoduleGrowthRateInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
