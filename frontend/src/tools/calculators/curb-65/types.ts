/** CURB-65 community-acquired pneumonia score — screenshot-first (ADR-023). */

export type YesNo = 'yes' | 'no' | '';
export type BunUnit = 'mg_dl_bun' | 'mmol_l_urea';

export interface Curb65Input {
  confusion: YesNo;
  bunText: string;
  bunUnit: BunUnit;
  respiratoryRateText: string;
  systolicBpText: string;
  diastolicBpText: string;
  ageText: string;
}

export interface Curb65Result {
  score: number | null;
  points: {
    confusion: number;
    urea: number;
    respiratory: number;
    bloodPressure: number;
    age: number;
  } | null;
  bandLabel: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type Curb65FieldErrors = {
  confusion?: string;
  bunText?: string;
  respiratoryRateText?: string;
  systolicBpText?: string;
  diastolicBpText?: string;
  ageText?: string;
};

export function createDefaultInput(): Curb65Input {
  return {
    confusion: '',
    bunText: '',
    bunUnit: 'mg_dl_bun',
    respiratoryRateText: '',
    systolicBpText: '',
    diastolicBpText: '',
    ageText: '',
  };
}

export function createEmptyInput(): Curb65Input {
  return createDefaultInput();
}

export function inputsEqual(a: Curb65Input, b: Curb65Input): boolean {
  return (
    a.confusion === b.confusion &&
    a.bunText === b.bunText &&
    a.bunUnit === b.bunUnit &&
    a.respiratoryRateText === b.respiratoryRateText &&
    a.systolicBpText === b.systolicBpText &&
    a.diastolicBpText === b.diastolicBpText &&
    a.ageText === b.ageText
  );
}
