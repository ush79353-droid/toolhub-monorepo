/** Which field the user last edited. The other field is derived. */
export type MeterMileSource = 'meters' | 'miles';

export interface MeterToMileInput {
  source: MeterMileSource;
  /** null while the active source field is blank or incomplete. */
  meters: number | null;
  miles: number | null;
}

export interface MeterToMileResult {
  source: MeterMileSource;
  meters: number;
  miles: number;
  explanation: string;
}

export type MeterToMileFieldErrors = {
  meters?: string;
  miles?: string;
};

/** Exact international statute mile. */
export const METERS_PER_MILE = 1609.344;

export const MAX_ABS_VALUE = 1e15;

/** Empty default per brief. */
export const DEFAULT_METER_TO_MILE_INPUT: MeterToMileInput = {
  source: 'meters',
  meters: null,
  miles: null,
};
