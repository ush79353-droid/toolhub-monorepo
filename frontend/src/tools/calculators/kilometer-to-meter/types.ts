/** Which field the user last edited. */
export type KmMSource = 'km' | 'm';

export interface KilometerToMeterInput {
  source: KmMSource;
  km: number | null;
  m: number | null;
}

export type KilometerToMeterFieldErrors = {
  km?: string;
  m?: string;
};

/** Exact: 1 kilometer = 1,000 meters. */
export const METERS_PER_KM = 1000;

export const MAX_ABS_VALUE = 1e15;
