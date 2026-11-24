export type QuarantineSex = 'female' | 'male';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';
export type TimeUnit = 'min' | 'hrs';

/** Work / Home / Exercises radio levels — Omni values 0–3. */
export type ActivityLevel = 0 | 1 | 2 | 3;

export interface ActivitySlot {
  activityId: string;
  timeText: string;
  timeUnit: TimeUnit;
}

export interface QuarantineActivityInput {
  sex: QuarantineSex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  work: ActivityLevel;
  home: ActivityLevel;
  exercise: ActivityLevel;
  /** Everyday activities given up (max 3). */
  removed: ActivitySlot[];
  /** Everyday activities added (max 3). */
  added: ActivitySlot[];
}

export interface QuarantineActivityResult {
  pal: number | null;
  palDisplay: string;
  maintenanceKcalPerDay: number | null;
  maintenanceDisplay: string;
  removedKcal: number | null;
  addedKcal: number | null;
  deltaKcal: number | null;
  deltaDisplay: string;
  statusHeadline: string;
  statusDetail: string;
  equationLabel: string;
  sourceNote: string;
  disclaimer: string;
}

export type QuarantineActivityFieldErrors = {
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
  removedTime0?: string;
  removedTime1?: string;
  removedTime2?: string;
  addedTime0?: string;
  addedTime1?: string;
  addedTime2?: string;
};

export function emptySlot(activityId = ''): ActivitySlot {
  return { activityId, timeText: '', timeUnit: 'min' };
}

/** Screenshot defaults: Female; Home office / basic / light; Running + Yoga selected. */
export function createDefaultInput(): QuarantineActivityInput {
  return {
    sex: 'female',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    work: 1,
    home: 1,
    exercise: 1,
    removed: [emptySlot('running'), emptySlot(), emptySlot()],
    added: [emptySlot('yoga'), emptySlot(), emptySlot()],
  };
}

export function createEmptyInput(): QuarantineActivityInput {
  return createDefaultInput();
}

function slotsEqual(a: ActivitySlot[], b: ActivitySlot[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (s, i) =>
      s.activityId === b[i]!.activityId &&
      s.timeText === b[i]!.timeText &&
      s.timeUnit === b[i]!.timeUnit,
  );
}

export function inputsEqual(
  a: QuarantineActivityInput,
  b: QuarantineActivityInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.ageYearsText === b.ageYearsText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.work === b.work &&
    a.home === b.home &&
    a.exercise === b.exercise &&
    slotsEqual(a.removed, b.removed) &&
    slotsEqual(a.added, b.added)
  );
}
