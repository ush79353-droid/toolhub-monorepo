import { resolveStateTaxDestination } from './calculation';
import { findState } from './states';
import type { StateTaxInput } from './types';

export interface StateTaxValidation {
  isValid: boolean;
  errors: { stateCode?: string };
  destination: ReturnType<typeof resolveStateTaxDestination> | null;
}

export function validateStateTaxInput(input: StateTaxInput): StateTaxValidation {
  if (!findState(input.stateCode)) {
    return {
      isValid: false,
      errors: { stateCode: 'Select a valid US state.' },
      destination: null,
    };
  }
  return {
    isValid: true,
    errors: {},
    destination: resolveStateTaxDestination(input.stateCode),
  };
}
