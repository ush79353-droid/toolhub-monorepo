/** Age display unit — screenshot default yrs; months for infant DRI bands. */
export type AgeUnit = 'yrs' | 'mo';

/** Screenshot: No selected by default. */
export type SerumKnown = 'no' | 'yes';

/**
 * Serum analyte — screenshot conditional when serum known = Yes.
 * NIH ODS: 25(OH)D is the status indicator (not 1,25(OH)₂D).
 */
export type SerumAnalyte = '25ohd';

/** NIH ODS reports both ng/mL and nmol/L (1 ng/mL = 2.5 nmol/L). */
export type SerumUnit = 'ng_mL' | 'nmol_L';

export type DriKind = 'ai' | 'rda';

export type SerumStatusBand =
  | 'deficiency_risk'
  | 'inadequate'
  | 'adequate'
  | 'potential_adverse';

export interface VitaminDInput {
  ageText: string;
  ageUnit: AgeUnit;
  serumKnown: SerumKnown;
  /** Fixed to 25(OH)D when serum panel is shown. */
  serumAnalyte: SerumAnalyte;
  serumValueText: string;
  serumUnit: SerumUnit;
}

export interface VitaminDDriRow {
  lifeStageLabel: string;
  kind: DriKind;
  mcgPerDay: number;
  iuPerDay: number;
  ulMcgPerDay: number | null;
  ulIuPerDay: number | null;
}

export interface VitaminDSerumInterpretation {
  analyteLabel: string;
  valueNgPerMl: number;
  valueNmolPerL: number;
  band: SerumStatusBand;
  bandLabel: string;
  detail: string;
}

export interface VitaminDResult {
  ageYears: number | null;
  dri: VitaminDDriRow | null;
  serum: VitaminDSerumInterpretation | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type VitaminDFieldErrors = {
  ageText?: string;
  serumValueText?: string;
};

/** Screenshot defaults: blank age (yrs); serum known No; lab fields idle. */
export function createDefaultInput(): VitaminDInput {
  return {
    ageText: '',
    ageUnit: 'yrs',
    serumKnown: 'no',
    serumAnalyte: '25ohd',
    serumValueText: '',
    serumUnit: 'ng_mL',
  };
}

export function createEmptyInput(): VitaminDInput {
  return createDefaultInput();
}

export function inputsEqual(a: VitaminDInput, b: VitaminDInput): boolean {
  return (
    a.ageText === b.ageText &&
    a.ageUnit === b.ageUnit &&
    a.serumKnown === b.serumKnown &&
    a.serumAnalyte === b.serumAnalyte &&
    a.serumValueText === b.serumValueText &&
    a.serumUnit === b.serumUnit
  );
}
