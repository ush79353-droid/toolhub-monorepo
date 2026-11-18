import type { LengthUnit } from './units';

export type CentimeterFieldErrors = Partial<Record<LengthUnit, string>>;

export const MAX_ABS_VALUE = 1e15;
