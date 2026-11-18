/** Which field the user last edited. The other field is derived. */
export type YardMileSource = 'yards' | 'miles';

export interface YardToMileInput {
  source: YardMileSource;
  /** null while the active source field is blank or incomplete. */
  yards: number | null;
  miles: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface YardToMileResult {
  source: YardMileSource;
  yards: number;
  miles: number;
  explanation: string;
  otherUnits: readonly OtherUnitRow[];
}

export type YardToMileFieldErrors = {
  yards?: string;
  miles?: string;
};

/** Exact: 1 international mile = 1,760 yards. */
export const YARDS_PER_MILE = 1760;

export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_YARD_TO_MILE_INPUT: YardToMileInput = {
  source: 'yards',
  yards: null,
  miles: null,
};
