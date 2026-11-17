/** Which field the user last edited. The other field is derived. */
export type HaAcSource = 'hectares' | 'acres';

export interface HectaresToAcresInput {
  source: HaAcSource;
  /** null while the active source field is blank or incomplete. */
  hectares: number | null;
  acres: number | null;
}

export interface HectaresToAcresResult {
  source: HaAcSource;
  hectares: number;
  acres: number;
  explanation: string;
}

export type HectaresToAcresFieldErrors = {
  hectares?: string;
  acres?: string;
};

/** Exact: 1 hectare = 10,000 m². */
export const SQUARE_METERS_PER_HECTARE = 10_000;
/** Exact: 1 international acre = 4,046.8564224 m². */
export const SQUARE_METERS_PER_ACRE = 4046.8564224;

export const MAX_ABS_VALUE = 1e15;
