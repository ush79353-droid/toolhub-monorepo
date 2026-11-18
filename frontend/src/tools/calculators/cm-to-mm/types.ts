/** Which field the user last edited. The other field is derived. */
export type CmToMmSource = 'centimeters' | 'millimeters';

export interface CmToMmInput {
  source: CmToMmSource;
  /** null while the active source field is blank or incomplete. */
  centimeters: number | null;
  millimeters: number | null;
}

export interface CmToMmResult {
  source: CmToMmSource;
  centimeters: number;
  millimeters: number;
  explanation: string;
}

export type CmToMmFieldErrors = {
  centimeters?: string;
  millimeters?: string;
};

/** Exact: 1 cm = 10 mm. */
export const MM_PER_CM = 10;

export const MAX_ABS_VALUE = 1e15;

/** Empty default per brief. */
export const DEFAULT_CM_TO_MM_INPUT: CmToMmInput = {
  source: 'centimeters',
  centimeters: null,
  millimeters: null,
};
