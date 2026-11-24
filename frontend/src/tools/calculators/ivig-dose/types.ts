/** Calculation mode — screenshot radios. */
export type CalculationType = 'general' | 'pregnancy_hemorrhage';

export type Sex = 'female' | 'male';
export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'in';
/** Supplied IVIG dose intensity (screenshot default g/kg). */
export type DoseIntensityUnit = 'g/kg';

export type WeightBasis =
  | 'actual'
  | 'ideal'
  | 'adjusted'
  | 'actual_below_ibw_eligibility';  | 'unavailable';

export type ProductKind = 'ivig' | 'rhig';

export interface IvigDoseInput {
  calculationType: CalculationType;
  sex: Sex;
  weightText: string;
  weightUnit: WeightUnit;
  heightText: string;
  heightUnit: HeightUnit;
  /** Supplied IVIG dose in g/kg (General branch only). */
  dosingText: string;
  dosingUnit: DoseIntensityUnit;
  /** Kleihauer–Betke / flow-cytometry % fetal cells (RhIG branch). */
  fetalCellsPercentText: string;
}

export interface IvigDoseResult {
  product: ProductKind;
  weightKg: number | null;
  heightCm: number | null;
  bmi: number | null;
  idealBodyWeightKg: number | null;
  dosingWeightKg: number | null;
  weightBasis: WeightBasis;
  dosingGPerKg: number | null;
  /** IVIG grams — General branch only; never invented for RhIG. */
  ivigDoseGrams: number | null;
  maternalBloodVolumeMl: number | null;
  fetalCellsPercent: number | null;
  /** Continuous vials before AABB rounding (FMH mL / 30). */
  rhigVialsRaw: number | null;
  /** AABB Technical Manual rounded vial count (300 µg / 30 mL vials). */
  rhigVials: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
  assumptions: string;
}

export type IvigDoseFieldErrors = {
  weightText?: string;
  heightText?: string;
  dosingText?: string;
  fetalCellsPercentText?: string;
};

/**
 * Screenshot defaults: General · Female · blank weight/height · dosing 1 g/kg.
 * 1 g/kg matches labeled Privigen chronic ITP single-day intensity (not a seeded patient mass).
 * Pregnancy-hemorrhage fetal-cell % stays blank (no seeded clinical value).
 */
export function createDefaultInput(): IvigDoseInput {
  return {
    calculationType: 'general',
    sex: 'female',
    weightText: '',
    weightUnit: 'kg',
    heightText: '',
    heightUnit: 'cm',
    dosingText: '1',
    dosingUnit: 'g/kg',
    fetalCellsPercentText: '',
  };
}

/** Clear patient fields; restore published dosing default and General mode. */
export function createEmptyInput(): IvigDoseInput {
  return createDefaultInput();
}

export function inputsEqual(a: IvigDoseInput, b: IvigDoseInput): boolean {
  return (
    a.calculationType === b.calculationType &&
    a.sex === b.sex &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.dosingText === b.dosingText &&
    a.dosingUnit === b.dosingUnit &&
    a.fetalCellsPercentText === b.fetalCellsPercentText
  );
}
