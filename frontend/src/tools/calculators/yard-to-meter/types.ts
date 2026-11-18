/** Which field the user last edited. The other field is derived. */
export type YardMeterSource = 'yards' | 'meters';

export interface YardToMeterInput {
  source: YardMeterSource;
  /** null while the active source field is blank or incomplete. */
  yards: number | null;
  meters: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface YardToMeterResult {
  source: YardMeterSource;
  yards: number;
  meters: number;
  explanation: string;
  otherUnits: readonly OtherUnitRow[];
}

export type YardToMeterFieldErrors = {
  yards?: string;
  meters?: string;
};

/** Exact international yard. */
export const METERS_PER_YARD = 0.9144;

export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_YARD_TO_METER_INPUT: YardToMeterInput = {
  source: 'yards',
  yards: null,
  meters: null,
};
