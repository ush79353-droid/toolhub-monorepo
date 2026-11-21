export type CpiMode = 'historical' | 'custom';

export interface CpiInflationInput {
  mode: CpiMode;
  amount: string;
  baseYear: string;
  targetYear: string;
  /** Custom mode only */
  baseCPI: string;
  targetCPI: string;
  yearsSpan: string;
}

export interface CpiInflationResult {
  equivalentValue: number;
  cumulativeInflationPercent: number;
  averageAnnualInflationPercent: number | null;
  purchasingPowerChangePercent: number;
  baseCPI: number;
  targetCPI: number;
  baseYear: number | null;
  targetYear: number | null;
  yearsSpan: number | null;
  sameYear: boolean;
  formattedEquivalentValue: string;
  formattedCumulativeInflation: string;
  formattedAverageAnnualInflation: string;
  formattedPurchasingPowerChange: string;
  formattedBaseCPI: string;
  formattedTargetCPI: string;
  interpretation: string;
  explanation: string;
  sourceSummary: string;
}

export type CpiInflationFieldErrors = {
  form?: string;
  amount?: string;
  baseYear?: string;
  targetYear?: string;
  baseCPI?: string;
  targetCPI?: string;
  yearsSpan?: string;
};

/** Amount default 100; target = latest CPI year; base empty until selected. */
export function createDefaultInput(latestYear: number): CpiInflationInput {
  return {
    mode: 'historical',
    amount: '100',
    baseYear: '',
    targetYear: String(latestYear),
    baseCPI: '',
    targetCPI: '',
    yearsSpan: '',
  };
}

export function createEmptyInput(): CpiInflationInput {
  return {
    mode: 'historical',
    amount: '',
    baseYear: '',
    targetYear: '',
    baseCPI: '',
    targetCPI: '',
    yearsSpan: '',
  };
}

/** Hypothetical illustrative pair for guide/tests (not official BLS). */
export function createIllustrativeCustomInput(): CpiInflationInput {
  return {
    mode: 'custom',
    amount: '1000',
    baseYear: '',
    targetYear: '',
    baseCPI: '220',
    targetCPI: '260',
    yearsSpan: '10',
  };
}
