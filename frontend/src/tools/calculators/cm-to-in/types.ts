/** Which field the user last edited. The other field is derived. */
export type CmToInSource = 'centimeters' | 'inches';

export interface CmToInInput {
  source: CmToInSource;
  /** null while the active source field is blank or incomplete. */
  centimeters: number | null;
  inches: number | null;
}

export interface CmToInResult {
  source: CmToInSource;
  centimeters: number;
  inches: number;
  explanation: string;
}

export type CmToInFieldErrors = {
  centimeters?: string;
  inches?: string;
};

/** Exact international inch: 1 in = 2.54 cm. */
export const CM_PER_INCH = 2.54;

export const MAX_ABS_VALUE = 1e15;

/** Empty default per brief. */
export const DEFAULT_CM_TO_IN_INPUT: CmToInInput = {
  source: 'centimeters',
  centimeters: null,
  inches: null,
};
