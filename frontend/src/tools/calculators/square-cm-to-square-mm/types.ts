export const SQUARE_MM_PER_SQUARE_CM = 100;
export const MAX_ABS_VALUE = 1e15;

export type Cm2Mm2Source = 'squareCentimeters' | 'squareMillimeters';

export interface SquareCmToSquareMmInput {
  source: Cm2Mm2Source;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface SquareCmToSquareMmResult {
  source: Cm2Mm2Source;
  squareCentimeters: number;
  squareMillimeters: number;
  explanation: string;
}

export type SquareCmToSquareMmFieldErrors = Partial<Record<Cm2Mm2Source, string>>;
