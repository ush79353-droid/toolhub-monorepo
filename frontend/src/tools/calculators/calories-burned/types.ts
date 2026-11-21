export type WeightUnit = 'kg' | 'lb';

export type DurationInputMode = 'time' | 'distance';

export interface CaloriesBurnedInput {
  activityId: string;
  durationHours: string;
  durationMinutes: string;
  weightValue: string;
  weightUnit: WeightUnit;
  durationInputMode: DurationInputMode;
  /** Miles traveled when durationInputMode is distance (walk/run/cycle only). */
  distanceMiles: string;
}

export interface CaloriesBurnedResult {
  activityId: string;
  activityLabel: string;
  met: number;
  weightKg: number;
  durationMinutes: number;
  caloriesKcal: number;
  caloriesPerHour: number;
  usedDistanceMode: boolean;
  distanceMiles: number | null;
  formattedCalories: string;
  formattedCaloriesPerHour: string;
  formattedDuration: string;
  formulaLine: string;
  explanation: string;
}

export type CaloriesBurnedFieldErrors = {
  form?: string;
  activityId?: string;
  durationHours?: string;
  durationMinutes?: string;
  weightValue?: string;
  distanceMiles?: string;
  durationInputMode?: string;
};

/** Screenshot defaults: 45 min, 70 kg, no activity selected. */
export function createDefaultInput(): CaloriesBurnedInput {
  return {
    activityId: '',
    durationHours: '',
    durationMinutes: '45',
    weightValue: '70',
    weightUnit: 'kg',
    durationInputMode: 'time',
    distanceMiles: '',
  };
}

export function createEmptyInput(): CaloriesBurnedInput {
  return {
    activityId: '',
    durationHours: '',
    durationMinutes: '',
    weightValue: '',
    weightUnit: 'kg',
    durationInputMode: 'time',
    distanceMiles: '',
  };
}

export function inputsEqual(
  a: CaloriesBurnedInput,
  b: CaloriesBurnedInput,
): boolean {
  return (
    a.activityId === b.activityId &&
    a.durationHours === b.durationHours &&
    a.durationMinutes === b.durationMinutes &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.durationInputMode === b.durationInputMode &&
    a.distanceMiles === b.distanceMiles
  );
}