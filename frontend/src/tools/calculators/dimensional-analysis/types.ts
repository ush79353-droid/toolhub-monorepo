export type CalcMode = 'compare' | 'convert';
export type UnitType = 'base' | 'derived';

export type FieldErrors = Partial<
  Record<'value1' | 'value2' | 'value' | 'from' | 'to' | 'quantity', string>
>;

export const EQUALITY_REL_TOL = 1e-9;
export const EQUALITY_ABS_TOL = 1e-12;
