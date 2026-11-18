/** Which field the user last edited. The other field is derived. */
export type InchesYardsSource = 'inches' | 'yards';

export interface InchesToYardsInput {
  source: InchesYardsSource;
  /** null while the active source field is blank or incomplete. */
  inches: number | null;
  yards: number | null;
}

export interface InchesToYardsResult {
  source: InchesYardsSource;
  inches: number;
  yards: number;
  explanation: string;
}

export type InchesToYardsFieldErrors = {
  inches?: string;
  yards?: string;
};

/** Exact: 1 yard = 36 inches. */
export const INCHES_PER_YARD = 36;

export const MAX_ABS_VALUE = 1e15;
