/** LVOT diameter display unit (canonical math uses cm). */
export type LvotDiameterUnit = 'mm' | 'cm';

/** LVOT VTI display unit (canonical math uses cm). */
export type LvotVtiUnit = 'cm' | 'm';

export type HeightUnit = 'cm' | 'in';

export type WeightUnit = 'kg' | 'lb';

export interface DopplerEchoCardiacOutputInput {
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  heartRateBpm: string;
  lvotVtiValue: string;
  lvotVtiUnit: LvotVtiUnit;
  lvotDiameterValue: string;
  lvotDiameterUnit: LvotDiameterUnit;
}

export interface DopplerEchoCardiacOutputResult {
  bsaM2: number | null;
  lvotAreaCm2: number | null;
  strokeVolumeMl: number | null;
  cardiacOutputLPerMin: number | null;
  cardiacIndexLPerMinM2: number | null;
  formattedBsa: string;
  formattedLvotArea: string;
  formattedStrokeVolume: string;
  formattedCo: string;
  formattedCi: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type DopplerEchoCardiacOutputFieldErrors = {
  form?: string;
  heightValue?: string;
  weightValue?: string;
  heartRateBpm?: string;
  lvotVtiValue?: string;
  lvotDiameterValue?: string;
};

/** Screenshot reload defaults: blank fields; cm/kg/mm defaults. */
export function createDefaultInput(): DopplerEchoCardiacOutputInput {
  return {
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    heartRateBpm: '',
    lvotVtiValue: '',
    lvotVtiUnit: 'cm',
    lvotDiameterValue: '',
    lvotDiameterUnit: 'mm',
  };
}

export function createEmptyInput(): DopplerEchoCardiacOutputInput {
  return createDefaultInput();
}

/** Prompt fixture: 20 mm · VTI 20 cm · HR 80 → SV ≈ 62.83 mL · CO ≈ 5.03 L/min. */
export function createExampleInput(): DopplerEchoCardiacOutputInput {
  return {
    ...createDefaultInput(),
    lvotDiameterValue: '20',
    lvotVtiValue: '20',
    heartRateBpm: '80',
  };
}

export function inputsEqual(
  a: DopplerEchoCardiacOutputInput,
  b: DopplerEchoCardiacOutputInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const HEIGHT_UNIT_LABELS: Record<HeightUnit, string> = {
  cm: 'cm',
  in: 'in',
};

export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  kg: 'kg',
  lb: 'lb',
};

export const LVOT_DIAMETER_UNIT_LABELS: Record<LvotDiameterUnit, string> = {
  mm: 'mm',
  cm: 'cm',
};

export const LVOT_VTI_UNIT_LABELS: Record<LvotVtiUnit, string> = {
  cm: 'cm',
  m: 'm',
};