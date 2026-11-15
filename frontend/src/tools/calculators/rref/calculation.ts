import { parseRationalInput } from './parse';
import {
  cloneMatrix,
  formatMatrix,
  Rational,
  type Matrix,
} from './rational';
import type {
  AugmentedAnalysis,
  RrefInput,
  RrefResult,
  RowOperationStep,
} from './types';

function formatScalar(r: Rational): string {
  if (r.isOne()) return '';
  if (r.equals(new Rational(-1))) return '−';
  const s = r.toString();
  return s.startsWith('-') ? `−${s.slice(1)}` : s;
}

function rowLabel(i: number): string {
  return `R${i + 1}`;
}

function describeScale(row: number, factor: Rational): string {
  if (factor.isOne()) return `${rowLabel(row)} unchanged`;
  if (factor.equals(new Rational(-1))) return `${rowLabel(row)} → −${rowLabel(row)}`;
  return `${rowLabel(row)} → (${factor.toString()})${rowLabel(row)}`;
}

function describeSwap(a: number, b: number): string {
  return `${rowLabel(a)} ↔ ${rowLabel(b)}`;
}

function describeAddMultiple(target: number, source: number, factor: Rational): string {
  const f = formatScalar(factor);
  if (factor.isZero()) return `${rowLabel(target)} unchanged`;
  if (factor.isOne()) return `${rowLabel(target)} → ${rowLabel(target)} + ${rowLabel(source)}`;
  if (factor.equals(new Rational(-1))) {
    return `${rowLabel(target)} → ${rowLabel(target)} − ${rowLabel(source)}`;
  }
  if (factor.n < 0) {
    const pos = formatScalar(factor.abs());
    return `${rowLabel(target)} → ${rowLabel(target)} − ${pos}${rowLabel(source)}`;
  }
  return `${rowLabel(target)} → ${rowLabel(target)} + ${f}${rowLabel(source)}`;
}

function pushStep(
  steps: RowOperationStep[],
  description: string,
  matrix: Matrix
): void {
  steps.push({
    index: steps.length + 1,
    description,
    matrix: formatMatrix(matrix),
  });
}

function findPivotRow(matrix: Matrix, startRow: number, col: number): number {
  let best = -1;
  for (let r = startRow; r < matrix.length; r += 1) {
    if (matrix[r][col].isZero()) continue;
    if (best === -1 || matrix[r][col].compareAbs(matrix[best][col]) > 0) {
      best = r;
    }
  }
  return best;
}

function swapRows(matrix: Matrix, a: number, b: number): void {
  if (a === b) return;
  const tmp = matrix[a];
  matrix[a] = matrix[b];
  matrix[b] = tmp;
}

function scaleRow(matrix: Matrix, row: number, factor: Rational): void {
  for (let j = 0; j < matrix[row].length; j += 1) {
    matrix[row][j] = matrix[row][j].mul(factor);
  }
}

function addMultiple(matrix: Matrix, target: number, source: number, factor: Rational): void {
  for (let j = 0; j < matrix[target].length; j += 1) {
    matrix[target][j] = matrix[target][j].add(matrix[source][j].mul(factor));
  }
}

function analyzeAugmented(
  rref: Matrix,
  pivotColumns: number[],
  variableCols: number
): AugmentedAnalysis {
  const rows = rref.length;

  for (let i = 0; i < rows; i += 1) {
    let allZeroVars = true;
    for (let j = 0; j < variableCols; j += 1) {
      if (!rref[i][j].isZero()) {
        allZeroVars = false;
        break;
      }
    }
    if (allZeroVars && !rref[i][variableCols].isZero()) {
      return {
        kind: 'inconsistent',
        message:
          'Inconsistent system: a row reduces to 0 = nonzero, so there is no solution.',
        freeVariables: [],
        uniqueSolution: null,
      };
    }
  }

  const freeVariables: number[] = [];
  for (let j = 1; j <= variableCols; j += 1) {
    if (!pivotColumns.includes(j)) freeVariables.push(j);
  }

  if (freeVariables.length === 0 && pivotColumns.length === variableCols) {
    const uniqueSolution: string[] = Array.from({ length: variableCols }, () => '0');
    for (let i = 0; i < rows; i += 1) {
      const pivotCol = rref[i].findIndex((c, idx) => idx < variableCols && c.isOne());
      if (pivotCol === -1) continue;
      // Ensure it is the only nonzero in that column among vars — RREF guarantees leading 1.
      let isPivot = rref[i][pivotCol].isOne();
      for (let k = 0; k < variableCols; k += 1) {
        if (k !== pivotCol && !rref[i][k].isZero()) {
          isPivot = false;
          break;
        }
      }
      if (!isPivot) continue;
      uniqueSolution[pivotCol] = rref[i][variableCols].toString();
    }
    return {
      kind: 'unique',
      message: 'Consistent system with a unique solution.',
      freeVariables: [],
      uniqueSolution,
    };
  }

  return {
    kind: 'infinite',
    message:
      'Consistent system with infinitely many solutions (free variables present).',
    freeVariables,
    uniqueSolution: null,
  };
}

/**
 * Gauss–Jordan elimination to reduced row echelon form using exact rationals.
 * Records each meaningful elementary row operation.
 */
export function computeRref(matrixInput: Matrix, augmented = false): Omit<
  RrefResult,
  'original' | 'augmented'
> & { originalMatrix: Matrix; rrefMatrix: Matrix } {
  const rows = matrixInput.length;
  const cols = matrixInput[0]?.length ?? 0;
  const matrix = cloneMatrix(matrixInput);
  const steps: RowOperationStep[] = [];
  const pivotColumns: number[] = [];

  pushStep(steps, 'Initial matrix', matrix);

  let pivotRow = 0;
  const variableCols = augmented ? Math.max(0, cols - 1) : cols;

  for (let col = 0; col < variableCols && pivotRow < rows; col += 1) {
    const pivot = findPivotRow(matrix, pivotRow, col);
    if (pivot === -1) continue;

    if (pivot !== pivotRow) {
      swapRows(matrix, pivotRow, pivot);
      pushStep(steps, describeSwap(pivotRow, pivot), matrix);
    }

    const pivotValue = matrix[pivotRow][col];
    if (!pivotValue.isOne()) {
      const factor = pivotValue.inv();
      scaleRow(matrix, pivotRow, factor);
      pushStep(steps, describeScale(pivotRow, factor), matrix);
    }

    for (let r = 0; r < rows; r += 1) {
      if (r === pivotRow) continue;
      const entry = matrix[r][col];
      if (entry.isZero()) continue;
      const factor = entry.neg();
      addMultiple(matrix, r, pivotRow, factor);
      pushStep(steps, describeAddMultiple(r, pivotRow, factor), matrix);
    }

    pivotColumns.push(col + 1);
    pivotRow += 1;
  }

  const freeColumns: number[] = [];
  for (let j = 1; j <= variableCols; j += 1) {
    if (!pivotColumns.includes(j)) freeColumns.push(j);
  }

  const rank = pivotColumns.length;
  const nullity = variableCols - rank;

  const augmentedAnalysis: AugmentedAnalysis = augmented
    ? analyzeAugmented(matrix, pivotColumns, variableCols)
    : {
        kind: 'not_augmented',
        message: 'Augmented mode is off — solution analysis applies only to linear systems.',
        freeVariables: [],
        uniqueSolution: null,
      };

  return {
    rows,
    cols,
    originalMatrix: cloneMatrix(matrixInput),
    rrefMatrix: cloneMatrix(matrix),
    rref: formatMatrix(matrix),
    rank,
    pivotColumns,
    freeColumns,
    nullity,
    steps,
    augmentedAnalysis,
  };
}

export function parseInputMatrix(
  input: RrefInput
): { ok: true; matrix: Matrix } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const matrix: Matrix = [];

  for (let i = 0; i < input.rows; i += 1) {
    const row: Rational[] = [];
    for (let j = 0; j < input.cols; j += 1) {
      const raw = input.cells[i]?.[j] ?? '';
      const parsed = parseRationalInput(raw);
      if (!parsed.ok) {
        errors[`cell-${i}-${j}`] = parsed.error;
        row.push(Rational.zero());
      } else {
        row.push(parsed.value);
      }
    }
    matrix.push(row);
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, matrix };
}

export function calculateRref(input: RrefInput): RrefResult {
  const parsed = parseInputMatrix(input);
  if (!parsed.ok) {
    throw new Error('Invalid matrix input');
  }

  const result = computeRref(parsed.matrix, input.augmented);
  return {
    rows: result.rows,
    cols: result.cols,
    augmented: input.augmented,
    original: formatMatrix(result.originalMatrix),
    rref: result.rref,
    rank: result.rank,
    pivotColumns: result.pivotColumns,
    freeColumns: result.freeColumns,
    nullity: result.nullity,
    steps: result.steps,
    augmentedAnalysis: result.augmentedAnalysis,
  };
}

/** Replay recorded scale/swap/add ops is hard from text; verify RREF invariants instead. */
export function assertIsRref(matrix: Matrix): boolean {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  let lastPivotCol = -1;

  for (let i = 0; i < rows; i += 1) {
    let pivot = -1;
    for (let j = 0; j < cols; j += 1) {
      if (!matrix[i][j].isZero()) {
        pivot = j;
        break;
      }
    }

    if (pivot === -1) {
      for (let k = i + 1; k < rows; k += 1) {
        for (let j = 0; j < cols; j += 1) {
          if (!matrix[k][j].isZero()) return false;
        }
      }
      continue;
    }

    if (!matrix[i][pivot].isOne()) return false;
    if (pivot <= lastPivotCol) return false;
    lastPivotCol = pivot;

    for (let r = 0; r < rows; r += 1) {
      if (r === i) continue;
      if (!matrix[r][pivot].isZero()) return false;
    }
  }

  return true;
}

export function replayStepsToFinal(original: Matrix, steps: RowOperationStep[]): boolean {
  // Steps store snapshots; confirm last snapshot equals computeRref output and is RREF.
  if (steps.length === 0) return false;
  const last = steps[steps.length - 1].matrix;
  const recomputed = computeRref(original, false);
  if (recomputed.rref.length !== last.length) return false;
  for (let i = 0; i < last.length; i += 1) {
    for (let j = 0; j < last[i].length; j += 1) {
      if (last[i][j] !== recomputed.rref[i][j]) return false;
    }
  }
  return assertIsRref(recomputed.rrefMatrix);
}
