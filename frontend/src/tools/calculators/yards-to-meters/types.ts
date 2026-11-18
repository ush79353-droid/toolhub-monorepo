/** Which field the user last edited. The other field is derived. */
export type YardsMetersSource = 'yards' | 'meters';

export interface YardsToMetersInput {
  source: YardsMetersSource;
  /** null while the active source field is blank or incomplete. */
  yards: number | null;
  meters: number | null;
}

export interface YardsToMetersResult {
  source: YardsMetersSource;
  yards: number;
  meters: number;
  explanation: string;
}

export type YardsToMetersFieldErrors = {
  yards?: string;
  meters?: string;
};

/** Exact international yard. */
export const METERS_PER_YARD = 0.9144;

export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_YARDS_TO_METERS_INPUT: YardsToMetersInput = {
  source: 'yards',
  yards: null,
  meters: null,
};
