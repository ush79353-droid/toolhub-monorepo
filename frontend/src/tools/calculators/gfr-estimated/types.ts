/** Marker mode from the reference GFR calculator screenshot. */
export type GfrMarkerMode = 'creatinine' | 'cystatin' | 'both';

export type Sex = 'female' | 'male';

/** Legacy race coefficient used only by CKD-EPI 2009 / MDRD / 2012 cr-cys. */
export type Ethnicity = 'black' | 'other';

export type CreatinineUnit = 'mg_dl' | 'umol_l';

export type CystatinUnit = 'mg_l';

export type EgfrBand =
  | 'normal'
  | 'mild'
  | 'mild_moderate'
  | 'moderate_severe'
  | 'severe'
  | 'failure';

export interface GfrEstimatedInput {
  markerMode: GfrMarkerMode;
  sex: Sex;
  ethnicity: Ethnicity;
  ageYearsText: string;
  creatinineText: string;
  creatinineUnit: CreatinineUnit;
  cystatinText: string;
  cystatinUnit: CystatinUnit;
}

export interface EgfrEquationValue {
  id: string;
  label: string;
  valueMlMin173: number | null;
  formatted: string;
  usesRaceCoefficient: boolean;
  note: string;
}

export interface GfrEstimatedResult {
  equations: EgfrEquationValue[];
  /** Primary band from the preferred current equation when available. */
  band: EgfrBand | null;
  bandLabel: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type GfrEstimatedFieldErrors = {
  ageYearsText?: string;
  creatinineText?: string;
  cystatinText?: string;
};

export function createDefaultInput(): GfrEstimatedInput {
  return {
    markerMode: 'creatinine',
    sex: 'female',
    ethnicity: 'black',
    ageYearsText: '',
    creatinineText: '',
    creatinineUnit: 'mg_dl',
    cystatinText: '',
    cystatinUnit: 'mg_l',
  };
}

export function createEmptyInput(): GfrEstimatedInput {
  return createDefaultInput();
}

export function inputsEqual(a: GfrEstimatedInput, b: GfrEstimatedInput): boolean {
  return (
    a.markerMode === b.markerMode &&
    a.sex === b.sex &&
    a.ethnicity === b.ethnicity &&
    a.ageYearsText === b.ageYearsText &&
    a.creatinineText === b.creatinineText &&
    a.creatinineUnit === b.creatinineUnit &&
    a.cystatinText === b.cystatinText &&
    a.cystatinUnit === b.cystatinUnit
  );
}
