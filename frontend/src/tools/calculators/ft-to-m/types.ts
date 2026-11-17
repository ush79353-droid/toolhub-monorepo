/** Which field the user last edited. The other field is derived. */
export type FtToMSource = 'feet' | 'meters';

export interface FtToMInput {
  source: FtToMSource;
  /** null while the active source field is blank or incomplete. */
  feet: number | null;
  meters: number | null;
}

export interface FtToMResult {
  source: FtToMSource;
  feet: number;
  meters: number;
  explanation: string;
}

export type FtToMFieldErrors = {
  feet?: string;
  meters?: string;
};

/** Exact: 1 international foot = 0.3048 meters. */
export const METERS_PER_FOOT = 0.3048;

export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_FT_TO_M_INPUT: FtToMInput = {
  source: 'feet',
  feet: null,
  meters: null,
};
