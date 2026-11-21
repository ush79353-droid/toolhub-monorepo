export interface BuyingPowerInput {
  amount: string;
  referenceYear: string;
  targetYear: string;
}

export interface BuyingPowerResult {
  originalAmount: number;
  referenceYear: number;
  targetYear: number;
  referenceCPI: number;
  targetCPI: number;
  cpiRatio: number;
  adjustedAmount: number;
  inflationChangePercent: number;
  purchasingPowerChangePercent: number;
  referenceDataStatus: 'final' | 'provisional';
  targetDataStatus: 'final' | 'provisional';
  formattedOriginalAmount: string;
  formattedAdjustedAmount: string;
  formattedReferenceCPI: string;
  formattedTargetCPI: string;
  formattedCpiRatio: string;
  formattedInflationChange: string;
  formattedPurchasingPowerChange: string;
  interpretation: string;
  explanation: string;
  sourceSummary: string;
}

export type BuyingPowerFieldErrors = {
  form?: string;
  amount?: string;
  referenceYear?: string;
  targetYear?: string;
};

/** Amount empty; no reference year; target = latest final CPI year (set in createDefaultInput). */
export function createDefaultInput(latestYear: number): BuyingPowerInput {
  return {
    amount: '',
    referenceYear: '',
    targetYear: String(latestYear),
  };
}

export function createEmptyInput(): BuyingPowerInput {
  return {
    amount: '',
    referenceYear: '',
    targetYear: '',
  };
}
