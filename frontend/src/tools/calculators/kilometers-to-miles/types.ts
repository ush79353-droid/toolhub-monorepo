/** Which field the user last edited. */
export type KmMiSource = 'km' | 'mi';

export interface KilometersToMilesInput {
  source: KmMiSource;
  km: number | null;
  mi: number | null;
}

export type KilometersToMilesFieldErrors = {
  km?: string;
  mi?: string;
};

/** Exact: 1 international mile = 1.609344 km. */
export const KM_PER_MILE = 1.609344;

export const MAX_ABS_VALUE = 1e15;
