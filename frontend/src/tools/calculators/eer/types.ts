export type EerSex = 'female' | 'male';
export type HeightUnit = 'cm' | 'in' | 'm';
export type WeightUnit = 'kg' | 'lb';
export type EerActivity = 'sedentary' | 'low_active' | 'active' | 'very_active';

export interface EerCalculatorInput {
  sex: EerSex;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  ageYearsText: string;
  activity: EerActivity;
}

export interface EerPregnancyLactationNote {
  trimester1Kcal: number;
  trimester2Kcal: number;
  trimester3Kcal: number;
  lactation0to6Kcal: number;
  lactation7to12Kcal: number;
}

export interface EerCalculatorResult {
  eerKcalPerDay: number | null;
  eerDisplay: string;
  paCoefficient: number | null;
  activityLabel: string;
  activityDescription: string;
  pregnancyLactation: EerPregnancyLactationNote;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type EerCalculatorFieldErrors = {
  heightText?: string;
  weightText?: string;
  ageYearsText?: string;
};

export const ACTIVITY_OPTIONS: readonly {
  id: EerActivity;
  label: string;
  description: string;
}[] = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    description:
      'Sedentary: Typical activities of daily living only (e.g., household tasks, walking around the home or workplace), with little or no additional moderate exercise.',
  },
  {
    id: 'low_active',
    label: 'Low active',
    description:
      'Low active: Typical activities of daily life (e.g., gardening, household tasks) PLUS 30 to 60 minutes of moderate activity daily, e.g., cycling (leisurely), walking 3-4mph, etc.',
  },
  {
    id: 'active',
    label: 'Active',
    description:
      'Active: Typical activities of daily life PLUS about 60 or more minutes of moderate activity daily (or an equivalent mix of moderate and vigorous activity).',
  },
  {
    id: 'very_active',
    label: 'Very active',
    description:
      'Very active: Typical activities of daily life PLUS substantial moderate or vigorous activity most days (e.g., vigorous sports, heavy physical work, or long-duration exercise).',
  },
] as const;

/** IOM 2002/2005 educational pregnancy/lactation energy deposition offsets (kcal/day). */
export const PREGNANCY_LACTATION_OFFSETS: EerPregnancyLactationNote = {
  trimester1Kcal: 0,
  trimester2Kcal: 340,
  trimester3Kcal: 452,
  lactation0to6Kcal: 330,
  lactation7to12Kcal: 400,
};

export function createDefaultInput(): EerCalculatorInput {
  return {
    sex: 'female',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    ageYearsText: '',
    activity: 'low_active',
  };
}

export function createEmptyInput(): EerCalculatorInput {
  return createDefaultInput();
}

export function inputsEqual(a: EerCalculatorInput, b: EerCalculatorInput): boolean {
  return (
    a.sex === b.sex &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.ageYearsText === b.ageYearsText &&
    a.activity === b.activity
  );
}
