/** Display units — canonical math uses cm, kg, m², mL/min, g/dL, Torr, mL/L. */

export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb';
export type BsaUnit = 'm2' | 'ft2';
export type Vo2Unit = 'mL/min' | 'mL/s';
export type HbUnit = 'g/dL' | 'g/L';
export type TensionUnit = 'Torr' | 'kPa';
export type ContentUnit = 'mL/L' | 'mL/dL';
export type CoUnit = 'L/min' | 'mL/min';

export interface CardiacOutputInput {
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  /** Manual BSA override; blank → derived from height/weight when possible. */
  bsaValue: string;
  bsaUnit: BsaUnit;
  bsaManual: boolean;
  /** Manual VO₂ override; blank → estimated 125 mL/min/m² × BSA. */
  vo2Value: string;
  vo2Unit: Vo2Unit;
  vo2Manual: boolean;
  hemoglobinValue: string;
  hemoglobinUnit: HbUnit;
  arterialSaturation: string;
  arterialTension: string;
  arterialTensionUnit: TensionUnit;
  /** Manual arterial content; blank → derived from Hb + sat + tension. */
  arterialContent: string;
  arterialContentUnit: ContentUnit;
  arterialContentManual: boolean;
  venousSaturation: string;
  venousTension: string;
  venousTensionUnit: TensionUnit;
  venousContent: string;
  venousContentUnit: ContentUnit;
  venousContentManual: boolean;
  coUnit: CoUnit;
  arterialOpen: boolean;
  venousOpen: boolean;
  resultsOpen: boolean;
}

export interface CardiacOutputResult {
  bsaM2: number;
  vo2MlPerMin: number;
  vo2Estimated: boolean;
  arterialContentMlPerL: number;
  venousContentMlPerL: number;
  avDifferenceMlPerL: number;
  cardiacOutputLPerMin: number;
  cardiacIndex: number;
  formattedCo: string;
  formattedCi: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type CardiacOutputFieldErrors = {
  form?: string;
  heightValue?: string;
  weightValue?: string;
  bsaValue?: string;
  vo2Value?: string;
  hemoglobinValue?: string;
  arterialSaturation?: string;
  arterialTension?: string;
  arterialContent?: string;
  venousSaturation?: string;
  venousTension?: string;
  venousContent?: string;
};

/** Screenshot defaults: all measurement fields blank; panels expanded. */
export function createDefaultInput(): CardiacOutputInput {
  return {
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    bsaValue: '',
    bsaUnit: 'm2',
    bsaManual: false,
    vo2Value: '',
    vo2Unit: 'mL/min',
    vo2Manual: false,
    hemoglobinValue: '',
    hemoglobinUnit: 'g/dL',
    arterialSaturation: '',
    arterialTension: '',
    arterialTensionUnit: 'Torr',
    arterialContent: '',
    arterialContentUnit: 'mL/L',
    arterialContentManual: false,
    venousSaturation: '',
    venousTension: '',
    venousTensionUnit: 'Torr',
    venousContent: '',
    venousContentUnit: 'mL/L',
    venousContentManual: false,
    coUnit: 'L/min',
    arterialOpen: true,
    venousOpen: true,
    resultsOpen: true,
  };
}

export function createEmptyInput(): CardiacOutputInput {
  return createDefaultInput();
}

/** Educational fixture: VO₂ 250 mL/min, Ca−Cv 50 mL/L → CO 5 L/min (prompt). */
export function createExampleInput(): CardiacOutputInput {
  return {
    ...createDefaultInput(),
    heightValue: '170',
    weightValue: '70',
    bsaManual: true,
    bsaValue: '1.82',
    vo2Manual: true,
    vo2Value: '250',
    hemoglobinValue: '15',
    arterialSaturation: '98',
    arterialTension: '95',
    arterialContentManual: true,
    arterialContent: '200',
    venousSaturation: '75',
    venousTension: '40',
    venousContentManual: true,
    venousContent: '150',
  };
}

export function inputsEqual(a: CardiacOutputInput, b: CardiacOutputInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const HEIGHT_UNIT_LABELS: Record<HeightUnit, string> = {
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
};

export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  kg: 'kg',
  lb: 'lb',
};

export const BSA_UNIT_LABELS: Record<BsaUnit, string> = {
  m2: 'm²',
  ft2: 'ft²',
};

export const VO2_UNIT_LABELS: Record<Vo2Unit, string> = {
  'mL/min': 'mL/min',
  'mL/s': 'mL/s',
};

export const HB_UNIT_LABELS: Record<HbUnit, string> = {
  'g/dL': 'g/dL',
  'g/L': 'g/L',
};

export const TENSION_UNIT_LABELS: Record<TensionUnit, string> = {
  Torr: 'Torr',
  kPa: 'kPa',
};

export const CONTENT_UNIT_LABELS: Record<ContentUnit, string> = {
  'mL/L': 'mL/L',
  'mL/dL': 'mL/dL',
};

export const CO_UNIT_LABELS: Record<CoUnit, string> = {
  'L/min': 'L/min',
  'mL/min': 'mL/min',
};
