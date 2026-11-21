export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

/** Reproductive / lactation state — screenshot radio group. */
export type PhysiologicalStateId =
  | 'lactation_0_6'
  | 'lactation_gt_6'
  | 'pregnancy_t1'
  | 'pregnancy_t2'
  | 'pregnancy_t3';

/**
 * DRI physical-activity coefficients (IOM 2002/2005 Energy).
 * Labels mirror common calculator wording; PA values are official DRI.
 */
export type ActivityId =
  | 'sedentary'
  | 'low_active'
  | 'active'
  | 'very_active';

export interface PhysiologicalStateOption {
  id: PhysiologicalStateId;
  label: string;
  /** Extra kcal/day on top of non-pregnant EER (IOM DRI). */
  energyAdditionKcal: number;
}

export interface ActivityOption {
  id: ActivityId;
  label: string;
  /** PA for women ≥ 19 y. */
  paAdult: number;
  /** PA for girls 14–18 y. */
  paAdolescent: number;
}

export interface BreastfeedingCalorieInput {
  state: PhysiologicalStateId;
  age: string;
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  activity: ActivityId;
}

export interface BreastfeedingCalorieResult {
  ageYears: number;
  heightMeters: number;
  weightKg: number;
  activityId: ActivityId;
  activityLabel: string;
  paCoefficient: number;
  ageBand: 'adolescent' | 'adult';
  stateId: PhysiologicalStateId;
  stateLabel: string;
  energyAdditionKcal: number;
  nonPregnantEerKcal: number;
  dailyEnergyNeedsKcal: number;
  formattedDailyEnergyNeeds: string;
  modelSource: string;
  disclaimer: string;
}

export type BreastfeedingCalorieFieldErrors = {
  form?: string;
  age?: string;
  height?: string;
  weight?: string;
  activity?: string;
  state?: string;
};

export const PHYSIOLOGICAL_STATES: readonly PhysiologicalStateOption[] = [
  {
    id: 'lactation_0_6',
    label: 'Lactation 0–6 months',
    energyAdditionKcal: 330,
  },
  {
    id: 'lactation_gt_6',
    label: 'Lactation >6 months',
    energyAdditionKcal: 400,
  },
  {
    id: 'pregnancy_t1',
    label: 'Pregnancy 1st trimester',
    energyAdditionKcal: 0,
  },
  {
    id: 'pregnancy_t2',
    label: 'Pregnancy 2nd trimester',
    energyAdditionKcal: 340,
  },
  {
    id: 'pregnancy_t3',
    label: 'Pregnancy 3rd trimester',
    energyAdditionKcal: 452,
  },
] as const;

export const ACTIVITY_OPTIONS: readonly ActivityOption[] = [
  {
    id: 'sedentary',
    label: 'Little/no exercise',
    paAdult: 1.0,
    paAdolescent: 1.0,
  },
  {
    id: 'low_active',
    label: 'Light exercise',
    paAdult: 1.12,
    paAdolescent: 1.16,
  },
  {
    id: 'active',
    label: 'Moderate exercise',
    paAdult: 1.27,
    paAdolescent: 1.31,
  },
  {
    id: 'very_active',
    label: 'Heavy exercise',
    paAdult: 1.45,
    paAdolescent: 1.56,
  },
] as const;

/** Screenshot defaults: lactation 0–6 selected; blank age/height/weight; Little/no exercise. */
export function createDefaultInput(): BreastfeedingCalorieInput {
  return {
    state: 'lactation_0_6',
    age: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    activity: 'sedentary',
  };
}

export function createEmptyInput(): BreastfeedingCalorieInput {
  return createDefaultInput();
}

/** Worked fixture: 30 y, 165 cm, 65 kg, sedentary, lactation 0–6. */
export function createExampleInput(): BreastfeedingCalorieInput {
  return {
    state: 'lactation_0_6',
    age: '30',
    height: '165',
    heightUnit: 'cm',
    weight: '65',
    weightUnit: 'kg',
    activity: 'sedentary',
  };
}

export function inputsEqual(
  a: BreastfeedingCalorieInput,
  b: BreastfeedingCalorieInput,
): boolean {
  return (
    a.state === b.state &&
    a.age === b.age &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.activity === b.activity
  );
}
