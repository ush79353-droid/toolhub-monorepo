/** Which field the user last edited. The other field is derived. */
export type FeetYardsSource = 'feet' | 'yards';

export interface FeetToYardsInput {
  source: FeetYardsSource;
  /** null while the active source field is blank or incomplete. */
  feet: number | null;
  yards: number | null;
}

export interface FeetToYardsResult {
  source: FeetYardsSource;
  feet: number;
  yards: number;
  explanation: string;
}

export type FeetToYardsFieldErrors = {
  feet?: string;
  yards?: string;
};

/** Exact: 1 yard = 3 feet. */
export const FEET_PER_YARD = 3;

export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_FEET_TO_YARDS_INPUT: FeetToYardsInput = {
  source: 'feet',
  feet: null,
  yards: null,
};
