/** Revised International Prognostic Index (R-IPI) for DLBCL — Sehn et al. */

export type StageBand = 'stage_1_2' | 'stage_3_4';

export type ExtranodalBand = 'zero_one' | 'more_than_one';

export type LdhBand = 'normal' | 'elevated';

export type EcogBand = 'zero_one' | 'two_four';

export type RipiRiskGroup =
  | 'low'
  | 'low_intermediate'
  | 'high_intermediate'
  | 'high';

export interface DlbclPrognosisInput {
  ageYearsText: string;
  stage: StageBand;
  extranodalSites: ExtranodalBand;
  ldh: LdhBand;
  ecog: EcogBand;
}

export interface DlbclPrognosisResult {
  score: number;
  formattedScore: string;
  riskGroup: RipiRiskGroup;
  riskGroupLabel: string;
  fourYearProgressionFreeSurvivalPercent: number | null;
  fourYearOverallSurvivalPercent: number | null;
  statusHeadline: string;
  statusDetail: string;
  disclaimer: string;
  sourceNote: string;
}

export type DlbclPrognosisFieldErrors = {
  ageYearsText?: string;
};

export function createDefaultInput(): DlbclPrognosisInput {
  return {
    ageYearsText: '',
    stage: 'stage_1_2',
    extranodalSites: 'zero_one',
    ldh: 'normal',
    ecog: 'zero_one',
  };
}

export function createEmptyInput(): DlbclPrognosisInput {
  return {
    ageYearsText: '',
    stage: 'stage_1_2',
    extranodalSites: 'zero_one',
    ldh: 'normal',
    ecog: 'zero_one',
  };
}

export function inputsEqual(a: DlbclPrognosisInput, b: DlbclPrognosisInput): boolean {
  return (
    a.ageYearsText === b.ageYearsText &&
    a.stage === b.stage &&
    a.extranodalSites === b.extranodalSites &&
    a.ldh === b.ldh &&
    a.ecog === b.ecog
  );
}

export const STAGE_OPTIONS: readonly { value: StageBand; label: string }[] = [
  { value: 'stage_1_2', label: 'Stage I – II' },
  { value: 'stage_3_4', label: 'Stage III – IV' },
];

export const EXTRANODAL_OPTIONS: readonly { value: ExtranodalBand; label: string }[] = [
  { value: 'zero_one', label: '0–1 extranodal site(s)' },
  { value: 'more_than_one', label: '> 1 extranodal site' },
];

export const LDH_OPTIONS: readonly { value: LdhBand; label: string }[] = [
  { value: 'normal', label: 'LDH normal (≤ local ULN)' },
  { value: 'elevated', label: 'LDH elevated (> ULN)' },
];

export const ECOG_OPTIONS: readonly { value: EcogBand; label: string }[] = [
  { value: 'zero_one', label: 'ECOG 0–1' },
  { value: 'two_four', label: 'ECOG 2–4' },
];