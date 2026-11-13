import { parseRationalInput } from './parse';
import {
  MAX_COLS,
  MAX_ROWS,
  MIN_COLS,
  MIN_ROWS,
  type RrefFieldErrors,
  type RrefInput,
} from './types';

export function validateRrefInput(input: RrefInput): {
  isValid: boolean;
  errors: RrefFieldErrors;
} {
  const errors: RrefFieldErrors = {};

  if (
    !Number.isInteger(input.rows) ||
    input.rows < MIN_ROWS ||
    input.rows > MAX_ROWS
  ) {
    errors.rows = `Rows must be between ${MIN_ROWS} and ${MAX_ROWS}`;
  }
  if (
    !Number.isInteger(input.cols) ||
    input.cols < MIN_COLS ||
    input.cols > MAX_COLS
  ) {
    errors.cols = `Columns must be between ${MIN_COLS} and ${MAX_COLS}`;
  }

  if (input.augmented && input.cols < 2) {
    errors.augmented = 'Augmented mode needs at least 2 columns (variables + constants)';
  }

  if (input.cells.length !== input.rows) {
    errors.form = 'Matrix row count does not match selected dimensions';
  }

  for (let i = 0; i < input.rows; i += 1) {
    const row = input.cells[i];
    if (!row || row.length !== input.cols) {
      errors.form = 'Matrix column count does not match selected dimensions';
      break;
    }
    for (let j = 0; j < input.cols; j += 1) {
      const parsed = parseRationalInput(row[j] ?? '');
      if (!parsed.ok) {
        errors[`cell-${i}-${j}`] = parsed.error;
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
