/** Urine output rate & fluid balance — screenshot-first (ADR-023). */

export type PatientAgeGroup = 'adult' | 'pediatric';
export type WeightUnit = 'kg' | 'lb';
export type TimeUnit = 'hrs' | 'days';
export type VolumeUnit = 'mL' | 'L';

export interface UrineOutputInput {
  ageGroup: PatientAgeGroup;
  weightText: string;
  weightUnit: WeightUnit;
  timeText: string;
  timeUnit: TimeUnit;
  urineText: string;
  urineUnit: VolumeUnit;
  intakeText: string;
  intakeUnit: VolumeUnit;
}

export interface UrineOutputResult {
  weightKg: number | null;
  timeHours: number | null;
  urineMl: number | null;
  intakeMl: number | null;
  rateMlKgHr: number | null;
  fluidBalanceMl: number | null;
  rateLabel: string | null;
  balanceNote: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type UrineOutputFieldErrors = {
  weightText?: string;
  timeText?: string;
  urineText?: string;
  intakeText?: string;
};

export function createDefaultInput(): UrineOutputInput {
  return {
    ageGroup: 'adult',
    weightText: '',
    weightUnit: 'kg',
    timeText: '24',
    timeUnit: 'hrs',
    urineText: '',
    urineUnit: 'mL',
    intakeText: '',
    intakeUnit: 'mL',
  };
}

export function createEmptyInput(): UrineOutputInput {
  return createDefaultInput();
}

export function inputsEqual(a: UrineOutputInput, b: UrineOutputInput): boolean {
  return (
    a.ageGroup === b.ageGroup &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.timeText === b.timeText &&
    a.timeUnit === b.timeUnit &&
    a.urineText === b.urineText &&
    a.urineUnit === b.urineUnit &&
    a.intakeText === b.intakeText &&
    a.intakeUnit === b.intakeUnit
  );
}