export interface FreeFloatInput {
  outstandingShares: string;
  restrictedShares: string;
  closelyHeldShares: string;
}

export interface FreeFloatResult {
  freeFloat: number;
  freeFloatPercentage: number;
  formattedFreeFloat: string;
  formattedPercentage: string;
  interpretation: string;
  warningMessage: string | null;
}

export type FreeFloatFieldErrors = {
  form?: string;
  outstandingShares?: string;
  restrictedShares?: string;
  closelyHeldShares?: string;
};

/** Reference: 10,000 − 2,000 − 1,000 → 7,000 (70%) */
export function createDefaultInput(): FreeFloatInput {
  return {
    outstandingShares: '10000',
    restrictedShares: '2000',
    closelyHeldShares: '1000',
  };
}

export function createEmptyInput(): FreeFloatInput {
  return {
    outstandingShares: '',
    restrictedShares: '',
    closelyHeldShares: '',
  };
}
