export type ForceField = 'newtons' | 'joulesPerMeter';
export type EnergyField = 'joules' | 'newtonMeters';
export type WorkCalcField = 'force' | 'distance' | 'angle' | 'work';

export type NmToJoulesFieldErrors = Partial<
  Record<ForceField | EnergyField | WorkCalcField, string>
>;

export const DEFAULT_NEWTONS = 10;
export const DEFAULT_JOULES = 50;
export const DEFAULT_WORK_FORCE = 10;
export const DEFAULT_WORK_DISTANCE = 5;
export const DEFAULT_WORK_ANGLE_DEG = 0;
export const MAX_ABS_VALUE = 1e18;
