import type { DeadSpaceFieldErrors, DeadSpaceInput, DeadSpaceResult } from './types';
export interface DeadSpaceValidation { isValid: boolean; errors: DeadSpaceFieldErrors; result: DeadSpaceResult | null; }
export function validateDeadSpaceInput(_input: DeadSpaceInput): DeadSpaceValidation {
  return { isValid: false, errors: { form: 'Enter alveolar CO2, mixed-expired CO2, and tidal volume to calculate dead space.' }, result: null };
}
