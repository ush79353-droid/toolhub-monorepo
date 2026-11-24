export type EthnicityOption =
  | 'asianPacific'
  | 'hispanic'
  | 'mixed'
  | 'nonHispanicBlack'
  | 'nonHispanicWhite';

export type DiabetesOption = 'no' | 'type1' | 'type2';

export interface StillbirthRiskInput {
  ageYears: string;
  heightCm: string;
  weightKg: string;
  ethnicity: EthnicityOption | '';
  previousPregnancies: boolean | null;
  art: boolean;
  diabetes: DiabetesOption;
  chronicHypertension: boolean;
  sle: boolean;
  aps: boolean;
  alcoholDuringPregnancy: boolean;
  smokingDuringPregnancy: boolean;
}

export interface StillbirthRiskResult {
  probabilityPercent: number;
  formattedProbability: string;
  oneInN: number | null;
  formattedOneInN: string;
  logit: number;
  formattedLogit: string;
  bmi: number | null;
  formattedBmi: string | null;
  bmiCategoryLabel: string | null;
  modelLabel: string;
  modelVersion: string;
  eligibilitySummary: string;
  disclaimer: string;
  nonModelFieldsNote: string | null;
  interceptReferencePercent: number;
  formattedInterceptReference: string;
}

export type StillbirthRiskFieldErrors = {
  form?: string;
  ageYears?: string;
  heightCm?: string;
  weightKg?: string;
  bmi?: string;
};

export function createEmptyInput(): StillbirthRiskInput {
  return {
    ageYears: '',
    heightCm: '',
    weightKg: '',
    ethnicity: '',
    previousPregnancies: null,
    art: false,
    diabetes: 'no',
    chronicHypertension: false,
    sle: false,
    aps: false,
    alcoholDuringPregnancy: false,
    smokingDuringPregnancy: false,
  };
}

export function inputsEqual(
  a: StillbirthRiskInput,
  b: StillbirthRiskInput
): boolean {
  return (
    a.ageYears === b.ageYears &&
    a.heightCm === b.heightCm &&
    a.weightKg === b.weightKg &&
    a.ethnicity === b.ethnicity &&
    a.previousPregnancies === b.previousPregnancies &&
    a.art === b.art &&
    a.diabetes === b.diabetes &&
    a.chronicHypertension === b.chronicHypertension &&
    a.sle === b.sle &&
    a.aps === b.aps &&
    a.alcoholDuringPregnancy === b.alcoholDuringPregnancy &&
    a.smokingDuringPregnancy === b.smokingDuringPregnancy
  );
}