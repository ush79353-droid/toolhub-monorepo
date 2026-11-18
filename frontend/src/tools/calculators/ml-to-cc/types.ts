export const MAX_ABS_VALUE = 1e15;
/** Exact: 1 L = 1000 mL = 1000 cc. */
export const ML_PER_LITER = 1000;

export type MlCcUnit = 'ml' | 'liters' | 'cc';

export const PRIMARY_UNITS: readonly MlCcUnit[] = ['ml', 'liters', 'cc'];

export const UNIT_LABELS: Record<MlCcUnit, string> = {
  ml: 'Volume in milliliters',
  liters: 'Volume in liters',
  cc: 'Volume in cubic centimeters',
};

export const UNIT_SYMBOLS: Record<MlCcUnit, string> = {
  ml: 'mL',
  liters: 'L',
  cc: 'cm³ (cc)',
};

export type MlToCcFieldErrors = Partial<Record<MlCcUnit, string>>;
