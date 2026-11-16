import type { EidlProgramStatus } from './types';

/**
 * Historical program metadata for the discontinued EIDL Emergency Advance.
 * This tool does not perform dynamic loan calculations as the relief program is closed.
 */
export function getEidlProgramStatus(): EidlProgramStatus {
  return {
    isExpired: true,
    programName: 'Economic Injury Disaster Loan Emergency Advance (EIDL)',
    maxAdvanceHistoricalAmount: 10000,
    currency: 'USD',
  };
}
