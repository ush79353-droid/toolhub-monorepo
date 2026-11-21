import type {
  LevothyroxineDosageFieldErrors,
  LevothyroxineDosageInput,
  LevothyroxineDosageResult,
} from './types';

export interface LevothyroxineDosageValidation {
  errors: LevothyroxineDosageFieldErrors;
  result: LevothyroxineDosageResult | null;
}

/** UI-shell stub — replaced by engine commit with clinical gate logic. */
export function validateLevothyroxineDosageInput(
  _input: LevothyroxineDosageInput,
): LevothyroxineDosageValidation {
  return { errors: {}, result: null };
}
