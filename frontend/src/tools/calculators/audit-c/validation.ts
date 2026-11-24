import { calculateAuditC } from './calculation';
import type { AuditCFieldErrors, AuditCInput, AuditCResult } from './types';

export interface AuditCValidation {
  errors: AuditCFieldErrors;
  result: AuditCResult | null;
}

export function validateAuditCInput(input: AuditCInput): AuditCValidation {
  // Unanswered selects and unset sex are valid empty states (not errors).
  return { errors: {}, result: calculateAuditC(input) };
}
