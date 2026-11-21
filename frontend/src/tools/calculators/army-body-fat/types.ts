/**
 * Army Body Fat Calculator — types (ADR-018).
 *
 * Models:
 * - activeDuty (default): one-site abdomen + weight (Army Directive 2023-11 /
 *   ALARACT 032/2025 implementing guidance; effective 9 June 2023).
 * - legacy: multi-site DoDI 1308.3 / AR 600-9 circumference equations
 *   (educational estimate only; not the current Army-authorized method).
 */

export type ArmySex = 'female' | 'male';

/** Length unit for height / circumference inputs (screenshot default: cm). */
export type ArmyLengthUnit = 'cm' | 'in';

/** Mass unit for active-duty weight (equations use pounds). */
export type ArmyMassUnit = 'lb' | 'kg';

export interface ArmyBodyFatInput {
  activeDuty: boolean;
  sex: ArmySex;
  ageYears: string;
  /** Active-duty one-site weight. */
  weight: string;
  weightUnit: ArmyMassUnit;
  /** Active-duty abdomen at the navel. */
  abdomen: string;
  abdomenUnit: ArmyLengthUnit;
  /** Legacy multi-site fields. */
  height: string;
  heightUnit: ArmyLengthUnit;
  neck: string;
  neckUnit: ArmyLengthUnit;
  waist: string;
  waistUnit: ArmyLengthUnit;
  hip: string;
  hipUnit: ArmyLengthUnit;
}

export type ArmyBodyFatFieldKey =
  | 'ageYears'
  | 'weight'
  | 'abdomen'
  | 'height'
  | 'neck'
  | 'waist'
  | 'hip';

export type ArmyBodyFatFieldErrors = Partial<
  Record<ArmyBodyFatFieldKey, string>
>;

export type ArmyBodyFatModel = 'one_site' | 'legacy_multi_site';

export interface ArmyBodyFatMaxStandard {
  ageGroupLabel: string;
  maxPercent: number;
}

export interface ArmyBodyFatResult {
  model: ArmyBodyFatModel;
  sex: ArmySex;
  bodyFatPercentRaw: number;
  /** Official worksheets round to nearest whole percent. */
  bodyFatPercent: number;
  formattedBodyFatPercent: string;
  ageYears: number | null;
  maxStandard: ArmyBodyFatMaxStandard | null;
  withinStandard: boolean | null;
  disclaimer: string;
}

export const CM_PER_INCH = 2.54;
export const LB_PER_KG = 2.2046226218;

export function createDefaultInput(): ArmyBodyFatInput {
  return {
    activeDuty: true,
    sex: 'female',
    ageYears: '',
    weight: '',
    weightUnit: 'lb',
    abdomen: '',
    abdomenUnit: 'cm',
    height: '',
    heightUnit: 'cm',
    neck: '',
    neckUnit: 'cm',
    waist: '',
    waistUnit: 'cm',
    hip: '',
    hipUnit: 'cm',
  };
}

export function createEmptyInput(): ArmyBodyFatInput {
  return createDefaultInput();
}

export function inputsEqual(a: ArmyBodyFatInput, b: ArmyBodyFatInput): boolean {
  return (
    a.activeDuty === b.activeDuty &&
    a.sex === b.sex &&
    a.ageYears === b.ageYears &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.abdomen === b.abdomen &&
    a.abdomenUnit === b.abdomenUnit &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.neck === b.neck &&
    a.neckUnit === b.neckUnit &&
    a.waist === b.waist &&
    a.waistUnit === b.waistUnit &&
    a.hip === b.hip &&
    a.hipUnit === b.hipUnit
  );
}
