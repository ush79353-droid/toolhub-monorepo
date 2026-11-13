import { Rational, type Matrix } from './rational';

export const MIN_ROWS = 1;
export const MAX_ROWS = 6;
export const MIN_COLS = 1;
export const MAX_COLS = 8;

export type CellDraft = string;
export type MatrixDraft = CellDraft[][];

export interface RrefInput {
  rows: number;
  cols: number;
  /** Row-major cell strings as typed by the user. */
  cells: string[][];
  /** When true, treat the last column as constants (augmented system). */
  augmented: boolean;
}

export type RrefFieldErrors = Record<string, string>;

export interface RowOperationStep {
  index: number;
  /** Human-readable elementary row operation, e.g. "R2 → R2 − 2R1". */
  description: string;
  matrix: string[][];
}

export type AugmentedSolutionKind =
  | 'not_augmented'
  | 'inconsistent'
  | 'unique'
  | 'infinite'
  | 'underdetermined';

export interface AugmentedAnalysis {
  kind: AugmentedSolutionKind;
  message: string;
  /** Free variable indices (1-based among variable columns). */
  freeVariables: number[];
  /** Unique solution values as strings when kind === 'unique'. */
  uniqueSolution: string[] | null;
}

export interface RrefResult {
  rows: number;
  cols: number;
  augmented: boolean;
  original: string[][];
  rref: string[][];
  rank: number;
  /** 1-based pivot column indices (variable columns only when augmented). */
  pivotColumns: number[];
  /** 1-based free column indices among variable columns. */
  freeColumns: number[];
  nullity: number;
  steps: RowOperationStep[];
  augmentedAnalysis: AugmentedAnalysis;
}

export function createEmptyDraft(rows: number, cols: number, fill = '0'): MatrixDraft {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export function createDefaultRrefInput(): RrefInput {
  return {
    rows: 3,
    cols: 3,
    cells: [
      ['1', '2', '3'],
      ['2', '4', '6'],
      ['1', '1', '1'],
    ],
    augmented: false,
  };
}

export function resizeDraft(draft: MatrixDraft, rows: number, cols: number): MatrixDraft {
  const next = createEmptyDraft(rows, cols, '0');
  for (let i = 0; i < Math.min(rows, draft.length); i += 1) {
    for (let j = 0; j < Math.min(cols, draft[i]?.length ?? 0); j += 1) {
      next[i][j] = draft[i][j];
    }
  }
  return next;
}

export function draftToZeroMatrix(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Rational.zero())
  );
}
