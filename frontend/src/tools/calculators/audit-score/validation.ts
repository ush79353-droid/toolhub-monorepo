import { calculateAuditScore } from './calculation';
import type {
  AuditScoreFieldErrors,
  AuditScoreInput,
  AuditScoreResult,
} from './types';

export interface AuditScoreValidation {
  errors: AuditScoreFieldErrors;
  result: AuditScoreResult | null;
}

export function validateAuditScoreInput(
  input: AuditScoreInput,
): AuditScoreValidation {
  return {
    errors: {},
    result: calculateAuditScore(input),
  };
}
