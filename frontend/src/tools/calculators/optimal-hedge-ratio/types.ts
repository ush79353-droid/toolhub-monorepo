export interface OptimalHedgeRatioInput {
  spotStdDev: string;
  futuresStdDev: string;
  correlation: string;
}

export interface OptimalHedgeRatioResult {
  hedgeRatio: number;
  formattedHedgeRatio: string;
}

export type OptimalHedgeRatioFieldErrors = {
  spotStdDev?: string;
  futuresStdDev?: string;
  correlation?: string;
  form?: string;
};

export function createDefaultInput(): OptimalHedgeRatioInput {
  return {
    spotStdDev: '',
    futuresStdDev: '',
    correlation: '',
  };
}
