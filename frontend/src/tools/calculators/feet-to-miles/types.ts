/** Which field the user last edited. The other field is derived. */
export type FeetMilesSource = 'feet' | 'miles';

export interface FeetToMilesInput {
  source: FeetMilesSource;
  /** null while the active source field is blank or incomplete. */
  feet: number | null;
  miles: number | null;
}

export interface FeetToMilesResult {
  source: FeetMilesSource;
  feet: number;
  miles: number;
  explanation: string;
}

export type FeetToMilesFieldErrors = {
  feet?: string;
  miles?: string;
};

/** Exact international mile: 1 mi = 5,280 ft. */
export const FEET_PER_MILE = 5280;

export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_FEET_TO_MILES_INPUT: FeetToMilesInput = {
  source: 'feet',
  feet: null,
  miles: null,
};
