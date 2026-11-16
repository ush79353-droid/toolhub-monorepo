export type CcfThermsField = 'ccf' | 'therms' | 'factor' | 'heating';

export type CcfToThermsFieldErrors = Partial<Record<CcfThermsField, string>>;

export const DEFAULT_CCF = 100;
/** Illustrative example only — not a universal utility billing rate. */
export const DEFAULT_FACTOR = 1.038;
export const DEFAULT_HEATING_BTU_PER_FT3 = 1038;
export const BTU_PER_THERM = 100_000;
export const CUBIC_FEET_PER_CCF = 100;
export const MAX_ABS_VALUE = 1e15;
