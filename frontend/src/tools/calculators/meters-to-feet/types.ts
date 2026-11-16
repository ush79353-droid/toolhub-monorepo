/** Which field the user last edited. The other field is derived. */
export type MetersFeetSource = 'meters' | 'feet';

export interface MetersToFeetInput {
  source: MetersFeetSource;
  /** null while the active source field is blank or incomplete. */
  meters: number | null;
  feet: number | null;
}

export interface MetersToFeetResult {
  source: MetersFeetSource;
  meters: number;
  feet: number;
  explanation: string;
}

export type MetersToFeetFieldErrors = {
  meters?: string;
  feet?: string;
};

/** Exact international foot: 1 ft = 0.3048 m. */
export const METERS_PER_FOOT = 0.3048;

export const MAX_ABS_VALUE = 1e15;

/** Empty default per brief. */
export const DEFAULT_METERS_TO_FEET_INPUT: MetersToFeetInput = {
  source: 'meters',
  meters: null,
  feet: null,
};
