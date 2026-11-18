/** Exact: 1 ft² = 144 in² (12 × 12). */
export const SQUARE_INCHES_PER_SQUARE_FOOT = 144;
export const MAX_ABS_VALUE = 1e15;

export type In2Ft2Source = 'squareInches' | 'squareFeet';

export interface SquareInchToSquareFootInput {
  source: In2Ft2Source;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface SquareInchToSquareFootResult {
  source: In2Ft2Source;
  squareInches: number;
  squareFeet: number;
  explanation: string;
}

export type SquareInchToSquareFootFieldErrors = Partial<Record<In2Ft2Source, string>>;
